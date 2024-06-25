const assert = require('assert');

const vscodeMocks = require('../mocks/vscode-mocks');
const extension = require('../../src/extension');

suite('Test getEncodingFromLine', () => {
	test('Simple test', () => {
		var enc = extension.getEncodingFromLine(`<?xml version="1.0" encoding="windows-1251"?>`);
		assert.strictEqual(enc, "windows-1251");
	});

	test('Usage of whitespaces', () => {
		var enc = extension.getEncodingFromLine(`  <?xml              encoding =    "utf-16" ?>`);
		assert.strictEqual(enc, "utf-16");
	});

	test('No encoding specified', () => {
		var enc = extension.getEncodingFromLine(`<?xml version="1.0"?>`);
		assert.strictEqual(enc, null);
	});

	test('Invalid XML declaration', () => {
		var enc = extension.getEncodingFromLine(`<xml encoding="utf-8"?>`);
		assert.strictEqual(enc, null);
	});

	test('Empty string', () => {
		var enc = extension.getEncodingFromLine(``);
		assert.strictEqual(enc, null);
	});
});

suite('Test findXMLDeclaration', () => {
	test('Simple test', () => {
		var mock = vscodeMocks.createMockTextDocument([
			`<?xml version="1.0" encoding="windows-1251"?>`
		]);
		var xmlDeclaration = extension.findXMLDeclaration(mock);
		assert.strictEqual(xmlDeclaration, `<?xml version="1.0" encoding="windows-1251"?>`);
	});

	test('Advanced test', () => {
		var mock = vscodeMocks.createMockTextDocument([
			`#include "../character_desc.xml"`,
			``,
			`<?xml encoding="windows-1251"?>`,
			`<string_table>`,
			`  <!-- I said come in, don't stand there! -->`,
			`  <string id="name_duty_0">`,
			`    <text>Андрей</text>`,
			`  </string>`,
			`</string_table>`,
			``
		]);
		var xmlDeclaration = extension.findXMLDeclaration(mock);
		assert.strictEqual(xmlDeclaration, `<?xml encoding="windows-1251"?>`);
	});

	test('Usage of whitespaces', () => {
		var mock = vscodeMocks.createMockTextDocument([
			`  <?xml version="1.0" encoding="windows-1251"?>`,
			``
		]);
		var xmlDeclaration = extension.findXMLDeclaration(mock);
		assert.strictEqual(xmlDeclaration, `  <?xml version="1.0" encoding="windows-1251"?>`);
	});

	test('Invalid XML declaration', () => {
		var mock = vscodeMocks.createMockTextDocument([
			`?xml encoding="windows-1251"?>`,
			`<root>`,
			`  <quote>50,000 People Used to Live Here. Now It's a Ghost Town</quote>`,
			`</root>`
		]);
		var xmlDeclaration = extension.findXMLDeclaration(mock);
		assert.strictEqual(xmlDeclaration, null);
	});

	test('Empty document', () => {
		var mock = vscodeMocks.createMockTextDocument([]);
		var xmlDeclaration = extension.findXMLDeclaration(mock);
		assert.strictEqual(xmlDeclaration, null);
	});
});
