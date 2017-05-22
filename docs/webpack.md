# Webpack

The approach for the webpack setup is broken down by environment. In a
traditional environment configuration setup, one could have different
configurations per environment. This follows a similar setup, but since webpack
is configured with JavaScript, we have the ability to assemble configuration in
a way so that we can merge other environments and keep environmental specific
configuration in a manageable state. The major environments include:

- development
- production
- test

There are also base configurations which are utilized by the different
environments. They include:

- common
- build

All of this can be found under `/webpack`.

## Configuration Breakdown

All the various environments mentioned above can be found in more detail below.

### Common (webpack.common.config.js)

As the name implies, this contains any of the baseline configuration. This
includes entry points, output, aliases, and a few other baseline configurations.
This configuration should work in every environment. If, by any chance, some
configuration doesn't play nicely with any other environment, then it should be
specified one level up or where appropriate.

### Build (webpack.build.config.js)

This configuration is intended to be used during a forward facing building step.
For example, this would be used for either production or development. However,
an environment such as test wouldn't make sense since it doesn't need any
production level build, but rather enough to get up and running and keep unit
testing as fast as possible.

### Development (webpack.development.config.js)

This configuration is used for, ummm, development. More specifically, this would
be used for any development specific concerns such as Browsersync or
webpack-dev-server. This configuration extends `build`.

### Production (webpack.production.config.js)

If you're thinking this is used for production, you're smart, don't let anyone
else tell you otherwise. Although similar to build, this would contain such
additional options has minification of assets or anything that belongs during
the production build task.

### Test (webpack.test.config.js)

This configuration is used under unit testing. Unit tests don't care about how
things look, so this is extending common and will have other overrides in place.
Unit tests can be perceived as boring (I don't agree with that!), the intention
is to have this configuration be fast and stripped down so the (re)compiling of
assets is as bare bones as possible. Basically, cut out the fat here so it's one
less thing to complain about when writing unit tests.

## Running in different environments

Since we are primarily working with 3 different environments (prod, dev, and
test), each is being provided an environmental configuration.

### Production

This is being handled via an npm script. This can be ran by executing:

```bash
npm run build
```

Behind the scenes, all it's really doing is this:

```bash
HAPPY_VERBOSE=true npm run webpack:prod
```

Which is basically:

```bash
webpack -p --config webpack/webpack.build.config.js --display-chunks --display-modules
```

Here, you can see webpack is being provided the production configuration.

### Development

This environment is a little more complicated, but still should be straight
forward to follow:

```bash
npm start
```

Which is essentially:

```bash
HAPPY_CACHE=true npm run webpack-dev-server
```

Which in turn, runs:

```bash
webpack-dev-server --config webpack/webpack.development.config.js
```

Similar to production, we are providing the `webpack-dev-server` a development
specific configuration.

### Test

The test configuration is the most straight forward, Karma is being used for
running unit tests. Since we have the totally awesome karma-webpack plugin
available, we just need to provide our dev configuration to that via a property
on `karma.config.js`. See `/karma.config.js` for more information, but it's
pretty uneventful.

## Notable Things About The Setup

Here are some sections to highlighting things of interest (at least I find them
interesting, maybe you don't?).

### Performance

Webpack is awesome. There, I said it. However, it does come with a performance
overhead. To considerably bring down latency, we are using [happypack](https://github.com/amireh/happypack)
which will run loaders in parallel across processes (or as they stupidly call
it, "threads"). Although it's relatively new, it's quite stable and well thought
out. More importantly, it speeds up build by as much as 50% - 60% (even more if
you increase the "thread count"). To make it easily configurable, a number of
environmental variables have been provided, including:

```bash
# This setting controls the size of the thread pool used across each loader that
# is utilizing happypack.
# https://github.com/amireh/happypack#shared-thread-pools
HAPPY_THREAD_POOL="4"

# Turns on caching. This is currently set to true in development.
HAPPY_CACHE="false"

# Sets happypack logging to verbose. This is currently set to true in production.
HAPPY_VERBOSE="false"

# Allows for happypack to be enabled. You can switch this if for some reason
# happypack is being a jerk.
HAPPY_DISABLE="false"
```

The biggest boost we get by using happypack is between JavaScript and Sass
compilation. This will really come into play when babel is enabled because babel
(although totally awesome) is one of the slowest transcompilers out there.

### Code Splitting

Code splitting is currently occurring when minimum chunking meets 2. To limit
the amount of requests, it's being bundled within `chrome`. However, if this
file needs to go on a diet, we can break out the chunk into it's own file and
update the templates accordingly. We have a lot of flexibility here about how
this cane be approached in the future.

### Browsersync

Browersync is being used in dev mode. However, the webpack dev server is being
proxied into Browsersync. The idea here is we can utilize a lot of the same
configuration and references outside of dev mode, ensuring that both building in
production and development are in sync and don't have different values across
the different environments.

### Code Coverage

Code coverage is being provided by istanbul via a webpack `postLoader`. Anytime
tests are ran, a coverage directory is created containing both HTML and LCOV for
historical analysis and other useful fun things.

### Minification

When in production, minification is occuring via UglifyJS through the webpack
provided Plugin. Yeah, that's it, not very exciting.
