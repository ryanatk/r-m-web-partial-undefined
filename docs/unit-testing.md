# JavaScript Unit Testing

Before deep diving into the setup, let's talk about the objectives of unit
testing:

- Test in isolation and remove unnecessary external dependencies
- To minimize the amount of future bugs
- To automate manual testing
- Ensure product requirements match to code
- Act as a form of documentation to new developers
- Provide an introspective look at code

When you're writing JavaScript unit tests, here are some things to keep in mind:

- Make sure you are testing on thing and only one thing, i.e. a method with
controlled arguments
- Make sure to never make any network requests, either mock out or use a fake
XHR server (sinon provides you with one that is very low level)
- Never test any private methods, only test public methods
- Instead of testing private methods, pass in arguments to your public methods
that interact with private methods. Then, when you private methods change, your
tests should stay intact.
- When it comes to testing code that depends on templates, do whatever works
best for the situation. Personally, I've found rendering templates within a test
yields the best results verses having a separate fixture that may need updating
from a time to time.
- Try to avoid stubbing methods and calling on window variables. Instead, look
into strategies such as dependency injection and creating interfaces to
represent objects.

There are many many books covering the items above. At the end of the day, as
long as you are writing tests and learning what works and doesn't work for your
project, you're doing it right. There are many different thoughts/methodologies
to testing. Choose the one that makes sense with your business, technology, and
patterns and you'll be fine.

## Running Tests

Before getting into the nitty gritty, here are a number of tests commands
available in this project:

```bash
# will run tests in a watch mode, i.e. the runner will listen for file changes
# and run through the suite of tests
npm run watch:test

# will run the tests in as a single run
# more specifically, it will run all the tests one time through and send back an
# 0 (success) or non-zero (failure) exit code
npm run karma:single

# will run both integration and unit tests in parallel
npm test
```

## Tooling

There are a bunch of tools that can be used for JavaScript unit testing, all
with pluses and minuses. All that matters is testing and testing the right
things. For this project, here are the various tools that are used in this
project:

