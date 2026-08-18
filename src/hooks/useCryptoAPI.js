import { useState, useEffect, useCallback } from "react";
//import mockData from "../data/mockData.json";

// Время жизни кэша: 2 минуты (в миллисекундах)
const CACHE_TTL = 2 * 60 * 1000;

export function useCryptoAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Функция запроса данных (обернута в useCallback, чтобы ссылка на неё не менялась при перерендерах)
  const fetchData = useCallback(
    async (force = false) => {
      try {
        // Проверка кэша: если это не принудительное обновление и время жизни кэша не истекло — выходим
        if (!force && lastUpdated && Date.now() - lastUpdated < CACHE_TTL) {
          console.log(
            "Данные взяты из кэша. Запрос к сети заблокирован для экономии лимитов.",
          );
          return;
        }

        setLoading(true);
        setError(null);

        // Делаем реальный запрос к CoinGecko API вместо setTimeout и моков
        const response = await fetch("https://coingecko.com");

        if (!response.ok) {
          throw new Error(
            `Ошибка сервера: ${response.status} (Превышен лимит запросов?)`,
          );
        }

        const serverCoins = await response.json();

        // МАЯК: Адаптер. Превращаем плоские данные CoinGecko в нашу структуру, включая историю для графиков
        const adaptedCoins = serverCoins.map((coin) => {
          // Так как CoinGecko не отдает историю в базовом эндпоинте, мы генерируем её из текущих данных,
          // чтобы наши графики Recharts продолжали красиво работать на живых ценах!
          const basePrice = coin.current_price;
          const change = coin.price_change_percentage_24h || 0;
          const pastPrice = basePrice / (1 + change / 100);

          return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            change24h: parseFloat(change.toFixed(2)),
            high24h: coin.high_24h || basePrice,
            low24h: coin.low_24h || basePrice,
            volume24h: coin.total_volume || 0,
            history: {
              // Эмулируем тренд графика на основе реального суточного изменения цены
              "24h": [
                pastPrice,
                pastPrice * 1.005,
                pastPrice * 0.995,
                basePrice * 0.998,
                basePrice,
              ],
              "7d": [
                pastPrice * 0.92,
                pastPrice * 0.95,
                pastPrice * 0.94,
                pastPrice * 0.98,
                basePrice,
              ],
              "30d": [
                pastPrice * 0.85,
                pastPrice * 0.89,
                pastPrice * 0.82,
                pastPrice * 0.95,
                basePrice,
              ],
            },
          };
        });

        // Собираем финальный объект, полностью повторяющий структуру нашего mockData.json
        const finalData = {
          global: {
            // Вычисляем глобальную капу на основе трех наших топ-монет для примера
            marketCap: adaptedCoins.reduce(
              (sum, c) => sum + c.volume24h * 5,
              2450000000000,
            ),
            marketCapChange24h: adaptedCoins[0]
              ? adaptedCoins[0].change24h
              : 1.5,
            btcDominance: 54.2,
          },
          coins: adaptedCoins,
        };

        setData(finalData);
        setLastUpdated(Date.now());
      } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    },
    [lastUpdated],
  );

  // Безопасный первичный запрос после монтирования компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timer); // Защита: очищаем таймер, если компонент внезапно размонтируется
  }, [fetchData]); // Добавляем зависимость, так как функция завернута в useCallback

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData: () => fetchData(true),
  };
}
