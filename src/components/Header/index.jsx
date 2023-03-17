import { useEffect, useState } from 'react'
import Logo from '../../assets/dbuzz-logo.svg'
import Button from '../Button'

const Header = (props) => {

	const { appLoading } = props

	const [isStaging, setIsStaging] = useState(null)

	useEffect(() => {
		setIsStaging(window.location.hostname === 'next.join.d.buzz' || window.location.hostname === 'localhost')
	}, [])

	const handleRedirectLogin = () => {
		window.location = `https://d.buzz`
	}

	return (
		!appLoading &&
		<div className="absolute top-0 flex items-center h-[55px] w-full pl-[8%] md:pl-[12%] lg:pl-[15%] pr-[8%] md:pr-[12%] lg:pr-[15%] border-b-[1px] border-[#e6ecf0]">
			<div className='relative'>
				<a href="https://d.buzz">
					<img src={Logo} alt="dbuzz logo" className='h-[30px] mb-[10px] cursor-pointer' />
				</a>
				{ isStaging && <span className='absolute h-fit top-0 bottom-0 m-auto right-[-50px] p-[2px] pl-[8px] pr-[8px] bg-[#e61c3443] font-bold text-[#e61c34] text-[10px] rounded-md select-none'>BETA</span> }
			</div>
			<Button variant='outlined' className='ml-auto' onClick={handleRedirectLogin}>
				Login instead
			</Button>
		</div>
	)
}

export default Header