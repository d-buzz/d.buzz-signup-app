import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const InputField = ({ id, name, label, startIcon, endIcon, type, size, placeholder, className, value, style={}, onChange, disabled }) => {
	return (
		<div className={`${className} flex pt-2 pb-2 pl-4 pr-4 w-fit rounded-full border-[1px] border-[#e61c34] overflow-hidden transition-all focus-within:shadow-outline focus-within:border-[#e65768]`} style={{ ...style, opacity: disabled ? '50%' : '100%' }}>
			<span className={`font-bold text-[${size}px]`}>{startIcon}</span>
			{type !== 'phone'
				?
				<input id={id} name={name} label={label} type={type} placeholder={placeholder} className={`w-full pl-2 pr-2 outline-none outline-0 text-[${size}px]`} value={value} onChange={onChange} disabled={disabled} />
				:
				<PhoneInput
					defaultCountry='US'
					placeholder={placeholder}
					className={`w-full pl-2 pr-2 outline-none outline-0 text-[${size}px]`}
					value={value}
					onChange={onChange}
					disabled={disabled}
				/>
			}
			<span className={`font-bold text-[${size}px]`}>{endIcon}</span>
		</div>
	)
}

export default InputField