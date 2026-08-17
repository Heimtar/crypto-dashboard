import React from "react";

function CoinStats({ coin }) {
  if (!coin) return null;

  // Форматирование крупных чисел, чтобы код ниже был чище
  const formatUSD = (num) =>
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const formatVolume = (num) =>
    num.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
        Статистика {coin.symbol}
      </h3>

      {/* Текущая цена крупным шрифтом */}
      <div
        style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}
      >
        ${formatUSD(coin.price)}
      </div>

      {/* Список метрик */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Максимум за сутки */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "8px",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>Макс. 24ч:</span>
          <span style={{ fontWeight: "500" }}>${formatUSD(coin.high24h)}</span>
        </div>

        {/* Минимум за сутки */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "8px",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>Мин. 24ч:</span>
          <span style={{ fontWeight: "500" }}>${formatUSD(coin.low24h)}</span>
        </div>

        {/* Объем торгов */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "8px",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>Объем 24ч:</span>
          <span style={{ fontWeight: "500" }}>
            ${formatVolume(coin.volume24h)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CoinStats;
