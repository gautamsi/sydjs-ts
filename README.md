sydjs.com
=========

    
=========

## TypeScript conversion based on Microsft's [TypeScript Node Starter](https://github.com/Microsoft/TypeScript-Node-Starter.git) repo

KeyStone typings taken from [@webteckie/keystonejs-ts](https://github.com/webteckie/keystonejs-ts/) and modified to work with latest code in SydJs Site.

### Getting started

see dedicated section [TypeScript Getting Started](#TypeScript-Getting-Started)

=========
## The SydJS Website.

Initially built in two and a half days by the team at [Thinkmill](http://www.thinkmill.com.au) as a demo of what [KeystoneJS](http://keystonejs.com) can do, it's now a showcase for the Sydney Javascript community.

## Get Involved!

Please use the GitHub Issues to log any ideas you have to improve the site, or problems you may come across.

Or if you're feeling more adventurous, go pick an issue and submit a pull request.

Feel free to ask questions about how it works, if you're getting into the code.

If you are part of another meetup group and want to use our site as a basis for your own, that's great, we'd love to hear about it.

### Coding Guidelines

If you're contributing code, please do your best to follow the conventions established in the codebase already. This makes pull requests much easier to review and merge.

We have generally followed the guidelines set out in [AirBnB's Javascript Style Guide](https://github.com/airbnb/javascript), with the exception of using real tabs for indentation.


## Getting Started

To run the SydJS site locally, there are a few things to set up.

Because we have some private keys for our MongoDB, Cloudinary and Mandrill accounts, you'll need to set up your own equivalents before the site will run properly.

_If you're looking to work on the SydJS site and want access to our accounts, please get in touch_

### Install Node.js and MongoDB

You'll need node 4.8.x and npm 2.15.x installed to run SydJS. The easiest way is to download the installers from [nodejs.org](http://nodejs.org).

You'll also need MongoDB 2.4.x - if you're on a Mac, the easiest way is to install [homebrew](http://brew.sh) and then run `brew install mongo`.

If you're on a Mac you'll also need Xcode and the Command Line Tools installed or the build process won't work.

### Setting up your copy of SydJS

Get a local copy of the site by cloning this repository, or fork it to work on your own copy.

Then run `npm install` to download the dependencies.

Before you continue, create a file called `.env` in the root folder of the project (this will be ignored by git). This file is used to emulate the environment config of our production server, in development. Any `key=value` settings you put in there (one on each line) will be set as environment variables in `process.env`.

The only line you **need** to add to your `.env` file is a valid `CLOUDINARY_URL`. To get one of these, sign up for a free account at [Cloudinary](http://cloudinary.com) and paste the environment variable if gives you into your `.env` file. It should look something like this:

	CLOUDINARY_URL=cloudinary://12345:abcde@cloudname

### Running SydJS

Once you've set up your configuration, run `node keystone` to start the server.

By default, [Keystone](http://keystonejs.com) will connect to a new local MongoDB database on your localhost called `sydjs`, and create a new Admin user that you can use to log in with using the email address `user@keystonejs.com` and the password `admin`.

If you want to run against a different server or database, add a line to your `.env` file to set the `MONGO_URI` environment variable, and restart the site.

When it's all up and running, you should see the message `SydJS is ready on port 3000` and you'll be able to browse the site on [localhost:3000](http://localhost:3000).

### Facebook login
Add `FACEBOOK_API=X.x` in your .env file.
For Facebook API >= 2.4 you must specify the fields you want to get in user profile.

### Here be ~~dragons~~ errors

#### or, how you don't have any content yet

The first time you run the site, the homepage will warn you that it expects there to be at least one meetup, and your database won't have any. Don't freak out, just go to [/keystone](http://localhost:3000/keystone), sign in as the admin user, and create one.

You'll probably want to add some other content too (blog post, members, etc) to get all the pages looking right.

... happy hacking!



___
# TypeScript Getting Started


# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started
- Clone the repository
```
git clone --depth=1 https://github.com/Microsoft/TypeScript-Node-Starter.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Start your mongoDB server (you'll probably want another command prompt)
```
mongod
```
- Build and run the project
```
npm start
```
Navigate to `http://localhost:3000`


## Project Structure

the project is served from `dist` folder  

TypeScript (`.ts`) files live in `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.
The `templates` folders remains top level as expected. 


### Running the build

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build before starting all watch tasks. Can be invoked with `npm start`                  |
| `build`                   | Full build. Runs ALL build tasks (`build-sass`, `build-ts`, `tslint`, `copy-static-assets`)       |
| `serve`                   | Runs node on `dist/server.js` which is the apps entry point                                       |
| `watch`                   | Runs all watch tasks (TypeScript, Sass, Node). Use this if you're not touching static assets.     |
| `test`                    | Runs tests using Jest test runner                                                                 |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed                |
| `build-sass`              | Compiles all `.scss` files to `.css` files                                                        |
| `watch-sass`              | Same as `build-sass` but continuously watches `.scss` files and re-compiles when needed             |
| `tslint`                  | Runs TSLint on project files                                                                      |
| `copy-static-assets`      | Calls script that copies JS libs, fonts, and images to dist directory                             |


#### Setting up TypeScript to look for `.d.ts` files in another folder
The compiler knows to look in `node_modules/@types` by default, but to help the compiler find our own `.d.ts` files we have to configure path mapping in our `tsconfig.json`.
Path mapping can get pretty confusing, but the basic idea is that the TypeScript compiler will look in specific places, in a specific order when resolving modules, and we have the ability to tell the compiler exactly how to do it.
In the `tsconfig.json` for this project you'll see the following:
```json
"baseUrl": ".",
"paths": {
    "*": [
        "src/types/*"
    ]
}
```
This tells the TypeScript compiler that in addition to looking in `node_modules/@types` for every import (`*`) also look in our own `.d.ts` file location `<baseUrl>` + `src/types/*`.
So when we write something like: 
```ts
import * as lusca from "lusca";
```
First the compiler will look for a `d.ts` file in `node_modules/@types` and then when it doesn't find one look in `src/types` and find our file `lusca.d.ts`.


## Debugging
Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps
Source maps allow you to drop break points in your TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime. 

> **Note!** - Source maps aren't specific to TypeScript.
Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps
First you need to make sure your `tsconfig.json` has source map generation enabled:
```json
"compilerOptions" {
    "sourceMaps": true
} 
```
With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
Because we are writing Node.js code, we don't have to worry about this. 

### Using the debugger in VS Code
Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to setup and even easier to use. 
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.
In this file, you can tell VS Code exactly what you want to do:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Debug",
    "program": "${workspaceRoot}/dist/keystone.js",
    "smartStep": true,
    "outFiles": [
        "../dist/**/*.js"
    ],
    "protocol": "inspector"
}
```

With this file in place, you can hit `F5` to serve the project with the debugger already attached.
Now just set your breakpoints and go!

> Warning! Make sure you don't have the project already running from another command line. 
VS Code will try to launch on the same port and error out.
Likewise be sure to stop the debugger before returning to your normal `npm start` process.

#### Using attach debug configuration
VS Code debuggers also support attaching to an already running program. The `Attach` configuration has already configured, everything you need to do is change `Debug Configuration` to `Attach` and hit `F5`.

> Tips! Instead of running `npm start`, using `npm run debug` and `Attach Configuration` that make you don't need to stop running project to debug.

## Testing
Tests are not part of original SydJs site, it is removed. you can look for how to do testing nodejs with typescript in original TypeScript Node Starter repo

## TSLint
TSLint is a code linter which mainly helps catch minor code quality and style issues.
TSLint is very similar to ESLint or JSLint but is built with TypeScript in mind.

### TSLint rules
Like most linters, TSLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `tslint.json`.
In this project, we are using a fairly basic set of rules with no additional custom rules.
The settings are largely based off the TSLint settings that we use to develop TypeScript itself.

### Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```
Notice that TSLint is not a part of the main watch task.
It can be annoying for TSLint to clutter the output window while in the middle of writing a function, so I elected to only run it only during the full build.
If you are interesting in seeing TSLint feedback as soon as possible, I strongly recommend the [TSLint extension in VS Code]().

# Hackathon Starter Project
A majority of this quick start's content was inspired or adapted from Sahat's excellent [Hackathon Starter project](https://github.com/sahat/hackathon-starter).