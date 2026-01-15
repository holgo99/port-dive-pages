import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, ComposedChart, Bar, Legend, ReferenceArea } from 'recharts';

// NVO Price Data (Nov 24, 2025 - Jan 9, 2026)
const priceData = [
  { date: 'Nov 24', price: 43.08, volume: 73.6, wave: 'W1 Start', rsi: 28 },
  { date: 'Nov 25', price: 47.06, volume: 30.5, wave: '', rsi: 35 },
  { date: 'Nov 26', price: 48.71, volume: 17.8, wave: '', rsi: 42 },
  { date: 'Nov 28', price: 49.35, volume: 15.5, wave: '', rsi: 45 },
  { date: 'Dec 1', price: 48.43, volume: 11.6, wave: '', rsi: 43 },
  { date: 'Dec 2', price: 47.43, volume: 11.9, wave: '', rsi: 40 },
  { date: 'Dec 3', price: 47.57, volume: 11.5, wave: '', rsi: 41 },
  { date: 'Dec 4', price: 47.99, volume: 18.5, wave: '', rsi: 42 },
  { date: 'Dec 5', price: 47.86, volume: 15.3, wave: '', rsi: 42 },
  { date: 'Dec 8', price: 46.77, volume: 14.8, wave: '', rsi: 38 },
  { date: 'Dec 9', price: 46.36, volume: 10.2, wave: '', rsi: 36 },
  { date: 'Dec 10', price: 49.05, volume: 17.0, wave: '', rsi: 44 },
  { date: 'Dec 11', price: 50.29, volume: 15.6, wave: '', rsi: 48 },
  { date: 'Dec 12', price: 50.18, volume: 12.4, wave: '', rsi: 48 },
  { date: 'Dec 15', price: 50.37, volume: 11.4, wave: '', rsi: 49 },
  { date: 'Dec 16', price: 48.96, volume: 14.1, wave: '', rsi: 45 },
  { date: 'Dec 17', price: 47.77, volume: 10.3, wave: '', rsi: 42 },
  { date: 'Dec 18', price: 47.61, volume: 8.3, wave: '', rsi: 41 },
  { date: 'Dec 19', price: 48.09, volume: 10.9, wave: '', rsi: 43 },
  { date: 'Dec 22', price: 48.10, volume: 16.1, wave: '', rsi: 43 },
  { date: 'Dec 23', price: 51.61, volume: 67.6, wave: 'Breakout', rsi: 60 },
  { date: 'Dec 24', price: 52.56, volume: 19.3, wave: '', rsi: 63 },
  { date: 'Dec 26', price: 52.40, volume: 13.3, wave: '', rsi: 62 },
  { date: 'Dec 29', price: 51.47, volume: 16.9, wave: '', rsi: 58 },
  { date: 'Dec 30', price: 51.22, volume: 11.9, wave: '', rsi: 57 },
  { date: 'Dec 31', price: 50.88, volume: 10.8, wave: '', rsi: 55 },
  { date: 'Jan 2', price: 52.39, volume: 12.1, wave: '', rsi: 60 },
  { date: 'Jan 5', price: 55.11, volume: 30.0, wave: 'Catalyst', rsi: 68 },
  { date: 'Jan 6', price: 56.26, volume: 32.9, wave: '', rsi: 70 },
  { date: 'Jan 7', price: 56.57, volume: 17.5, wave: '', rsi: 71 },
  { date: 'Jan 8', price: 57.34, volume: 17.5, wave: '', rsi: 73 },
  { date: 'Jan 9', price: 58.81, volume: 29.1, wave: 'W1 Peak', rsi: 75 },
];

// Fibonacci levels from Wave 1
const fibLevels = {
  wave1Top: 60.64,
  fib236: 56.49,
  fib382: 53.93,
  fib500: 51.86,
  fib618: 49.79,
  wave1Bottom: 43.08
};

