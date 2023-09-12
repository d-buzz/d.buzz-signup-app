import moment from 'moment'
import { useEffect, useState } from 'react'
import BackIcon from '../../assets/back-icon.svg'
import Button from '../Button'
import InputField from '../InputField'
import OTPCodeInput from '../OTPCodeInput'
import PageLoading from '../PageLoading'
import axios from 'axios'
const OTPVerificationWrapper = (props) => {

	const { phone, 
		setPhone,
		handleRequestCode, 
		setShowPhoneVerifier, 
		codeRequested, 
		submitting,
		requestedCodeCount,
		requestedCodeLimit,
		setRequestedCodeLimit,
		setConfirmationCode,
		accountCreated,
		handleVerifyOpt,
		// eslint-disable-next-line
		confirmationResult,
		// eslint-disable-next-line
		canRequestCodeAgain,
		// eslint-disable-next-line
		setCanRequestCodeAgain,
		// eslint-disable-next-line
		setRequestedCodeCount,
	} = props

	const [checkingPhoneNumber, setCheckingPhoneNumber] = useState(false)
	const [phoneNumberError, setPhoneNumberError] = useState("")

	const [requestedCodeAgainIn, setRequestedCodeAgainIn] = useState(0)

	useEffect(() => {
		const requestCodeLimitDateTime = localStorage.getItem('requestCodeLimitDateTime')
		const elapsedTime = moment().diff(requestCodeLimitDateTime, 'minutes')

		if(elapsedTime > 30) {
			localStorage.clear()
		}
	}, [])

	useEffect(() => {
		var timeLeft = 15
		if(requestedCodeCount > 0 && requestedCodeCount < 3) {
			const timer = setInterval(() => {
				timeLeft -= 1
				setRequestedCodeAgainIn(timeLeft)
				if(timeLeft === 0){
					clearInterval(timer)
				}
			}, 1000)
		}
	}, [requestedCodeCount])

	useEffect(() => {
		if(requestedCodeCount === 3) {
			setRequestedCodeLimit(true)
			localStorage.setItem('requestCodeLimit', 3)
			localStorage.setItem('requestCodeLimitDateTime', moment().format())
		}
		// eslint-disable-next-line
	}, [requestedCodeCount])

	const handleRequestOTPCode = async () => {
		setCheckingPhoneNumber(true)
		const verifyExistingUser = {
				url: `${process.env.REACT_APP_API_ENDPOINT}/api/verifyExistingUser`,
				method: "POST",
				data: {
					phoneNumber: phone,
				},
				validateStatus: () => true,
			}

		const verifyExistingUserResponse = (await axios(verifyExistingUser)).data
		
		setCheckingPhoneNumber(false)
		
		if (verifyExistingUserResponse.success === true) {
			setRequestedCodeAgainIn(15)
			handleRequestCode()
		}else{
			if(verifyExistingUserResponse.error) {
				setPhoneNumberError(verifyExistingUserResponse.error)
			}
		}
	}

	return (
		<div className="pt-[100px] h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-start">
				<div className="flex items-center justify-center select-none cursor-pointer hover:opacity-50 transition-all" onClick={() => setShowPhoneVerifier(false)}>
					<img src={BackIcon} alt='back icon' className="h-[30px] pb-[2px] pr-[2px]" />
					<span className="pl-2 text-[#e61c34] font-bold">Go back</span>
				</div>
				<div className="flex flex-col items-center justify-center">
					<span className="mt-[20px] text-[22px] md:text-[26px] lg:text-[32px] font-bold">One Time Passcode Verification</span>
					{
						!codeRequested && !accountCreated
						?
							<div>
								<InputField placeholder='Enter your phone number' className='w-[100%] md:w-[400px] lg:w-[400px] mt-4 mb-2 text-[20px] md:text-[30px] lg:text-[30px]' type='phone' value={phone} onChange={setPhone} disabled={submitting || codeRequested} />
								{phoneNumberError && (
									<span className={`flex justify-center pr-4 mt-[5px] mb-4 text-[14px] font-medium`} style={{ color: '#dc3545' }}>
										{phoneNumberError}
									</span>
								)}
							</div>
							:
							<OTPCodeInput handleVerifyOpt={handleVerifyOpt} setConfirmationCode={setConfirmationCode}/>
					}
					{
						!codeRequested && !accountCreated
						?
							<div className='relative mt-4 flex flex-col items-center justify-center'>
								<Button variant='fill' onClick={handleRequestOTPCode} disabled={requestedCodeLimit} loading={submitting || checkingPhoneNumber}>SEND CODE</Button>
								{
									requestedCodeCount > 0 && requestedCodeAgainIn > 0 &&
									<span className='mt-4 md:mt-0 lg:mt-0 md:absolute lg:md:absolute right-[-120px] text-[12px] text-gray-400'>Request another <br /> code in {requestedCodeAgainIn}</span>
								}
								{
									requestedCodeLimit && requestedCodeAgainIn === 0 &&
									<span className='mt-4 font-medium text-center'>You've already requested code more than 3 times, <br /> please check back later in 30 minutes.</span>
								}
							</div>
						:
							<Button className='mt-4' variant='fill' onClick={handleVerifyOpt} disabled={submitting} loading={submitting}>VERIFY CODE</Button>
					}
					{
						accountCreated &&
						<PageLoading />
					}
				</div>
			</div>
		</div>
	)
}

export default OTPVerificationWrapper