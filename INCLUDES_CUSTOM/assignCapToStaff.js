function assignCapToStaff(assignId){ // optional CapId
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args
	var cAssgndStaff = getAssignedStaff();//get current assigned to staff to compare below
	if(assignId == cAssgndStaff){ logDebug("New Staff is same as current staff, not updating Assigned To"); return false; }//prevents update if no change
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()){ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()); return false; }
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj){ logDebug("**ERROR: No cap detail script object"); return false; }
	cd = cdScriptObj.getCapDetailModel();
	iNameResult  = aa.person.getUser(assignId);
	if (!iNameResult.getSuccess()){ logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage()); return false; }
	iName = iNameResult.getOutput();
	cd.setAsgnDept(iName.getDeptOfUser());
	cd.setAsgnStaff(assignId);
	cdWrite = aa.cap.editCapDetail(cd)
	if (cdWrite.getSuccess()){ logDebug("Assigned CAP to " + assignId); }
	else { logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()); return false; }
}