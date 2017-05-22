var fs = require('fs');
var path = require('path');
var join = path.join;
var resolve = path.resolve;

module.exports = {
  getLinks: getLinks,
  enable: enable,
  disable: disable,
};

// declare svg directory
var svgDirectory = resolve('lib', 'imgs', 'svg');
var availableDirectory = join(svgDirectory, 'available');
var targetDirectory = join('..', 'available');
var enabledDirectory = join(svgDirectory, 'enabled');

// Constructor for new link objects
// setting properties and attaching helper functions
var Link = function(name) {
  this.source = join(availableDirectory, name); // location of the source file
  this.target = join(targetDirectory, name);    // target to symlink relative to the dest
  this.path = join(enabledDirectory, name);     // path where symlink should be
  this.create = create;
  this.remove = remove;
};

// Gather link/file names from command line arguments,
// and create an array of link objects
function getLinks(args) {
  var array = [];

  args.forEach(function (arg, index) {
    if (index < 2) return;
    var name = arg.replace(/\.svg$/, '') + '.svg'; // ensure the name ends in '.svg'

    // add new link to array
    array.push(new Link(name));
  });

  // if no file name(s), return message and stop
  if (!array.length) {
    msg('Please tell us which file you want to enable/disable', 'error');
  }

  return array;
}

function enable(link) {

  fs.stat(link.source, function (err, stats) {
    var sourceExists = stats && stats.isFile();

    // as long as sourceFile exists, make attempt to create a symlink
    if (sourceExists) {
      link.create();
    }
    // if sourceFile does not exist, return with error
    else {
      msg('File does not exist: svg/available/' + link.source, 'error');
    }
  });
}

function disable(link) {
  link.remove();
}

function create() {
  var thisLn = this;

  fs.symlink(this.target, this.path, function (err) {
    if (err && err.code === 'EEXIST') {
      msg('Symlink found ' + thisLn.path);
      thisLn.remove().create();
    }
    else if (err) {
      msg(err.code, 'error');
    }
    else {
      msg('Symlink added ' + thisLn.path);
    }
  });
  return this; // for method chaining
}

function remove() {
  var thisLn = this;

  fs.unlink(this.path, function (err) {
    if (err && err.code === 'ENOENT') {
      msg('Symlink not found ' + thisLn.path, 'error');
    }
    else {
      msg('Symlink removed ' + thisLn.path);
    }
  });
  return this; // for method chaining
}

function msg(txt, type) {
  var markers = {
    'error': '!',
  };
  var marker = markers[type] || '"';
  console.log(marker, txt);
}
