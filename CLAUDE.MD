# PortDive Pages - Project Context for AI Assistants

## Project Overview

**PortDive Pages** is a Docusaurus-based documentation and marketing website for PortDive, an AI-driven portfolio analysis platform. The site presents investment analysis reports, deep dives on specific stocks (like NVO and ZETA), and educational content about the PortDive platform.

**Purpose**: Educational and informational resource showcasing AI-generated investment analysis reports
**Tech Stack**: Docusaurus 3.9.2, React 19, MDX, Recharts for data visualization
**Deployment**: GitHub Pages at https://holgo99.github.io/portdive-pages/

## Project Structure

```
portdive-pages/
├── docs/              # Main documentation content (MDX files)
│   ├── intro.mdx      # Introduction page
│   ├── nvo/           # Novo Nordisk analysis reports
│   └── zeta/          # Zeta Global analysis reports
├── blog/              # Blog posts
├── src/
│   ├── components/    # React components
│   ├── css/           # Custom styling
│   ├── pages/         # Custom pages (landing, etc.)
│   └── theme/         # Theme customizations
├── static/
│   └── img/           # Static images, logos, social cards
├── docusaurus.config.js  # Main configuration
├── sidebars.js        # Sidebar navigation config
└── package.json
```

## Key Information

### Brand Identity
- **Name**: PortDive
- **Tagline**: "AI-driven portfolio deep dives. Build Conviction, Not Anxiety."
- **Theme Color**: #1FA39B (teal/turquoise)
- **Logo**: portdive-logo-primary.svg

### Important Disclaimers
All content includes disclaimers stating:
- Reports are for informational/educational purposes only
- NOT investment advice or buy/sell recommendations
- AI-generated analysis may contain hallucinations
- Trading involves risk

### Development Commands

```bash
npm start              # Start development server (localhost:3000)
npm run build          # Build for production
npm run serve          # Serve production build locally
npm run deploy         # Deploy to GitHub Pages
npm run clear          # Clear Docusaurus cache
```

### Node Requirements
- Node.js >= 20.0 (specified in package.json engines)

## Content Guidelines

### When Adding New Stock Analysis
1. Create a new folder under `docs/` (e.g., `docs/ticker-symbol/`)
2. Use MDX format for rich content with React components
3. Include standard disclaimer at the top
4. Update `sidebars.js` to add navigation entry
5. Consider adding interactive charts using Recharts

### MDX Best Practices
- Use frontmatter for page metadata (title, description, sidebar position)
- Import and use custom React components for interactive elements
- Keep markdown clean and accessible
- Use code blocks with syntax highlighting where appropriate

### Styling
- Custom CSS lives in `src/css/custom.css`
- Follow Docusaurus theme conventions
- Respect color scheme (supports dark mode via `respectPrefersColorScheme`)
- Maintain mobile responsiveness

## Technical Considerations

### Dependencies
- **Docusaurus**: 3.9.2 (v4 compatibility enabled via future flags)
- **React**: 19.0.0
- **Recharts**: ^3.6.0 for data visualization
- **MDX**: ^3.0.0 for enhanced markdown

### Configuration Notes
- Base URL: `/portdive-pages/` (GitHub Pages subdirectory)
- Sidebar is hideable via user interaction
- Search is enabled in navbar
- Broken links throw errors (strict mode)

### Deployment
- Hosted on GitHub Pages
- Organization: PortDive UG.
- Repository: https://github.com/holgo99/portdive-pages
- Deploy command: `npm run deploy`

## Common Tasks

### Adding a New Stock Report
1. Create `docs/ticker/` directory
2. Add `index.mdx` with frontmatter
3. Create additional analysis pages as needed
4. Update `sidebars.js` with new section
5. Test locally with `npm start`
6. Deploy with `npm run deploy`

### Updating Site Metadata
- Edit `docusaurus.config.js` for title, tagline, SEO metadata
- Update social card images in `static/img/`
- Modify theme colors in `themeConfig`

