# SimpleRig — Constraint Rope v3.2

GitHub Pages-ready static build.

## Included in this build

- **Build This** command bar for generating starter rig systems, including advantage and disadvantage ratios such as `3:1`, `1:2`, and `1:3`.
- **Fixed-length rope constraint system**. In Live Rope mode, moving a free end moves the connected travelling pulley/load group; moving a pulley, performer or load causes the free end to pay in or out.
- Connected objects may share a movement group, so a performer and travelling pulley move together.
- The rope does not stretch; its total routed length is preserved.
- **Shared 2D/3D scene bridge**. Build This objects and rope segments are mirrored into the 3D workspace in metres.
- **Metric project scale** with metres, centimetres and millimetres.
- 2D point-to-point measurement.
- 3D true distance, horizontal run, height difference and depth difference using selected-object coordinates.
- Application-wide localisation for English, French, Spanish, German, Chinese, Japanese and Thai. A mutation observer also translates dynamically generated controls and status text.
- Lighter 2D workspace for improved contrast.

## Deploy to GitHub Pages

1. Delete the previous repository contents.
2. Upload the **contents of this folder**, not the enclosing folder.
3. Confirm `index.html` is at the repository root.
4. In **Settings → Pages**, deploy from the root of the selected branch.
5. Hard-refresh after deployment.

The top bar must display **Constraint Rope v3.2**.

## Important limitation

The rope solver is a planning and visualisation tool. It is not a certified structural, dynamic or stunt-engineering calculation package and must not be used as the sole basis for approving a rig.
