var myCapId = "EQP-20180340"; //"INCOMPLETE APP-20180571";
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
	
//	viewObj("capId",capId);

	var capModel = aa.cap.getCapByPK(capId,true).getOutput(); //*Class = CapModel*/ viewObj("capModel", capModel);
	
	logDebug(br+"altId|"+capModel.getAltID()+"|File Date|"+capModel.getFileDate()+"|Cap Class|"+capModel.getCapClass()+"|Audit Status|"+capModel.getAuditStatus()+"|Complete|"+capModel.isCompleteCap());
	
	var capScriptModel = aa.cap.getCap(capId).getOutput(); //*Class = CapScriptModel*/ viewObj("capScriptModel", capScriptModel);
	
	var activeRecs = 0;
	var incCapCount = 0;
	
	if(capModel){
		activeRecs++;
//		if(capModel.getAuditStatus() != "A")continue;
//		if(capModel.isCompleteCap())continue;
//		if(!matches(capModel.getCapClass(),"INCOMPLETE CAP","INCOMPLETE EST"))continue;
//		if(!capModel.getCreatedByACA())continue;
		
		var puId = capModel.getCreatedBy(); //get submitted by userid
		var uid = aa.person.getUser(puId).getOutput(); //get sysuser by userid
		var uEmail = uid.getEmail(); //gets submitted by email
		var aTypeAlias = capModel.getAppTypeAlias();

		logDebug("aTypeAlias: "+aTypeAlias);
		logDebug("uEmail: "+uEmail);
		
		if(!matches(uEmail,null,"",undefined)) {
			
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$recordType$$", aTypeAlias);
			
			var emailCC = "";
			var reportFile = new Array();
			
			itemCap = capId;
			
			
			sendNotification(agencyEmailFrom, "cisensano@yahoo.com", "","ACA_INCOMPLETE_CAP", eParams, null);
//			aa.document.sendEmailAndSaveAsDocument(agencyEmailFrom, uEmail, "", "ACA_INCOMPLETE_CAP", eParams, capScriptModel, reportFile);
//			aa.document.sendEmailByTemplateName(agencyEmailFrom, uEmail, "", "ACA_INCOMPLETE_CAP", eParams, null);
			
//			var result = null;
//			result = aa.document.sendEmailAndSaveAsDocument(agencyEmailFrom, uEmail, emailCC, "ACA_INCOMPLETE_CAP", eParams, capScriptModel, reportFile);
//			if(result.getSuccess()){
//				logDebug("Sent email successfully!");
//			}else{
//				logDebug("Failed to send mail. - " + result.getErrorType());
//			}
//		}else{
//			logDebug("No email address found for logged in user");
		}
//		viewObj("uid",uid);
		incCapCount++;
		logDebug("activeRecs: "+activeRecs)
	}
	
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)