// archive-tab/scripts/main.mjs
// ---------------------------------------------------------------------------
// Archive Tab - main entry (Final version for Foundry v13.351)
// ---------------------------------------------------------------------------

import { ArchiveSidebarTab, createArchiveTabAPI } from "./ui/archive-tab.mjs";


const MODULE_ID = "archive-tab";

Hooks.once("init", () => {

    const Sidebar = foundry?.applications?.sidebar?.Sidebar;
    if (!Sidebar) {
        console.warn(`${MODULE_ID} | Sidebar API not found (v13+ required).`);
        return;
    }

    // Register the tab metadata (v13.351-compatible)
    if (!Sidebar.TABS["archive"]) {
        Sidebar.TABS["archive"] = {
            icon: "icon-archive-tab",
            tooltip: "Archive Tools",
            gmOnly: true
        };
    }

    console.log(`${MODULE_ID} | Archive sidebar tab registered.`);

});

Hooks.once("ready", () => {
    const mod = game.modules.get(MODULE_ID);
    if (!mod) return;

    // Create the tab instance once
    if (!ui.archive) {
        ui.archive = new ArchiveSidebarTab();
    }

    // Render once so the tab initializes (required for this Foundry build)
    ui.archive.render(true);

    // Expose public API for other Archive modules to register launchers
    mod.api = createArchiveTabAPI();

    // Notify other modules that the Archive Tab is ready
    Hooks.callAll("archive-tab.ready", mod.api);
});
