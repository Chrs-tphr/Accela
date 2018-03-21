function editParentExpiration(eStatus,eDate){
	var savedCapId = capId;
	capId = parentCapId
	
	licEditExpInfo(eStatus,eDate);
	
	capId = savedCapId;
}