import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Area, ComposedChart } from 'recharts';

// Weekly price data with projections
const weeklyData = [
  // Historical data (actual)
  { week: 'Oct 21', price: 88.50, type: 'actual', sma50: 95.20, sma200: 98.50 },
  { week: 'Oct 28', price: 84.20, type: 'actual', sma50: 93.80, sma200: 97.80 },
  { week: 'Nov 4', price: 78.30, type: 'actual', sma50: 91.50, sma200: 96.90 },
  { week: 'Nov 11', price: 72.50, type: 'actual', sma50: 88.70, sma200: 95.80 },
  { week: 'Nov 18', price: 68.20, type: 'actual', sma50: 85.40, sma200: 94.50 },
  { week: 'Nov 25', price: 43.08, type: 'actual', sma50: 81.20, sma200: 93.00, label: 'WAVE 1 START' },
  { week: 'Dec 2', price: 47.99, type: 'actual', sma50: 77.50, sma200: 91.40 },
  { week: 'Dec 9', price: 46.36, type: 'actual', sma50: 73.90, sma200: 89.80 },
  { week: 'Dec 16', price: 47.77, type: 'actual', sma50: 70.50, sma200: 88.10 },
  { week: 'Dec 23', price: 51.61, type: 'actual', sma50: 67.40, sma200: 86.40 },
  { week: 'Dec 30', price: 50.88, type: 'actual', sma50: 64.80, sma200: 84.70 },
  { week: 'Jan 6', price: 56.26, type: 'actual', sma50: 62.50, sma200: 83.20 },
  { week: 'Jan 9', price: 58.81, type: 'actual', sma50: 63.41, sma200: 83.37, label: 'CURRENT' },
  // Projected Wave 2 (pullback)
  { week: 'Jan 13', price: 56.00, type: 'projected', wave: 'W2' },
  { week: 'Jan 20', price: 54.50, type: 'projected', wave: 'W2' },
  { week: 'Jan 27', price: 53.93, type: 'projected', wave: 'W2', label: 'WAVE 2 BOTTOM' },
  // Projected Wave 3 (extension)
  { week: 'Feb 3', price: 56.00, type: 'projected', wave: 'W3' },
  { week: 'Feb 10', price: 59.00, type: 'projected', wave: 'W3' },
  { week: 'Feb 17', price: 62.00, type: 'projected', wave: 'W3' },
  { week: 'Feb 24', price: 65.00, type: 'projected', wave: 'W3' },
  { week: 'Mar 3', price: 68.00, type: 'projected', wave: 'W3' },
  { week: 'Mar 10', price: 71.00, type: 'projected', wave: 'W3' },
  { week: 'Mar 17', price: 74.00, type: 'projected', wave: 'W3' },
  { week: 'Mar 24', price: 77.00, type: 'projected', wave: 'W3' },
  { week: 'Mar 31', price: 79.00, type: 'projected', wave: 'W3' },
  { week: 'Apr 7', price: 82.35, type: 'projected', wave: 'W3', label: 'WAVE 3 TARGET' },
  // Projected Wave 4 (pullback)
  { week: 'Apr 14', price: 78.00, type: 'projected', wave: 'W4' },
  { week: 'Apr 21', price: 74.00, type: 'projected', wave: 'W4' },
  { week: 'Apr 28', price: 71.49, type: 'projected', wave: 'W4', label: 'WAVE 4 BOTTOM' },
  // Projected Wave 5
  { week: 'May 5', price: 75.00, type: 'projected', wave: 'W5' },
  { week: 'May 12', price: 80.00, type: 'projected', wave: 'W5' },
  { week: 'May 19', price: 85.00, type: 'projected', wave: 'W5' },
  { week: 'May 26', price: 89.00, type: 'projected', wave: 'W5', label: 'WAVE 5 TARGET' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid #3b82f6',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
      }}>
        <p style={{ color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{label}</p>
        <p style={{ color: data.type === 'actual' ? '#22c55e' : '#f59e0b', fontSize: 20, fontWeight: 700 }}>
          ${data.price?.toFixed(2)}
        </p>
        {data.wave && (
          <p style={{ color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>{data.wave}</p>
        )}
        {data.label && (
          <p style={{ color: '#a855f7', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{data.label}</p>
        )}
        <p style={{ color: '#64748b', fontSize: 10 }}>
          {data.type === 'actual' ? 'Historical' : 'Projected'}
        </p>
      </div>
    );
  }
  return null;
};

const LongTermProjection = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px',
      borderRadius: '16px',
      fontFamily: "'SF Pro Display', -apple-system, sans-serif"
    }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          NVO Long-Term Price Projection
        </h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Elliott Wave 5-Wave Impulse Projection | 200-Day Horizon
        </p>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={weeklyData} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="week" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={2}
          />
          <YAxis 
            domain={[35, 100]} 
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Fibonacci Extension Targets */}
          <ReferenceLine y={82.35} stroke="#22c55e" strokeDasharray="5 5" strokeWidth={2} label={{ value: '1.618x $82.35', fill: '#22c55e', fontSize: 11, position: 'right' }} />
          <ReferenceLine y={71.49} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: '1.00x $71.49', fill: '#3b82f6', fontSize: 10, position: 'right' }} />
          
          {/* Support Levels */}
          <ReferenceLine y={53.93} stroke="#a855f7" strokeDasharray="5 5" label={{ value: '38.2% $53.93', fill: '#a855f7', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={51.86} stroke="#ec4899" strokeDasharray="3 3" label={{ value: '50% $51.86', fill: '#ec4899', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={43.08} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'STOP $43.08', fill: '#ef4444', fontSize: 10, position: 'right' }} />
          
          {/* Buy Zone */}
          <ReferenceArea y1={51.86} y2={53.93} fill="#22c55e" fillOpacity={0.1} />
          
          {/* Wave 3 Target Zone */}
          <ReferenceArea y1={78} y2={85} fill="#3b82f6" fillOpacity={0.05} />
          
          {/* Historical Price Line */}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#22c55e" 
            strokeWidth={3}
            dot={false}
            connectNulls={false}
          />
          
          {/* 50 SMA */}
          <Line 
            type="monotone" 
            dataKey="sma50" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          
          {/* 200 SMA */}
          <Line 
            type="monotone" 
            dataKey="sma200" 
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="10 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Wave Labels */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: 16,
        marginTop: 24,
        padding: '16px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px'
      }}>
        {[
          { wave: 'Wave 1', range: '$43.08 → $60.64', gain: '+40.8%', status: 'COMPLETE', color: '#22c55e' },
          { wave: 'Wave 2', range: '$60.64 → $53.93', gain: '-11.1%', status: 'IN PROGRESS', color: '#f59e0b' },
          { wave: 'Wave 3', range: '$53.93 → $82.35', gain: '+52.7%', status: 'PROJECTED', color: '#3b82f6' },
          { wave: 'Wave 4', range: '$82.35 → $71.49', gain: '-13.2%', status: 'PROJECTED', color: '#a855f7' },
          { wave: 'Wave 5', range: '$71.49 → $89.00', gain: '+24.5%', status: 'PROJECTED', color: '#ec4899' },
        ].map((w, i) => (
          <div key={i} style={{ 
            textAlign: 'center',
            padding: '12px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '8px',
            borderTop: `3px solid ${w.color}`
          }}>
            <div style={{ color: w.color, fontSize: 18, fontWeight: 700 }}>{w.wave}</div>
            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>{w.range}</div>
            <div style={{ color: w.gain.startsWith('+') ? '#22c55e' : '#ef4444', fontSize: 14, fontWeight: 600 }}>{w.gain}</div>
            <div style={{ 
              color: '#64748b', 
              fontSize: 10, 
              marginTop: 4,
              padding: '2px 8px',
              background: 'rgba(100, 116, 139, 0.2)',
              borderRadius: '4px',
              display: 'inline-block'
            }}>{w.status}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginTop: 16,
        padding: '12px',
        background: 'rgba(30, 41, 59, 0.3)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 3, background: '#22c55e' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Price</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 2, background: '#3b82f6', borderStyle: 'dashed' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>50 SMA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 2, background: '#f59e0b' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>200 SMA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, background: 'rgba(34, 197, 94, 0.2)', borderRadius: 2 }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Buy Zone</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginTop: 16
      }}>
        {[
          { label: 'Wave 3 Target', value: '$82.35', subtext: '1.618x Extension', color: '#22c55e' },
          { label: 'Wave 2 Buy Zone', value: '$51.86-53.93', subtext: '38.2%-50% Fib', color: '#a855f7' },
          { label: 'Full Cycle Return', value: '+106.6%', subtext: 'From W1 Low to W5', color: '#3b82f6' },
          { label: 'Timeline', value: '6-8 Months', subtext: 'Jan - Aug 2026', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#64748b', fontSize: 11 }}>{m.label}</div>
            <div style={{ color: m.color, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{m.value}</div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>{m.subtext}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LongTermProjection;
