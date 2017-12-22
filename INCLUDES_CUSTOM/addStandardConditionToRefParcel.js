function addStandardConditionToRefParcel(parcelNumber,cGroup,cType,cDesc){
	var standardConditionsArray = aa.capCondition.getStandardConditionsByGroup(cGroup).getOutput();
	for(i in standardConditionsArray){
		var thisStdCon = standardConditionsArray[i];
		if(thisStdCon.getConditionType().toUpperCase() == cType.toUpperCase() && thisStdCon.getConditionDesc().toUpperCase() == cDesc.toUpperCase()){
			var newPCond = aa.parcelCondition.createParcelConditionFromStdCondition(parcelNumber,thisStdCon.getConditionNbr());
			return newPCond.getSuccess();
		}
	}
}