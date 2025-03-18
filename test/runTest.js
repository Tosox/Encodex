const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
    process.env.DBUS_SESSION_BUS_ADDRESS = '/dev/null'; // Prevents Electron from trying to connect to DBus
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
                '--disable-extensions'    // Ensures VSCode runs cleanly
            ],
        });
    } catch (err) {
        console.error('Failed to run tests: ', err);
        process.exit(1);
    }
}

main();
