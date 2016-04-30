function allInspectionsHaveResult(inspResult) {
	var output = true;
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) { 
			var inspType = inspList[xx].getInspectionType();
			o = doesInspHaveResult(inspType,inspResult)
			if(o == false)
				output = false;
		}
	}
	return output;
}