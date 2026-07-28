# SimpleRig — Sprint 2C

Adds multi-stroke recognition for telehandlers, performers and truss, while retaining line, pulley, double-pulley and winch recognition.

## New
- Telehandler: body, two wheels and boom
- Performer: head, body and limbs
- Truss: parallel rails and diagonal bracing
- Recognition explanation text
- Multi-stroke conversion into one editable object
- Object scale estimated from sketch size

Run with `python3 -m http.server 8000` and test with `npm test`.

For GitHub Pages, upload all extracted files to the repository root and select **GitHub Actions** as the Pages source.
