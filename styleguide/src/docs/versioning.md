Node modules heavily leverage semver (or Semantic Versioning) for their versioning.

### Semver Resources

#### http://semver.org/
This can be a bit academic, but the top part of the page summarizes major, minor, and patch quite well.

#### https://docs.npmjs.com/getting-started/semantic-versioning
Contains a great video and provides a good high level overview of semver.

#### https://nodesource.com/blog/semver-a-primer/
Good a little more in-depth article on semver, but still doesn't feel very academic.

### Semver Wildcards

If the team follows semver closely, then you should be fine with applying either a caret (wildcards on the minor and patch version) or tilde range (wildcards on the path version).

More examples:

#### ~2.1.2

- 2.1.12
- 2.3.0
- 2.5.0

#### ^3.2.1

- 3.2.3
- 3.2.5
- 3.2.8

I personally like using caret and tilde, as it denotes when the version was last set so it helps for tracking purposes verses 2.x or 3.2.x.

### The rules I follow when I make a change to a project:

- Does this change fix a bug and is it backwards compatible? *patch, i.e. 1.2.1 becomes 1.2.2*
- Does this change introduce a new feature but it's still backwards compatible? *minor, i.e. 1.2.1 becomes 1.3.0*
- Is this change not backwards compatible and typically includes a good amount of code? *major, i.e. 1.2.1 becomes 2.0.0*

However, if the team is looking to pin to a specific version, there's nothing wrong with that. A lot of this comes down to what works best for the team. In my experience, if a team is using semver and sticking close to it, then it can be very powerful and provide a lot of flexibility for rolling out releases. The downsides I've experienced come down to people on the team not incrementing correctly, but a lot of that comes down to education.

If version bumps are not happening by machinery (i.e. after a successful build), npm version is a command aiding in bumping a version based on the type of change. It will create a new git commit and will automatically increment to the type of version bump. Therefore, no one has to modify package.json. For more info: https://docs.npmjs.com/cli/version

### An example workflow that could be used for a minor version bump:

1. create a new branch
1. do something work on the new branch
1. get it code reviewed
1. once work has been approved by the team, merge into master
1. run `npm version minor -m "added a new feature"`
1. run `git push origin master && git push --tags`
