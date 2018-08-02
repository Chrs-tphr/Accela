function getWorkflowTaskAssignedToStaffId(taskName){//optional param to specify capId to get userId from
	var atsid = null;
	var xCapId = capId;
	if(arguments.length == 2)
		xCapId = arguments[1];
	var workflowResult = aa.workflow.getTasks(xCapId);
	if(workflowResult.getSuccess()){
		var wfObj = workflowResult.getOutput();
		for(i in wfObj){
			var thisTask = wfObj[i];
			if(thisTask.getTaskDescription() == taskName){
				var asfn = thisTask.getAssignedStaff().getFirstName();
				var asmn = thisTask.getAssignedStaff().getMiddleName();
				var asln = thisTask.getAssignedStaff().getLastName();
				if(asfn && asln){
					var atsid = aa.person.getUser(asfn,asmn,asln).getOutput().getUserID();
					logDebug("   assignedUserId: "+atsid);
				}else{
					logDebug(taskName+" is not assigned");
				}
			}
		}
	}
	return atsid;
}