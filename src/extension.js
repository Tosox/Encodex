const vscode = require('vscode');
const encodings = require('./encodings');

/**
 * @param {String} line
 * @returns {(String | null)}
 */
function getEncodingFromLine(line) {
	var matches = line.match(/<\?xml[^>]*encoding\s*=\s*"([^"]+)/);
	if (!matches) {
		return null;
	}

	return matches.at(1);
}

/**
 * @param {vscode.TextDocument} doc
 * @returns {(String | null)}
 */
function findXMLDeclaration(doc) {
	for (var i = 0; i < doc.lineCount; i++) {
		var line = doc.lineAt(i).text;
		if (line.trim().startsWith("<?xml")) {
			return line;
		}
	}
	return null;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(handleDocumentChange));
}

function deactivate() {
	// Nothing to do
}

/**
 * @param {vscode.TextEditor} editor
 */
function handleDocumentChange(editor) {
	var document = editor.document;
	if (!document) {
		console.log("No document open");
		return;
	}

	if (document.languageId !== "xml") {
		console.log("Document isn't XML");
		return;
	}

	var xmlDeclaration = findXMLDeclaration(document);
	if (!xmlDeclaration) {
		console.log("Document doesn't contain a XML tree");
		return;
	}

	var encDeclaration = getEncodingFromLine(xmlDeclaration);
	if (!encDeclaration) {
		console.log("XML tree doesn't contain an encoding instruction");
		return;
	}

	var encoding = encodings.ENCODINGS_MAP[encDeclaration.toLowerCase()];
	if (!encoding) {
		console.error(`${encDeclaration} isn't supported by VS Code`);
		return;
	}

	if (document.encoding === encoding) {
		console.log(`Encoding is already set to ${encoding}`);
		return;
	}

	Promise.resolve(vscode.workspace.openTextDocument(document.uri, { encoding: encoding })).then(doc => {
		console.log(`Changed encoding for ${doc.fileName.split("\\").pop()} to ${encoding}`);
	}).catch(error => {
		vscode.window.showErrorMessage(`Error setting encoding for ${document.fileName.split("\\").pop()}: ${error.message}`);
	});
}

module.exports = {
	getEncodingFromLine,
	findXMLDeclaration,

	activate,
	deactivate
}
