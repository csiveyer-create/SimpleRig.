
export async function loadSimpleRigLibrary(baseUrl = ".") {
  const response = await fetch(`${baseUrl}/library-manifest.json`);
  if (!response.ok) throw new Error(`Library manifest failed: ${response.status}`);
  return response.json();
}

export function flattenLibrary(manifest) {
  return manifest.categories.flatMap(category =>
    category.assets.map(asset => ({ ...asset, category: category.name }))
  );
}

export function buildDropdownLibrary(container, manifest, onSelect) {
  container.replaceChildren();
  for (const category of manifest.categories) {
    const details = document.createElement("details");
    details.className = "equipment-folder";
    const summary = document.createElement("summary");
    summary.textContent = category.name;
    details.append(summary);

    const grid = document.createElement("div");
    grid.className = "equipment-folder-grid";
    for (const asset of category.assets) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "equipment-library-item";
      button.innerHTML = `<img src="${asset.icon}" alt=""><span>${asset.name}</span>`;
      button.addEventListener("click", () => onSelect(asset, category));
      grid.append(button);
    }
    details.append(grid);
    container.append(details);
  }
}
