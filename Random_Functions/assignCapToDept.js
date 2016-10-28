function assignCapToDept(deptName, capId){//update to compare existing department to new department and break if matches
	var deptResult = aa.people.getDepartmentList(null);
	if (deptResult.getSuccess()){
		var depts = deptResult.getOutput(), deptFound = false, dept = null;
		for (var i=0;i<depts.length;i++){
			if (depts[i].getDeptName() == deptName){
				logDebug("Department " + deptName + " found.");
				deptFound = true;
				dept = depts[i];
				
				// get the cap detail
				var capDetailResult = aa.cap.getCapDetail(capId);
				if (capDetailResult.getSuccess()){
					var capDetailModel = capDetailResult.getOutput().getCapDetailModel();
					var cAsgnedDept = capDetailModel.getAsgnDept();//gets current assigned to department to compare below
					if (cAsgnedDept == dept.toString()) logDebug("New department is same as current department, not updating Assigned To"); break;//returns debug message and cancels update
					capDetailModel.setAsgnDept(dept.toString());
					
					// write changes to cap detail
					var capDetailEditResult = aa.cap.editCapDetail(capDetailModel);
					if (capDetailEditResult.getSuccess()){
						logDebug("Successfully updated department to " + deptName);
					} else {
						logDebug("ERROR: Unable to write department to cap detail. " + capDetailEditResult.getErrorType() + " " + capDetailEditResult.getErrorMessage());
					}
				} else {
					aa.print("ERROR: Unable to get cap detail. " + capDetailResult.getErrorType() + " " + capDetailResult.getErrorMessage());
				}
				
				break;
			}
		}
		if (!deptFound) logDebug("Department " + deptName + " not found.");
	} else {
		logDebug("ERROR: Unable to get department list. " + deptResult.getErrorType() + " " + deptResult.getErrorMessage());
	}
}