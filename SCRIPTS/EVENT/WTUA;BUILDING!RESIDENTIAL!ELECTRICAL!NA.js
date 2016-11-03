//individual exercise 1 START
if(wfTask == "Application Submittal" && wfStatus == "Accepted - Plan Review Req"){
	updateFee("BLD_030", "BLD_GENERAL","FINAL",1,"Y");
}
//individual exercise 1 END

//individual exercise 2 START
if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
	editAppSpecific("Permit Expiration Date",dateAdd(wfDateMMDDYYYY,180));
	scheduleInspectDate("Electrical Final",dateAdd(wfDateMMDDYYYY,15,"Y"),"ADMIN");
}
//individual exercise 2 END