// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
module.exports = {
  docs: [
    {
      type: "doc",
      id: "overview",
      label: "Overview",
    },
    {
      type: "category",
      label: "Features",
      items: [
        {
          type: "category",
          label: "NBIS, Nebius Group N.V.",
          customProps: {
            icon: "/img/nbis/nbis-icon.svg", // Your icon path
          },
          items: [
            {
              type: "category",
              label: "Elliott Wave Analysis",
              items: ["features/ticker/elliott-wave-analysis/chart-overlay"],
            },
            {
              type: "category",
              label: "Technical Indicators",
              items: [
                "features/ticker/technical-indicators/oscillators-dashboard",
                "features/ticker/technical-indicators/moving-averages-dashboard",
                "features/ticker/technical-indicators/signal-matrix",
              ],
            },
            {
              type: "category",
              label: "AI Features",
              items: [
                "features/ticker/ai-features/ai-verdict-panel",
                "features/ticker/ai-features/ai-signal-contradiction-resolution",
              ],
            },
          ],
        },
      ],
    },
    // Add NVO section similarly
  ],
};
