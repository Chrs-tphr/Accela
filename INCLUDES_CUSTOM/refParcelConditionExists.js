function refParcelConditionExists(condtype){
	var pcResult = aa.parcelCondition.getParcelConditions(RefParcelNumber);
	if(!pcResult.getSuccess()){
//		logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage());
		return false;
	}
	pcs = pcResult.getOutput();
	for(pc1 in pcs)
		if (pcs[pc1].getConditionType().equals(condtype)) return true;
}