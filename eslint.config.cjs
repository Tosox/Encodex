module.exports = [
	{
	  languageOptions: {
		ecmaVersion: 2018,
		sourceType: "module"
	  },
	  linterOptions: {
		reportUnusedDisableDirectives: true
	  },
	  rules: {
		"no-const-assign": "warn",
		"no-this-before-super": "warn",
		"no-undef": "warn",
		"no-unreachable": "warn",
		"no-unused-vars": "warn",
		"constructor-super": "warn",
		"valid-typeof": "warn"
	  }
	}
  ];