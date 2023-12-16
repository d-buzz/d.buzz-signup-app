# D.Buzz Account Creation Portal

This project is a web portal to help users create and manage accounts on D.Buzz, a decentralized social media platform built on top of the Hive blockchain.

![](https://d.buzz/images/d.buzz-icon-128.png)

[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://makeapullrequest.com)

## About This Project 👋

This repository contains all the frontend and backend code used to run [Join.D.Buzz](https://join.d.buzz), a simple DApp for onboarding new users to Hive from [DBuzz](https://D.Buzz).

## Key Features

- Create new Hive account
- Securely back up private keys
- Associate referral code
- Firebase backend integrations

## Tech Stack

**Frontend**
- React
- React Router
- TailwindCSS

**Backend**
- Firebase (Auth, Firestore, Functions, Analytics)
- Hive Blockchain JS

## Installation & Setup ⚙
- Clone the repository
```bash
> git clone https://github.com/d-buzz/d.buzz-signup-app.git
```
- Install dependencies for the client app
```bash
> cd join.d.buzz
> yarn install
```
- If you don't have Firebase CLI installed, please install it
```bash
> npm install -g firebase-tools
```
Login to your Firebase using your Google account
```bash
> firebase login
```

#### Client Setup ⚙

- Go to Firebase console -> Create new project

- Go to Firebase project -> Add a new Web app and then follow the instructions 

- Put in your config from your new Web app into ``/config/firebase.json`` file, just copy and paste the values.

- Put in your preferred whitelisted domains into ``/config/whitelist.json``.

- Put in your project ID into `.firebaserc`, you can find your project ID from the project settings.

- Then goto Firestore Database and initialize a new database, choose any region you prefer.

- Then goto -> Authentication -> Sign-in method -> Add new provider -> then enable Phone.

- Finally, put in required variables into a new file `.env`, copy the values from `.env.example`


#### Backend Setup ⚙

- Put in your preferred HIVE configurations into a new file ``/functions/config.json``, copy the values from ``/functions/config.example.json``

## Build & Deploy ⚙
- Build the app for production
```bash
> yarn build
```
- Deploy the client and backend to Firebase
```bash
> firebase deploy
```

## Run the app for development 🚀
```bash
> yarn start
```

## Dependencies (frontend) 🤖
- [@hiveio/hive-js](https://ghub.io/@hiveio/hive-js): Hive.js the JavaScript API for Hive blockchain
- [@testing-library/jest-dom](https://ghub.io/@testing-library/jest-dom): Custom jest matchers to test the state of the DOM
- [@testing-library/react](https://ghub.io/@testing-library/react): Simple and complete React DOM testing utilities that encourage good testing practices.
- [@testing-library/user-event](https://ghub.io/@testing-library/user-event): Simulate user events for react-testing-library
- [clsx](https://ghub.io/clsx): A tiny (229B) utility for constructing className strings conditionally.
- [firebase](https://ghub.io/firebase): Firebase JavaScript library for web and Node.js
- [formik](https://ghub.io/formik): Forms in React, without tears
- [lodash](https://ghub.io/lodash): Lodash modular utilities.
- [react](https://ghub.io/react): React is a JavaScript library for building user interfaces.
- [react-dom](https://ghub.io/react-dom): React package for working with the DOM.
- [react-router-dom](https://ghub.io/react-router-dom): DOM bindings for React Router
- [react-scripts](https://ghub.io/react-scripts): Configuration and scripts for Create React App.
- [reactfire](https://ghub.io/reactfire): Firebase library for React
- [yup](https://ghub.io/yup): Dead simple Object schema validation
- [party-js](https://party.js.org): A JavaScript library to brighten up your user's site experience with visual effects
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [react-device-detect](github.com/duskload/react-device-detect): Detect device, and render view according to the detected device type
- [file-saver](github.com/eligrey/FileSaver.js): An HTML5 saveAs() FileSaver implementation

## Dependencies (backend) 🤖

- [@hivechain/dhive](https://ghub.io/@hivechain/dhive): Hive blockchain RPC client library
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [firebase-admin](https://ghub.io/firebase-admin): Firebase admin SDK for Node.js
- [firebase-functions](https://ghub.io/firebase-functions): Firebase SDK for Cloud Functions
- [lodash](https://ghub.io/lodash): Lodash modular utilities.

## Credits 🎉
###### Backend code for Functions is forked from **[hiveonboard](https://github.com/christianfuerst/hiveonboard)** open source project managed by **[@christianfuerst](https://github.com/christianfuerst)**

----

## Contributions 🧪
You can [check opened issues](https://github.com/d-buzz/join.d.buzz/issues) and contribute to this project by creating a pull request

If you have questions or comments, please create an issue or message us on [chat.d.buzz](https://chat.d.buzz)
