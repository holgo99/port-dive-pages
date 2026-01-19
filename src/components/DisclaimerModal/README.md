# Disclaimer Modal Component

## Overview

A modal dialog that appears when users first access any page under the `/docs` section. The modal displays important legal disclaimers about the investment analysis content and requires users to accept the terms before viewing the content.

## Features

- **Automatic Display**: Shows on first visit to any docs page
- **Local Storage Persistence**: Remembers user acceptance using `localStorage`
- **Cookie-Banner Style**: Positioned at bottom-right like modern cookie consent banners
- **Responsive Design**: Adapts to mobile and desktop screens
- **Dark Mode Support**: Fully styled for both light and dark themes
- **Animated Entry**: Smooth slide-up animation with backdrop blur
- **Reject Option**: Redirects users to homepage if they reject the terms

## How It Works

1. **Detection**: The `Layout` wrapper checks if the current page path includes `/docs`
2. **First Visit**: On first visit, the modal appears after a 500ms delay
3. **User Action**:
   - **Accept**: Stores acceptance in localStorage and dismisses modal
   - **Reject**: Redirects user back to the homepage
4. **Subsequent Visits**: Modal doesn't appear if user has already accepted

## Storage Key

```javascript
localStorage.getItem('portdive-disclaimer-accepted')
```

## Styling

The modal uses CSS custom properties from the Docusaurus theme:
- Primary color: `--ifm-color-primary`
- Secondary color: `--ifm-color-secondary`
- Background: `--ifm-background-surface-color`
- Supports both light and dark themes automatically

## Modifying Content

To update the disclaimer text, edit:
```
src/components/DisclaimerModal/index.jsx
```

The main sections are:
- **Warning Text**: Legal disclaimers and risk warnings
- **AI Hallucination Notice**: Highlighted in a special box
- **Copyright Notice**: Organization and responsibility statement
- **Buttons**: Accept/Reject actions

## Customization

### Change Position
Edit `styles.module.css`:
```css
.modal {
  bottom: 20px;  /* Change vertical position */
  right: 20px;   /* Change horizontal position */
}
```

### Change Animation
Modify the animation in `styles.module.css`:
```css
@keyframes slideUp {
  /* Customize entry animation */
}
```

### Reset User Acceptance
To test or reset acceptance, clear localStorage:
```javascript
localStorage.removeItem('portdive-disclaimer-accepted');
```

## Browser Compatibility

- Modern browsers with localStorage support
- Falls back gracefully if localStorage is unavailable
- Responsive design works on all screen sizes

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- High contrast for readability
- Responsive text sizing
