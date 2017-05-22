All `svg` assets are contained in a single directory: `/src/assets/svg/`

### Subdirectory Organization

Webpack plugins and loaders use these specific file locations to work their magic. If you change this organization, please also update the proper webpack configs, along with these docs.

Duplication of svg's across these subdirectories is fine. There are no dependencies across subdirectories, and there is no reason a single svg cannot live in multiple places. That said, feel free to delete anything we no longer want, because git.

#### `backgrounds`

Images referenced thru CSS `background` properties live here. The `svg-url-loader` loader replaces the url within the `background-image(url)` with a `utf-8` encoded string. These svg's are not processed at build time, so there is no harm in leaving unreferenced images in here.

#### `icons`

Images reference thru HTML `<svg>` elements live here. The `webpack-svgstore-plugin` plugin compiles these svg's into a single sprite `/lib/sprite.svg` during the build process. Because this plugin compiles ALL these svg's, it's imperative that we do not leave unused svg's in this directory. Doing so has negative impacts on build time, and (more importantly for the user) increases file size leading to slower page rendering.

#### `archive`

Put any svg's you want in here. Its original purpose is to hold svg's we're not currently using, but we don't want to trash. This helps us keep other subdirectories clean, particularly important for subdirectories that are pre-compiled at build time, like `icons`.