### Creating Interactive Components
1. Add component to `src/components/`
2. Import in MDX files where needed
3. Use Recharts for data visualizations
4. Ensure components are accessible and responsive

## Troubleshooting

### Build Failures
- Check Node.js version (must be >= 20.0)
- Clear cache: `npm run clear`
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check for broken links (Docusaurus throws on broken links)

### Styling Issues
- Check custom CSS in `src/css/custom.css`
- Verify Docusaurus theme overrides in `src/theme/`
- Test in both light and dark modes

### GitHub Pages Deployment
- Ensure `baseUrl` matches repository name
- Verify `url` and `organizationName` in config
- Check GitHub repository settings for Pages configuration

## Additional Context

This project is part of the PortDive platform ecosystem. The website serves as:
1. A showcase for AI-generated investment analysis
2. Educational resource about the PortDive methodology
3. Marketing and brand presence for PortDive UG.

All analysis is AI-generated and combines multiple models analyzing macro trends, technicals, sentiment, and fundamentals. The platform aims to help investors build conviction in their decisions while managing anxiety through comprehensive, multi-faceted analysis.

## Git Workflow

- Main branch: (not specified, typically `main` or `master`)
- Current working branch: `stoic-aryabhata` (worktree)
- Commit style: Follow existing patterns (sentence case, descriptive)

## AI-PREMIUM Component Styling Guide

AI-PREMIUM components are premium features that receive special visual treatment to distinguish them from standard components. Each premium component shares common styling patterns while maintaining its own unique color identity.

### Files

- **Shared styles**: `src/css/premium-components.css` - Shared animations and color palette
- **Custom.css**: `src/css/custom.css` - Imports premium-components.css and defines global color variables
- **Component styles**: Each component has its own `styles.module.css` with component-scoped variables

### Color Identities

Each AI-PREMIUM component has a unique color identity while sharing structural patterns:

| Component | Primary Color | Secondary Color | Theme |
|-----------|--------------|-----------------|-------|
| AIActionSignalMatrixContradictionResolver | Purple (`#8b5cf6`) | Blue (`#3d72ff`) | AI/Neural |
| AIWaveCountAnalysisVerdictPanel | Teal (`#1fa39b`) | Gold (`#f59e0b`) | Analysis/Decision |

### Color Variables

Global CSS variables (defined in `custom.css`):
```css
:root {
    --portdive-teal: #1fa39b;
    --portdive-teal-rgb: 31, 163, 155;
    --portdive-blue: #3d72ff;
    --portdive-blue-rgb: 61, 114, 255;
    --portdive-coral: #ff6b6b;
    --portdive-coral-rgb: 255, 107, 107;
    --portdive-purple: #8b5cf6;
    --portdive-purple-rgb: 139, 92, 246;
    --portdive-gold: #f59e0b;
    --portdive-gold-rgb: 245, 158, 11;
}
```

### Premium Treatment Patterns

When applying premium treatment to a component, use these patterns:

#### 1. Component-Scoped CSS Variables

Define fallbacks at the component wrapper level:
```css
.componentWrapper {
    --portdive-teal: #1fa39b;
    --portdive-teal-rgb: 31, 163, 155;
    /* ... other colors with fallbacks ... */

    --premium-bg: #0a0a0f;
    --premium-surface: rgba(255, 255, 255, 0.03);
    --premium-surface-alt: rgba(255, 255, 255, 0.05);
    --premium-border: rgba(255, 255, 255, 0.08);
    --premium-text: #ffffff;
    --premium-text-secondary: rgba(255, 255, 255, 0.7);
    --premium-text-muted: rgba(255, 255, 255, 0.5);
}
```

#### 2. Animated Gradient Border

Create a glowing gradient border effect using `::before` pseudo-element:
```css
.componentWrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(
        135deg,
        rgba(var(--color1-rgb), 0.5) 0%,
        rgba(var(--color2-rgb), 0.3) 50%,
        rgba(var(--color3-rgb), 0.4) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

.componentWrapper:hover::before {
    opacity: 1;
}
```

#### 3. Shimmer Animation

