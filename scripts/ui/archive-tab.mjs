// archive-tab/scripts/ui/archive-tab.mjs
const MODULE_ID = "archive-tab";

console.log("[ARCHIVE-TAB][TABS] archive-tab.mjs loaded");

// Internal launcher registry
const launchers = [];

/**
 * Public API for other modules
 */
export function createArchiveTabAPI() {
    console.log("[ARCHIVE-TAB][TABS] createArchiveTabAPI() called");

    return {
        registerLauncher(cfg) {
            console.log("[ARCHIVE-TAB][TABS] registerLauncher() called with:", cfg);

            if (!cfg?.id || !cfg?.label || !cfg?.onClick) {
                console.warn("[ARCHIVE-TAB][TABS] registerLauncher() missing data", cfg);
                return;
            }

            const existingIndex = launchers.findIndex(l => l.id === cfg.id);
            if (existingIndex >= 0) {
                console.log("[ARCHIVE-TAB][TABS] Updating existing launcher:", cfg.id);
                launchers[existingIndex] = cfg;
            } else {
                console.log("[ARCHIVE-TAB][TABS] Adding new launcher:", cfg.id);
                launchers.push(cfg);
            }

            console.log("[ARCHIVE-TAB][TABS] Launchers array now:", launchers);

            ui.archive?.render({ parts: ["main"] });
        },

        getLaunchers() {
            console.log("[ARCHIVE-TAB][TABS] getLaunchers() called");
            return [...launchers];
        }
    };
}

/**
 * Archive Sidebar Tab
 */
export class ArchiveSidebarTab extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.sidebar.AbstractSidebarTab
) {
    static tabName = "archive";

    static DEFAULT_OPTIONS = {
        window: { title: "Archive Tools" },
        classes: ["archive-tab", "flexcol"]
    };

    static PARTS = {
        main: {
            template: `modules/${MODULE_ID}/templates/archive-tab.hbs`
        }
    };

    constructor(...args) {
        super(...args);
        console.log("[ARCHIVE-TAB][TABS] ArchiveSidebarTab constructed");
    }

    /** Prepare template context */
    /** After template is rendered */
    async _onRender(context, options) {
        await super._onRender(context, options);

        // Where we put buttons
        const container = this.element.querySelector(".launcher-list");
        // The empty-state block from HBS
        const emptyState = this.element.querySelector(".archive-empty");

        if (!container) return;

        // If no launchers, make sure empty-state is visible and clear any buttons
        if (!launchers.length) {
            container.innerHTML = "";
            if (emptyState) emptyState.style.display = "";
            return;
        }

        // We have launchers: hide the empty-state
        if (emptyState) emptyState.style.display = "none";

        // Rebuild the launcher list
        container.innerHTML = "";

        for (const launcher of launchers) {
            const button = document.createElement("div");
            button.classList.add("archive-launcher-button");

            // Decide how to render the icon (FontAwesome or image)
            let iconHTML = "";
            if (launcher.icon) {
                if (/fa[srlb]?-/i.test(launcher.icon)) {
                    iconHTML = `<i class="archive-launcher-fa ${launcher.icon}"></i>`;
                } else if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(launcher.icon)) {
                    iconHTML = `<img src="${launcher.icon}" class="archive-launcher-icon" alt="${launcher.label}">`;
                }
            }

            // Mark the button so CSS can adjust spacing
            if (!iconHTML) button.classList.add("no-icon");

            button.innerHTML = `
          <div class="archive-launcher-inner">
            ${iconHTML}
            <span class="archive-launcher-label">${launcher.label}</span>
          </div>
        `;

            button.addEventListener("click", () => {
                try {
                    launcher.onClick();
                } catch (err) {
                    console.error(`${MODULE_ID} | Launcher "${launcher.id}" failed:`, err);
                    ui.notifications?.error(`Failed to open "${launcher.label}".`);
                }
            });

            container.appendChild(button);
        }

        console.log("[ARCHIVE-TAB][TABS] Finished _onRender");
    }

}
