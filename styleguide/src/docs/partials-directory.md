Many `materials` repeat the same code, so we're setting up a `partials` directory to hold those.

These partials are available the same way as others made available by `fabricator-assemble`. The main difference is that they don't show as their own materials in the style guide (they don't appear in the left nav or the list of modules, etc).

Currently we are not capable of nesting these within folders, but we won't worry about fixing that until we have enough in there to warrant the need for better organization. The simpler we keep this directory, the better.
