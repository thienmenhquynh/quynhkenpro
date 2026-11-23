# Foundation 9tek / 9Proptech v2.1

The attached specification is preserved in `9proptech-design-system-v2.1.md`.

This portfolio remains a static HTML/CSS/JavaScript site. `assets/design-system.css` defines the source's four token palettes and aliases the original portfolio variables to them. Component rules apply the source's fonts, typography, 4px spacing, 6/8/10/14px radii, button variants, input labels, focus rings and accessible touch targets without changing product data or introducing CRM navigation.

- Themes: `light`, `dark`, `hc`, `hc-dark` on `html[data-theme]`. All themed sections, featured cards and the detail dialog follow the page theme.
- Theme choices are available in the navigation menu and footer. Explicit choices persist; an unset preference uses Light, or follows system high contrast and color scheme when `prefers-contrast: more` is active. The existing moon/sun button toggles light/dark while preserving high contrast.
- Lexend, Mona Sans and Be Vietnam Pro are self-hosted from Fontsource 5.3.0, including Vietnamese subsets, so font rendering does not require Google Fonts access. SIL OFL licenses are in `assets/fonts/`.
- SVG symbols use `lucide-static@0.460.0`; its license is in `assets/LUCIDE-LICENSE.txt`.
- The original screenshots, product content, analytics, native controls, view switching, free-height tables, sticky controls and 8–4 detail layout are retained.
- Gradient identification is reserved for the brand mark and landing hero. Interactive components use semantic `primary`, `accent`, `muted` and chart tokens.
