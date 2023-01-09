# BHTMIM-W22-Sub Methods &amp; tools of modern software development - Submodule
[comment]: <> (description)
Git Submodule for Assignment for the course in the master's degree program in media informatics at the BHT Berlin  
(fall semester 2022)
Git Submodule for Assignment 6 

[comment]: <> (badges)
![MIT](https://img.shields.io/github/license/JayDeeDee/BHTMIM-W22-Sub??style=flat-square&logo=appveyor)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg??style=flat-square&logo=appveyor)](https://GitHub.com/JayDeeDee/BHTMIM-W22/graphs/commit-activity)

![WebStorm](https://img.shields.io/badge/webstorm-143??style=flat-square&logo=appveyor&logo=webstorm&logoColor=white&color=black)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg??style=flat-square&logo=appveyor&logo=javascript&logoColor=%23F7DF1E)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg??style=flat-square&logo=appveyor&logo=jquery&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg??style=flat-square&logo=appveyor&logo=github&logoColor=white)

[comment]: <> (content)

## Gulp Build

### How to run on localhost
First install dependencies:
```sh
npm install
```
You have two choices for running the development mode:
#### 1. DEV_auto (run browser-sync with watch task)
```sh
gulp DEV_auto
```
* clean build dir
* build CSS, JS and copies assets and static markup in build dir
* watch for changes in SCSS, JS und HTML files, but without automatic reload of browser, you have to do that manually
#### 2. use DEV_sync to run browser-sync with watch task and auto sync
```sh
gulp DEV_sync
```
* clean build dir
* build CSS, JS and copies assets and static markup in build dir
* watch for changes in SCSS, JS und HTML files and reload the browser with every change

Then go to http://localhost:8080 and develop your frontend

### How to create the production build
Create the production build with the command:
```sh
gulp PROD
```

### How to use individual tasks
There are several single task you can use for development and production build:

#### Tasks for development
* **devClean**: remove all files from development directory (default: _build_)
* **devCSS**: build CSS from SCSS source files with source maps, postCSS processes like auto prefixer and optimization with nano
* **devJS**: build JS from libs and modules with source maps 
* **devImg**: optimize images for web and copy them into the development directory
* **devCopyAssets**: copy other assets like web fonts, json or html to the development directory 
* **devWatch**: watch for changes in SCSS, JS, html and asset files to build these files anew
* **devServer**: watch for changes in SCSS, JS, html and asset files to build these files anew, run browser-sync without automatic page reload after changes
* **devServerWithAutoSync**: watch for changes in SCSS, JS, html and asset files to build these files anew, run browser-sync with automatic page reload after changes

#### Tasks for production 
* **prodClean**: remove all files from production directory (default: _[mandant name]/static_)
* **prodCSS**: build CSS from SCSS source files with postCSS processes like auto prefixer and optimization with nano
* **prodJS**: build JS from libs and modules, remove comments, minify and uglify source code
* **prodImg**: optimize images for web and copy them into the build directory
* **prodCopyAssets**: copy other assets like web fonts, json or html to the build directory

### How to configure the build
* you can use the .env to configure changes you need to make for different frontend clients, add more if necessary, all .env vars can be used in the Gulpfile via process.env
* most tasks have a config structure in the Gulpfile, they are used for all frontend clients

