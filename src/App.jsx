import { useState, useEffect } from "react";
import { useCryptoAPI } from "./hooks/useCryptoAPI";
import MarketTicker from "./components/MarketTicker";
import PortfolioWidget from "./components/PortfolioWidget";
import CoinStats from "./components/CoinStats";
import CoinChart from "./components/CoinChart";
import MarketTable from "./components/MarketTable";
import AddAssetModal from "./components/AddAssetModal";

function App() {
  // Активируем хук API и достаем из него данные, статус загрузки и метод обновления
  const { data, loading, error, lastUpdated, refreshData } = useCryptoAPI();
  // Закладываем ленивую инициализацию портфеля из localStorage
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("crypto_portfolio");
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState("light");
  const [modalCoin, setModalCoin] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  // Синхронизируем стейт портфеля с localStorage
  useEffect(() => {
    localStorage.setItem("crypto_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);
  // Заводим стейт для хранения ID выбранной монеты. По умолчанию — первый элемент массива (Биткоин)
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const handleAddAsset = (coinId, amount, buyPrice) => {
    setPortfolio((prev) => {
      // Ищем, есть ли уже эта монета в портфеле
      const existingIndex = prev.findIndex((item) => item.id === coinId);

      if (existingIndex > -1) {
        // Если есть — создаем копию массива и агрегируем (складываем) количество и усредняем цену
        const updated = [...prev];
        const existing = updated[existingIndex];

        const totalAmount = existing.amount + amount;
        // Считаем среднюю цену покупки (математика инвестора)
        const averagePrice =
          (existing.buyPrice * existing.amount + buyPrice * amount) /
          totalAmount;

        updated[existingIndex] = {
          id: coinId,
          amount: totalAmount,
          buyPrice: averagePrice,
        };
        return updated;
      } else {
        // Если монеты в портфеле еще нет — просто добавляем новый объект
        return [...prev, { id: coinId, amount, buyPrice }];
      }
    });
  };
  const handleRemoveAsset = (coinId) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== coinId));
  };
  // Безопасно ищем активную монету. Если данные еще не загрузились, вернем null
  const activeCoin = data
    ? data.coins.find((c) => c.id === selectedCoinId)
    : null;
  // Финансовый UI-занавес для обработки асинхронности
  if (loading) {
    return (
      <div
        style={{
          color: "var(--text-main)",
          textAlign: "center",
          marginTop: "100px",
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        Загрузка рыночных данных...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "var(--crypto-down)",
          textAlign: "center",
          marginTop: "100px",
          fontSize: "18px",
        }}
      >
        Ошибка: {error}
      </div>
    );
  }
  return (
    <div>
      <MarketTicker
        globalData={data.global}
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
      />

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
            {/* Панель кнопок-вкладок (Tabs) */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "10px",
              }}
            >
              <button
                onClick={() => setActiveTab("stats")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color:
                    activeTab === "stats"
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  borderBottom:
                    activeTab === "stats" ? "2px solid var(--accent)" : "none",
                }}
              >
                Статистика
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color:
                    activeTab === "portfolio"
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  borderBottom:
                    activeTab === "portfolio"
                      ? "2px solid var(--accent)"
                      : "none",
                }}
              >
                Мой Портфель ({portfolio.length})
              </button>
            </div>

            {/* Условный рендер содержимого в зависимости от выбранной вкладки */}
            {activeTab === "stats" ? (
              <CoinStats coin={activeCoin} />
            ) : (
              <PortfolioWidget
                portfolio={portfolio}
                coins={data.coins}
                onRemove={handleRemoveAsset}
              />
            )}
          </div>
        </div>

        {/* Рендерим таблицу под сеткой графика */}
        <MarketTable
          coins={data.coins}
          selectedCoinId={selectedCoinId}
          onSelectCoin={setSelectedCoinId}
          onOpenModal={setModalCoin}
        />
        {modalCoin && (
          <AddAssetModal
            coin={modalCoin}
            onClose={() => setModalCoin(null)}
            onSave={handleAddAsset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
