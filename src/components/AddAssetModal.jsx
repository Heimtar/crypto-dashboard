import { useState } from "react";

function AddAssetModal({ coin, onClose, onSave }) {
  // Управляемая форма: количество монет и цена покупки (по умолчанию текущая цена с рынка)
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState(coin.price);

  if (!coin) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация: переводим в числа и проверяем, чтобы значения были больше нуля
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(buyPrice);

    if (
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      isNaN(parsedPrice) ||
      parsedPrice <= 0
    ) {
      alert("Пожалуйста, введите корректные числа больше нуля");
      return;
    }

    // Передаем валидные данные вверх в родительский компонент
    onSave(coin.id, parsedAmount, parsedPrice);
    onClose(); // Закрываем модалку
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "24px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          width: "320px",
          color: "var(--text-main)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
          Купить {coin.name}
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Поле количества */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Количество ({coin.symbol}):
            </label>
            <input
              type="number"
              step="any"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
              }}
            />
          </div>

          {/* Поле цены покупки */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Цена покупки (USD):
            </label>
            <input
              type="number"
              step="any"
              required
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
              }}
            />
          </div>

          {/* Кнопки управления */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "8px",
                cursor: "pointer",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                backgroundColor: "transparent",
                color: "var(--text-main)",
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "8px",
                cursor: "pointer",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "var(--accent)",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;
