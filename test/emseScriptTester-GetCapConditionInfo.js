var myCapId = "BLD05-00100";
var myUserId = "ADMIN";
var condNum = "";

/* ASB  */  //var eventName = "ApplicationSubmitBefore";
/* ASA  */  var eventName = "ApplicationSubmitAfter";
/* ASUB  */  //var eventName = "ApplicationStatusUpdateBefore";
/* ASUA  */  //var eventName = "ApplicationStatusUpdateAfter";
/* WTUA */  //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "taskName"; wfStatus = "taskStatus"; wfDateMMDDYYYY = "01/01/2016";
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
	
	var capCondResult = aa.capCondition.getCapConditions(capId);
	
	if(!capCondResult.getSuccess()){
		logDebug("**WARNING: error getting cap conditions : " + capCondResult.getErrorMessage());
		return false;
	}
	
	var ccs = capCondResult.getOutput();
	var count = 1;
	for(pc1 in ccs){
		logDebug("Condition: "+i); i++;
		logDebug("getActionDepartmentName: "+ccs[pc1].getActionDepartmentName());
		logDebug("getAdditionalInformation: "+ccs[pc1].getAdditionalInformation());
		logDebug("getAppliedDepartmentName: "+ccs[pc1].getAppliedDepartmentName());
		logDebug("getAuditID: "+ccs[pc1].getAuditID());
		logDebug("getAuditStatus: "+ccs[pc1].getAuditStatus());
		logDebug("getConditionComment: "+ccs[pc1].getConditionComment());
		logDebug("getConditionDescription: "+ccs[pc1].getConditionDescription());
		logDebug("getConditionGroup: "+ccs[pc1].getConditionGroup());
		logDebug("getConditionNumber: "+ccs[pc1].getConditionNumber());
		logDebug("getConditionStatus: "+ccs[pc1].getConditionStatus());
		logDebug("getConditionStatusAndTypeValue: "+ccs[pc1].getConditionStatusAndTypeValue());
		logDebug("getConditionStatusType: "+ccs[pc1].getConditionStatusType());
		logDebug("getConditionType: "+ccs[pc1].getConditionType());
		logDebug("getDispConditionComment: "+ccs[pc1].getDispConditionComment());
		logDebug("getDispConditionDescription: "+ccs[pc1].getDispConditionDescription());
		logDebug("getDisplayConditionNotice: "+ccs[pc1].getDisplayConditionNotice());
		logDebug("getDisplayConditionStatusAndType: "+ccs[pc1].getDisplayConditionStatusAndType());
		logDebug("getDisplayNoticeOnACA: "+ccs[pc1].getDisplayNoticeOnACA());
		logDebug("getDisplayNoticeOnACAFee: "+ccs[pc1].getDisplayNoticeOnACAFee());
		logDebug("getDispLongDescripton: "+ccs[pc1].getDispLongDescripton());
		logDebug("getDispPublicDisplayMessage: "+ccs[pc1].getDispPublicDisplayMessage());
		logDebug("getDispResolutionAction: "+ccs[pc1].getDispResolutionAction());
		logDebug("getEffectDate: "+ccs[pc1].getEffectDate());
		logDebug("getEntityPK: "+ccs[pc1].getEntityPK());
		logDebug("getExpireDate: "+ccs[pc1].getExpireDate());
		logDebug("getImpactCode: "+ccs[pc1].getImpactCode());
		logDebug("getIncludeInConditionName: "+ccs[pc1].getIncludeInConditionName());
		logDebug("getIncludeInShortDescription: "+ccs[pc1].getIncludeInShortDescription());
		logDebug("getInheritable: "+ccs[pc1].getInheritable());
		logDebug("getIssuedByUser: "+ccs[pc1].getIssuedByUser());
		logDebug("getIssuedDate: "+ccs[pc1].getIssuedDate());
		logDebug("getLongDescripton: "+ccs[pc1].getLongDescripton());
		logDebug("getNoticeActionType: "+ccs[pc1].getNoticeActionType());
		logDebug("getPublicDisplayMessage: "+ccs[pc1].getPublicDisplayMessage());
		logDebug("getRefNumber1: "+ccs[pc1].getRefNumber1());
		logDebug("getRefNumber2: "+ccs[pc1].getRefNumber2());
		logDebug("getResColumns: "+ccs[pc1].getResColumns());
		logDebug("getResConditionComment: "+ccs[pc1].getResConditionComment());
		logDebug("getResConditionDescription: "+ccs[pc1].getResConditionDescription());
		logDebug("getResId: "+ccs[pc1].getResId());
		logDebug("getResLangId: "+ccs[pc1].getResLangId());
		logDebug("getResLongDescripton: "+ccs[pc1].getResLongDescripton());
		logDebug("getResolutionAction: "+ccs[pc1].getResolutionAction());
		logDebug("getResPublicDisplayMessage: "+ccs[pc1].getResPublicDisplayMessage());
		logDebug("getResResolutionAction: "+ccs[pc1].getResResolutionAction());
		logDebug("getServiceProviderCode: "+ccs[pc1].getServiceProviderCode());
		logDebug("getSourceNumber: "+ccs[pc1].getSourceNumber());
		logDebug("hasResource: "+ccs[pc1].hasResource());
	}
	
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)