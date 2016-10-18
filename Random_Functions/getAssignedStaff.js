function getAssignedStaff(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	var cdScriptObj = cdScriptObjResult.getOutput();
	var cd = cdScriptObj.getCapDetailModel();
	var currentAssignedStaff = cd.getAsgnStaff();
	logDebug("CAP Assigned to: "+currentAssignedStaff);
	return currentAssignedStaff;
}