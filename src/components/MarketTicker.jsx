import React from "react";

function MarketTicker({ globalData }) {
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

      {/* Правая часть: Заглушка под статус кэша и тему */}
      <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
        Синхронизировано (Mock)
      </div>
    </div>
  );
}

export default MarketTicker;
