import Button from "../Button"
import HiveOnBoardLogo from "../../assets/hiveonboard_logo.png"
import EcencyIcon from "../../assets/ecency-icon.svg"
import ActifitLogo from "../../assets/actifit_logo.png"


const ErrorOccurredWrapper = (props) => {

	const { error } = props

	const getErrorMessage = (err) => {
		switch(err) {
			case 'Firebase: Error (auth/invalid-verification-code).':
				return 'The entered code is invalid.'
			case 'Firebase: Error (auth/code-expired).':
				return 'The code is expired, please try again.'
			case 'Firebase: Error (auth/too-many-requests).':
				return 'Too many requests, please try again later.'
			case 'Your phone number was already used for account creation.':
				return 'Your phone number was already used for account creation.'
			case 'Your IP was recently used for account creation.':
				return 'Your IP was recently used for account creation.'
			default:
				return 'Unexpected error: ' + err
		}
	}

	const handleRetry = () => {
		window.location.reload()
	}

	return (
		<div className="pt-[100px] flex flex-col min-h-[600px] h-full w-full justify-center items-center">
			{error && getErrorMessage(error) !== 'Your IP was recently used for account creation.'
				?
				<div className="flex flex-col items-start w-[80%]">
					<span className='w-[80%] md:w-[600px] lg:w-[800px] mt-4 text-[#e61c34] font-semibold text-left text-[18px] md:text-[22px] lg:text-[24px]'>{getErrorMessage(error)}</span>
					<span className="mt-2 text-[18px] md:text-[20px] lg:text-[20px]">You can use <a href='https://signup.hive.io' className='text-[#e31337] font-medium'>signup.hive.io</a></span>
					<Button className='w-fit mt-6' variant='fill' onClick={handleRetry}>OR TRY ANOTHER?</Button>
				</div>
				:
				error &&
				<div className="flex justify-center">
					<div className='w-[80%] md:w-[600px] lg:w-[800px] mt-4 text-[#e61c34] font-semibold text-center text-[18px] md:text-[22px] lg:text-[24px]'>{getErrorMessage(error)}</div>
					<div className="mt-8"/>
					<div className='w-[80%] md:w-[600px] lg:w-[800px] mt-4 text-[#e61c34] font-medium text-center text-[14px] md:text-[18px] lg:text-[20px]'>Try other sign up options:</div>
					<div className="mt-[25px] ml-auto mr-auto w-[80%] md:w-[600px] lg:w-[800px] flex justify-between items-center">
						<div className="overflow-hidden rounded-lg flex flex-col items-center font-bold text-center bg-gray-100 border-[#e61c34] border-[2px]">
							<img className="m-4 w-[150px] h-[65.38px] bg-gray-700 rounded cursor-pointer" src={HiveOnBoardLogo} alt="hiveonboard" />
							<p className="pl-4 pr-4 w-full bg-white pt-2 pb-2 text-[18px] md:text-[25px] lg:text-[25px] font-medium">HiveOnBoard</p>
							<span className="pl-4 pr-4 flex flex-col">
								<p className="mb-2 text-[35px] font-extrabold">free</p>
								<span className="flex flex-col text-[16px] font-normal">
									<p>Instant</p>
									<p>Requires verification (email)</p>
									<p>** Has extra checks fro abuse</p>
								</span>
							</span>
							<a className="mt-4 p-2 w-full bg-[#e61c34] text-white pt-2 pb-2 text-[18px] md:text-[20px] lg:text-[20px]" href="https://hiveonboard.com/create-account?ref=dbuzz">Sign up</a>
						</div>
						<div className="overflow-hidden rounded-lg flex flex-col items-center font-bold text-center bg-gray-100 border-[#e61c34] border-[2px]">
							<img className="m-4 w-[65px] cursor-pointer" src={EcencyIcon} alt="ecency" />
							<p className="pl-4 pr-4 w-full bg-white pt-2 pb-2 text-[18px] md:text-[25px] lg:text-[25px] font-medium">Ecency</p>
							<span className="pl-4 pr-4 flex flex-col">
								<p className="mb-2 text-[35px] font-extrabold">free / paid</p>
								<span className="flex flex-col text-[16px] font-normal">
									<p>Instant</p>
									<p>Requires verification (email)</p>
									<p>** Has extra checks fro abuse</p>
								</span>
							</span>
							<a className="mt-4 p-2 w-full bg-[#e61c34] text-white pt-2 pb-2 text-[18px] md:text-[20px] lg:text-[20px]" href="https://ecency.com/signup">Sign up</a>
						</div>
						<div className="overflow-hidden rounded-lg flex flex-col items-center font-bold text-center bg-gray-100 border-[#e61c34] border-[2px]">
							<img className="m-4 w-[65px] cursor-pointer" src={ActifitLogo} alt="actifit" />
							<p className="pl-4 pr-4 w-full bg-white pt-2 pb-2 text-[18px] md:text-[25px] lg:text-[25px] font-medium">HiveOnBoard</p>
							<span className="pl-4 pr-4 flex flex-col">
								<p className="mb-2 text-[35px] font-extrabold">$2</p>
								<span className="flex flex-col text-[16px] font-normal">
									<p>Instant</p>
									<p>Requires verification (email)</p>
									<p>** Has extra checks fro abuse</p>
								</span>
							</span>
							<a className="mt-4 p-2 w-full bg-[#e61c34] text-white pt-2 pb-2 text-[18px] md:text-[20px] lg:text-[20px]" href="https://actifit.io/signup">Sign up</a>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default ErrorOccurredWrapper