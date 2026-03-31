# CSS + JS Cleanup Audit

## What changed

- Replaced the old root CSS stack with `assets/css/pages/shared.css`
- Replaced the template parallax/vendor script with a dedicated `assets/js/home-carousel.js`
- Added `assets/css/pages/webshop.css` so Webshop no longer depends on template CSS
- Replaced the incomplete `assets/css/pages/home.css` with a self-contained version that includes:
  - 3D carousel layout
  - card spacing
  - active-card neon state
  - guide button styles
  - indicators and controls
- Updated all HTML files to stop loading `assets/css/main.css`, `assets/css/header.css`, and the template vendor parallax JS

## Files now safe to remove

### CSS
- `assets/css/main.css`
- `assets/css/header.css`
- `assets/css/buttons.css`
- `assets/css/carousel.css`
- `assets/css/vendor/parallax-clean.css`
- entire folder `assets/css/vendor/parallax/`

### JS
- `assets/js/vendor/tooplate-2144-parallax-scripts.js`

## Why the vendor JS was removable

The old vendor script contained several unrelated template behaviours mixed together:
- parallax layers
- rectangle hover tilt
- home carousel
- gallery-item fade-in
- submit button ripple
- anchor smooth scroll

Only the home carousel was actually in use in the current project. The rest had no matching live markup or class hooks in the HTML files.

## Double-check summary

Kept:
- `assets/js/header.js`
- `assets/js/footer.js`
- `assets/js/faq-accordion.js`
- `assets/js/method-accordion.js`
- `assets/js/story-slides.js`
- inline Contact form submit handler

Added:
- `assets/js/home-carousel.js`
- `assets/css/pages/shared.css`
- `assets/css/pages/webshop.css`

## Still removable after this pass

- `assets/js/method-video.js`
  - not referenced by any HTML file
  - current Method page uses native video controls only
