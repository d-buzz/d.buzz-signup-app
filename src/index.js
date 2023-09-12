import React, { Suspense } from "react"
import ReactDOM from 'react-dom/client'
import './override.css'
import App from './App'
import { BrowserRouter } from "react-router-dom"

import { FirebaseAppProvider } from "reactfire"

import fbConfig from "./config/firebase.json"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  ...fbConfig,
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Suspense fallback={<span>LOADING...</span>}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FirebaseAppProvider>
    </Suspense>
  </React.StrictMode>
)