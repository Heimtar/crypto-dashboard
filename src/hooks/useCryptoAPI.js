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

        // Имитируем сетевую задержку в 800мс, чтобы проверить работу лоадеров в UI
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Здесь в будущем будет реальный fetch(). А пока — берем наши мок-данные
        setData(mockData);
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
