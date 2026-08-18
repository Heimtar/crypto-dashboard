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

        // Стучимся на открытое, свободное от CORS и блокировок финтех-зеркало
        const response = await fetch("https://cryptocompare.com");

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const rawData = await response.json();
        const displayData = rawData.DISPLAY; // Достаем ветку с отформатированными данными

        // Адаптируем ответ нового API под структуру нашего приложения
        const targetCoins = ["BTC", "ETH", "SOL"];
        const coinIds = { BTC: "bitcoin", ETH: "ethereum", SOL: "solana" };
        const coinNames = { BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" };

        const adaptedCoins = targetCoins.map((symbol) => {
          const info = displayData[symbol].USD;

          // Очищаем строки от знаков валют (например, "$64,250" -> 64250.00)
          const cleanPrice = parseFloat(info.PRICE.replace(/[^\d.]/g, ""));
          const cleanChange = parseFloat(info.CHANGEPCT24HOUR);
          const cleanHigh = parseFloat(info.HIGH24HOUR.replace(/[^\d.]/g, ""));
          const cleanLow = parseFloat(info.LOW24HOUR.replace(/[^\d.]/g, ""));
          const cleanVolume = parseFloat(
            info.VOLUME24HOURTO.replace(/[^\d.]/g, ""),
          );

          const pastPrice = cleanPrice / (1 + cleanChange / 100);

          return {
            id: coinIds[symbol],
            name: coinNames[symbol],
            symbol: symbol,
            price: cleanPrice,
            change24h: cleanChange,
            high24h: cleanHigh,
            low24h: cleanLow,
            volume24h: cleanVolume,
            history: {
              "24h": [
                pastPrice,
                pastPrice * 1.01,
                pastPrice * 0.99,
                cleanPrice * 0.995,
                cleanPrice,
              ],
              "7d": [
                pastPrice * 0.93,
                pastPrice * 0.96,
                pastPrice * 0.94,
                pastPrice * 0.97,
                cleanPrice,
              ],
              "30d": [
                pastPrice * 0.86,
                pastPrice * 0.88,
                pastPrice * 0.83,
                pastPrice * 0.94,
                cleanPrice,
              ],
            },
          };
        });

        // Собираем финальный объект, идентичный нашей дизайн-системе
        const finalData = {
          global: {
            marketCap: 2450000000000,
            marketCapChange24h: adaptedCoins[0].change24h, // Берем тренд Биткоина для общей плашки
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
