# Overview
This app keeps track of your omnipod changes and notifies you when your stash is running low. The app connects directly to your Nightscout database once a day to search for pod-changes and loggs them in a separate table.

This app consists of 3 parts: 
1. Api-backend that handles conection to the database
2. A single page app (frontend) that lets the user alter current nr of pods
    - calls the api-backend to access the NS-db
3. A Heroku scheduled task that polls the NS-db for pod-changes and updates the count of used pods. 

For now this app does not require a sign in because it only allows the client to update the app-specific table keeping track of the number of pods left in the NS database. Not much fun for a hacker since the only thing you can do with this app is to update your counter of pods so that in worst case scenario you'd gett a notification telling you that you're out of pods even if you're not.  

# debug in visual studio code
## To debug the server/index.js with breakpoints
(breakpoints will not work in the frontend-app!)
1. build the react frontend first with: 
    - `cd frontend`
    - `npm run build` 
2. run use the configuration "Launch backend" (.vscode/launch.json) with f5 (see bellow) no need to manually run "npm start" first!
```
"configurations": [
    {
        "type": "node",
        "request": "launch",
        "name": "Launch backend",
        "skipFiles": ["<node_internals>/**"],
        "program": "${workspaceFolder}/server/index.js",
    },
    {
        "type": "node",
        "request": "attach",
        "name": "Attach to backend",
        "port": 5000
    },
]
```
## to debug the /frontend-react app 
open the /frontend-folder in different vscode and run its debug config separately!
1. start the app with `npm start` in terminal and close the browser that opens
2. run the "Launch Chrome debug"-config in the frontend/.vscode/launch.json with f5:
```
"configurations": [
    {
        "type": "pwa-chrome",
        "request": "launch",
        "name": "Launch Chrome debug",
        "url": "http://localhost:3000",
        "webRoot": "${workspaceFolder}"
    }
]
```
# run scheduled task in Heroku
- task needs to be placed under /bin/-folder and without file-ending
- task is a node file and has a start-line of `#! /app/.heroku/node/bin/node` and ´process.exit();´ to close the runner when finnished. 
- When deployed to heroku, test by "More"-button/"Run Console" and run the filename in the "heroku run"-box.'
- test script by creating copy with file-ending .js and remove the first line, and test with `node testfile.js`

# Heroku env
Env-variables specified in heroku is accessed with `process.env.ENVNAME`









# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
