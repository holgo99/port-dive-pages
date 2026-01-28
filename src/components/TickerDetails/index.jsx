/**
 * TickerDetails - Sidebar Component
 *
 * Displays detailed ticker information including:
 * - Company fundamentals
 * - Symbol details
 * - Trading metrics
 * - Market data
 *
 * @component
 * @param {string} ticker - Ticker symbol
 */

import React from "react";
import styles from "./styles.module.css";

// Mock ticker database
const TICKER_DATA = {
  NBIS: {
    symbol: "NBIS",
    company: "Nebius Group N.V.",
    sector: "Technology",
    industry: "Cloud Computing",
    country: "Netherlands",
    isin: "NL0015436031",
    website: "https://nebius.com",
    currentPrice: 14.32,
    dayHigh: 14.85,
    dayLow: 13.95,
    fiftyTwoWeekHigh: 17.5,
    fiftyTwoWeekLow: 8.2,
    marketCap: "$2.1B",
    employees: 450,
    founded: 2020,
    fundamentals: {
      pe: 28.4,
      pb: 3.2,
      ps: 2.1,
      revenue: "$450M",
      ebitda: "$85M",
      grossMargin: "68%",
      operatingMargin: "12%",
    },
    trading: {
      volume: "2.4M",
      avgVolume: "1.8M",
      bid: 14.3,
      ask: 14.35,
      spread: 0.05,
    },
  },
  AAPL: {
    symbol: "AAPL",
    company: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    country: "USA",
    isin: "US0378331005",
    website: "https://apple.com",
    currentPrice: 138.45,
    dayHigh: 140.12,
    dayLow: 137.2,
    fiftyTwoWeekHigh: 199.62,
    fiftyTwoWeekLow: 124.17,
    marketCap: "$2.1T",
    employees: 164000,
    founded: 1976,
    fundamentals: {
      pe: 32.5,
      pb: 54.2,
      ps: 7.8,
      revenue: "$383B",
      ebitda: "$130B",
      grossMargin: "46.2%",
      operatingMargin: "30.1%",
    },
    trading: {
      volume: "52.3M",
      avgVolume: "45.1M",
      bid: 138.43,
      ask: 138.47,
      spread: 0.04,
    },
  },
};

export function TickerDetails({ ticker }) {
  const tickerData = TICKER_DATA[ticker] || TICKER_DATA.NBIS;

  return (
    <div className={styles.tickerDetails}>
      {/* Company Header */}
      <div className={styles.companyHeader}>
        <div className={styles.symbolBadge}>
          <div className={styles.symbol}>{tickerData.symbol}</div>
        </div>
        <h2 className={styles.companyName}>{tickerData.company}</h2>
        <p className={styles.companyMeta}>
          {tickerData.sector} • {tickerData.country}
        </p>
      </div>

      {/* Current Price Section */}
      <div className={styles.priceSection}>
        <div className={styles.currentPrice}>
          <div className={styles.priceLabel}>Current Price</div>
          <div className={styles.priceValue}>
            ${tickerData.currentPrice.toFixed(2)}
          </div>
        </div>
        <div className={styles.priceRange}>
          <div className={styles.rangeItem}>
            <span className={styles.rangeLabel}>Day High</span>
            <span className={styles.rangeValue}>
              ${tickerData.dayHigh.toFixed(2)}
            </span>
          </div>
          <div className={styles.rangeItem}>
            <span className={styles.rangeLabel}>Day Low</span>
            <span className={styles.rangeValue}>
              ${tickerData.dayLow.toFixed(2)}
            </span>
          </div>
        </div>
        <div className={styles.rangeBar}>
          <div className={styles.rangeBarTrack}>
            <div
              className={styles.rangeBarFill}
              style={{
                left: "20%",
                right: "15%",
              }}
            />
          </div>
        </div>
      </div>

      {/* 52 Week Range */}
      <div className={styles.detailSection}>
        <h3 className={styles.detailTitle}>52-Week Range</h3>
        <div className={styles.rangeGrid}>
          <div className={styles.rangeCard}>
            <div className={styles.rangeCardLabel}>High</div>
            <div className={styles.rangeCardValue}>
              ${tickerData.fiftyTwoWeekHigh.toFixed(2)}
            </div>
          </div>
          <div className={styles.rangeCard}>
            <div className={styles.rangeCardLabel}>Low</div>
            <div className={styles.rangeCardValue}>
              ${tickerData.fiftyTwoWeekLow.toFixed(2)}
            </div>
          </div>
        </div>
        <div className={styles.rangeBar} style={{ marginTop: "12px" }}>
          <div className={styles.rangeBarTrack}>
            <div
              className={styles.rangeBarFill}
              style={{
                left: "35%",
                right: "10%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className={styles.detailSection}>
        <h3 className={styles.detailTitle}>Company Details</h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Market Cap</span>
            <span className={styles.detailValue}>{tickerData.marketCap}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Industry</span>
            <span className={styles.detailValue}>{tickerData.industry}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Employees</span>
            <span className={styles.detailValue}>
              {tickerData.employees.toLocaleString()}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Founded</span>
            <span className={styles.detailValue}>{tickerData.founded}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>ISIN</span>
            <span className={styles.detailValue}>{tickerData.isin}</span>
          </div>
        </div>
      </div>

      {/* Fundamentals */}
      <div className={styles.detailSection}>
        <h3 className={styles.detailTitle}>Fundamentals</h3>
        <div className={styles.fundamentalsGrid}>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>P/E Ratio</div>
            <div className={styles.fundValue}>{tickerData.fundamentals.pe}</div>
          </div>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>P/B Ratio</div>
            <div className={styles.fundValue}>{tickerData.fundamentals.pb}</div>
          </div>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>P/S Ratio</div>
            <div className={styles.fundValue}>{tickerData.fundamentals.ps}</div>
          </div>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>Revenue</div>
            <div className={styles.fundValue}>
              {tickerData.fundamentals.revenue}
            </div>
          </div>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>EBITDA</div>
            <div className={styles.fundValue}>
              {tickerData.fundamentals.ebitda}
            </div>
          </div>
          <div className={styles.fundamental}>
            <div className={styles.fundLabel}>Gross Margin</div>
            <div className={styles.fundValue}>
              {tickerData.fundamentals.grossMargin}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Information */}
      <div className={styles.detailSection}>
        <h3 className={styles.detailTitle}>Trading</h3>
        <div className={styles.tradingGrid}>
          <div className={styles.tradingItem}>
            <span className={styles.tradingLabel}>Volume</span>
            <span className={styles.tradingValue}>
              {tickerData.trading.volume}
            </span>
          </div>
          <div className={styles.tradingItem}>
            <span className={styles.tradingLabel}>Avg Volume</span>
            <span className={styles.tradingValue}>
              {tickerData.trading.avgVolume}
            </span>
          </div>
          <div className={styles.tradingItem}>
            <span className={styles.tradingLabel}>Bid</span>
            <span className={styles.tradingValue}>
              ${tickerData.trading.bid.toFixed(2)}
            </span>
          </div>
          <div className={styles.tradingItem}>
            <span className={styles.tradingLabel}>Ask</span>
            <span className={styles.tradingValue}>
              ${tickerData.trading.ask.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Website Link */}
      <a
        href={tickerData.website}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.websiteLink}
      >
        <span>Visit Company Website</span>
        <span className={styles.linkIcon}>→</span>
      </a>
    </div>
  );
}
