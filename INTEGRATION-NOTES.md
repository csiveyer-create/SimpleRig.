# SimpleRig integrated library build

This build contains the replacement `index.html` plus the complete asset library.

## New library folders

- Pulleys
- Hardware
- Truss
- Scaffold
- Camera
- Machines

Both 2D and 3D workspaces use the same library manifest.

## Assets

Every item includes:

- SVG plan icon
- GLB model
- JSON metadata
- thumbnail

## Running

Upload the complete contents of this folder to the app repository. Do not upload only `index.html`, because the GLB and SVG files are external assets.

A local web server is recommended for testing because browsers may block GLB/JSON fetches when `index.html` is opened directly from disk.
