0.4.3 / 2020-01-08
==================
* [FEATURE] Moved the client-side component to its own package, see the README for more.
* [FEATURE] Messages now require a message object instead of type and content.
* [FEATURE] Changed the `player-joined` event to `player-connected`.
* [FEATURE] Changed the `player-left` event to `player-disconnected`.
* [FEATURE] Converted the project to typescript.
* [FEATURE] Changed the `players` property of the players module to be `connected`.
* [FEATURE] Changed the `rooms` property of the rooms module to `created`.
* [MISC] Removed unnecessary dependencies and moved express to a be a dev dependency which it should have been all along.
* [MISC] Updated README to reflect breaking changes.

0.4.3 / 2020-01-08
==================
* [MISC] Made private methods that weren't really private public.
* [MISC] Updated dependencies to their latest versions.

0.4.2 / 2020-01-05
==================
* [MISC] Slightly cleaned up docs in preparation for new functionality.

0.4.1 / 2020-01-05
==================
* [HOTFIX] Added main property to package.json.
* [MISC] Updated license year to reflect new year.
* [MISC] Removed extra spacing.
* [MISC] Removed debugging statements.
* [MISC] Updated dependencies to their latest versions.

0.4.0 / 2019-12-24
==================
* [MISC] Updated tests to clear database file before each one.
* [MISC] Added more test cases.
* [MISC] Moved all tests to tests folder.
* [HOTFIX] Changed the client to use window.location.host instead of localhost.
* [HOTFIX] Made secure flag change connection string to wss.

0.3.0 / 2019-12-24
==================
* [FEATURE] Changed class properties to be strict and added the necessary setters/getters to be more strict.
* [MISC] Updated JSdoc comments.
* [MISC] Added badges to README and updated getters/setters documentation.
* [MISC] Updated dependencies to their latest versions.

0.1.0 / 2019-10-16
==================
* Initial release