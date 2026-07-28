# SimpleRig — Sprint 2B

Sprint 2B adds local sketch recognition and conversion suggestions.

## Added

- Automatic recognition after each completed sketch stroke
- Straight line → Rig Line suggestion
- Circle → Pulley suggestion
- Two nearby circles → Double Pulley suggestion
- Rectangle → Winch suggestion
- Confidence percentage
- Convert or Keep Sketch controls
- Recognition can be switched off
- Sketch eraser mode
- Recognition and conversion operate locally in the browser
- Converted sketches become editable scene objects
- Converted sketch strokes are removed from the sketch layer
- Undo and redo remain available

## Run locally

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Tests

```bash
npm test
```

The included tests cover project validation and recognition of lines, circles and double circles.

## GitHub Pages

Upload all extracted files to the repository root. Set:

**Settings → Pages → Source → GitHub Actions**

## Sprint boundary

Telehandler, performer and truss recognition remain experimental and are not enabled in this build. Sprint 2C can add multi-stroke grouping and more complex symbols.
