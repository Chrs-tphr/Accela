function allScheduledROWInspAreApproved(){//counts the number of scheduled ROW inspections and compares it to the number Approved and Not Required ROW inspections and returns true or false
	var output = false; var inspCountA = 0; var inspCountB = 0; var inspCountC = 0; var inspCountD = 0; var iResult = "";
	var inspResultObj = aa.inspection.getInspections(capId);
	if(inspResultObj.getSuccess()){
		var inspList = inspResultObj.getOutput();
		for(xx in inspList){
			var iName = inspList[xx].getInspectionType();
			inspCountA = inspList.length;
			if(checkInspectionResult(iName,"Approved"))inspCountB++;
			if(checkInspectionResult(iName,"Not Required"))inspCountC++;
			if(checkInspectionResult(iName,"Pending"))inspCountD++;
		}
	}
	logDebug("Total # of Inspections: "+inspCountA+" / Approved: "+inspCountB+" / Not Required: "+inspCountC+" / Pending: "+inspCountD);
	if(inspCountA == (inspCountB+inspCountC+inspCountD))output = true;
	if(output == "false")logDebug("Not all required/scheduled inspections have been Approved");
	return output;
}