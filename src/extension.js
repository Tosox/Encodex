const vscode = require('vscode');
const encodings = require('./encodings');

/**
 * Extracts encoding from an XML declaration line
 * @param {string} line - A line of text
 * @returns {string | null} The extracted encoding or null if not found
 */
function getEncodingFromLine(line) {
	const match = line.match(/<\?xml\s+[^>]*?encoding\s*=\s*(['"])(.*?)\1/i);
	return match ? match[2] : null;
}

/**
 * Finds the XML declaration in a document
 * @param {vscode.TextDocument} doc - The document to search
 * @returns {string | null} The XML declaration line, or null if not found
 */
function findXMLDeclaration(doc) {
	for (let i = 0; i < doc.lineCount; i++) {
		const line = doc.lineAt(i).text;
		if (/^\s*<\?xml/i.test(line)) {
			return line;
		}
	}
	return null;
}

/**
 * This method is called when the extension is activated
 * @param {vscode.ExtensionContext} context - The extension context
 */
function activate(context) {
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(handleDocumentChange));
}

/**
 * This method is called when the extension is deactivated
 */
function deactivate() {
	// Clean up if necessary
}

/**
 * Handles document change events
 * @param {vscode.TextEditor | undefined} editor - The active text editor
 */
function handleDocumentChange(editor) {
	if (!editor) {
        console.log("No active editor");
        return;
    }

	const document = editor.document;
	if (document.languageId !== "xml") {
		console.log("Active document isn't XML");
		return;
	}

	const xmlDeclaration = findXMLDeclaration(document);
	if (!xmlDeclaration) {
		console.log("No XML declaration found");
		return;
	}

	const encodingDeclaration = getEncodingFromLine(xmlDeclaration);
	if (!encodingDeclaration) {
		console.log("XML declaration does not specify encoding");
		return;
	}

	const encoding = encodings.XML_ENCODINGS_MAP[encodingDeclaration.toLowerCase()];
	if (!encoding) {
		vscode.window.showErrorMessage(`${encodingDeclaration} encoding is not supported`);
		return;
	}

	if (document.encoding === encoding) {
		console.log(`Document encoding is already set to ${encoding}`);
		return;
	}

	vscode.workspace.openTextDocument(document.uri, { encoding })
        .then(
            doc => console.log(`Changed encoding for ${doc.fileName.split('\\').pop()} to ${encoding}`),
            error => vscode.window.showErrorMessage(`Error setting encoding for ${document.fileName.split('\\').pop()}: ${error.message}`)
        );
}

module.exports = {
	// Tests
	getEncodingFromLine,
	findXMLDeclaration,

	// VS Code API
	activate,
	deactivate
}