Add a moving light effect to headers:
```css
.header::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
    );
    animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}
```

#### 4. Premium Badge

Create a pulsing badge for premium features:
```css
.premiumBadge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: linear-gradient(
        135deg,
        rgba(var(--accent-rgb), 0.2) 0%,
        rgba(var(--accent-rgb), 0.1) 100%
    );
    border: 1px solid rgba(var(--accent-rgb), 0.3);
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-color);
    animation: premiumPulse 2s ease-in-out infinite;
}
```

#### 5. Grid Pattern Overlay

Add subtle grid texture to sections:
```css
.section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(var(--accent-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    opacity: 0.5;
}
```

#### 6. Decorative Accent Line

Add a colored accent line to section titles:
```css
.sectionTitle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
        180deg,
        var(--color1) 0%,
        var(--color2) 100%
    );
    border-radius: 2px;
}
```

### Shared Animations (from premium-components.css)

```css
@keyframes premiumShimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

@keyframes premiumPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
}

@keyframes premiumGlow {
    0%, 100% { box-shadow: 0 0 8px currentColor; }
    50% { box-shadow: 0 0 16px currentColor; }
}

@keyframes premiumFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}
```

### Embedded Variant

When a premium component is embedded inside another component (like AIActionSignalMatrixContradictionResolver inside ActionSignalMatrix), use the `.embedded` class to remove outer styling:

```css
.embedded {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 0;
}

.embedded::before {
    display: none;  /* Remove animated border */
}

.embedded .mainContent {
    padding: 0;
}
```

### Light Mode Support

Override dark mode colors for light theme:
```css
[data-theme="light"] .componentWrapper {
    --premium-bg: #ffffff;
    --premium-surface: rgba(0, 0, 0, 0.02);
    --premium-surface-alt: rgba(0, 0, 0, 0.04);
    --premium-border: rgba(0, 0, 0, 0.08);
    --premium-text: #1a1a2e;
    --premium-text-secondary: rgba(0, 0, 0, 0.7);
    --premium-text-muted: rgba(0, 0, 0, 0.5);
}

[data-theme="light"] .componentWrapper::before {
    opacity: 0.4;  /* Reduce border intensity */
}
```

### Accessibility

Always include reduced-motion and high-contrast support:
```css
@media (prefers-reduced-motion: reduce) {
    .componentWrapper * {
        animation: none !important;
        transition-duration: 0.01ms !important;
    }
}

@media (prefers-contrast: more) {
    .componentWrapper {
        border-width: 2px;
    }

    .sectionTitle::before {
        width: 4px;
    }
}
```

### Current AI-PREMIUM Components

1. **AIActionSignalMatrixContradictionResolver** (`src/components/AIActionSignalMatrixContradictionResolver/`)
   - Analyzes and resolves conflicting trading signals
   - Purple/Blue color identity
   - Supports `standalone` and `embedded` variants

2. **AIWaveCountAnalysisVerdictPanel** (`src/components/AIWaveCountAnalysisVerdictPanel/`)
   - Displays AI analysis verdict and thesis
   - Teal/Gold color identity
   - Supports `standalone` and `embedded` variants

## Golden Ratio Design System

The PortDive design system uses the Golden Ratio (φ = 1.618033988749) throughout for mathematically harmonious proportions. This creates visual balance and aesthetic appeal based on principles found in nature and classical art.

### Mathematical Constants

```
φ (phi) = 1.618033988749
1/φ = 0.618033988749 (61.8%)
1 - 1/φ = 0.381966011251 (38.2%)
Golden Angle ≈ 137.5°
```

### Golden Ratio CSS Variables

Define these variables at the component or page level:

