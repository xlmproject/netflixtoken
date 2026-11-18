# Netflix Token Landing Page

Static, responsive landing page for Cloudflare Pages.


## Deploy
1. Upload the project folder to a Git repository.
2. In Cloudflare Pages, create a project from the repo and choose **Direct Upload** or Git integration as appropriate.
3. Build command: none (static site). Output directory: `/` (root).
4. To serve the Stellar profile at the standard location, move `stellar.toml` to `.well-known/stellar.toml` before deploy. This bundle also includes the file at root for easy editing.

## Included
- Animated WebGL sphere with scroll-wheel zoom and drag tilt
- New York live clock
- Trading link (Dexscreener Stellar asset URL)
- Global market link (CoinGecko)
- Token profile and SVG coin asset

## Notes
The market and trading links are external discovery destinations; they do not confirm that the asset is listed or tradable. Confirm token issuer, trustlines, liquidity, and contract details before promoting.