// Wave 3 extension targets
const extensionTargets = {
  ext100: 71.49,
  ext127: 76.29,
  ext161: 82.35
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.95)', 
        border: '1px solid #3b82f6',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
      }}>
        <p style={{ color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{label}</p>
        <p style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>
          ${payload[0].value?.toFixed(2)}
        </p>
        {payload[1] && (
          <p style={{ color: '#64748b', fontSize: 12 }}>
            Vol: {payload[1].value?.toFixed(1)}M
          </p>
        )}
        {payload[0].payload.wave && (
          <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>
            {payload[0].payload.wave}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ElliottWaveChart() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px',
      borderRadius: '16px',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          color: '#f8fafc', 
          fontSize: 24, 
          fontWeight: 700, 
          marginBottom: 8,
          letterSpacing: '-0.5px'
        }}>
          NVO Elliott Wave Analysis
        </h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Wave 1 Complete ($43.08 → $60.64) | Wave 2 Pullback Expected
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={priceData} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis 
            yAxisId="price"
            domain={[40, 65]} 
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickFormatter={(v) => `$${v}`}
          />
          <YAxis 
            yAxisId="volume"
            orientation="right"
            domain={[0, 100]}
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Fibonacci Reference Lines */}
          <ReferenceLine yAxisId="price" y={fibLevels.wave1Top} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'W1 Top $60.64', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
          <ReferenceLine yAxisId="price" y={fibLevels.fib236} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: '23.6% $56.49', fill: '#06b6d4', fontSize: 10, position: 'right' }} />
          <ReferenceLine yAxisId="price" y={fibLevels.fib382} stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" label={{ value: '38.2% $53.93 BUY ZONE', fill: '#22c55e', fontSize: 10, position: 'right' }} />
          <ReferenceLine yAxisId="price" y={fibLevels.fib500} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '50% $51.86', fill: '#a855f7', fontSize: 10, position: 'right' }} />
          <ReferenceLine yAxisId="price" y={fibLevels.wave1Bottom} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'W1 Low $43.08', fill: '#ef4444', fontSize: 10, position: 'right' }} />
          
          {/* Buy Zone Highlight */}
          <ReferenceArea yAxisId="price" y1={51.86} y2={53.93} fill="#22c55e" fillOpacity={0.1} />
          
          {/* Volume Bars */}
          <Bar yAxisId="volume" dataKey="volume" fill="url(#volumeGradient)" opacity={0.6} />
          
          {/* Price Line with Area */}
          <Area 
            yAxisId="price"
            type="monotone" 
            dataKey="price" 
            stroke="#22c55e" 
            strokeWidth={3}
            fill="url(#priceGradient)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Wave Labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 24,
        padding: '16px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#22c55e', fontSize: 24, fontWeight: 700 }}>Wave 1</div>
          <div style={{ color: '#64748b', fontSize: 12 }}>$43.08 → $60.64</div>
          <div style={{ color: '#22c55e', fontSize: 14, fontWeight: 600 }}>+40.8%</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: 24, fontWeight: 700 }}>Wave 2</div>
          <div style={{ color: '#64748b', fontSize: 12 }}>Target: $51.86-$53.93</div>
          <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600 }}>IN PROGRESS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#3b82f6', fontSize: 24, fontWeight: 700 }}>Wave 3</div>
          <div style={{ color: '#64748b', fontSize: 12 }}>Target: $82.35</div>
          <div style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600 }}>PENDING</div>
        </div>
      </div>

      {/* Indicators Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16,
        marginTop: 16 
      }}>
        {[
          { label: 'RSI(14)', value: '75.45', status: 'OVERBOUGHT', color: '#ef4444' },
          { label: 'Williams %R', value: '-14.02', status: 'OVERBOUGHT', color: '#ef4444' },
          { label: 'Stochastic', value: '80.69', status: 'OVERBOUGHT', color: '#ef4444' },
          { label: 'ADX(14)', value: '27.49', status: 'STRONG TREND', color: '#22c55e' }
        ].map((ind, i) => (
          <div key={i} style={{ 
            background: 'rgba(30, 41, 59, 0.7)', 
            padding: '12px', 
            borderRadius: '8px',
            borderLeft: `3px solid ${ind.color}`
          }}>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>{ind.label}</div>
            <div style={{ color: '#f8fafc', fontSize: 18, fontWeight: 700 }}>{ind.value}</div>
            <div style={{ color: ind.color, fontSize: 10, fontWeight: 600 }}>{ind.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
