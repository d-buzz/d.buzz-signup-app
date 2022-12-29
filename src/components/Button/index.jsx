import { useEffect } from "react"


const Button = ({ type, variant, children, width='fit', id='', className='', style={}, loading=false, onClick, disabled }) => {

	useEffect(() => {
		if(variant === undefined) {
			console.warn('Please provide a variant in Button')
		}
		if(children === undefined) {
			console.error('Please provide a children value for Button')
		}
		// eslint-disable-next-line
	}, [])

	return (
		<button type={type} id={id} className={`grid place-items-center w-[${width ? `${width}px` : ''}] rounded-full pt-[5px] pb-[5px] pl-[15px] pr-[15px] font-bold select-none cursor-pointer text-[#e61c34] outline-none outline-0 ${variant === 'outlined' ? 'border-solid border-[1px] border-[#e61c34] hover:bg-[#b71c1c1c]' : variant === 'fill' ? 'bg-[#e61c34] text-white border-solid border-[1px] border-[#e61c34] hover:border-[#b71c1c] hover:bg-[#b71c1c] disabled:border-[#e61c34] disabled:bg-[#e61c34]' : ''} disabled:opacity-50 disabled:cursor-default transition-all ${className}`} style={style} onClick={onClick} disabled={disabled}>
			{!loading ? children : <span className="loader"/>}
		</button>
	)

}

export default Button