- Runner: [Karma](https://karma-runner.github.io)
- Framework: [Mocha](https://mochajs.org/)
- Assertion Library: [Chai](http://chaijs.com/) - using the [expect style](http://chaijs.com/api/bdd/)
- Test double Library: [Sinon](http://sinonjs.org/)
- HTML Fixture: [Karma Fixture](https://github.com/billtrik/karma-fixture) with [html2js](https://github.com/karma-runner/karma-html2js-preprocessor)
- Browsers: [Karma Browsers](http://karma-runner.github.io/0.13/config/browsers.html)
- Webpack: [karma-webpack](https://github.com/webpack/karma-webpack)
- Test coverage: [Istanbul](https://github.com/gotwarlost/istanbul) via the [istanbul-instrumenter-loader](https://github.com/deepsweet/istanbul-instrumenter-loader) webpack loader

Each of these will be elaborated below.

## Runner

A test runner will take a suite of tests and well, run them. This is typically
done via running tests from the command line. For simplicity (although it isn't
always true), think of a runner as software that wires up various pieces
required for unit testing.

This project is using karma for a number of reasons including:

- Easy to configure
- Lightweight, fast, and intelligent about how it reruns tests
- Very extensible by imploring dependency injection and a variety of hooks
allowing for a lot of customizability
- Well supported community and used by a number of bigger companies and
software projects

For the most part, each building blocks used for testing has some type of plugin
that hooks into karma. This is done through a number of:

- [frameworks](https://karma-runner.github.io/0.13/config/plugins.html): essentially these are plugins
- [reporters](https://www.npmjs.com/browse/keyword/karma-reporter): how the test results get outputted or reported
- [preprocessors](http://karma-runner.github.io/0.13/config/preprocessors.html): runs files through a set of filters or transformations

See `karma.config.js` for the full configuration of the project.

## Framework

Not to be confused with karma frameworks, but a testing framework provides the
shell or structure for running unit tests. A framework accomplishes:

- Organization of a tests
- Defines the names of the tests
- Options for running async tests
- In some cases, the ability to run code before/after a number of tests

Although there are other frameworks that are great, we chose mocha for a number
of reasons:

- Well supported
- Widely used
- Battle tested and stable

Mocha can be used as a runner as well. It's amazing for node projects or very
simple projects. However, when testing for client side code, there are more
moving parts, so using a runner like karma allows for flexibility and better
readability. In order for mocha to be used with karma, there is a [karma plugin](https://github.com/karma-runner/karma-mocha)
which allows for mocha to communicate to karma errors, the amount of tests, and
any other info that needs to be communicated up.

Mocha provides a number of functions or "blocks" used for setting up a test.
Here's a simple example:

```JavaScript
describe('Some Piece of code', function() {
  beforeEach(function() {
    // anything inside of here is ran before every test
  });

  afterEach(function() {
    // anything inside of here is ran after every test
  });

  it('should do something', function() {
    // code used for testing
  });

  it('should do something else', function() {
    // code used for testing
  });
});
```

At the end of the day, when the `it` function is ran by mocha, it checks to see
if an error has been thrown. If not, it then assumes the test passes, similar to
the mindset of "no news is good news". This is where assertion libraries comes
into play.

## Assertion Library

At it's core, an assertion library checks an expected value with the actual
value. Another way of thinking of it as providing some input and expecting some
predictable output. When the expected result does not equal the actual result,
an error is thrown. The framework (in this case mocha) will see if any error has
been thrown and report it up to the runner.

There are a number of assertion libraries that exist. The one we chose to use is
chai. It has a lot of backgind support, provides a lot of flexibility, and allows
for consistency across different plugins. It also provides 3 different styles
for writing assertions. We are using the expect style as it finds a nice balance
between readability, while still being developer centric. It also follows a lot
of the same patterns as existing assertion libraries, allowing others to easily
adapt and learn.

Here's an example of chai with expect style:

```JavaScript
expect(true).to.be.true;
expect('leland').to.equal('leland');
expect({ name: 'leland' }).to.deep.equal({ name: 'leland' );
```

So using the mocha example, one could have a test written like this:

```JavaScript
var expect = require('chai').expect;

describe('Some Piece of code', function() {
  beforeEach(function() {
    // anything inside of here is ran before every test
  });

  afterEach(function() {
    // anything inside of here is ran after every test
  });

  it('should do something', function() {
    expect(true).to.be.true;
  });

  it('should do something else', function() {
    expect('leland').to.equal('leland');
  });
});
```

Although there exists a karma plugin for chai, it isn't completely necessary to
include it since we can treat chai as a dependency and remove one less global.

## Test Double Library

The goal of a test double library is to provide fake objects that are either
used as parameters or override some existing behavior. For this, we are using
sinon, which provides us with a slew of test doubles in the form of spies,
stubs, mocks, a fake server, timers, and much more.

We are using the karma framework for sinon. This is because sinon does not play
nicely in a webpack environment. However, if we were in a node environment,
everything would be peachy. There is a window variable called `sinon`. On top of
this we have a chai plugin called [sinon-chai](https://github.com/domenic/sinon-chai)
which provided sinon assertions in the form of chai.

## HTML Fixture

Since we don't have a good way to get at the actual server side rendered
templates, we are using HTML fixtures to represent what our templates contain.
When we say fixtures, we are referring to data which simulates what our test is
expecting.

HTML fixtures are being treated as preprocessors, so we specify where they are
located as files and then apply a preprocessor to said files. This makes our
HTML available to us within our tests.

Using HTML fixtures can have some negative affects. If the HTML changes in your
server-side templates, then it must be updated in our HTML test fixture. As
long as it's not too overly complicated, rendering your actual templates within
a test environment is ideal. When the markup changes, it will be reflected in
your tests right away, creating a single place for your markup verses two
different places. More than anything, do whatever is best for your environment
and adapt.

## Browsers

Karma (and other runners) provide the ability to run unit tests in a variety of
browsers. When testing locally, both Chrome and PhantomJS are being ran. When
running tests directly from the command (for example in a continuous
integration environment), only PhantomJS is being ran. This can be easily
changed to use a variety of browsers within Karma. There's also the ability to
run tests with WebDriver, so tests could be ran in something like Selenium-Grid,
Sauce Labs, or another environment that accepts WebDriver.

## Webpack

Since our source files are written in a CommonJS format, we need some way of
converting this format over to something the browser can understand. Since we
are already using webpack for developing and asset compilation, we can utilize
the same general setup for our tests.

To have webpack interact with karma, simply install karma-webpack and provide
the webpack config to the webpack property. There's also an option for
`webpackMiddleware` is used for serving webpack compiled code in memory and
sending it back to Karma. Since we have broken out each config into it's own
file, we can provide new options and overrides that make sense for testing. One
of those is code coverage.

## Code Coverage

Code coverage is used as a way of measuring how much of your source code has
been tested. This is helpful for a number of reasons including:

- to see how much of your code has tests
- have precommit checks in place to reject commits that don't meet a certain
coverage threshold
- make sure the critical parts of your code have tests

Unfortunately, people get caught up on having 100% coverage. Personally, that's
unrealistic and as long as you cover critical paths, i.e. code that is reused, error
prone, or is complicated, then you're doing good. For web apps, I like something
in the 60% - 70% range. For libraries, I strive for 85% - 95%.

We are using a code coverage tool called Istanbul. More specifically we are
using istanbul-instrumenter, which is a webpack loader being fed in through our
webpack test config. Based on how it's configured in karma config, we are
outputting both HTML and LCOV formats. HTML is used so we can see visually what
parts of the code need coverage. LCOV is used so we can run that through a
continuous integration tool like Jenkins or Travis CI to see code coverage
metrics.
