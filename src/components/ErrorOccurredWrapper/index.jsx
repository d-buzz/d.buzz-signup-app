import Button from "../Button"


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
			default:
				return 'Unexpected error: ' + err
		}
	}

	const handleRetry = () => {
		window.location.reload()
	}

	return (
		<div className="mt-[100px] flex flex-col h-[300px] w-full justify-center items-center">
			<span className='w-[80%] md:w-[400px] lg:w-[500px] mt-4 text-[#e61c34] font-semibold text-center text-[18px] md:text-[22px] lg:text-[24px]'>{getErrorMessage(error)}</span>
			<Button className='mt-6' variant='fill' onClick={handleRetry}>TRY ANOTHER</Button>
		</div>
	)
}

export default ErrorOccurredWrapper