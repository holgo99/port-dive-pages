import React from "react";

const ScenarioProbabilityTree = () => {
  const scenarios = [
    {
      name: "Wave 2 Pullback",
      probability: 83,
      color: "#22c55e",
      subScenarios: [
        {
          name: "38.2% Fib ($53.93)",
          probability: 60,
          target: "$82.35",
          rr: "1:2.6",
          action: "RELOAD 40%",
        },
        {
          name: "50% Fib ($51.86)",
          probability: 23,
          target: "$80.00",
          rr: "1:2.8",
          action: "RELOAD 50%",
        },
      ],
    },
    {
      name: "Wave 1 Extension",
      probability: 12,
      color: "#3b82f6",
      subScenarios: [
        {
          name: "1.272x Ext ($64.43)",
          probability: 12,
          target: "$85.00+",
          rr: "1:4.1",
          action: "TRAIL STOP",
        },
      ],
    },
    {
      name: "Trend Reversal",
      probability: 5,
      color: "#ef4444",
      subScenarios: [
        {
          name: "Break $43.08",
          probability: 5,
          target: "N/A",
          rr: "LOSS",
          action: "EXIT ALL",
        },
      ],
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "32px",
        borderRadius: "16px",
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
        minHeight: "600px",
      }}
    >
      <h2
        style={{
          color: "#f8fafc",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        NVO Scenario Probability Tree
      </h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
        Bayesian-updated probabilities | Current Price: $58.81
      </p>

      {/* Current Price Node */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            padding: "20px 40px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)",
          }}
        >
          <div style={{ color: "#bfdbfe", fontSize: 12, fontWeight: 500 }}>
            CURRENT PRICE
          </div>
          <div style={{ color: "#ffffff", fontSize: 32, fontWeight: 700 }}>
            $58.81
          </div>
          <div style={{ color: "#93c5fd", fontSize: 12 }}>
            Jan 9, 2026 Close
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <div
          style={{
            width: "60%",
            height: 2,
            background: "linear-gradient(90deg, #334155, #64748b, #334155)",
          }}
        />
      </div>

      {/* Scenario Branches */}
      <div style={{ display: "flex", justifyContent: "space-around", gap: 24 }}>
        {scenarios.map((scenario, idx) => (
          <div key={idx} style={{ flex: 1, maxWidth: 320 }}>
            {/* Main Scenario Card */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                borderRadius: "12px",
                padding: "20px",
                borderTop: `4px solid ${scenario.color}`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{ color: "#f8fafc", fontSize: 16, fontWeight: 600 }}
                >
                  {scenario.name}
                </span>
                <span
                  style={{
                    background: scenario.color,
                    color: "#000",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {scenario.probability}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: 8,
                  background: "#1e293b",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${scenario.probability}%`,
                    background: `linear-gradient(90deg, ${scenario.color}, ${scenario.color}88)`,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>

            {/* Sub-scenarios */}
            {scenario.subScenarios.map((sub, subIdx) => (
              <div
                key={subIdx}
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: 12,
                  borderLeft: `3px solid ${scenario.color}`,
                }}
              >
                <div
                  style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}
                >
                  {sub.name}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>TARGET</div>
                    <div
                      style={{
                        color: "#22c55e",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {sub.target}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>R:R</div>
                    <div
                      style={{
                        color: "#f59e0b",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {sub.rr}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    background:
                      scenario.probability > 50
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                    borderRadius: "6px",
                    color: scenario.probability > 50 ? "#22c55e" : "#ef4444",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ACTION: {sub.action}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Expected Value Summary */}
      <div
        style={{
          marginTop: 32,
          background: "rgba(30, 41, 59, 0.6)",
          borderRadius: "12px",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 2fr))",
          gap: 24,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
            EXPECTED VALUE
          </div>
          <div style={{ color: "#22c55e", fontSize: 28, fontWeight: 700 }}>
            +39.4%
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>
            12-Month Weighted
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
            SHARPE RATIO
          </div>
          <div style={{ color: "#3b82f6", fontSize: 28, fontWeight: 700 }}>
            1.9
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>Risk-Adjusted</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
            MAX DRAWDOWN
          </div>
          <div style={{ color: "#ef4444", fontSize: 28, fontWeight: 700 }}>
            -24%
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>
            Probability-Weighted
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
            KELLY FRACTION
          </div>
          <div style={{ color: "#f59e0b", fontSize: 28, fontWeight: 700 }}>
            24%
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>Optimal Position</div>
        </div>
      </div>

      {/* Risk/Reward Payoff */}
      <div
        style={{
          marginTop: 24,
          background: "rgba(30, 41, 59, 0.4)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            color: "#94a3b8",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          WEIGHTED PAYOFF BREAKDOWN
        </div>
        <div style={{ display: "flex", gap: 8, height: 40 }}>
          <div
            style={{
              flex: 60,
              background: "linear-gradient(90deg, #22c55e, #16a34a)",
              borderRadius: "4px 0 0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Base +24%
          </div>
          <div
            style={{
              flex: 25,
              background: "linear-gradient(90deg, #3b82f6, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Bull +15.3%
          </div>
          <div
            style={{
              flex: 10,
              background: "linear-gradient(90deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            +2.2%
          </div>
          <div
            style={{
              flex: 5,
              background: "linear-gradient(90deg, #ef4444, #dc2626)",
              borderRadius: "0 4px 4px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            -2.1%
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            color: "#64748b",
            fontSize: 10,
          }}
        >
          <span>Base Case (60%)</span>
          <span>Bull (25%)</span>
          <span>Bear (10%)</span>
          <span>Tail (5%)</span>
        </div>
      </div>
    </div>
  );
};

export default ScenarioProbabilityTree;
