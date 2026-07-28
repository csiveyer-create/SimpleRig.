# SimpleRig — Sprint 1

Clean core rebuild focused on a reliable 3D workspace.

## Included
- Shared object model across TOP, FRONT, LEFT and 3D
- Canvas-based 3D scene with orbit, pan and zoom
- Touch and mouse controls
- Pulley, double pulley, performer, truss and telehandler
- Position, rotation, scale and labels
- Duplicate, delete, undo and redo
- Save/open `.rig` files
- GitHub Pages deployment workflow

## Run
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

## Test
```bash
npm test
```
No install step is required.

## GitHub Pages
Upload all files to the repository root, then set **Settings → Pages → Source** to **GitHub Actions**.
