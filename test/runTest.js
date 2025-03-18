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
                '--disable-extensions' // Disables VS Code extensions
            ],
        });
    } catch (err) {
        console.error('Failed to run tests: ', err);
        process.exit(1);
    }
}

main();
