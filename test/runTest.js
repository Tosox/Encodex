const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
    process.env.ELECTRON_NO_ATTACH_CONSOLE = '1'; // Prevents Electron from expecting a display
    process.env.NO_AT_BRIDGE = '1'; // Disables some accessibility features that require a UI
    process.env.DISPLAY = ''; // Ensures no X server is required

    try {
        await runTests({
            extensionDevelopmentPath: path.resolve(__dirname, '../'),
            extensionTestsPath: path.resolve(__dirname, './suite/index'),
            launchArgs: [
                '--disable-gpu',          // Prevents GPU-related crashes
                '--no-sandbox',           // Helps prevent sandboxing issues
                '--disable-software-rasterizer', // Ensures rendering does not need a display
                '--disable-crash-reporter', // Prevents Electron from generating crash reports
                '--disable-dev-shm-usage',  // Fixes shared memory issues in CI
                '--disable-extensions',    // Ensures VSCode runs cleanly
                '--force-color-profile=srgb', // Ensures consistent colors without needing a display
                '--headless'               // Forces Electron to run in headless mode (main change)
            ],
        });
    } catch (err) {
        console.error('Failed to run tests: ', err);
        process.exit(1);
    }
}

main();
