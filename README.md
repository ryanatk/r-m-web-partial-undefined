#Revolve Clothing mobile Web

##Installation

Here are the steps needed to install this thing:

```bash
git clone git@github.com:FiresqueakLLC/revolve-clothing-mobile-web.git
cd revolve-clothing-mobile-web
npm install
// this will run in watch mode with no server
npm start
// this will run in watch mode along with the dev server
npm run webpack-dev-server
```

Upon starting the dev server, a page will open in the default browser.

##Building

To build the compiled version:

```bash
npm run build
```

##Test

To run the tests, issue the following command:

```bash
npm test
```

Running `npm test` will build static assets, start up a web dev server, and
eventually run casperjs. It'll also run karma in parallel for unit tests.

If you are running `npm start` in a separate tab, then issue the following
command:

```bash
npm run casperjs:suite -- -d
```

The `-d` will disable the server and expect the webpack dev server to be running
on port 8080, i.e the same port when running `npm start`.

Here are the different commands for running unit tests:

```bash
# will run the tests in a watch mode where it'll listen for changing and reload
# the tests - think of this as a tdd mode of sorts
npm run watch:test

# will run the tests on a single run using PhantomJS and turning off colors in
# case this is ran from a CI or something
npm run karma:single
```

To see the full list of npm scripts available, enter this into the terminal:

```bash
npm run
```

More information on common npm commands can be found at docs/npm.md.
