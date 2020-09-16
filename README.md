# Grunt Tenon Demo

NOTE: This is supposed to say "Build Error", because that's what it demonstrates.

[![Build Status](https://travis-ci.org/tenon-io/grunt-tenon-demo.svg?branch=master)](https://travis-ci.org/tenon-io/grunt-tenon-demo)


## Get a Tenon.io account before continuing

If you do not already have an account on Tenon.io, you need one to use this. Head over to [https://tenon.io/register.php](https://tenon.io/register.php). 

Once you're registered and confirmed, get your API key at [https://tenon.io/user/apikey.php](https://tenon.io/user/apikey.php)

## What this is

This is a demonstration of using Tenon as a Grunt task. It uses the [grunt-tenon-client](https://github.com/egauci/grunt-tenon-client) to test a folder of HTML files using [Tenon API](https://tenon.io) and using Tenon in a [watch task](https://www.npmjs.com/package/grunt-contrib-watch). It also demonstrates using [grunt-githooks](https://www.npmjs.com/package/grunt-githooks) to run the `tenon` task on commit.

It also demonstrates using Tenon in a Continuous Integration Scenario, using Travis (view sample output at: [https://travis-ci.org/tenon-io/grunt-tenon-demo/](https://travis-ci.org/tenon-io/grunt-tenon-demo/)).  Note: When viewing the Travis-CI output, the build fails because that's exactly what you want in this case. The Grunt Tenon task is specifically designed to exit if errors are found.

## Explore

Take a bit of time to explore the Gruntfile and .tenonrc file to see how the options can be used for your purposes.

Don't forget to also [Read The Fine Manual](http://tenon.io/documentation/) for the full range of API parameters!





