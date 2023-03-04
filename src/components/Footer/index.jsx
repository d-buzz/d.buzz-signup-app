const Footer = () => {

	const VERSION = process.env.REACT_APP_VERSION
	return (
		<div className="absolute bottom-0 flex items-center h-[55px] w-full pl-[15%] pr-[15%] border-t-[1px] border-[#e6ecf0]">
			<span className="ml-auto">&copy; {new Date().getFullYear()} Dataloft LLC&nbsp; - <b>v{VERSION}</b></span>
		</div>
	)
}

export default Footer