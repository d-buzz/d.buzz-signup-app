import { useEffect, useState } from 'react'
import DbuzzIcon from '../../assets/dbuzz-icon.svg'
import HiveIcon from '../../assets/hive-icon.svg'
import { httpsCallable } from "firebase/functions"
import { logEvent } from "firebase/analytics"
import { useAnalytics, useFunctions } from "reactfire"
import Button from '../Button'
import InputField from '../InputField'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useFormik } from "formik"
import * as Yup from "yup"
import hive from "@hiveio/hive-js"
import _ from "lodash"
import Form from '../Form'

import { doc } from "firebase/firestore"
import { useFirestore, useFirestoreDocDataOnce } from "reactfire"

import { ticketThreshold, rateLimitInSeconds } from "../../config"
import { useLocation } from 'react-router-dom'
import PageLoading from '../PageLoading'
import { isIOS, isSafari } from 'react-device-detect'

import axios from 'axios'
import ReferrerWrapper from '../ReferrerWrapper'

const SignUpWrapper = (props) => {

	const {
		referrerAccount,
		// eslint-disable-next-line
		setReferrerAccount,
		referrer,
		// eslint-disable-next-line
		setReferrer,
		account,
		phone,
		setPhone,
		setAccount,
		suspended,
		setSuspended,
		setCurrentPage,
		appLoading,
		setAppLoading,
		setError,
	} = props

	const analytics = useAnalytics()
  const functions = useFunctions()
	const location = useLocation()
  const firestore = useFirestore()

  const checkReputation = httpsCallable(functions, "checkReputation")
	
	const [accountTickets, setAccountTickets] = useState(null)
	// eslint-disable-next-line
  const [referrerProfile, setReferrerProfile] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [ticket, setTicket] = useState(null)
	const [generatingAccount, setGeneratingAccount] = useState(false)
	// eslint-disable-next-line
  const [showUnsupportedBrowserAlert, setShowUnsupportedBrowserAlert] = useState(false)
	const [typingUsername, setTypingUsername] = useState(false)
	const [checkingUsernameAvailability, setCheckingUsernameAvailability] = useState(false)
	const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
	const [isUsernameValid, setIsUsernameValid] = useState(false)

	const [helperTextColor, setHelperTextColor] = useState('#969494')

	const publicData = useFirestoreDocDataOnce(
		 doc(firestore, "public", "data")
	 ).data

	const accountsCreatedToday = publicData?.accountsCreatedToday

	useEffect(() => {
    if (isIOS && !isSafari) {
      setShowUnsupportedBrowserAlert(true)
    }
  }, [])

  useEffect(() => {
    if (referrerAccount) {
      let referrerProfileCandidate = {}

      try {
        const profileJSON = JSON.parse(
          referrerAccount.posting_json_metadata
        ).profile

        referrerProfileCandidate.account = referrer

        if (profileJSON.hasOwnProperty("name")) {
          referrerProfileCandidate.name = profileJSON.name
        }

        if (profileJSON.hasOwnProperty("profile_image")) {
          referrerProfileCandidate.profile_image = profileJSON.profile_image
        }

        if (profileJSON.hasOwnProperty("about")) {
          referrerProfileCandidate.about = profileJSON.about
        }

        setReferrerProfile(referrerProfileCandidate)
      } catch (error) {
        referrerProfileCandidate.account = referrer
        referrerProfileCandidate.name = referrerAccount.name
        referrerProfileCandidate.profile_image = ""
        referrerProfileCandidate.about = ""

        setReferrerProfile(referrerProfileCandidate)
      }
    }
  }, [referrerAccount, referrer])

	useEffect(() => {
		setAppLoading(true)
		if (typeof publicData !== "undefined") {
			const query = new URLSearchParams(location.search)
			var tickets = publicData?.accountTickets

			if (publicData.creators) {
				if (!_.isNil(query.get("creator"))) {
					tickets = 0
					publicData.creators.forEach((element) => {
						if (element.available) {
							if (element.account === query.get("creator")) {
								tickets = element.accountTickets
							}
						}
					})
				} else {
					publicData.creators.forEach((element) => {
						if (element.available && element.isPublic) {
							tickets = tickets + element.accountTickets
						}
					})
				}
			}

			if (tickets < ticketThreshold && (!ticket || ticket === "invalid")) {
				tickets = 0
			}

			const startDate = publicData?.lastAccountCreated?.toDate()
			const endDate = new Date()
			const timeDiff = endDate.getTime() - startDate?.getTime()
			const diffInMin = Math.round(timeDiff / 1000)

			if (diffInMin < rateLimitInSeconds && (!ticket || ticket === "invalid")) {
				tickets = 0
			}

			if(ticket !== 0) {
				setAccountTickets(tickets)
			} else {
				setAccountTickets(null)
			}

			setAppLoading(false)
		}
		// eslint-disable-next-line
	}, [publicData, ticket, location.search])

	const isValidPhone = () => {
		return phone ? isValidPhoneNumber(phone) : false
	}

	const formik = useFormik({
    initialValues: {
      username: account.username,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should contain at least 3 characters")
        .required("Username is required"),
    }),
    onSubmit: async (values) => {
			setGeneratingAccount(true)

			const verifyExistingUser = {
				url: `${process.env.REACT_APP_API_ENDPOINT}/api/verifyExistingUser`,
				method: "POST",
				data: {
					phoneNumber: phone,
				},
				validateStatus: () => true,
			}

			const verifyExistingUserResponse = (await axios(verifyExistingUser)).data

      if (confirmed && verifyExistingUserResponse.success === true) {
        let password = hive.formatter.createSuggestedPassword()

        setAccount({
          username: values.username,
          password: password,
          publicKeys: hive.auth.generateKeys(values.username, password, [
            "owner",
            "active",
            "posting",
            "memo",
          ]),
          privateKeys: hive.auth.getPrivateKeys(values.username, password, [
            "owner",
            "active",
            "posting",
            "memo",
          ]),
        })

        if (ticket) {
					setCurrentPage('backup-account')
					setGeneratingAccount(false)
        } else {
          checkReputation().then((result) => {
            if (result.data.ticket && result.data.ticket !== "") {
							if (result.data.ticket === "BADREPUTATION") {
                setSuspended(true)
              } else {
                setTicket(result.data.ticket)
              }
            }
						setGeneratingAccount(false)
            setCurrentPage('backup-account')
          })
        }

        logEvent(analytics, "confirm_account_name")
      } else {
				if(verifyExistingUserResponse.error) {
					setError(verifyExistingUserResponse.error)
					setCurrentPage('error-occurred')
				}
			}
    },
  })

	useEffect(() => {
		if(formik.values.username) {
			setTypingUsername(true)
		}

		const resolve = async () => {
			let result = await hive.api.lookupAccountNamesAsync([formik.values.username])
			
			if (_.isEmpty(hive.utils.validateAccountName(formik.values.username))) {
				setIsUsernameValid(true)

				if (_.isEmpty(result[0])) {
					// console.log('Username is available!');
					setIsUsernameAvailable(true)
					setCheckingUsernameAvailability(false)
				} else {
					// console.log('Username not available!');
					setIsUsernameAvailable(false)
					setCheckingUsernameAvailability(false)
				}
			} else {
				setIsUsernameValid(false)
				// console.log('Username is not valid');
				setCheckingUsernameAvailability(false)
			}
		}

		const delayDebounce = setTimeout(() => {
			if(formik.values.username !== '') {
				setTypingUsername(false)
				setCheckingUsernameAvailability(true)
				resolve()
			}
		}, 1000)

    return () => clearTimeout(delayDebounce)
		// eslint-disable-next-line
	}, [formik.values.username])


	useEffect(() => {
		const error = formik.errors.username
		if(!typingUsername && !checkingUsernameAvailability) {
			if(error) {
				switch(error) {
					case 'Username is required':
						setHelperTextColor('#dc3545')
						break
					case 'Username should contain at least 3 characters':
						setHelperTextColor('#dc3545')
						break
					default:
						setHelperTextColor('#BABABA')
						break
				}
			} else {
				if(isUsernameValid && isUsernameAvailable) {
					setHelperTextColor('#28a745')
				} else {
					setHelperTextColor('#dc3545')
				}
			}
		} else {
			setHelperTextColor('#ff8000')
		}

		if(!isValidPhone() && !formik.errors.username && formik.values.username !== '') {
			setConfirmed(true)
		}
		// eslint-disable-next-line
	}, [formik.errors.username, typingUsername, checkingUsernameAvailability, isUsernameValid, isUsernameAvailable])

	return (
		!appLoading && accountTickets !== null ?
			<div className='mt-[55px] flex flex-col h-full w-full'>
				{
					(accountTickets !== 0 && accountsCreatedToday < 100 && !suspended)
					?
					<div className='flex flex-col w-full'>
							<div className="h-[200px] w-full flex flex-col items-center justify-center">
								<span className="text-[28px] text-gray-900 font-medium">Share the Buzz</span>
								<span className="text-[18px] text-gray-600 w-[70%] md-w-[100%] lg-w-[100%] text-center">Decentralised & censorship resistant social media.</span>
							</div>
							<div className='flex items-center justify-center'>
								<img src={DbuzzIcon} alt="dbuzz icon" className='h-[45px]' />
								<span className='ml-[15px] mr-[15px] w-[80px] border-t-[4px] border-dotted border-[#e61c34]'/>
								<img src={HiveIcon} alt="hive icon" className='h-[45px]' />
							</div>

							{referrerProfile.account && referrerProfile.account !== 'dbuzz' &&
								<div className='flex flex-col items-center referrer-wrapper'>
									<span className='mt-8 font-bold'>Referred by:</span>
									<ReferrerWrapper referrer={referrerProfile}/>
								</div>
							}

							<div className='h-[200px] mt-[50px] flex flex-col items-center'>
								<Form className='h-full flex flex-col justify-center items-center' onSubmit={formik.handleSubmit}>
									<InputField
										id="username"
										name="username"
										label="Username"
										placeholder='Pick a username'
										startIcon='@'
										endIcon={ 
											formik.values.username &&
											(
												!typingUsername ?
												!checkingUsernameAvailability ?
												formik.errors.username ? '❌' :
												isUsernameValid ? isUsernameAvailable ? '✅' : '❌' : '❌' :
												'🔎' :
												'⌛️'
											)
										}
										size={18}
										className='w-[350px] md:w-[400px] lg:w-[400px]'
										theme={formik.values.username ? helperTextColor : ''}
										value={formik.values.username.toLowerCase()}
										onChange={(e) => {
											formik.handleChange(e)
										}}
										onBlur={formik.handleBlur}
										disabled={generatingAccount}
									/>
									<span className={`flex justify-end pr-4 mt-[5px] mb-4 text-[14px] font-medium`} style={{ color: helperTextColor }}>
										{
											formik.values.username &&
											(
												!typingUsername &&
												!checkingUsernameAvailability ?
												formik.errors.username ? formik.errors.username :
												isUsernameValid ? isUsernameAvailable ? 'Username is available' : 'Username is not available' : 'Username is not valid' :
												'Checking for username availability'
											)
										}
									</span>
									<InputField
										placeholder='Enter your phone number'
										size={18}
										className='w-[350px] md:w-[400x] lg:w-[400px] mb-4'
										type='phone'
										value={phone}
										onChange={setPhone}
										disabled={generatingAccount}
									/>
									<Button type='submit' className='w-[350px] md:w-[400px] lg:w-[400px]' onClick={() => setGeneratingAccount(true)} variant='fill' loading={generatingAccount} disabled={!isValidPhone() || typingUsername || checkingUsernameAvailability || !isUsernameAvailable || !isUsernameValid}>Continue</Button>
								</Form>
							</div>
					</div>
					:
					<div className='flex flex-col h-[500px] w-full items-center justify-center'>
						<div className='flex rounded-full p-6 bg-[#e31337] items-center'>
							<span className='grid place-items-center rounded-full bg-white w-[40px] h-[40px] text-[#e31337] text-[25px] font-bold'>!</span>
							<span className='ml-4 text-[14px] md:text-[25px] lg:text-[25px] text-white font-bold md:font-semibold lg:font-semibold'>SERVICE UNAVAILABLE AT THE MOMENT</span>
						</div>
						<div className='flex justify-center w-[85%] md:w-full lg:w-full mt-[50px] text-[18px] md:text-[20px] lg:text-[20px] font-medium'>
							<span>Our daily account creation limit has been reached. <br /> Please try again tomorrow or use <a href='https://signup.hive.io' className='text-[#e31337] font-medium'>signup.hive.io</a> for other account creation options.</span>
						</div>
					</div>
				}
			</div>
			:
			<PageLoading />
	)
}

export default SignUpWrapper