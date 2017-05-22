# NPM

NPM is being heavily utilized for dependency management (including development
dependencies) and as a task runner. The following will provide a breakdown of
both.

## Dependency management

One of the most powerful features of NPM includes dependency management. It does
it in such a way that [collisions in versioning](https://docs.npmjs.com/files/folders)
are a non-issue and you are absolutely certain about how transitive dependencies
are being referenced.

When versioning dependencies, always practice [semver](https://docs.npmjs.com/getting-started/semantic-versioning)
and always avoid setting dependencies to `*`. Instead, use [caret](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004)
or [tilde](https://docs.npmjs.com/misc/semver#tilde-ranges-123-12-1) ranges. Even
better, when installing dependencies, use the `npm install` command, for example:

```bash
# installs and saves it to your regular dependencies
npm install --save lodash

# installs and saves it to your devDependencies
npm install --save-dev mocha

# installs and saves at a specific version
npm install --save lodash@3
```

As alluded to above, there are two different types of relying on code including
`dependencies` and `devDependencies`.

### Dependencies

These are dependencies that are part of the distributed artifact of the project.
More specifically, if you're leveraging code that will appear in the built
JavaScript file, then such dependency should be included here. It's through here
that webpack knows how to find any code which hasn't been included locally to
the project.

### Development Dependencies

Development dependencies includes leveraged code that won't be part of the
distributed artifact and are using **purely** for development purposes. This
typically includes test and building related code, i.e. karma, mocha, webpack,
and so forth.

## Task Runner

Another powerful feature of NPM includes [npm-scripts](https://docs.npmjs.com/misc/scripts),
which acts as a glorified task runner similar to grunt/gulp, but without an
additional layer of deflection or pass through. Furthermore, this is being
utilized through using [npm-run-script](https://docs.npmjs.com/cli/run-script).
For example, in our `package.json`, we create the following script:

```json
{
  "scripts": {
    "foo": "echo I am foo"
  }
}
```

We can then run foo, by running the following in the shell:

```bash
npm run foo
```

npm-scripts are nothing more than running shell command.

This is nice and all, but the biggest advantage of using `npm run` is it will
add `/path/to/project/node_modules/.bin` to the `PATH`. It's very common for
node modules to provide their own bin files which can be executed from this
location. This is great for a number of reasons:

- We don't have to worry about installing globals
- It makes your code much more portable
- You get an explicit way of versioning your `bin` files
- It's a way of standardizing how tasks should be ran
- Keeps cohesion within the team using a reliable standard

For an example, let's say we installed `node-sass`. If we want to compile sass,
we would provide the following script in our `package.json`:

```json
{
  "scripts": {
    "node-sass": "node-sass scss/main.scss dist/main.css"
  }
}
```

Then we run the script like so:

```bash
npm run node-sass
```

There's also the ability to append additional arguments to a script. To do so,
simply add ` -- ` to the end of the script, along with any additional
parameters. Using our example above, if we wanted to emit a source map, we can
do so by running the following:

```bash
npm run node-sass -- --source-map
```
You can have scripts call other scripts in a similar way.

There may be cases where there isn't an available binary or you need more
granularity. In this case, create a file, make it executable, add the node
interpreter to the top of the file, and then call on the node API in the file.
One example of this would be to create a separate executable file that interacts
directly with the webpack API instead of the webpack CLI.

When a script passes, it will return a 0 exit code. However, if a script fails,
it will return a non-zero exit code. This is important for when these scripts
are being ran in a continuous integration (CI) server so it can notify the CI
server when a script fails and immediately stop the build.

## Available Scripts

To see the available scripts, simply run:

```bash
npm run
```

This will list out every script specified under the scripts object in the
`package.json`.

Here are some of the more command scripts that will get ran along with
explanations:

```bash
# starts up the dev server along with Browsersync
npm start

# runs all tests
npm test

# runs any lint related binaries, i.e. eslint
npm run lint

# will run karma in a watch mode and re-run tests when changes are made to any
# test related files
npm run watch:test

# runs karma with a single run, i.e. karma is ran only once
npm run karma:single

# runs webpack watch, i.e. when ran, it will rebuild whenever a file changes
npm run watch

# will delete a set number of code generated directories
npm run clean

# will run the webpack config for the mobile app specific bundle
npm run webpack:mobile-app
```
