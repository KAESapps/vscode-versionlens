# Version Lens - VsCode Extension

![Development Phase](http://img.shields.io/phase/alpha.png?color=yellowgreen)

[![Build Status](https://img.shields.io/travis/pflannery/vscode-versionlens/master.svg)](http://travis-ci.org/pflannery/vscode-versionlens "Check this project's build status on TravisCI")

Compares a single or ranged version against each package and displays the latest version if not satisfied; otherwise provides a satisfied indication.

**Note:** Replaces the version text but does not automatically install packages when clicking a code lens link. 

Currently supports

- bower http://bower.io/
- dub https://code.dlang.org, and
- npm https://www.npmjs.com/

### Preview

![Screenshot](images/animated-preview.gif)

## Install

[How to install vscode extentions](https://code.visualstudio.com/docs/editor/extension-gallery)

### Available Workspace\\User Settings

Property|Type|Default|Description
--------|----|-------|-----------
versionlens.versionPrefix|string||Inserts this prefix before the version <br>when clicking on the code lens link.

### Contributors

These are the people that have contributed code to this project:

- [pflannery](https://github.com/pflannery) — [view contributions](https://github.com/pflannery/vscode-versionlens/commits?author=pflannery)
- [WebFreak001](https://github.com/WebFreak001) — [view contributions](https://github.com/pflannery/vscode-versionlens/commits?author=WebFreak001)

### License

Licensed under MIT

Copyright &copy; 2016+ pflannery (https://github.com/pflannery)
