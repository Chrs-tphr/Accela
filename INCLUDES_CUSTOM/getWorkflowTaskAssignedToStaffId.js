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
				var assignedUserId = aa.person.getUser(thisTask.getAssignedStaff().getFirstName(),thisTask.getAssignedStaff().getMiddleName(),thisTask.getAssignedStaff().getLastName()).getOutput().getUserID();
				logDebug("   assignedUserId: "+assignedUserId);
			}
		}
	}
	return atsid;
}