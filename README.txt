RIG PLAN DESIGNER — INSTALLABLE HOME-SCREEN APP

This folder is a Progressive Web App (PWA).

IMPORTANT
The app must be served from an HTTPS website for reliable installation and offline use.
Opening index.html directly from the Files app is not the same as installing a PWA.

IPHONE / IPAD
1. Upload this entire folder to an HTTPS web host.
2. Open the resulting address in Safari.
3. Tap Share.
4. Tap “Add to Home Screen”.
5. Tap Add.

QUICK HOSTING OPTIONS
- GitHub Pages
- Netlify Drop
- Cloudflare Pages
- Your own website/server

FILES
- index.html: the app
- manifest.webmanifest: installation details
- service-worker.js: offline caching
- icons/: home-screen icons


UPDATE v2 — ZOOM
- Zoom in and out buttons
- Zoom percentage/reset control
- Pinch-to-zoom on touch screens
- Mouse-wheel/trackpad zoom
- Pan mode for moving around enlarged diagrams
- Double-tap to zoom in


UPDATE v3 — EQUIPMENT CATALOGUE
- Search by manufacturer, model or category
- Live dropdown suggestions
- Specification preview
- Add selected equipment to the plan
- Create a custom item with an uploaded image
- Save WLL/SWL and MBS data on each placed icon


UPDATE v4 - EXPORT, HISTORY AND ICON
- Single-page PDF export with diagram, equipment specifications and ratio details
- PNG export for diagram only
- Zoom range extended down to 50%
- Undo, redo, duplicate and delete repaired
- Black home-screen icon with silver S.


UPDATE v5 — PRODUCTION DETAILS, MODERN STYLE & TOUCH TARGETS
- Show Name, Gag/Move Name and Location fields at the top
- Production details included in PDF reports and export filenames
- Modern dark glass-style interface with teal accent
- New icons are generated at 50% of their previous size
- Enlarged invisible touch targets make small icons easier to grab
- Touch targets are excluded from exported images and PDFs


SIMPLERIG v6
- App renamed to SimpleRig
- Zoom, reset and pan moved into the diagram space
- Expanded catalogue: 159 records
- Includes Petzl, ISC, Rock Exotica, Harken, Singing Rock and generic rigging items
- Selecting catalogue equipment now applies its record to the selected diagram object
- Applying equipment preserves object position, scale, rotation and rope attachment
- Incomplete records are marked for exact manufacturer/model verification
- Database supplied separately as equipment-catalogue.json
