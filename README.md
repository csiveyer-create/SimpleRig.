# SimpleRig — Latest Checked Build

Open `index.html` in a modern desktop browser.

Included:
- 2D rig workspace
- 3D visualisation workspace
- 3D object rotation and layers
- Projects and draggable timeline
- Active-workspace PDF export
- Harness Reference page
- Operating-point analysis
- 2D/3D Live simulation with kN force input and reset
- Self-contained unique equipment icons

Important:
The Live mode is a simplified preview, not a certified engineering or stunt-rigging solver.

## Harness Reference update
The full-body harness illustration has been redrawn from the user-supplied Climbing Sutra reference, fitted to the basic grey male/female performer outline.

## Finite line update
- Attaching a performer or other object to a rope end no longer creates a new endpoint.
- In Live mode each 2D rig line captures a finite total length.
- Moving one terminal endpoint makes the opposite terminal endpoint compensate.
- Attached endpoint objects follow their endpoint.
- Reset restores the full pre-simulation state.

## Live manipulation update
- Attached 2D pulleys and performers can now be dragged while Live mode is active.
- Moving an internal rope point preserves the captured finite rope length.
- A free terminal endpoint compensates automatically; anchored endpoints are avoided where possible.
- Objects attached to reacting endpoints move with those endpoints.
- 3D pulley dragging now provides an approximate linked-load reaction until full 3D rope topology is introduced.

## Corrective update
- Restored the original higher-detail 32-icon equipment set exactly from the Detailed 3D Objects build.
- Attach to end now always uses an existing terminal node and cannot extend the rope.
- The normal Attach button automatically uses the existing terminal node when the object is near an endpoint.
- Objects can snap directly to a terminal node when dropped close to it.
- Reworked manual Live manipulation so moving an attached pulley or performer updates the rope point and solves a reactive terminal endpoint while preserving finite rope length.

## 3D, endpoint and live-rope corrective update
- The 3D renderer now selects detailed procedural models by canonical asset ID rather than category text.
- Every built-in library asset is routed to its proper 3D representation instead of the generic black box.
- Add rig line is blocked when the selected object is already attached to an existing rope end.
- A free object positioned on an existing end is attached there rather than creating another rope.
- Endpoint attachment never changes the rope point array.
- In Live mode, pulling one terminal end transfers rope travel to the opposite terminal end, which retracts while total rope length remains finite.

## Layers and compact Live controls
- The 3D Layers + Group control now creates a functioning layer group.
- The currently selected object is added to the new group automatically.
- Groups can be collapsed, expanded, hidden, shown, locked, unlocked or removed.
- Layer-group data is included in saved 3D workspace state.
- The Live controls have been reduced to a compact single-row control bar on desktop.
- Explanatory text remains hidden unless Live mode is active, where only the safety warning is shown.

## 2D/3D operating analysis and icon rendering correction
- Added the same mechanical advantage/disadvantage analysis panel to the 2D workspace.
- The 2D panel reports effective ratio, estimated pull, travel and force effect using the same role-based logic as 3D.
- The analysis updates when the operating point, role, load, supporting parts, ratio or efficiency changes.
- Removed the destructive grayscale/brightness filter from 2D SVG and PNG assets.
- 2D equipment now preserves original transparency, colour and detail.
- Added image load/error handling so a failed asset shows a technical placeholder instead of a black block.

## 3D import, ground presets and project calendar
- Added real local import for OBJ, STL, self-contained GLTF and GLB files.
- Imported models are parsed into mesh geometry, auto-centred, auto-scaled and optionally grounded.
- Imported models support the existing select, move, rotate, scale, hide, lock, group and project-save workflows.
- Added drag-and-drop model import to the 3D viewport controls.
- Added procedural sample grounds: concrete, grass, dirt, black stage and survey grid.
- Added a Monthly Calendar tab beside the project timeline.
- Calendar events support production categories, dates, optional time and location, editing and deletion.
- Calendar events persist with the project and are included in exported SimpleRig project files.

# SimpleRig v2 — Modular GitHub Pages Build

This version splits the previous single-file application into:
- `index.html`
- ordered CSS files in `css/`
- ordered JavaScript files in `js/`

## Deploying to GitHub Pages

1. Upload the **contents** of this folder to the repository root.
2. Ensure `index.html` sits at the repository root.
3. In GitHub, open **Settings → Pages**.
4. Set the source to **Deploy from a branch**.
5. Select the branch and `/ (root)`.
6. Save and wait for deployment.

The `.nojekyll` file is included so GitHub Pages serves the files directly.

## Important

Do not upload only `index.html`. The `css/` and `js/` folders are required.
All paths are relative, so the app works on project pages such as:
`https://username.github.io/repository-name/`

## Dark multilingual interface update
- Black, silver, grey and white visual theme.
- Project-first command bar followed by 2D, 3D and Harness Reference workspaces.
- English, French, Spanish, Thai, Chinese, Japanese and German interface selector.
- Major editing panels collapse to title bars on initial load.
- Built-in tutorial dialog.
- Harness shackle placement mode with drop animation and white visibility outline.
- Front/back and 90-degree harness diagram rotation.
- 3 mm and 6 mm leader creation with user-defined lengths.

## Simplified force calculator
The former multi-input load calculator has been replaced with a four-step workflow:
1. Enter the load.
2. Choose the pulling end.
3. Use automatic recognition or a manual mechanical-advantage override.
4. Calculate the system.

The result shows load, mechanical advantage, pull force, highest component load, overall status and a component-by-component weight-distribution list. Existing legacy fields remain hidden for project compatibility.
