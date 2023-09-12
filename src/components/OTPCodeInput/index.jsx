import { useEffect, useState } from "react"


const OTPCodeInput = (props) => {

	const { handleVerifyOpt } = props

	const [otp1, setOtp1] = useState('')
	const [otp2, setOtp2] = useState('')
	const [otp3, setOtp3] = useState('')
	const [otp4, setOtp4] = useState('')
	const [otp5, setOtp5] = useState('')
	const [otp6, setOtp6] = useState('')

	const gotoNextOtp = (id) => {
		const nextOtpEl = document.getElementById(`otp-${id+1}`)
		nextOtpEl.focus()
	}

	const handleOptChange = (otpId, value) => {
		const otpFormat = /[0-9]/
		if(otpFormat.test(value)) {
			switch(otpId) {
				case 1:
					setOtp1(value)
					gotoNextOtp(1)
					break;
				case 2:
					setOtp2(value)
					gotoNextOtp(2)
					break;
				case 3:
					setOtp3(value)
					gotoNextOtp(3)
					break;
				case 4:
					setOtp4(value)
					gotoNextOtp(4)
					break;
				case 5:
					setOtp5(value)
					gotoNextOtp(5)
					break;
					case 6:
						setOtp6(value)
						break;
				default:
					return null
			}
		}
	}

	useEffect(() => {
		if(otp1 && otp2 && otp3 && otp4 && otp5 && otp6) {
			const otpCode = `${otp1}${otp2}${otp3}${otp4}${otp5}${otp6}`
			handleVerifyOpt(otpCode)
		}
		// eslint-disable-next-line
	}, [otp1, otp2, otp3, otp4, otp5, otp6])
	
	const handleResetOptValue = (otpId) => {
		switch(otpId) {
			case 1:
				setOtp1('')
				break;
			case 2:
				setOtp2('')
				break;
			case 3:
				setOtp3('')
				break;
			case 4:
				setOtp4('')
				break;
			case 5:
				setOtp5('')
				break;
			case 6:
				setOtp6('')
				break;
			default:
				return null;
		}
	}

	return (
		<div className="flex items-center">
			<input id="otp-1" className="otp-input" type="text" maxLength={1} value={otp1} onChange={(e) => handleOptChange(1, e.target.value)} onClick={() => handleResetOptValue(1)} onFocus={() => handleResetOptValue(1)}/>
			<input id="otp-2" className="otp-input" type="text" maxLength={1} value={otp2} onChange={(e) => handleOptChange(2, e.target.value)} onClick={() => handleResetOptValue(2)} onFocus={() => handleResetOptValue(2)}/>
			<input id="otp-3" className="otp-input" type="text" maxLength={1} value={otp3} onChange={(e) => handleOptChange(3, e.target.value)} onClick={() => handleResetOptValue(3)} onFocus={() => handleResetOptValue(3)}/>
			<div className="h-[3px] w-[30px] bg-[#e61c34]"/>
			<input id="otp-4" className="otp-input" type="text" maxLength={1} value={otp4} onChange={(e) => handleOptChange(4, e.target.value)} onClick={() => handleResetOptValue(4)} onFocus={() => handleResetOptValue(4)}/>
			<input id="otp-5" className="otp-input" type="text" maxLength={1} value={otp5} onChange={(e) => handleOptChange(5, e.target.value)} onClick={() => handleResetOptValue(5)} onFocus={() => handleResetOptValue(5)}/>
			<input id="otp-6" className="otp-input" type="text" maxLength={1} value={otp6} onChange={(e) => handleOptChange(6, e.target.value)} onClick={() => handleResetOptValue(6)} onFocus={() => handleResetOptValue(6)}/>
		</div>
	)
}

export default OTPCodeInput