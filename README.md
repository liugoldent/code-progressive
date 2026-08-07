# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Documentation structure

The sidebar is generated from seven focused top-level topic folders. Frontend
notes are split into separate sections so no single category becomes too large:

```text
docs/
├── frontend-core/          # HTML, CSS, JavaScript, TypeScript
├── frontend-frameworks/    # React, Vue, Nuxt
├── frontend-engineering/   # Tooling, system design, refactoring
├── frontend-interview/     # General and role-focused interview notes
├── backend/                # Node.js, Python
├── algorithms/             # LeetCode solutions grouped by problem number
└── resources/              # Curated learning links
```

Add new notes to the matching topic folder so the generated sidebar stays organized.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
