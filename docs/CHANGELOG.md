# Change Log

## [1.17.0] 2017-03-23
- ability to specify traffic split when creating an experience

## [1.16.0] 2017-03-22
- better logging if user tries to --watch in a folder with no variation

## [1.15.2] 2017-03-21
- use dark magic to ensure module loading works even if smartserve overwrites `window.__qubit.amd` during execution

## [1.15.0] 2017-03-20
- added change log
- added FYI.md
- added ability to control what other experiences execute with the 'also' package.json param (see FYI.md)
- by default no other experiences will execute
- on push package.json gets updated without asking (necessary for git hook workflow)

## [1.14.0] 2017-03-15
- added ability to create new variations (xp duplicate)
- xp no longer wants to remove .git folder on pull

## [1.13.0] 2017-03-05
- realtime hot and live reloading of package.json on change
- support for yarn
- `xp open` now supports options: --settings --overview --editor, opens settings, overview and editor pages
- `xp link` now supports options: --settings --overview --editor --preview, gives links to settings, overview, editor and preview pages
- `xp link` now copies to clipboard
- `xp push` now tells you if there are changes in the platform, use xp push --force to force push
- fixed remember-preview behaviour
- moved to webpack 2.0, for faster compile times, better performance
- improved hot reloading behaviour, styles get removed if experience does not activate

## [1.12.0] 2017-03-02
- achieved api parity with platform by adding getVisitorState, getBrowserState, drifwood logger and other api things to options

## [1.11.0] 2017-03-01
- added getVisitorState, and ability to override visitor attributes returned by getVisitorState via pkg.meta.visitor

## [1.10.0] 2017-03-01
- fixed diff command
- fixed error where no package.meta.variations object exists
- improved readme with tutorials

## [1.9.0] 2017-03-01
- added `xp clone`
- `xp create` now creates a directory for you

## [1.8.0] 2017-02-30
- added update notifications

## [1.7.0] 2017-02-30
- improved analytics

## [1.6.0] 2017-02-30
- added diff command

## [1.5.0] 2017-02-30
- default execution, css and triggers same as platform

## [1.4.0] 2017-02-24
- published module to @qubit
- added cleanup of extraneous files on pull (e.g. deleted variations)
- improved tests
- fixed bug causing authentication to fail and not retry after token expiry
- templates: support installing and consuming multi template repos
- ask for experience name on create

## [1.3.0] 2017-02-08
- added mini tutorials to xp --help
- templatize, command to turn any experience into a template
