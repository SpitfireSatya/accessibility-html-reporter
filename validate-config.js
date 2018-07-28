
(function () {

  'use strict';

  const fs = require('fs');
  const funkyLogger = require('./funky-logger');
  const path = require('path');

  function validateConfig(config) {

    const basePath = path.resolve(__dirname, '..', '..');
    let extendedConfig = {
      srcFiles: [],
      options: {},
      reportOptions: {}
    };

    function recursiveMkDir(outDir) {
      let folders = outDir.split('/');
      let folderPath = basePath;
      folders.forEach((folder) => {
        if (folder) {
          folderPath = path.resolve(folderPath + '/' + folder);
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
        }
      });
    }


    const srcFiles = ['**/*.html'];

    const defaultConfig = {
      accessibilityLevel: 'WCAG2AAA',
      ignore: [],
      verbose: false,
      force: true,
      browser: false,
      maxBuffer: 500 * 1024,
    };

    const defaultReportConfig = {
      fileName: 'accessibility-report',
      reportType: 'json',
      reportLocation: 'reports/accessibility',
      reportLevels: {
        notice: true,
        warning: true,
        error: true
      }
    };

    if (config) {
      extendedConfig.srcFiles = config.srcFiles || srcFiles;
      
      extendedConfig.options.accessibilityLevel = config.accessibilityLevel || defaultConfig.accessibilityLevel;
      extendedConfig.options.ignore = config.ignore || defaultConfig.ignore;
      extendedConfig.options.verbose = (typeof config.force !== 'boolean') ? defaultConfig.verbose : config.verbose;
      extendedConfig.options.force = (typeof config.force !== 'boolean') ? defaultConfig.force : config.force;
      extendedConfig.options.browser = (typeof config.browser !== 'boolean') ? defaultConfig.browser : config.browser;
      extendedConfig.options.maxBuffer = config.maxBuffer || defaultConfig.maxBuffer;
      
      extendedConfig.reportOptions.fileName = config.fileName || defaultReportConfig.fileName;
      extendedConfig.reportOptions.reportLocation = config.reportLocation || defaultReportConfig.reportLocation;
      extendedConfig.reportOptions.reportType = defaultReportConfig.reportType;
      extendedConfig.reportOptions.reportLevels = defaultReportConfig.reportLevels;

    } else {
      extendedConfig.srcFiles = srcFiles;
      extendedConfig.options = defaultConfig;
      extendedConfig.reportOptions = defaultReportConfig;
    }

    recursiveMkDir(extendedConfig.reportOptions.reportLocation);

    extendedConfig.srcFiles.forEach((srcFile, index) => {
      extendedConfig.srcFiles[index] = path.resolve(basePath, srcFile);
    });
    extendedConfig.reportOptions.reportLocation = path.resolve(basePath, extendedConfig.reportOptions.reportLocation);

    extendedConfig.jsonReport = path.resolve(extendedConfig.reportOptions.reportLocation, extendedConfig.reportOptions.fileName + '.json');
    extendedConfig.finalReport = path.resolve(extendedConfig.reportOptions.reportLocation, extendedConfig.reportOptions.fileName + '.html');

    console.info('Config used for generation of report: ');
    console.info(funkyLogger.color('cyan', 'Source files to be linted: '),
      funkyLogger.color('magenta', JSON.stringify(extendedConfig.srcFiles, null, 2)));
    console.info(funkyLogger.color('cyan', 'Output path for HTML report: '),
      funkyLogger.color('magenta', extendedConfig.finalReport));

    return extendedConfig;

  }

  module.exports = validateConfig;

}());
