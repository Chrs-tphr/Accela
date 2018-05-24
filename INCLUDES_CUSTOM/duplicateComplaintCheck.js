var iRec = null; 
var recordArray = new Array();

recordArray = capIdsGetByAddr();
aa.print("Length: " + recordArray.length);
if(recordArray.length > 0){
	for(iRec in recordArray){
		var vApp = null;
		vApp = recordArray[iRec];
		vCap = aa.cap.getCap(vApp).getOutput();
		vAppTypeString = vCap.getCapType().toString();
		vFileDateObj = vCap.getFileDate();
		bAppTypeMatch = false;
		bASIMatch = false;
		if(appMatch(vAppTypeString) && (vApp.equals(capId) == false)){
			bAppTypeMatch = true;
		}
		if(bAppTypeMatch && getAppSpecific("Complaint Type",capId).equals(getAppSpecific("Complaint Type",vApp))){
			bASIMatch = true; //aa.print("Complaint Types: " + getAppSpecific("Complaint Type",capId)+ "=" + getAppSpecific("Complaint Type",vApp));
		}
		if(bAppTypeMatch && bASIMatch){
			sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"MM/DD/YYYY");
			vFileDate = "" + vFileDateObj.getMonth() + "/" + vFileDateObj.getDayOfMonth() + "/" + vFileDateObj.getYear();
		}
		if(bAppTypeMatch && bASIMatch && dateDiff(vFileDate, sysDateMMDDYYYY) < 3){
			updateAppStatus("Potential Duplicate","This is a potential duplicate of Record ID: " + vApp.getCustomID());
			createCapComment("This is a potential duplicate of Record ID: " + vApp.getCustomID());
		}
	}
}

