
# accessibility-html-reporter
A small module which runs Access sniff on the given source glob and generates a simple HTML report.

## Installation

Install accessibility-html-reporter locally and add it to the dev dependancies
```bash
npm install accessibility-html-reporter --save-dev
```

## Usage

Simple require the module in your script/gulp task and invoke it with the desired config

```js
const accessibilityHtmlReporter = require('accessibility-html-reporter');

accessibilityHtmlReporter({/*config*/}, callback);

```

and you're done!!

## Config

The accessibility-html-reporter takes the following config object and the default values are as below

```js
config: {
  srcFiles: ['**/*.html'], // array of files to test

  accessibilityLevel: 'WCAG2AAA', // one of WCAG2A, WCAG2AA, WCAG2AAA, and Section508
  ignore: [], // rules to ignore eg. ['WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2']
  verbose: false, // Verbose output
  force: true, // do not throw an error if errors found
  browser: false, // false = jsdom, true = phantomJS
  maxBuffer: 500 * 1024, // set buffer size

  fileName: 'accessibility-report', // name of json and html file generated
  reportLocation: 'reports/accessibility' // folder where report should be written
}
```

## Sample Report

![This is what the report looks like](sample.jpg?raw=true "Sample Report")
