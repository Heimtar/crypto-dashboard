import { useState } from 'react';
// Импортируем только нужные компоненты из Recharts для построения Area-графика
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function CoinChart({ historyData }) {
  if (!historyData) return null;

  // Храним выбранный таймфрейм. По умолчанию — 24 часа
  const [timeframe, setTimeframe] = useState('24h');

  // Форматируем массив простых чисел [62500, 63100...] в массив объектов [{ value: 62500 }, ...], который требует Recharts
  const chartData = historyData[timeframe].map((price, index) => ({
    name: index, // Просто индекс точки для оси X
    price: price
  }));

  const periods = ['24h', '7d', '30d'];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Шапка графика с переключателем периодов */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Динамика цены</h3>
        
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '4px', borderRadius: '6px' }}>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setTimeframe(p)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: timeframe === p ? 'var(--bg-card)' : 'transparent',
                color: timeframe === p ? 'var(--accent)' : 'var(--text-muted)',
                boxShadow: timeframe === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Контейнер для самого графика.ResponsiveContainer автоматически подстраивается под размеры родительского DIV */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            {/* Скрываем оси X и Y, чтобы выдержать строгий минималистичный стиль без нагромождения сетки */}
            <XAxis dataKey="name" hide />
            <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
            
            {/* Минималистичный тултип при наведении */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)', 
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '12px'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Цена']}
              labelFormatter={() => null} // Скрываем имя индекса в тултипе
            />
            
            {/* Сама линия и градиент под ней */}
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="var(--accent)" 
              strokeWidth={2}
              fillOpacity={0.1} 
              fill="var(--accent)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default CoinChart;
