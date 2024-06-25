const vscode = require('vscode');

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
		if (line.trim().toLowerCase().startsWith("<?xml")) {
			return line;
		}
	}
	return null;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
		if (document.languageId != "xml") {
			console.log("Document isn't XML");
			return;
		}

		var xmlDeclaration = findXMLDeclaration(document);
		if (!xmlDeclaration) {
			console.log("Document doesn't contain a XML tree");
			return;
		}

		var encoding = getEncodingFromLine(xmlDeclaration);
		if (!encoding) {
			console.log("XML tree doesn't contain an encoding instruction");
			return;
		}

		console.log("Detected encoding: ", encoding);

		/*
		// Waiting for https://github.com/microsoft/vscode/pull/177434 :(

		vscode.window.activeTextEditor.setEncoding(encoding).then(() => {
			console.log("Encoding set successfully");
		}).catch(error => {
			console.error("Error setting encoding: ", error.message);
		});
		*/
	}));
}

function deactivate() {
	
}

module.exports = {
	getEncodingFromLine,
	findXMLDeclaration,

	activate,
	deactivate
}
