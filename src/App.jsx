import { useState, useEffect } from "react";
import MarketTicker from "./components/MarketTicker";
import CoinStats from "./components/CoinStats";
import CoinChart from "./components/CoinChart";
import MarketTable from "./components/MarketTable";
import mockData from "./data/mockData.json";

function App() {
  // Закладываем ленивую инициализацию портфеля из localStorage
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("crypto_portfolio");
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState("light");
  // Синхронизируем стейт портфеля с localStorage
  useEffect(() => {
    localStorage.setItem("crypto_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);
  // Заводим стейт для хранения ID выбранной монеты. По умолчанию — первый элемент массива (Биткоин)
  const [selectedCoinId, setSelectedCoinId] = useState(mockData.coins[0].id);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const activeCoin = mockData.coins.find((c) => c.id === selectedCoinId);
  return (
    <div>
      <MarketTicker globalData={mockData.global} />

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
            <CoinChart historyData={activeCoin.history} />
            {/* Временно выведем ID, чтобы видеть, что клик по таблице работает */}
            <h3>Исторический график для: {selectedCoinId.toUpperCase()}</h3>
          </div>

          {/* Правая колонка для быстрой статистики */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              minHeight: "300px",
            }}
          >
            <CoinStats coin={activeCoin} />
            <h3>Статистика актива</h3>
          </div>
        </div>

        {/* Рендерим таблицу под сеткой графика */}
        <MarketTable
          coins={mockData.coins}
          selectedCoinId={selectedCoinId}
          onSelectCoin={setSelectedCoinId}
        />
      </main>
    </div>
  );
}

export default App;
