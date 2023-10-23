import moment from 'moment'
import { useEffect, useState } from 'react'
import BackIcon from '../../assets/back-icon.svg'
import Button from '../Button'
import InputField from '../InputField'
import OTPCodeInput from '../OTPCodeInput'
import PageLoading from '../PageLoading'
import axios from 'axios'

const OTP_DURATION = 60 * 15; // 15 minutes in seconds

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

	const [checkingPhoneNumber, setCheckingPhoneNumber] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState("");
	const [otpExpiryTimeLeft, setOtpExpiryTimeLeft] = useState(null);
	const [otpError, setOtpError] = useState("");
	const [requestedCodeAgainIn, setRequestedCodeAgainIn] = useState(0);


	// added limit for set otp
	useEffect(() => {
		if (codeRequested) {
			setOtpExpiryTimeLeft(OTP_DURATION);
			const otpExpiryInterval = setInterval(() => {
				setOtpExpiryTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
			}, 1000);
			return () => clearInterval(otpExpiryInterval);
		}
	}, [codeRequested]);

	const [showResendLink, setShowResendLink] = useState(false);

	useEffect(() => {
		if (otpExpiryTimeLeft === 0 && codeRequested) {
			setOtpError("The OTP has expired. Please request a new one.");
			setShowResendLink(true);
		}
	}, [otpExpiryTimeLeft, codeRequested]);


	useEffect(() => {
		const requestCodeLimitDateTime = localStorage.getItem('requestCodeLimitDateTime');
		const elapsedTime = moment().diff(requestCodeLimitDateTime, 'minutes');

		if (elapsedTime > 15) {
			localStorage.clear();
		}
	}, []);

	useEffect(() => {
		const handleCountdown = () => {
			if (requestedCodeCount > 0 && requestedCodeCount < 3) {
				setRequestedCodeAgainIn(timeLeft => (timeLeft - 1));
			}
		};

		const timer = setInterval(handleCountdown, 1000);

		return () => clearInterval(timer);
	}, [requestedCodeCount]);

	useEffect(() => {
		if (requestedCodeCount === 3) {
			setRequestedCodeLimit(true);
			localStorage.setItem('requestCodeLimit', 3);
			localStorage.setItem('requestCodeLimitDateTime', moment().format());
		}
	}, [requestedCodeCount, setRequestedCodeLimit]);

	const handleRequestOTPCode = async () => {
		setCheckingPhoneNumber(true);
		const verifyExistingUserResponse = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/verifyExistingUser`, { phoneNumber: phone });

		setCheckingPhoneNumber(false);

		if (verifyExistingUserResponse.data.success) {
			setRequestedCodeAgainIn(15);
			handleRequestCode();
			setOtpExpiryTimeLeft(OTP_DURATION);
		} else {
			setPhoneNumberError(verifyExistingUserResponse.data.error);
		}
	};

	const handleVerify = () => {
		if (otpExpiryTimeLeft <= 0) {
			setOtpError("The OTP has expired. Please request a new one.");
			setShowResendLink(true);
			localStorage.clear();
			return; // Return early since the OTP is expired.
		}
		handleVerifyOpt();
	};

	return (
		<div className="pt-[100px] h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-start">
				<div
					className="flex items-center justify-center select-none cursor-pointer hover:opacity-50 transition-all"
					onClick={() => setShowPhoneVerifier(false)}>
					<img src={BackIcon} alt='back icon' className="h-[30px] pb-[2px] pr-[2px]"/>
					<span className="pl-2 text-[#e61c34] font-bold">Go back</span>
				</div>
				<div className="flex flex-col items-center justify-center">
					<span className="mt-[20px] text-[22px] md:text-[26px] lg:text-[32px] font-bold">One Time Passcode Verification</span>


					{!codeRequested && !accountCreated
						? <div>
							<InputField placeholder='Enter your phone number'
										className='w-[100%] md:w-[400px] lg:w-[400px] mt-4 mb-2 text-[20px] md:text-[30px] lg:text-[30px]'
										type='phone' value={phone} onChange={setPhone}
										disabled={submitting || codeRequested}/>
							{phoneNumberError && (
								<span className={`flex justify-center pr-4 mt-[5px] mb-4 text-[14px] font-medium`}
									  style={{color: '#dc3545'}}>
                                    {phoneNumberError}
                                </span>
							)}
						</div>
						: <div>
							<OTPCodeInput handleVerifyOpt={handleVerify} setConfirmationCode={setConfirmationCode}/>
							{otpError && (
								<div className={`flex justify-center pr-4 mt-[5px] mb-4 text-[14px] font-medium`}>
									<span style={{color: '#dc3545'}}>
										{otpError}
									</span>
									{showResendLink && (
										<button
											onClick={(event) => handleRequestOTPCode(event)}
											className="ml-2 text-[#007bff] cursor-pointer hover:underline"
										>
											Resend OTP
										</button>
									)}
								</div>
							)}
						</div>
					}
					{!codeRequested && !accountCreated
						? <div className='relative mt-4 flex flex-col items-center justify-center'>
							<Button variant='fill' onClick={(event) => handleRequestOTPCode(event)}
									disabled={requestedCodeLimit} loading={submitting || checkingPhoneNumber}>SEND
								CODE</Button>
							{requestedCodeCount > 0 && requestedCodeAgainIn > 0 &&
								<span
									className='mt-4 md:mt-0 lg:mt-0 md:absolute lg:md:absolute right-[-120px] text-[12px] text-gray-400'>Request another <br/> code in {requestedCodeAgainIn}</span>
							}
							{requestedCodeLimit && requestedCodeAgainIn === 0 &&
								<span className='mt-4 font-medium text-center'>You've already requested code more than 3 times, <br/> please check back later in 30 minutes.</span>
							}
						</div>
						: <Button className='mt-4' variant='fill' onClick={handleVerify} disabled={submitting}
								  loading={submitting}>VERIFY CODE</Button>
					}

					{accountCreated &&
						<PageLoading/>
					}
				</div>
			</div>
		</div>
	)
}

export default OTPVerificationWrapper