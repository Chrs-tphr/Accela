var myCapId = "";
var myUserId = "ADMIN";

/* ASB  */  //var eventName = "ApplicationSubmitBefore";
/* ASA  */  var eventName = "ApplicationSubmitAfter";
/* ASUB  */  //var eventName = "ApplicationStatusUpdateBefore";
/* ASUA  */  //var eventName = "ApplicationStatusUpdateAfter";
/* WTUA */  //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "taskName"; wfStatus = "taskStatus";  wfDateMMDDYYYY = "01/01/2016";
/* WTUB */  //var eventName = "WorkflowTaskUpdateBefore"; wfTask = "taskName"; wfStatus = "taskStatus";  wfDateMMDDYYYY = "01/01/2016";
/* IRSA */  //var eventName = "InspectionResultSubmitAfter"; inspResult = "result"; inspResultComment = "comment";  inspType = "inspName"; wfTask = "taskName";
/* ISA  */  //var eventName = "InspectionScheduleAfter"; inspType = "inspName";
/* ISB ALT */ //var eventName = "InspectionMultipleScheduleBefore"; inspType = "inspName"; wfTask = "taskName"; balanceDue = 0;
/* PRA  */  //var eventName = "PaymentReceiveAfter";  
/* ASIUA */ //var eventName = "ApplicationSpecificInfoUpdateAfter";
/* WTUB */  //var eventName = "WorkflowAdhocTaskUpdateBefore";
/* WTUA */  //var eventName = "WorkflowAdhocTaskUpdateAfter";
/* DUA */  //var eventName = "DocumentUploadAfter";

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = false; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

//
// User code goes here
//

try {
	showDebug = true;
//INSERT TEST CODE START
	
	function viewObj(log, obj){
		logDebug("---- "+log+" start ----");
		var outputArray = [];
		for(var key in obj){
			if(typeof obj[key] == 'function')
				outputArray.push(key + '()');
			else
				outputArray.push(key + ": " + obj[key]);
		}
		outputArray.sort();
		for(i=1;i<outputArray.length;i++){
			logDebug(outputArray[i]);
		}
		logDebug("---- "+log+" end ----");
	}
	
	function elapsed(){
		var thisDate = new Date();
		var thisTime = thisDate.getTime();
		return ((thisTime - startTime) / 1000)
	}
	var startDate = new Date();
	var startTime = startDate.getTime();
	var maxSeconds = 290;
	
	var incCapArr = [];
	var incCapCount = 0;
	
	
	
	
	///*
	
	
	
	var capListSR = aa.cap.getCapIDList();
	if(capListSR.getSuccess()){
		var capList = capListSR.getOutput();
		var capListLength = capList.length;
		logDebug("capListLength: "+capListLength);
		if(capListLength > 0){
			for(i=0; i<capListLength; i++){
				var rTime = elapsed();
				if (rTime > maxSeconds) { // only continue if time hasn't expired
					logDebug("WARNING","A script timeout has caused partial completion of this process.  Please re-run.  " + rTime + " seconds elapsed, " + maxSeconds + " allowed.") ;
					timeExpired = true;
					break;
				}
				
				var thisCap = capList[i]; //*Class = CapIDScriptModel*/ viewObj("thisCap", thisCap);
				
				var capId = aa.cap.getCapID(thisCap.getID1(), thisCap.getID2(), thisCap.getID3()).getOutput(); //*Class = CapIDModel*/ viewObj("capId", capId);
				
				var capModel = aa.cap.getCapByPK(thisCap.getCapID(),true).getOutput(); /*Class = CapModel*/ viewObj("capModel", capModel);
				
//				var capScriptModel = aa.cap.getCap(capId).getOutput(); /*Class = CapScriptModel*/ viewObj("capScriptModel", capScriptModel);
				
				break;
				
				if(capModel){
					if(capModel.getAuditStatus() != "A")continue;
					if(capModel.isCompleteCap())continue;
					logDebug("capModel.getAuditStatus(): "+capModel.getAuditStatus());
					logDebug("capModel.getCapClass(): "+capModel.getCapClass());
					logDebug("capModel.isCompleteCap(): "+capModel.isCompleteCap());
					logDebug("capModel.isCreatedByACA(): "+capModel.isCreatedByACA());
					logDebug("capModel.getFileDate(): "+capModel.getFileDate());
					if(!capModel.isCompleteCap()){
						
//						incCapArr.push(cap);
						incCapCount++;
						if(incCapCount > 1)break;
					}
				}
			}
			
			logDebug("RunTime: "+rTime+", Checked: "+i+" of "+capListLength+" records, found "+incCapCount+" Incomplete");
			
		}else{
			logDebug("ERROR no caps in list");
		}
	}else{
		logDebug("ERROR no capListSR");
	}
	
	
	
	//*/
	
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)