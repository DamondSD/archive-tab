# Archive Tab

A centralized launcher for all **Archive ecosystem modules** inside Foundry VTT.

Archive Tab adds a dedicated sidebar tab that collects launch buttons from any installed Archive module. Each Archive module can register itself automatically using a tiny helper import — no configuration required.

This keeps your workflow clean, organized, and consistent across all Archive-branded tools.

---

## ✨ Features

- A custom Foundry VTT sidebar tab titled **Archive Tools**
- Modules register themselves automatically using a one-line API
- Full-sized launcher buttons with labels and optional icons
- Graceful empty-state when no Archive modules are installed
- Fully load-order safe
- Archive Tab never needs updating when new Archive modules are released
- Supports FontAwesome icons or custom image icons
- Simple, stable API for module developers

---

## 📦 Installation

1. Install **Archive Tab** like any other Foundry module.
2. Enable it in your world.
3. A new sidebar tab will appear in the sidebar.
4. Any Archive module you install will automatically add its launcher button.

---

## 🧩 How Archive Modules Register Themselves

> **Important:** If your module provides a launcher button that _opens, toggles, or shows_ a UI, your module must also expose a public API method that Archive Tab can call.
>
> Example:
>
> ```js
> const mod = game.modules.get("archive-gm-screen");
> mod.api = {
>   toggle: () => game.archiveGMScreen.toggle(),
> };
> ```
>
> Without this, Archive Tab cannot execute your button’s `onClick` handler.

This is the entire API:

```js
import { registerArchiveLauncher } from "/modules/archive-tab/scripts/api/register-launcher.mjs";

registerArchiveLauncher({
  id: "your-module-id", // unique ID of your module
  label: "Your Module Name", // the button text in Archive Tab
  icon: "fa-solid fa-star", // OPTIONAL (FontAwesome or image URL)
  onClick: () => yourAPI.open(), // what happens when user clicks
});
```

That’s it.

No settings. No dependencies. No circular imports.
Just call `registerArchiveLauncher()` from your module.

---

## 🛠 Why This Works

Archive Tab emits a custom hook:

```js
Hooks.callAll("archive-tab.ready", api);
```

The helper waits for it:

```js
Hooks.once("archive-tab.ready", (api) => {
  api.registerLauncher({...});
});
```

This guarantees:

- load order **does not matter**
- Archive Tab’s API is always ready when your module registers
- your module never fails to appear in the list

---

## 🎨 Launcher Button Icons

You may use:

### FontAwesome

```js
icon: "fa-solid fa-book";
```

### Custom image

```js
icon: "/modules/your-module/assets/icon.png";
```

### No icon

Just omit the property:

```js
registerArchiveLauncher({ id, label, onClick });
```

The button text will automatically center.

---

## 🧪 Example: GM’s Drawer

```js
import { registerArchiveLauncher } from "/modules/archive-tab/scripts/api/register-launcher.mjs";

registerArchiveLauncher({
  id: "archive-gm-drawer",
  label: "GM’s Drawer",
  icon: "fa-solid fa-drawer",
  onClick: () => game.modules.get("archive-gm-drawer")?.api.toggle(),
});
```

This adds a button labeled **GM’s Drawer** to Archive Tab.

---

## 🧱 Template for New Archive Modules

Copy this into your `main.js`:

```js
import { registerArchiveLauncher } from "/modules/archive-tab/scripts/api/register-launcher.mjs";

Hooks.once("ready", () => {
  registerArchiveLauncher({
    id: "archive-your-module",
    label: "Your Module",
    icon: "fa-solid fa-toolbox", // optional
    onClick: () => game.modules.get("archive-your-module")?.api.open(),
  });
});
```

---

## 🗂 File Structure Summary

Archive Tab uses:

```
modules/archive-tab/
 ├─ scripts/
 │   ├─ main.mjs                ← registers sidebar tab
 │   ├─ ui/archive-tab.mjs      ← renders tab + launcher buttons
 │   └─ api/register-launcher.mjs ← used by other modules
 ├─ templates/archive-tab.hbs   ← Handlebars template
 ├─ styles/archive-tab.css      ← styling
 └─ assets/tablogo.png          ← tab icon
```

---

## 🤝 Contributing

If you create an Archive module, simply use the helper import and it will seamlessly integrate into the Archive Tab. No need for patches, no tight coupling, no dependency chains.

If you’d like to enhance Archive Tab itself (styling, categories, themes, icons), PRs are welcome.

---

## 🧷 License

MIT License.

Feel free to use, modify, or distribute.

---

If you’d like, I can also generate:

- An **API reference section**
- A **badges header**
- **Screenshots** section
- A **developer guide**
- A template README for Archive modules
