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

## Links & Resources

- **Live Site**: https://holgo99.github.io/portdive-pages/
- **GitHub**: https://github.com/holgo99/portdive-pages
- **Docusaurus Docs**: https://docusaurus.io/docs
- **Social**: https://x.com/Holgo99
