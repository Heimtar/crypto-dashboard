// Добавляем хуки useState и useEffect
import React, { useState, useEffect } from "react";
import MarketTicker from "./components/MarketTicker";
import mockData from "./data/mockData.json";

function App() {
  // Инициализируем тему. По умолчанию светлая 'light'
  const [theme, setTheme] = useState("light");

  // Следим за изменением темы и вешаем атрибут на документ
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Функция для переключения стейта
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <MarketTicker globalData={mockData.global} />

      {/* Временная кнопка для теста переключения темы */}
      <main style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Панель аналитики</h1>
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            Режим: {theme === "light" ? "🌙 Темный" : "☀️ Светлый"}
          </button>
        </div>

        {/* Сюда мы сейчас вставим нашу сетку (Grid) */}
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {/* Левая колонка для графика */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              minHeight: "300px",
            }}
          >
            <h3>Исторический график (Заглушка)</h3>
          </div>

          {/* Правая колонка для быстрой статистики или портфеля */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              minHeight: "300px",
            }}
          >
            <h3>Статистика актива (Заглушка)</h3>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
