function getStandardCondition(cGroup,cType,cDesc){
	var standardConditionsArray = aa.capCondition.getStandardConditionsByGroup(cGroup).getOutput();
	for(i in standardConditionsArray){
		var thisStdCon = standardConditionsArray[i];
		if(thisStdCon.getConditionType().toUpperCase() == cType.toUpperCase() && thisStdCon.getConditionDesc().toUpperCase() == cDesc.toUpperCase()){
			return thisStdCon;
		}
	}
}