import { useState, useEffect, useCallback } from "react";
import mockData from "../data/mockData.json";

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
        // МАЯК: Имитируем сетевой запрос к серверу с задержкой 600мс
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Функция для случайного колебания цены на рынке (эмуляция реальных торгов)
        const getRandomVolatility = (basePrice) => {
          // Случайный процент от -1.2% до +1.2%
          const percent = (Math.random() * 2.4 - 1.2) / 100;
          return parseFloat((basePrice * (1 + percent)).toFixed(2));
        };

        // МАЯК: Маппим моки, добавляя им живую динамику цены при каждом обновлении
        const dynamicCoins = mockData.coins.map((coin) => {
          const livePrice = getRandomVolatility(coin.price);

          // Пересчитываем максимумы и минимумы суток на основе новой живой цены
          const liveHigh = livePrice > coin.high24h ? livePrice : coin.high24h;
          const liveLow = livePrice < coin.low24h ? livePrice : coin.low24h;

          // Пересчитываем прошлую цену для красивого графика
          const pastPrice = livePrice / (1 + coin.change24h / 100);

          return {
            ...coin,
            price: livePrice,
            high24h: liveHigh,
            low24h: liveLow,
            // Перестраиваем массивы истории, чтобы линии графика плавно дергались при обновлении
            history: {
              "24h": [
                pastPrice,
                pastPrice * 1.002,
                pastPrice * 0.997,
                livePrice * 0.999,
                livePrice,
              ],
              "7d": coin.history["7d"].map((p) => getRandomVolatility(p)),
              "30d": coin.history["30d"].map((p) => getRandomVolatility(p)),
            },
          };
        });

        // Собираем итоговую структуру данных
        const finalData = {
          global: {
            ...mockData.global,
            // Глобальная капа тоже слегка колеблется в такт рынку
            marketCap: getRandomVolatility(mockData.global.marketCap),
          },
          coins: dynamicCoins,
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
