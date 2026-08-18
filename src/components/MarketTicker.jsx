function MarketTicker({ globalData, lastUpdated, onRefresh }) {
  if (!globalData) return null;

  // Проверяем, положительный ли тренд, чтобы выбрать нужный цвет
  const isPositive = globalData.marketCapChange24h >= 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border-color)",
        fontSize: "14px",
      }}
    >
      {/* Левая часть: Капитализация и её динамика */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <span style={{ color: "var(--text-muted)" }}>Рыночная кап.: </span>
          <strong>${(globalData.marketCap / 1e12).toFixed(2)} Трлн</strong>
          <span
            style={{
              marginLeft: "8px",
              color: isPositive ? "var(--crypto-up)" : "var(--crypto-down)",
              fontWeight: "500",
            }}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(globalData.marketCapChange24h)}%
          </span>
        </div>

        {/* Средняя часть: Доминирование Биткоина */}
        <div>
          <span style={{ color: "var(--text-muted)" }}>
            Доминирование BTC:{" "}
          </span>
          <strong>{globalData.btcDominance}%</strong>
        </div>
      </div>

      {/* Выводим время последнего обновления и кнопку принудительного обхода кэша */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {lastUpdated && (
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Обновлено: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
        <button
          onClick={onRefresh}
          style={{
            padding: "4px 10px",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: "var(--text-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-main)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          🔄 Обновить
        </button>
      </div>
    </div>
  );
}

export default MarketTicker;
