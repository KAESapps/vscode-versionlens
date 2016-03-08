# Version Lens - VsCode Extension

![Development Phase](http://img.shields.io/phase/alpha.png?color=yellowgreen)

[![Build Status](https://img.shields.io/travis/pflannery/vscode-versionlens/master.svg)](http://travis-ci.org/pflannery/vscode-versionlens "Check this project's build status on TravisCI")
[![Dependency Status](https://img.shields.io/david/pflannery/vscode-versionlens.svg)](https://david-dm.org/pflannery/vscode-versionlens)
[![Dev Dependency Status](https://img.shields.io/david/dev/pflannery/vscode-versionlens.svg)](https://david-dm.org/pflannery/vscode-versionlens#info=devDependencies)<br/>

Shows the latest version for an npm or bower package using the code lens interface. 

**Note:** Replaces the version text but does not automatically install packages when clicking a code lens link.

## Install

[How to install vscode extentions](https://code.visualstudio.com/docs/editor/extension-gallery)

### Available Workspace\\User Settings

```yaml
  versionlens.versionPrefix:
    type: string
    default: ''
    description: >
      Applies the provided prefix before with the latest version when clicking on the code lens link.

  versionlens.satisfyOnly:
    type: boolean
    default: false
    description: >
      When set to true will check if the latest version is within the range specified by the local version 
      and displays 'satisfied' if local version is in range.
```

### Preview

- default settings

![Screenshot](images/animated-preview.gif)

- when versionlens.satisfyOnly = true

![Screenshot](images/animated-preview-2.gif)

### Contributors

These are the people that have contributed code to this project:

- [pflannery](https://github.com/pflannery) — [view contributions](https://github.com/pflannery/vscode-versionlens/commits?author=pflannery)

### License

Licensed under MIT

Copyright &copy; 2016+ pflannery (https://github.com/pflannery)
