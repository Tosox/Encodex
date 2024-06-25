/**
 * Mock vscode.TextLine
 * 
 * @param {String} text
 * @returns {any}
 */
const createMockTextLine = (text) => {
	return {
		text: text,
	};
};
  
/**
 * Mock vscode.TextDocument
 * 
 * @param {String[]} lines
 * @returns {any}
 */
const createMockDoc = (lines) => {
	return {
        /**
         * @returns {number}
         */
		get lineCount() {
			return lines.length;
		},

        /**
         * 
         * @param {number} i 
         * @returns {any}
         */
		lineAt: function (i) {
			return createMockTextLine(lines[i]);
		}
	};
};

module.exports = {
    createMockTextLine,
    createMockDoc
};
