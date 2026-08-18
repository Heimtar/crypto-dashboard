function PortfolioWidget({ portfolio, coins }) {
  // Хелпер для форматирования валюты
  const formatUSD = (num) =>
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (!portfolio || portfolio.length === 0) {
    return (
      <div
        style={{
          color: "var(--text-muted)",
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        Ваш портфель пока пуст. Нажмите «+» в таблице, чтобы добавить монеты.
      </div>
    );
  }

  // Формируем детальный массив активов без изменения внешних переменных
  const portfolioDetails = portfolio.map((item) => {
    const marketCoin = coins.find((c) => c.id === item.id);
    const currentPrice = marketCoin ? marketCoin.price : item.buyPrice;

    const currentValue = item.amount * currentPrice;
    const investedValue = item.amount * item.buyPrice;
    const pnlUSD = currentValue - investedValue;
    const pnlPercent = investedValue > 0 ? (pnlUSD / investedValue) * 100 : 0;

    return {
      ...item,
      symbol: marketCoin ? marketCoin.symbol : "?",
      currentValue,
      pnlUSD,
      pnlPercent,
      investedValue, // Добавляем для последующего расчета суммы
    };
  });

  // Считаем итоги через .reduce() без мутаций переменных
  const totalCurrentValue = portfolioDetails.reduce(
    (sum, item) => sum + item.currentValue,
    0,
  );
  const totalInvested = portfolioDetails.reduce(
    (sum, item) => sum + item.investedValue,
    0,
  );

  const totalPnLUSD = totalCurrentValue - totalInvested;
  const totalPnLPercent =
    totalInvested > 0 ? (totalPnLUSD / totalInvested) * 100 : 0;
  const isTotalPositive = totalPnLUSD >= 0;

  return (
    <div>
      {/* Сводный баланс портфеля */}
      <div
        style={{
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "2px solid var(--border-color)",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "4px",
          }}
        >
          Баланс портфеля
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "6px" }}
        >
          ${formatUSD(totalCurrentValue)}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: isTotalPositive ? "var(--crypto-up)" : "var(--crypto-down)",
          }}
        >
          {isTotalPositive ? "▲" : "▼"} ${formatUSD(Math.abs(totalPnLUSD))} (
          {totalPnLPercent.toFixed(2)}%)
        </div>
      </div>

      {/* Список купленных активов */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "180px",
          overflowY: "auto",
        }}
      >
        {portfolioDetails.map((asset) => {
          const isAssetPositive = asset.pnlUSD >= 0;
          return (
            <div
              key={asset.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                backgroundColor: "var(--bg-main)",
                borderRadius: "6px",
              }}
            >
              <div>
                <strong style={{ fontSize: "14px" }}>{asset.symbol}</strong>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {asset.amount} шт.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  ${formatUSD(asset.currentValue)}
                </span>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    color: isAssetPositive
                      ? "var(--crypto-up)"
                      : "var(--crypto-down)",
                  }}
                >
                  {isAssetPositive ? "+" : ""}
                  {asset.pnlPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioWidget;
