//post training exercise 1 START
if(wfTask == "Application Acceptance" && wfStatus == "Accepted - Plan Review Not Req"){
	updateFee("APPLFEE","BLD_GENERAL","FINAL",1,"Y");
}
//post training exercise 1 END

//post training exercise 4 START
if(wfTask == "Application Acceptance" && wfStatus == "Accepted - Plan Review Not Req"){
	closeTask('Permit Issuance', 'Issued', 'Workflow Task Permit Issuanc was closed Via Script');
	editAppSpecific('Permit Expiration Date', dateAdd(null,180));
	scheduleInspectDate("Set Backs",dateAdd(null,30),null);
	addStdCondition('Building Permit', 'As Built Plans');
}
//post training exercise 4 END