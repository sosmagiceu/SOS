# SOS cleanup audit

## Full file safe to remove
- `SOS.html`
  - Not linked from the current site navigation or any page.
  - Still contains stock/demo gallery content from the template.
  - It is the only HTML file using the old gallery demo markup.

## Full files changed
- `assets/css/main.css`
- `assets/css/pages/home.css`
- `Home.html`
- `Collection.html`
- `FAQ.html`
- `Partnership.html`
- `Story.html`
- `guidedreading.html`
- `partials/header.html`
- `TOS.html`

## Why these changes were made
- Removed page-specific CSS imports from `main.css`. Shared bundle should not import `home.css` and `collection.css`.
- Moved `Home.html` inline layout CSS into `assets/css/pages/home.css`.
- Fixed case-mismatched `.html` links that can break on case-sensitive hosting.
- Cleaned invalid duplicate `alt` attributes in `Home.html`.
- Rebuilt `TOS.html` into one valid document. The original file had a second full HTML document pasted into the first one.
