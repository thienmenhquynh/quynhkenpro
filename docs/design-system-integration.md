# Foundation 9tek / 9Proptech v2.1

The attached specification is preserved in `9proptech-design-system-v2.1.md`.

This portfolio remains a static HTML/CSS/JavaScript site. `assets/design-system.css` defines the source's light and dark token palettes and aliases the original portfolio variables to them. Component rules apply the source's fonts, typography, 4px spacing, 6/8/10/14px radii, button variants, accessible input names, focus rings and accessible touch targets without changing product data or introducing CRM navigation.

- Themes: `light`, `dark` on `html[data-theme]`. All themed sections, featured cards and the detail dialog follow the page theme.
- Theme choices are available in the navigation menu and footer. Explicit choices persist; an unset preference uses Light. The existing moon/sun button toggles light/dark. Previous high-contrast preferences migrate to the matching light or dark theme.
- Project filters keep their labels available to assistive technology while displaying only the select controls, as requested.
- Lexend, Mona Sans and Be Vietnam Pro are self-hosted from Fontsource 5.3.0, including Vietnamese subsets, so font rendering does not require Google Fonts access. SIL OFL licenses are in `assets/fonts/`.
- SVG symbols use `lucide-static@0.460.0`; its license is in `assets/LUCIDE-LICENSE.txt`.
- The original screenshots, product content, analytics, native controls, view switching, free-height tables, sticky controls and 8–4 detail layout are retained.
- Brand gradient matches the supplied token exactly: `linear-gradient(100deg, #DEFEFF 0%, #2EE4FF 48%, #A2FF00 100%)`. It appears only in the brand mark and decorative landing-hero field/rule. Text, buttons, AI icons, tools cards, product cards and selected tabs use semantic solid colors. Neutral masks, grid/checker patterns and photo overlays serve layout/legibility rather than brand coloring.

- Section headings use a 32px gap before content on desktop and 24px on tablet/mobile.
- `assets/hero.css` and `assets/hero.js` add decorative circuit paths, grid and light fields to page heroes. SVG effects pause offscreen or in hidden tabs, and remain static with reduced motion; mobile omits moving data pulses.
