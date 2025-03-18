const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
    try {
        await runTests({
            extensionDevelopmentPath: path.resolve(__dirname, '../'),
            extensionTestsPath: path.resolve(__dirname, './suite/index'),
            launchArgs: [
                '--disable-gpu',          // Prevents GPU-related crashes
                '--no-sandbox',           // Helps prevent sandboxing issues
                '--disable-extensions',    // Ensures VSCode runs cleanly
                '--enable-proposed-api=Tosox.encodex', // Enable proposed API
            ],
        });
    } catch (err) {
        console.error('Failed to run tests: ', err);
        process.exit(1);
    }
}

main();
