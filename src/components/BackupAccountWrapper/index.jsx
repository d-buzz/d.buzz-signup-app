import { useEffect, useState } from "react"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { httpsCallable } from "firebase/functions"
import { logEvent } from "firebase/analytics"
import { useAuth, useFunctions, useAnalytics } from "reactfire"
import Button from "../Button"
import AlertIcon from '../../assets/alert-icon.svg'
import OTPVerificationWrapper from "../OTPVerificationWrapper"

const BackupAccountWrapper = (props) => {

	const {
		account,
		phone,
		setPhone,
		setCurrentPage,
		referrer,
		creator,
		ticket,
		debugMode,
		setError,
	} = props

	const auth = useAuth()
  const functions = useFunctions()
  const analytics = useAnalytics()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [keysDownloaded, setKeysDownloaded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [backupConfirmed, setBackupConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPhoneVerifier, setShowPhoneVerifier] = useState(false)
	// eslint-disable-next-line
  const [showKeychainDialog, setShowKeychainDialog] = useState(false)


  const [codeRequested, setCodeRequested] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)

	const [canRequestCodeAgain, setCanRequestCodeAgain] = useState(false)
	const [requestedCodeCount, setRequestedCodeCount] = useState(0)
	const [requestedCodeLimit, setRequestedCodeLimit] = useState(localStorage.getItem('requestCodeLimit'))
	const [accountCreated, setAccountCreated] = useState(false)

  const createAccount = httpsCallable(functions, "createAccount")

  const initializeRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "create-account",
      {
        size: "invisible",
        callback: function (response) {},
      },
      auth
    )

    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId
    })
  }

  useEffect(() => {
    initializeRecaptcha()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

	const accountString =
		`--------------- YOUR ACCOUNT -------------\n` +
		`Username: ${account.username}\n` +
		`Password: ${account.password}\n\n` +
		`------------------------ PRIVATE KEYS ----------------------\n` +
		`Owner:   ${account.privateKeys.owner}\n` +
		`Active:  ${account.privateKeys.active}\n` +
		`Posting: ${account.privateKeys.posting}\n` +
		`Memo:    ${account.privateKeys.memo}\n\n` +
		`-------------------------- KEY DESCRIPTION -----------------------\n` +
		`Owner:   Change Password, Change Keys, Recover Account\n` +
		`Active:  Transfer Funds, Power up/down, Voting Witnesses/Proposals\n` +
		`Posting: Post, Comment, Vote, Reblog, Follow, Profile\n` +
		`Memo:    Send/View encrypted messages on transfers\n\n` +
		`---------------------- WHERE TO USE YOUR KEYS --------------------\n` +
		`Hive Keychain and Hive Signer should allow you to do transactions\n` +
		`on all Hive sites and applications.\n\n` +
		`PeakD.com allows your own browser to store Posting key via\n` +
		`"PeakLock" login method (an alternative for mobile).\n\n` +
		`Be very careful directly using your keys on any other website or application.`

	useEffect(() => {
		if(copiedToClipboard && keysDownloaded) {
			setConfirmed(true)
		}
	}, [copiedToClipboard, keysDownloaded])

	const downloadBackupFile = () => {
		var blob = new Blob([accountString], { type: "text/plaincharset=utf-8" })

		// Convert blob to dataURL
		var reader = new FileReader()
		reader.readAsDataURL(blob)

		reader.onloadend = function() {
			var base64data = reader.result

			// Create an anchor element
			var a = document.createElement("a")
			a.href = base64data
			a.download = `DBUZZ-HIVE-ACOUNT-${account.username}-BACKUP.txt`

			// Append to body (necessary for Firefox)
			document.body.appendChild(a)

			// Trigger the download
			a.click()

			// Cleanup
			document.body.removeChild(a)

			setKeysDownloaded(true)
		}
	}
	
	const copyToClipboard = (text) => {
		var textField = document.createElement("textarea")
    textField.innerHTML = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand("copy")
    textField.remove()
		setCopiedToClipboard(true)
  }

	const handleCreateAccount = () => {
		if (confirmed) {
			if (debugMode) {
				if (
					window.hive_keychain &&
					window.hive_keychain.requestAddAccount
				) {
					setShowKeychainDialog(true)
					window.hive_keychain.requestAddAccount(
						account.username,
						{
							active: account.privateKeys.active,
							posting: account.privateKeys.posting,
							memo: account.privateKeys.memo,
						},
						function () {
							setAccountCreated(true)
							setCurrentPage('account-created')
						}
					)
				} else {

					setAccountCreated(true)
					setCurrentPage('account-created')
				}
			} else if (ticket && ticket !== "invalid") {
				setSubmitting(true)
				createAccount({
					username: account.username,
					publicKeys: account.publicKeys,
					referrer: referrer,
					creator: creator,
					ticket: ticket,
				}).then(function (result) {
					console.log(result)
					if (result.data.hasOwnProperty("error")) {
						logEvent(analytics, "create_account_error", {
							error: result.data.error,
						})
						setError(result.data.error)
						setSubmitting(false)
					} else {
						logEvent(analytics, "create_account_success")

						if (
							window.hive_keychain &&
							window.hive_keychain.requestAddAccount
						) {
							setShowKeychainDialog(true)
							window.hive_keychain.requestAddAccount(
								account.username,
								{
									active: account.privateKeys.active,
									posting: account.privateKeys.posting,
									memo: account.privateKeys.memo,
								},
								function () {
									setAccountCreated(true)
									setCurrentPage('account-created')
								}
							)
						} else {
							setAccountCreated(true)
							setCurrentPage('account-created')
						}
					}
				})
				.catch((err) => {
					console.log(err.message)
				})
			} else {
				setShowPhoneVerifier(true)
			}
		}
	}

	const reset = () => {
		setSubmitting(false)
		setCodeRequested(false)
		setConfirmationResult(null)
		setRequestedCodeCount(0)
	}
	
	const handleRequestCode = () => {
		setError(null)
		setSubmitting(true)
		let appVerifier = window.recaptchaVerifier

		console.log(appVerifier)
		
		signInWithPhoneNumber(auth, "+" + phone, appVerifier)
		.then(function (result) {
			// SMS sent. Prompt user to type the code from the message, then sign the
			// user in with confirmationResult.confirm(code).
			setRequestedCodeCount(requestedCodeCount+1)
			setCodeRequested(true)
			setConfirmationResult(result)
			setSubmitting(false)
		})
			.catch(function (error) {
				reset()
				setError(error.message)
			})
	}


	const handleVerifyOpt = (otpCode) => {
		setError(null)
		setSubmitting(true)
		confirmationResult
			.confirm(otpCode)
			.then(function () {
				createAccount({
					username: account.username,
					publicKeys: account.publicKeys,
					referrer: referrer,
					creator: creator,
				}).then(function (result) {
					if (result.data.hasOwnProperty("error")) {
						logEvent(analytics, "create_account_error", {
							error: result.data.error,
						})
						setError(result.data.error)
						setCurrentPage('error-occurred')
						reset()
					} else {
						logEvent(analytics, "create_account_success")
						if (
							window.hive_keychain &&
							window.hive_keychain.requestAddAccount
						) {
							setShowKeychainDialog(true)
							window.hive_keychain.requestAddAccount(
								account.username,
								{
									active: account.privateKeys.active,
									posting: account.privateKeys.posting,
									memo: account.privateKeys.memo,
								},
								 () => {
									setAccountCreated(true)
									setCurrentPage('account-created')
									reset()
								}
							)
						} else {
							setAccountCreated(true)
							setCurrentPage('account-created')
							reset()
						}
					}
				})
				.catch((err) => {
					setError(err.message)
					setCurrentPage('error-occurred')
					reset()
				})
			})
			.catch(function (error) {
				setError(error.message)
				setCurrentPage('error-occurred')
				reset()
			})
	}

	return (
		<div className="pb-12 min-h-full flex flex-col justify-center items-center backup-account-page"> 
			{!showPhoneVerifier
				?
				<div className="flex flex-col justify-center items-center">
					<div className="flex flex-col justify-center">
						<span className="text-2xl font-medium">ALMOST THERE!</span>
						<div className="flex flex-col text-sm md:text-md lg:text-md">
							<span>Please backup your account info, so don't lose it.</span>
							<span>After you save this info your account will be created.</span>
						</div>
						<div className="rounded-lg mt-8 p-4 flex flex-col bg-white shadow-lg border-[1px] border-slate-200 text-[12px] md:text-[14px] lg:text-[14px] font-mono">
							<span className="flex gap-2 font-bold">
								<span>Username:</span>
								<span>{account.username}</span>
							</span>

							<span className="flex gap-2 font-bold">
								<span>Password:</span>
								<span>{account.password}</span>
							</span>

							<span className="mt-8 flex flex-col gap-2 font-medium text-[9px]">
								<span>------------------------ PRIVATE KEYS ----------------------</span>
								<span className="flex gap-2 font-bold">
									<span>Owner:</span>
									<span>{account.privateKeys.owner}</span>
								</span>
								<span className="flex gap-2 font-bold">
									<span>Active:</span>
									<span>{account.privateKeys.active}</span>
								</span>
								<span className="flex gap-2 font-bold">
									<span>Posting:</span>
									<span>{account.privateKeys.posting}</span>
								</span>
								<span className="flex gap-2 font-bold">
									<span>Memo:</span>
									<span>{account.privateKeys.memo}</span>
								</span>
							</span>
						</div>
					</div>
					<div className="mt-6 flex flex-col md:flex-row lg:flex-row justify-center items-center">
						<Button variant='fill' onClick={() => copyToClipboard(accountString)} disabled={confirmed || copiedToClipboard}>COPY TO CLIPBOARD</Button>
						<span className="pt-2 pb-2 pl-2 pr-2" />
						<Button variant='fill' onClick={downloadBackupFile} disabled={confirmed || keysDownloaded}>DOWNLOAD BACKUP</Button>
					</div>
					{confirmed
						&&
						<>
							<span className="rounded-full mt-8 p-2 pl-4 pr-4 text-[16px] text-[#e61c34] bg-[#ffd4d9] font-medium">Keys downloaded and copied to clipboard. 🔐</span>
							<span className="rounded-full mt-8 p-2 pl-4 pr-4 text-[16px] text-[#e61c34] bg-[#ffd4d9] font-medium">Please consider taking a screenshot of the keys as well. 🔐</span>
						</>
					}
					{copiedToClipboard && !keysDownloaded
						&&
						<span className="rounded-full mt-8 p-2 pl-4 pr-4 text-[16px] text-[#e61c34] bg-[#ffd4d9] font-medium">Keys copied to clipboard, please download the backup as well. 🔐</span>
					}
					{keysDownloaded && !copiedToClipboard
						&&
						<span className="rounded-full mt-8 p-2 pl-4 pr-4 text-[16px] text-[#e61c34] bg-[#ffd4d9] font-medium">Keys downloaded, please copy to clipboard as well. 🔐</span>
					}
					<div className='rounded-md flex mt-12 p-6 bg-[#FFF4E5] w-[90%] md:w-[600px] lg:w-[800px]'>
						<img src={AlertIcon} alt="alert icon" className="h-[20px] mt-[2px]" />
						<div className="pl-4 flex flex-col text-[#663C00]">
							<span className="font-bold">WHY DO I HAVE TO SAVE THIS INFO?</span>
							<span className="mt-2 text-[0.875rem]">
							- Because no one can recover your account if you don't have this info. <br />
							- If you loose these keys you will loose your account and any currency in the account. <br />
							- These keys are how you will be able to sign in and use sites.
							</span>
							<span className="mt-4 text-[0.875rem] font-bold">SIGNING IN</span>
							<span className="mt-2 text-[0.875rem]">
								After this you are likely going to sign into a website using a login software <br />
								- The POSTING KEY can be used for login software like PeakLock and the Hive Keychain browser extension <br />
								- The ACTIVE KEY will help you login using HiveSigner software
							</span>
							<span className="mt-6 text-[0.875rem]">
								You can change your password later, but for now you have to keep it safe. We don't offer account recovery yet, so be aware of the fact if you lose your password, your account cannot be recovered.
							</span>
						</div>
					</div>
					<label className="flex items-start justify-start gap-2 mt-6 w-[85%] md:w-[570px] lg:w-[760px] checkbox-container" style={{ cursor: !confirmed ? 'not-allowed' : 'pointer' }}>
						<input type="checkbox" id="keys" checked={backupConfirmed} onChange={() => setBackupConfirmed(true)} disabled={!confirmed}/>
						<span className="checkmark" style={{ opacity: !confirmed ? '50%' : '100%', cursor: !confirmed ? 'not-allowed' : 'pointer' }}/>
						<div htmlFor="keys" className="ml-4 text-[16px] md:text-[22px] lg:text-[22px]" style={{ cursor: !confirmed ? 'not-allowed' : 'pointer' }}>I (the soon to be owner of @{account.username}) declare that I understand the requirement of safely securing these private keys. I understand that neither DBUZZ nor any other entity on this planet is capable of restoring or changing these keys if lost. Meaning I really did save these keys in a safe location that I will be able to find later.</div>
					</label>
				</div>
				:
				<OTPVerificationWrapper
					phone={phone}
					setPhone={setPhone}
					handleRequestCode={handleRequestCode}
					setShowPhoneVerifier={setShowPhoneVerifier}
					codeRequested={codeRequested}
					submitting={submitting}
					canRequestCodeAgain={canRequestCodeAgain}
					setCanRequestCodeAgain={setCanRequestCodeAgain}
					requestedCodeCount={requestedCodeCount}
					setRequestedCodeCount={setRequestedCodeCount}
					requestedCodeLimit={requestedCodeLimit}
					setRequestedCodeLimit={setRequestedCodeLimit}
					confirmationResult={confirmationResult}
					setConfirmationResult={setConfirmationResult}
					accountCreated={accountCreated}
					handleVerifyOpt={handleVerifyOpt}
				/>
			}
			<Button
				id='create-account'
				className="mt-[25px]"
				variant='fill'
				onClick={handleCreateAccount}
				style={{
					visibility: showPhoneVerifier ? 'hidden' : 'visible',
					opacity: !backupConfirmed ? '50%' : '100%',
					background: !backupConfirmed ? '#e61c34' : '#e61c34',
					borderColor: !backupConfirmed ? '#e61c34' : '#e61c34',
					cursor: !backupConfirmed ? 'not-allowed' : 'pointer'
				}}
				disabled={!backupConfirmed ? true : false}
			>
				CREATE ACCOUNT
			</Button>
		</div>
	)
}

export default BackupAccountWrapper