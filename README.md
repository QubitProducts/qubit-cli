[![Codeship Status for qubitdigital/qubit-cli](https://app.codeship.com/projects/638fd7f0-7353-0134-988c-52e76941e580/status?branch=master)](https://app.codeship.com/projects/178849)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# ![logo](https://user-images.githubusercontent.com/640611/32888373-fbdc7134-cabe-11e7-9b0e-027a49cef8bf.png)

## Qubit-CLI

A client to facilitate local development of experiences for the qubit platform

## Features

_Develop experiences locally using your preferred development environment:_

- use your local editor/IDE of choice to write experience code
- use your own workflow and versioning tools
- write and run local unit tests

_Iterate quickly using the built in live previewing and hot reloading server:_

- built in experience server for instant preview on any website
- live hot reloading

_Automate your workflow by interacting with the platform from the command line:_

- create new experiences or clone existing ones
- push remote changes to the platform
- pull remote changes from the platform
- revert or diff with previous iterations of the experience
- publish | pause | resume your experience
- CI integration

## Installation

`npm install --location=global qubit-cli`

## Windows

Please ensure you have a recent version of `openssl` installed (e.g. 1.1.1)

You can find and install `openssl` using the `cygwin` installer or from https://slproweb.com/products/Win32OpenSSL.htmls

Please also ensure that the `openssl` executable is available on the system path

## Setup

Run `qubit extension` and then drag the chrome-extension folder into your chrome extensions pane

## Docs

See https://docs.qubit.com/content/developers/cli-overview
