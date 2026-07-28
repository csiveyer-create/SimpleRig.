# SimpleRig — Sprint 2A

This increment adds the sketch capture layer.

## Added

- Select and Sketch modes
- Mouse, touch and stylus freehand drawing
- Pressure-aware line width where supported
- Strokes stored in project/world coordinates
- Strokes remain aligned during zoom and pan
- Separate sketch layers for TOP, FRONT and LEFT views
- Sketch strokes included in `.rig` save files
- Undo and redo for sketch strokes
- Clear Sketch button
- Sprint 1 project compatibility

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Tests

```bash
npm test
```

## GitHub Pages

Upload the extracted contents to the repository root. Set **Settings → Pages → Source** to **GitHub Actions**.

The next increment is Sprint 2B: line and circle recognition with conversion suggestions.
