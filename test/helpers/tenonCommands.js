'use strict';

var tenonNode = require('tenon-node'),
    tenonApi = new tenonNode({
        //@TODO use the key from .tenonrc
        key: 'c630990d2999c17ee2c4600df0a67ec6'
    });

module.exports = {

    // Analyze the current URL in Tenon
    tenonAnalyzeUrl: function(cb) {
        this.url(function(err, urlResult) {
            tenonApi.analyze(urlResult.value, function(err, tenonResult) {
                if (err) {
                    console.error(err);
                } else {
                    cb(err, tenonResult);
                }
            });
        });
    },

    // Analyze the HTML identified by a specified selector in Tenon
    tenonAnalyzeHtml: function(selector, cb) {
        this.getHTML(selector, function(err, html) {
            tenonApi.analyze(html, function(err, tenonResult) {
                if (err) {
                    console.error(err);
                } else {
                    cb(err, tenonResult);
                }
            });
        });
    }
};
