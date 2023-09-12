const ReferrerWrapper = ({ referrer }) => {
	return (
		<div className="ml-auto mr-auto w-fit rounded-lg pt-[5px] pb-[5px] pl-[10px] pr-[10px] mt-2 flex justify-center border-2 border-[#e65768]">
			<img src={referrer.profile_image || `${window.location.origin}/images/dbuzz-avatar.png`} alt={referrer.account} className="rounded-full h-[50px] w-[50px] mr-[10px] object-cover" />
			<div className="flex flex-col">
				<span className="text-[#e61c34] font-bold text-lg">{referrer.name || referrer.account}</span>
				<span className="text-gray-500 text-md">@{referrer.account}</span>
			</div>
		</div>
	)
}

export default ReferrerWrapper