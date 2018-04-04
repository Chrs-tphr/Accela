var myCapId = "doNotUse";
var refLPNum = "replaceWithStateLicNum";
var myUserId = "ADMIN";

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
	
	var refLPModel = getRefLicenseProf(refLPNum);
	if(!refLPModel){
		logDebug("Ref LP " + refLPNum + " not found");
	}else if(refLPModel){
		logDebug("Log Ref LP info for #: "+refLPNum);
		logDebug("getAcaPermission(): "+refLPModel.getAcaPermission())
		logDebug("getAddress1(): "+refLPModel.getAddress1())
		logDebug("getAddress2(): "+refLPModel.getAddress2())
		logDebug("getAddress3(): "+refLPModel.getAddress3())
		logDebug("getAgencyCode(): "+refLPModel.getAgencyCode())
		
		logDebug("getAuditDate(): "+refLPModel.getAuditDate())
		logDebug("getAuditID(): "+refLPModel.getAuditID())
		logDebug("getAuditStatus(): "+refLPModel.getAuditStatus())
		logDebug("getBusinessLicense(): "+refLPModel.getBusinessLicense())
		logDebug("getBusinessLicExpDate(): "+refLPModel.getBusinessLicExpDate())
		logDebug("getBusinessName(): "+refLPModel.getBusinessName())
		logDebug("getBusinessName2(): "+refLPModel.getBusinessName2())
		logDebug("getCity(): "+refLPModel.getCity())
		logDebug("getCityCode(): "+refLPModel.getCityCode())
		logDebug("getComment(): "+refLPModel.getComment())
		logDebug("getContactFirstName(): "+refLPModel.getContactFirstName())
		logDebug("getContactLastName(): "+refLPModel.getContactLastName())
		logDebug("getContactMiddleName(): "+refLPModel.getContactMiddleName())
		logDebug("getContLicBusName(): "+refLPModel.getContLicBusName())
		logDebug("getContrLicNo(): "+refLPModel.getContrLicNo())
		logDebug("getContryCode(): "+refLPModel.getContryCode())
		logDebug("getCountry(): "+refLPModel.getCountry())
		logDebug("getCountryCode(): "+refLPModel.getCountryCode())
		logDebug("getEinSs(): "+refLPModel.getEinSs())
		logDebug("getEMailAddress(): "+refLPModel.getEMailAddress())
		logDebug("getFax(): "+refLPModel.getFax())
		logDebug("getFaxCountryCode(): "+refLPModel.getFaxCountryCode())
		logDebug("getFein(): "+refLPModel.getFein())
		logDebug("getHoldCode(): "+refLPModel.getHoldCode())
		logDebug("getHoldDesc(): "+refLPModel.getHoldDesc())
		logDebug("getInfoTableGroupCodeModel(): "+refLPModel.getInfoTableGroupCodeModel())
		logDebug("getInsuranceAmount(): "+refLPModel.getInsuranceAmount())
		logDebug("getInsuranceCo(): "+refLPModel.getInsuranceCo())
		logDebug("getInsuranceExpDate(): "+refLPModel.getInsuranceExpDate())
		logDebug("getLicenseBoard(): "+refLPModel.getLicenseBoard())
		logDebug("getLicenseExpirationDate(): "+refLPModel.getLicenseExpirationDate())
		logDebug("getLicenseIssueDate(): "+refLPModel.getLicenseIssueDate())
		logDebug("getLicenseLastRenewalDate(): "+refLPModel.getLicenseLastRenewalDate())
		logDebug("getLicenseModel(): "+refLPModel.getLicenseModel())
		logDebug("getLicenseType(): "+refLPModel.getLicenseType())
		logDebug("getLicOrigIssDate(): "+refLPModel.getLicOrigIssDate())
		logDebug("getLicSeqNbr(): "+refLPModel.getLicSeqNbr())
		logDebug("getLicState(): "+refLPModel.getLicState())
		logDebug("getMaskedSsn(): "+refLPModel.getMaskedSsn())
		logDebug("getPeopleAttributeScriptModels(): "+refLPModel.getPeopleAttributeScriptModels())
		logDebug("getPermStatusCode(): "+refLPModel.getPermStatusCode())
		logDebug("getPhone1(): "+refLPModel.getPhone1())
		logDebug("getPhone1CountryCode(): "+refLPModel.getPhone1CountryCode())
		logDebug("getPhone2(): "+refLPModel.getPhone2())
		logDebug("getPhone2CountryCode(): "+refLPModel.getPhone2CountryCode())
		logDebug("getPhone3(): "+refLPModel.getPhone3())
		logDebug("getPhone3CountryCode(): "+refLPModel.getPhone3CountryCode())
		logDebug("getPolicy(): "+refLPModel.getPolicy())
		logDebug("getRecLocd(): "+refLPModel.getRecLocd())
		logDebug("getRecSecurity(): "+refLPModel.getRecSecurity())
		logDebug("getSelfIns(): "+refLPModel.getSelfIns())
		logDebug("getServiceProviderCode(): "+refLPModel.getServiceProviderCode())
		logDebug("getSocialSecurityNumber(): "+refLPModel.getSocialSecurityNumber())
		logDebug("getState(): "+refLPModel.getState())
		logDebug("getStateLicense(): "+refLPModel.getStateLicense())
		logDebug("getSuffixName(): "+refLPModel.getSuffixName())
		logDebug("getTypeFlag(): "+refLPModel.getTypeFlag())
		logDebug("getWcCancDate(): "+refLPModel.getWcCancDate())
		logDebug("getWcEffDate(): "+refLPModel.getWcEffDate())
		logDebug("getWcExempt(): "+refLPModel.getWcExempt())
		logDebug("getWcExpDate(): "+refLPModel.getWcExpDate())
		logDebug("getWcInsCoCode(): "+refLPModel.getWcInsCoCode())
		logDebug("getWcIntentToSuspNtcSentDate(): "+refLPModel.getWcIntentToSuspNtcSentDate())
		logDebug("getWcPolicyNo(): "+refLPModel.getWcPolicyNo())
		logDebug("getWcSuspendDate(): "+refLPModel.getWcSuspendDate())
		logDebug("getZip(): "+refLPModel.getZip())
		
//		logDebug("getAttributes(): "+refLPModel.getAttributes())// added below to log each attribute and value
		var peopAttrResult = aa.people.getPeopleAttributeByPeople(refLPModel.getLicSeqNbr(), refLPModel.getLicenseType());
		if(peopAttrResult.getSuccess()){
			var peopAttrArray = peopAttrResult.getOutput();
			for(i in peopAttrArray){
				var lpClassCode = peopAttrArray[i].getAttributeValue();
				logDebug(peopAttrArray[i].getAttributeName()+": "+lpClassCode);
			}
		}
//		editRefLicProfAttribute(refLPNum, "replace with attr field name", "replace with attr value");//use this to edit an attribute value
//		refLPModel.setAcaPermission("N");
		refLPModel.setInsuranceCo("ACT!VE");
		aa.licenseScript.editRefLicenseProf(refLPModel);
	}
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)