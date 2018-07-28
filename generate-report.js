
(function () {

  'use strict';

  const AccessSniff = require('access-sniff');
  const handlebars = require('handlebars');
  const fs = require('fs');
  const async = require('async');
  const funkyLogger = require('./funky-logger');
  const path = require('path');

  const basePath = path.resolve(__dirname, '..', '..');

  function generateReport(config, done) {
    let data = {};

    console.info(funkyLogger.color('cyan', 'Generating Accessibility report.'));
    AccessSniff.default(config.srcFiles, config.options)
      .then((report) => {
        console.info(funkyLogger.color('green', 'Accessibility report Generated'));
        console.info(funkyLogger.color('cyan', 'Remapping data'));
        data.errors = 0;
        data.warnings = 0;
        data.notices = 0;
        data.files = [];
        Object.keys(report).forEach((file, index) => {
          data.errors += report[file].counters.error;
          data.warnings += report[file].counters.warning;
          data.notices += report[file].counters.notice;
          const fileDetails = {
            index: index + 1,
            name: file,
            errors: report[file].counters.error,
            warnings: report[file].counters.warning,
            notices: report[file].counters.notice,
            errorDetails: []
          };
          report[file].messageLog.forEach((message) => {
            const errorDetail = {
              issue: message.issue,
              description: message.description,
              element: message.element.node,
              severity: message.heading,
              position: message.position
            };
            fileDetails.errorDetails.push(errorDetail);
          });
          data.files.push(fileDetails);
        });

        console.info(funkyLogger.color('green', 'Data remapping complete'));
        
        
        console.info(funkyLogger.color('yellow', '\nTotal errors found: '), funkyLogger.color('red', data.errors));
        console.info(funkyLogger.color('yellow', 'Total warnings found: '), funkyLogger.color('red', data.warnings));
        console.info(funkyLogger.color('yellow', 'Total notices found: '), funkyLogger.color('red', data.notices), '\n');


        console.info(funkyLogger.color('cyan', 'Writing data...'));
        const template = fs.readFileSync(__dirname + '/html-report-template.html', 'utf8');
        const compiledTemplate = handlebars.compile(template, {});
        const html = compiledTemplate(data);

        async.parallel([
          function (cb) {
            fs.writeFile(config.finalReport, html, 'utf8', () => { cb(); });
          },
          function (cb) {
            fs.writeFile(config.jsonReport, JSON.stringify(data, null, 2), 'utf8', () => { cb(); });
          }
        ], () => {
          console.info(funkyLogger.color('green', 'Accessibility report written to JSON and HTML'));
          if (!config.options.force && data.errors > 0) {
            process.exit(1);
          }
          done();
        });

      });

  }

  module.exports = generateReport;

})();
