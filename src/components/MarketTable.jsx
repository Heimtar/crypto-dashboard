function MarketTable({ coins, selectedCoinId, onSelectCoin }) {
  if (!coins || coins.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        padding: "20px",
        marginTop: "20px",
        overflowX: "auto", // Защита: если экран маленький, появится горизонтальный скролл, сетка не поедет
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Рыночные котировки</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "2px solid var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <th style={{ padding: "12px 8px" }}>Название</th>
            <th style={{ padding: "12px 8px" }}>Тикер</th>
            <th style={{ padding: "12px 8px", textAlign: "right" }}>
              Цена (USD)
            </th>
            <th style={{ padding: "12px 8px", textAlign: "right" }}>24ч (%)</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const isPositive = coin.change24h >= 0;
            const isSelected = coin.id === selectedCoinId;

            return (
              <tr
                key={coin.id}
                onClick={() => onSelectCoin(coin.id)}
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  // Подсвечиваем строку, если она выбрана, или при наведении
                  backgroundColor: isSelected
                    ? "var(--bg-main)"
                    : "transparent",
                  fontWeight: isSelected ? "600" : "normal",
                  transition: "background-color 0.2s ease",
                }}
                // Эффект hover через JS-события, чтобы не усложнять CSS-файлы
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "var(--bg-main)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td style={{ padding: "16px 8px" }}>{coin.name}</td>
                <td style={{ padding: "16px 8px", color: "var(--text-muted)" }}>
                  {coin.symbol}
                </td>
                <td style={{ padding: "16px 8px", textAlign: "right" }}>
                  $
                  {coin.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td
                  style={{
                    padding: "16px 8px",
                    textAlign: "right",
                    color: isPositive
                      ? "var(--crypto-up)"
                      : "var(--crypto-down)",
                    fontWeight: "500",
                  }}
                >
                  {isPositive ? "+" : ""}
                  {coin.change24h}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MarketTable;
