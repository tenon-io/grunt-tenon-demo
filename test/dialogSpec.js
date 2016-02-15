'use strict';

var assert = require('assert'),
    webdriverio = require('webdriverio'),
    tenonCommands = require('./helpers/tenonCommands');

// Load the Tenon helper commands
browser
    .addCommand('tenonAnalyzeUrl', tenonCommands.tenonAnalyzeUrl)
    .addCommand('tenonAnalyzeHtml', tenonCommands.tenonAnalyzeHtml);


beforeEach(function() {
    browser.url('https://rawgit.com/karlgroves/axsdialog/master/demo/index.html');
});

describe('AXS Dialog', function() {
    it('should have "axsdialog demo." as the page title', function(done) {
        browser.getTitle(function(err, res) {
            assert(res === 'axsdialog demo.');
        })
        .call(done);
    });

    it('should have no accessibility errors', function(done) {
        browser.tenonAnalyzeUrl(function(err, res) {
            assert(res.resultSet.length === 0, 'should have 0 errors');
        })
        .call(done);
    });
});

describe('Launch dialog and test it', function() {
    it('should have no accessibility errors', function(done) {
        browser
        .click('#sign-in')
        .pause(100)
        .tenonAnalyzeHtml('#tehDialog', function(err, res) {
            assert(res.resultSet.length === 0, 'should have 0 errors');
        })
        .call(done);
    });

});