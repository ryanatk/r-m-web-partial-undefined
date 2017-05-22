# SVG icons

We use an SVG icon system that allows us to manage our icons as individual svg files. At build time, they get combined into a single svg sprite. The sprite is loaded using ajax, taking advantage of browser caching. Icons are referenced within the svg `<use>` element, with the `xlink:href` corresponding to the svg's file name.


## Usage

### Directory Structure

The svg directory contains 2 subdirectories: available & enabled

#### available/

Contains all svg files you might ever want to use. We don't build them all, we just store them there, making them "available" to use.

#### enabled/

Contains symlinks to svg files in the available directory. These symlinks are used to determine which svg's should be bundled into the main icon sprite.

### Enabling & Disabling

Our main goal is to minimize the number of svg's bundled into the sprite. There are 2 main benefits:

1. smaller file size for sprite.svg
2. faster build time

#### svg:enable

To enable an svg, run the following command, replacing *filename(s)* with the files you want to enable:

```bash
npm run svg:enable filename(s)
```

- will replace an existing symlink in the same location

#### svg:disable

To disable an svg, removing it from future builds of the sprite, run the following command, replacing *filename(s)* with the files you want to disable:

```bash
npm run svg:disable filename(s)
```

#### Notes for both scripts

- accept multiple filenames, and give feedback for each
- you can include or leave off the `.svg` file extension, no problem
- do not include a full path, just the file's name
- works from anywhere within the project
- checks for the image in available directory before attempting to create the symlink


## Future Work

We plan to check for broken symlinks at build time. This can occur when an svg is deleted from the available directory, but the symlink still lives in the enabled directory. A broken symlink will cause the build to fail immediately. In the meantime, this will hopefully be a rare case, and easy enough to fix manually.
