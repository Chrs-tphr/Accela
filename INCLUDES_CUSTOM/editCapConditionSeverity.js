function editCapConditionSeverity(cSeverity,nSeverity,typeOfCheck,condDescArray){//typeOfCheck and condDescArray can be null if no check is needed
	var itemCap = capId;
	
	//optional param 5 - provide non event capId
	if(arguments.length == 5) itemCap = arguments[2]; // use cap ID specified in args
	
	var capCondResult = aa.capCondition.getCapConditions(capId);
	
	if(!capCondResult.getSuccess()){
		logDebug("**WARNING: error getting cap conditions : " + capCondResult.getErrorMessage());
		return false;
	}
	
	var ccs = capCondResult.getOutput();
	
	for(pc1 in ccs){
		
		if(typeOfCheck && condDescArray){
			if(typeOfCheck == "INCLUDE"){
				if(!exists(ccs[pc1].getConditionDescription(),condDescArray)){
					continue;
				}
			}else if(typeOfCheck == "EXCLUDE"){
				if(exists(ccs[pc1].getConditionDescription(),condDescArray)){
					continue;
				}
			}
		}
		
		if(ccs[pc1].getImpactCode() == cSeverity){
			ccs[pc1].setImpactCode(nSeverity);
			aa.capCondition.editCapCondition(ccs[pc1]);
		}
	}
	
}