function doesInspHaveResult(inspectionType){//add each inspection result as a new argument
	var inspResultArray = new Array();
	for (var i=1; i<arguments.length; i++){
		inspResultArray.push(arguments[i])
	}
	var inspResultSearch = inspResultArray.toString();
	var output = false;
	var inspResultObj = aa.inspection.getInspections(capId);
	if(inspResultObj.getSuccess()){
		var inspList = inspResultObj.getOutput();
		for(xx in inspList){
			var iName = inspList[xx].getInspectionType();
			for(xxx in inspResultArray){
				var iResult = inspResultArray[xxx];
				logDebug("Checking for inspection '"+iName+"' with result: "+iResult);
				if(String(iName).equals(inspectionType) && String(iResult).equals(inspList[xx].getInspectionStatus())){
					logDebug("Found inspection "+iName+": "+iResult);
					output = true;
				}
			}
		}
	}
	if(output == "false") logDebug("Did not find any "+inspectionType+" inspections with a result of "+inspResultSearch);
	return output;
}