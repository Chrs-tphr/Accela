function removeRefParcelCondition(parcelNum,cType,cDesc){
	var pcResult = aa.parcelCondition.getParcelConditions(parcelNum);
	if(!pcResult.getSuccess()){
//			logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage());
		return false;
	}
	var pcs = pcResult.getOutput();
	for(pc1 in pcs){
		if(pcs[pc1].getConditionType().equals(cType) && pcs[pc1].getConditionDescription().equals(cDesc)){
			var rmParcelCondResult = aa.parcelCondition.removeParcelCondition(pcs[pc1].getConditionNumber(),parcelNum);
			if(rmParcelCondResult.getSuccess()){
				logDebug("Successfully removed condition from Parcel " + parcelNum + "  (" + cType + ") " + cDesc);
			}else{
				logDebug( "**ERROR: removing ("+cType+") condition from Parcel " + parcelNum);
			}
		}
	}
}