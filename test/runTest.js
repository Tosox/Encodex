const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
    try {
        await runTests({
            extensionDevelopmentPath: path.resolve(__dirname, '../'),
            extensionTestsPath: path.resolve(__dirname, './suite/index'),
            launchArgs: [
                '--disable-gpu', // Avoids GPU-related crashes
                '--no-sandbox' // Prevents sandboxing issues
            ],
        });
    } catch (err) {
        console.error('Failed to run tests: ', err);
        process.exit(1);
    }
}

main();
