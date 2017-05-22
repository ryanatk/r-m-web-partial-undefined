const assemble = require('fabricator-assemble');
const gaze = require('gaze');

const WATCHABLE_NAMES = ['layouts', 'layoutIncludes', 'views', 'materials', 'data', 'docs'];

class FabricatorPlugin {
  constructor(options) {
    this.watchRunStarted = false;
    this.options = options;
  }

  apply(compile) {
    compile.plugin('run', this.assemble.bind(this));
    compile.plugin('watch-run', this.assemble.bind(this));
    compile.plugin('watch-run', this.watchToBuild.bind(this, compile));
  }

  assemble(compiler, callback) {
    assemble(this.options);
    callback();
  }

  watchToBuild(compile, compiler, callback) {
    if (!this.watchRunStarted) {
      this.watchRunStarted = true;
      const options = this.options;

      gaze(this.getWatchableGlobs(), function(err) {
        if (err) { throw err; }

        this.on('all', () => {
          assemble(options);

          compile.run((err) => {
            if (err) { throw err; }
          });
        });
      });
    }

    callback();
  }

  getWatchableGlobs() {
    return WATCHABLE_NAMES
      .map(pattern => this.options[pattern])
      .filter(pattern => !!pattern);
  }
}

module.exports = FabricatorPlugin;
