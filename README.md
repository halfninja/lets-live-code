# Fun game

We played around with Live Share for VS Code and made this nonsense.

This is a Javascript project using the Phaser framework. The aim was to have something that didn't require compilation but worked with Intellisense autocompletion, so it's using browser native ES6 modules, loading Phaser from a CDN, with a Typescript declaration to get it to understand the type of the global `Phaser` object and hence everything else.

## Running

You can run by serving the `src` directory using whatever HTTP server you like but `npm start` will run a _LiveReload_-enabled server that will reload automatically on changes.