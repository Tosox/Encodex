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

const EncodingMode = {
	Encode: 0,
	Decode: 1
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
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

		// Waiting for https://github.com/microsoft/vscode/pull/177434 :(

		//@ts-ignore
		vscode.window.activeTextEditor.getEncoding().then(currentEncoding => {
			console.log(`Current encoding: ${currentEncoding}, encoding: ${encoding}`)
			if (currentEncoding === encoding) {
				console.log(`Encoding is already set to ${currentEncoding}`);
				return;
			}

			//@ts-ignore
			vscode.window.activeTextEditor.setEncoding(encoding, EncodingMode.Decode).then(() => {
				console.log("Encoding set successfully");
			}).catch(error => {
				console.error(`Error setting encoding: ${error.message}`);
			});
		}).catch(error => {
  			console.error(`Error setting encoding: ${error.message}`);
		});
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
