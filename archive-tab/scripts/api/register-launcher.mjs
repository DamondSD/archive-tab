export function registerArchiveLauncher({ id, label, icon, onClick }) {

    // Wait for Archive Tab's API ready hook
    Hooks.once("archive-tab.ready", (api) => {

        if (!api?.registerLauncher) {
            console.error(
                `Archive Launcher | Archive Tab API missing registerLauncher(). ` +
                `Launcher "${id}" cannot be registered.`
            );
            return;
        }

        try {
            api.registerLauncher({ id, label, icon, onClick });
            console.log(`Archive Launcher | Registered launcher "${id}".`);
        } catch (err) {
            console.error(`Archive Launcher | Failed to register launcher "${id}".`, err);
        }
    });
}
