import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Bar } from 'recharts';

// Technical indicator data (last 30 days)
const technicalData = [
  { date: 'Dec 10', price: 49.05, rsi: 44, macd: -1.2, macdSignal: -1.8, williamsR: -65, stochK: 35, stochD: 32, adx: 18 },
  { date: 'Dec 11', price: 50.29, rsi: 48, macd: -0.9, macdSignal: -1.5, williamsR: -55, stochK: 42, stochD: 36, adx: 19 },
  { date: 'Dec 12', price: 50.18, rsi: 48, macd: -0.7, macdSignal: -1.2, williamsR: -56, stochK: 41, stochD: 38, adx: 19 },
  { date: 'Dec 15', price: 50.37, rsi: 49, macd: -0.5, macdSignal: -0.9, williamsR: -52, stochK: 45, stochD: 41, adx: 20 },
  { date: 'Dec 16', price: 48.96, rsi: 45, macd: -0.6, macdSignal: -0.8, williamsR: -62, stochK: 38, stochD: 42, adx: 20 },
  { date: 'Dec 17', price: 47.77, rsi: 42, macd: -0.8, macdSignal: -0.7, williamsR: -72, stochK: 28, stochD: 38, adx: 21 },
  { date: 'Dec 18', price: 47.61, rsi: 41, macd: -0.9, macdSignal: -0.7, williamsR: -75, stochK: 25, stochD: 32, adx: 21 },
  { date: 'Dec 19', price: 48.09, rsi: 43, macd: -0.7, macdSignal: -0.7, williamsR: -68, stochK: 32, stochD: 29, adx: 22 },
  { date: 'Dec 22', price: 48.10, rsi: 43, macd: -0.5, macdSignal: -0.6, williamsR: -67, stochK: 33, stochD: 30, adx: 22 },
  { date: 'Dec 23', price: 51.61, rsi: 60, macd: 0.2, macdSignal: -0.3, williamsR: -28, stochK: 68, stochD: 42, adx: 23 },
  { date: 'Dec 24', price: 52.56, rsi: 63, macd: 0.6, macdSignal: 0.0, williamsR: -22, stochK: 75, stochD: 55, adx: 24 },
  { date: 'Dec 26', price: 52.40, rsi: 62, macd: 0.8, macdSignal: 0.2, williamsR: -25, stochK: 72, stochD: 65, adx: 24 },
  { date: 'Dec 29', price: 51.47, rsi: 58, macd: 0.7, macdSignal: 0.4, williamsR: -35, stochK: 62, stochD: 68, adx: 25 },
  { date: 'Dec 30', price: 51.22, rsi: 57, macd: 0.6, macdSignal: 0.5, williamsR: -38, stochK: 58, stochD: 65, adx: 25 },
  { date: 'Dec 31', price: 50.88, rsi: 55, macd: 0.5, macdSignal: 0.5, williamsR: -42, stochK: 54, stochD: 60, adx: 26 },
  { date: 'Jan 2', price: 52.39, rsi: 60, macd: 0.8, macdSignal: 0.6, williamsR: -28, stochK: 68, stochD: 58, adx: 26 },
  { date: 'Jan 5', price: 55.11, rsi: 68, macd: 1.4, macdSignal: 0.8, williamsR: -15, stochK: 82, stochD: 68, adx: 27 },
  { date: 'Jan 6', price: 56.26, rsi: 70, macd: 1.8, macdSignal: 1.0, williamsR: -12, stochK: 85, stochD: 76, adx: 27 },
  { date: 'Jan 7', price: 56.57, rsi: 71, macd: 2.0, macdSignal: 1.2, williamsR: -10, stochK: 84, stochD: 80, adx: 27 },
  { date: 'Jan 8', price: 57.34, rsi: 73, macd: 2.1, macdSignal: 1.4, williamsR: -8, stochK: 82, stochD: 82, adx: 27 },
  { date: 'Jan 9', price: 58.81, rsi: 75.45, macd: 2.18, macdSignal: 1.28, williamsR: -14.02, stochK: 80.69, stochD: 81.38, adx: 27.49 },
];

