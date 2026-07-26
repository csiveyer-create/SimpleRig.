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