```css
.container {
    /* Golden Ratio Constants */
    --phi: 1.618033988749;
    --golden-major: 61.8033988749%;
    --golden-minor: 38.1966011251%;

    /* Fibonacci-based Spacing Scale
     * Each step multiplied by φ ≈ 1.618
     */
    --golden-1: 5px;     /* 8 / φ */
    --golden-2: 8px;     /* base */
    --golden-3: 13px;    /* 8 × φ */
    --golden-4: 21px;    /* 13 × φ */
    --golden-5: 34px;    /* 21 × φ */
    --golden-6: 55px;    /* 34 × φ */
    --golden-7: 89px;    /* 55 × φ */

    /* Golden Ratio Border Radius */
    --radius-sm: 8px;
    --radius-md: 13px;    /* 8 × φ */
    --radius-lg: 21px;    /* 13 × φ */
    --radius-xl: 34px;    /* 21 × φ */
}
```

### Layout Split (Golden Ratio)

For two-column layouts, use the exact golden ratio:

```css
.splitContainer {
    display: grid;
    /* Major: 61.8% | Minor: 38.2% */
    grid-template-columns: 61.8033988749fr 38.1966011251fr;
    gap: var(--golden-5);  /* 34px - Fibonacci number */
}
```

### Golden Angle Gradients

Use the golden angle (≈137.5°) for natural spiral-like gradient distribution:

```css
.card {
    background: linear-gradient(
        137.5deg,  /* Golden angle */
        rgba(var(--portdive-teal-rgb), 0.06) 0%,
        var(--premium-surface-alt) 61.8%,
        var(--premium-surface-alt) 100%
    );
}

/* Golden ratio gradient stops */
.gradientBorder {
    background: linear-gradient(
        137.5deg,
        rgba(var(--portdive-teal-rgb), 0.4) 0%,
        rgba(var(--portdive-gold-rgb), 0.25) 38.2%,
        rgba(var(--portdive-blue-rgb), 0.3) 61.8%,
        rgba(var(--portdive-teal-rgb), 0.2) 100%
    );
}
```

### Golden Spiral Background Positioning

Position elements at golden ratio focal points:

```css
.container::before {
    background: radial-gradient(
        ellipse 61.8% 61.8% at 61.8% 38.2%,
        rgba(var(--portdive-teal-rgb), 0.06) 0%,
        transparent 61.8%
    ),
    radial-gradient(
        ellipse 38.2% 38.2% at 38.2% 61.8%,
        rgba(var(--portdive-gold-rgb), 0.04) 0%,
        transparent 38.2%
    );
}
```

### Grid Pattern with Golden Sizing

Use Fibonacci numbers for grid patterns:

```css
.section::after {
    background-image:
        linear-gradient(rgba(var(--portdive-teal-rgb), 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--portdive-teal-rgb), 0.02) 1px, transparent 1px);
    background-size: var(--golden-4) var(--golden-4);  /* 21px × 21px */
}
```

### Animation Timing

Use 1/φ ≈ 0.309s for natural-feeling transitions:

```css
.element {
    transition: all 0.309s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Min-Width Calculations

For card grids, use golden ratio-based min-widths:

```css
.cardGrid {
    /* 233px ≈ 144 × φ */
    grid-template-columns: repeat(auto-fit, minmax(233px, 1fr));
}
```

### Responsive Golden Ratio

At smaller breakpoints, step down through the Fibonacci sequence:

```css
/* Desktop: 34px padding */
.container { padding: var(--golden-5); }

/* Tablet: 21px padding */
@media (max-width: 1024px) {
    .container { padding: var(--golden-4); }
}

/* Mobile: 13px padding */
@media (max-width: 768px) {
    .container { padding: var(--golden-3); }
}

/* Small mobile: 8px padding */
@media (max-width: 480px) {
    .container { padding: var(--golden-2); }
}
```

### Reference Implementation

See `src/pages/ticker-analysis.module.css` for a complete golden ratio implementation including:
- Split container with exact 61.8% / 38.2% proportions
- Fibonacci-based spacing throughout
- Golden angle gradients
- Golden spiral background positioning
- Responsive scaling through Fibonacci sequence

## Links & Resources

- **Live Site**: https://holgo99.github.io/portdive-pages/
- **GitHub**: https://github.com/holgo99/portdive-pages
- **Docusaurus Docs**: https://docusaurus.io/docs
- **Social**: https://x.com/Holgo99