const GaugeIndicator = ({ value, min, max, label, overbought, oversold, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOverbought = value >= overbought;
  const isOversold = value <= oversold;
  const color = isOverbought ? '#ef4444' : isOversold ? '#22c55e' : '#3b82f6';
  
  return (
    <div style={{ textAlign: 'center', padding: '12px' }}>
      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ position: 'relative', height: 120, width: 120, margin: '0 auto' }}>
        <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background arc */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeDasharray="251.2"
            strokeDashoffset="62.8"
          />
          {/* Value arc */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (188.4 * percentage / 100)}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ color: '#f8fafc', fontSize: 24, fontWeight: 700 }}>{value.toFixed(1)}{unit}</div>
          <div style={{ 
            color: color, 
            fontSize: 10, 
            fontWeight: 600,
            marginTop: 2
          }}>
            {isOverbought ? 'OVERBOUGHT' : isOversold ? 'OVERSOLD' : 'NEUTRAL'}
          </div>
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 8,
        color: '#64748b',
        fontSize: 10
      }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

const TechnicalDashboard = () => {
  const currentData = technicalData[technicalData.length - 1];
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px',
      borderRadius: '16px',
      fontFamily: "'SF Pro Display', -apple-system, sans-serif"
    }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          NVO Technical Dashboard
        </h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Multi-Indicator Analysis | As of Jan 9, 2026
        </p>
      </div>

      {/* Gauge Indicators */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: 16,
        marginBottom: 32,
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <GaugeIndicator 
          value={currentData.rsi} 
          min={0} max={100} 
          label="RSI(14)" 
          overbought={70} oversold={30}
        />
        <GaugeIndicator 
          value={Math.abs(currentData.williamsR)} 
          min={0} max={100} 
          label="Williams %R(14)" 
          overbought={80} oversold={20}
        />
        <GaugeIndicator 
          value={currentData.stochK} 
          min={0} max={100} 
          label="Stochastic K" 
          overbought={80} oversold={20}
        />
        <GaugeIndicator 
          value={currentData.stochD} 
          min={0} max={100} 
          label="Stochastic D" 
          overbought={80} oversold={20}
        />
        <GaugeIndicator 
          value={currentData.adx} 
          min={0} max={60} 
          label="ADX(14)" 
          overbought={40} oversold={20}
        />
      </div>

      {/* RSI Chart */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>RSI(14) - Momentum</h3>
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart data={technicalData}>
            <defs>
              <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[20, 90]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="rsi" stroke="#3b82f6" fill="url(#rsiGradient)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* MACD Chart */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>MACD(12/26/9) - Trend</h3>
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart data={technicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[-2.5, 3]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar 
              dataKey={(d) => d.macd - d.macdSignal} 
              fill={(d) => (d.macd - d.macdSignal) > 0 ? '#22c55e' : '#ef4444'}
              opacity={0.6}
            />
            <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Stochastic Chart */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Stochastic(14/3/3) - Mean Reversion</h3>
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart data={technicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" />
            <ReferenceLine y={20} stroke="#22c55e" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="stochK" stroke="#a855f7" strokeWidth={2} dot={false} name="K" />
            <Line type="monotone" dataKey="stochD" stroke="#ec4899" strokeWidth={2} dot={false} name="D" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Signal Summary */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          SELL/TRIM Signal Matrix
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { signal: 'RSI >75', status: true, value: '75.45' },
            { signal: 'Williams %R >-20', status: true, value: '-14.02' },
            { signal: 'MACD Shrinking', status: false, value: 'Expanding' },
            { signal: 'Volume Declining', status: false, value: '29.1M' },
            { signal: 'Stoch >80', status: true, value: '80.69/81.38' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: item.status ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              borderLeft: `3px solid ${item.status ? '#ef4444' : '#64748b'}`
            }}>
              <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4 }}>{item.signal}</div>
              <div style={{ color: item.status ? '#ef4444' : '#64748b', fontSize: 14, fontWeight: 600 }}>
                {item.status ? '✓ CONFIRMED' : '✗ NOT MET'}
              </div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>
            SIGNAL COUNT: 3/5 CONFIRMED
          </span>
          <span style={{ color: '#f8fafc', fontSize: 14, fontWeight: 700 }}>
            ACTION: TRIM 25-30%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDashboard;
