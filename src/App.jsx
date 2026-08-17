import React from "react";
// Импортируем наш новый компонент и мок-данные
import MarketTicker from "./components/MarketTicker";
import mockData from "./data/mockData.json";

function App() {
  return (
    <div>
      {/* Рендерим бар и передаем туда ветку global из JSON */}
      <MarketTicker globalData={mockData.global} />

      <main style={{ padding: "20px" }}>
        <h1>Crypto Dashboard - Project 3</h1>
      </main>
    </div>
  );
}

export default App;
