import './override.css'
import { useEffect, useState } from "react"
import Header from "./components/Header"
import SignUpWrapper from "./components/SignUpWrapper"
import hive from "@hiveio/hive-js"
import _ from "lodash";
import { useLocation } from 'react-router-dom'
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"
import { getAnalytics } from "firebase/analytics"
import {
  FirestoreProvider,
  AuthProvider,
  FunctionsProvider,
  AnalyticsProvider,
  useFirebaseApp,
} from "reactfire"
import BackupAccountWrapper from './components/BackupAccountWrapper'
import AccountCreatedWrapper from './components/AccountCreatedWrapper'
import ErrorOccurredWrapper from './components/ErrorOccurredWrapper'

function App() {

  const app = useFirebaseApp()
  const authProvider = getAuth(app)
  const firestoreProvider = getFirestore(app)
  const functionsProvider = getFunctions(app)
  const analyticsProvider = getAnalytics(app)
	const location = useLocation()

	const [account, setAccount] = useState({ username: "" })
  const [referrerAccount, setReferrerAccount] = useState(null)
  const [referrer, setReferrer] = useState(null)
  const [currentPage, setCurrentPage] = useState('create-account')
  const [suspended, setSuspended] = useState(false)
  const [phone, setPhone] = useState('')
  const [debugMode, setDebugMode] = useState(false)
  const [error, setError] = useState('')

  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const referrer = location.pathname.split('@')[1] || 'dbuzz'

    hive.api.getAccounts([referrer], function (err, result) {
      if (result) {
        if (result.length === 1) {
          setReferrer(referrer)
          setReferrerAccount(result[0])
        }
      }
    })

    if (!_.isNil(query.get("debug_mode"))) {
      setDebugMode(query.get("debug_mode"));
    }
    // eslint-disable-next-line
  }, [location.pathname])

  const getActivePage = () => {
    switch(currentPage) {
      case 'create-account':
        return (
          <SignUpWrapper
            referrer={referrer}
            referrerAccount={referrerAccount}
            suspended={suspended}
            setSuspended={setSuspended}
            setCurrentPage={setCurrentPage}
            appLoading={appLoading}
            setAppLoading={setAppLoading}
            account={account}
            setAccount={setAccount}
            phone={phone}
            setPhone={setPhone}
            setError={setError}
          />
        )
      case 'backup-account':
        return (
          <BackupAccountWrapper
            referrer={referrer}
            setCurrentPage={setCurrentPage}
            setAppLoading={setAppLoading}
            account={account}
            setAccount={setAccount}
            phone={phone}
            setPhone={setPhone}
            debugMode={debugMode}
            setError={setError}
          />
        )
      case 'account-created':
        return (
          <AccountCreatedWrapper
            account={account}
          />
        )
      case 'error-occurred':
        return (
          <ErrorOccurredWrapper
            error={error}
          />
        )
      default:
        return null;
    }
  }

  return (
    <div className="app max-h-screen w-full bg-white">
      <FirestoreProvider sdk={firestoreProvider}>
        <AuthProvider sdk={authProvider}>
          <FunctionsProvider sdk={functionsProvider}>
            <AnalyticsProvider sdk={analyticsProvider}>
              <Header />
              {getActivePage()}
            </AnalyticsProvider>
          </FunctionsProvider>
        </AuthProvider>
      </FirestoreProvider>
    </div>
  )
}

export default App
