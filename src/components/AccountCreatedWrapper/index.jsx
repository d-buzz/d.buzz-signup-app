import DoneIcon from '../../assets/done-icon.svg'
import Button from '../Button'
import party from "party-js";
import { useEffect } from 'react';

const AccountCreatedWrapper = (props) => {

	const { account } = props
	
	const handleRedirectLogin = () => {
		window.location = `https://d.buzz`
	}

	useEffect(() => {
		party.confetti(document.getElementById('done-icon'))
	}, [])

	return (
		<div className="pt-[100px] h-full flex flex-col justify-center items-center">
			<img id='done-icon' src={DoneIcon} alt="done icon" className='h-[150px] animate-bounce' />
			<span className="mt-4 text-[25px] md:text-[35px] lg:text-[35px] font-medium">You're ready <b>{account.username || 'myusername'}</b>! 🎉</span>
			<span className="mt-6 md:mt-8 lg:mt-12 text-[18px] md:text-[30px] lg:text-[35px] font-bold">Welcome to DBUZZ and HIVE ecosystem!</span>
			<span className="mt-2 text-[14px] md:text-[22px] lg:text-[22px] font-medium">You can now login with your credentials on <b>DBUZZ</b>.</span>
			<Button variant='fill' className='mt-6 text-[18px] md:text-[24px] lg:text-[24px] w-[150px] hover:w-[160px]' onClick={handleRedirectLogin}>Login</Button>
		</div>
	)
}

export default AccountCreatedWrapper