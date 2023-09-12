import { useEffect } from "react"
import { useState } from "react"

const Footer = (props) => {
	const { appLoading } = props

	const [isStaging, setIsStaging] = useState(null)

	const VERSION = `v${process.env.REACT_APP_VERSION}`
	const BETA_VERSION = `v${process.env.REACT_APP_BETA_VERSION}`

	useEffect(() => {
		setIsStaging(window.location.hostname === 'next.join.d.buzz' || window.location.hostname === 'localhost')
	}, [])

	const APP_VERSION = isStaging === true ? BETA_VERSION : isStaging === false && VERSION
	return (
		!appLoading &&
		<div className="h-[100px] w-full relative bottom-0">
			<div className="absolute bottom-0 mt-auto flex items-center h-[55px] w-full pl-[15%] pr-[15%] border-t-[1px] border-[#e6ecf0]">
				<span className="ml-auto">&copy; {new Date().getFullYear()} Dataloft LLC&nbsp; {APP_VERSION && <>- <b>{APP_VERSION}</b></>}</span>
			</div>
		</div>
	)
}

export default Footer