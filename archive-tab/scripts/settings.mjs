// scripts/settings.mjs

export const THEME_CHOICES = {
    "default": "SC Gold (Default)",
    "magic": "Magic (Arcane Blue)",
    "forest": "Forest (Deep Woods)",
    "lava": "Lava (Molten Core)"
};

export function registerSettings() {
    game.settings.register("archive-tab", "theme", {
        name: "Archive Tab Theme",
        hint: "Choose how launcher buttons are visually styled.",
        scope: "world",
        config: true,
        type: String,
        choices: THEME_CHOICES,
        default: "default",
        onChange: () => ui.archive?.render(true)
    });
}
