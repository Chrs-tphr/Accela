var myCapId = "replaceWithAltId";
var myUserId = "ADMIN";

/* ASB  */  //var eventName = "ApplicationSubmitBefore";
/* ASA  */  //var eventName = "ApplicationSubmitAfter";
/* ASUB  */  //var eventName = "ApplicationStatusUpdateBefore";
/* ASUA  */  //var eventName = "ApplicationStatusUpdateAfter";
/* WTUA */  var eventName = "WorkflowTaskUpdateAfter"; wfTask = "taskName"; wfStatus = "taskStatus"; wfDateMMDDYYYY = "01/01/2016";
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
	
	var capLPResult = aa.licenseScript.getLicenseProf(capId);
	if(capLPResult.getSuccess()){
		capLPArr = capLPResult.getOutput();
		if(capLPArr.length){
			for(i=0;i<capLPArr.length;i++){
				var licProfScriptModel = capLPArr[i];
				var lPCount = i+1;
				logDebug("----- Info for Cap LP #"+lPCount)
				logDebug("getAddress1(): "+licProfScriptModel.getAddress1())
				logDebug("getAddress2(): "+licProfScriptModel.getAddress2())
				logDebug("getAddress3(): "+licProfScriptModel.getAddress3())
				logDebug("getAgencyCode(): "+licProfScriptModel.getAgencyCode())
				logDebug("getAttributes(): "+licProfScriptModel.getAttributes())
				if(licProfScriptModel.getAttributes()){
					var attrList = licProfScriptModel.getAttributes()
					for(i in attrList){
						thisAttr = attrList[i]
						logDebug("- - - - - "+attrList[i].getAttributeName()+" = "+attrList[i].getAttributeValue())
					}
				}
				logDebug("getAuditDate(): "+licProfScriptModel.getAuditDate())
				logDebug("getAuditID(): "+licProfScriptModel.getAuditID())
				logDebug("getAuditStatus(): "+licProfScriptModel.getAuditStatus())
				logDebug("getBirthDate(): "+licProfScriptModel.getBirthDate())
				logDebug("getBusinessLicense(): "+licProfScriptModel.getBusinessLicense())
				logDebug("getBusinessName(): "+licProfScriptModel.getBusinessName())
				logDebug("getBusName2(): "+licProfScriptModel.getBusName2())
				logDebug("getCapID(): "+licProfScriptModel.getCapID())
				logDebug("getCity(): "+licProfScriptModel.getCity())
				logDebug("getCityCode(): "+licProfScriptModel.getCityCode())
				logDebug("getClassCode(): "+licProfScriptModel.getClassCode())
				logDebug("getComment(): "+licProfScriptModel.getComment())
				logDebug("getContactFirstName(): "+licProfScriptModel.getContactFirstName())
				logDebug("getContactLastName(): "+licProfScriptModel.getContactLastName())
				logDebug("getContactMiddleName(): "+licProfScriptModel.getContactMiddleName())
				logDebug("getCountry(): "+licProfScriptModel.getCountry())
				logDebug("getCountryCode(): "+licProfScriptModel.getCountryCode())
				logDebug("getEinSs(): "+licProfScriptModel.getEinSs())
				logDebug("getEmail(): "+licProfScriptModel.getEmail())
				logDebug("getFax(): "+licProfScriptModel.getFax())
				logDebug("getFaxCountryCode(): "+licProfScriptModel.getFaxCountryCode())
				logDebug("getFein(): "+licProfScriptModel.getFein())
				logDebug("getGender(): "+licProfScriptModel.getGender())
				logDebug("getHoldCode(): "+licProfScriptModel.getHoldCode())
				logDebug("getHoldDesc(): "+licProfScriptModel.getHoldDesc())
				logDebug("getInfoTableColumnModel(): "+licProfScriptModel.getInfoTableColumnModel())
				logDebug("getInfoTableGroupCodeModel(): "+licProfScriptModel.getInfoTableGroupCodeModel())
				logDebug("getInfoTableSubgroupModel(): "+licProfScriptModel.getInfoTableSubgroupModel())
				logDebug("getInfoTableValueModel(): "+licProfScriptModel.getInfoTableValueModel())
				logDebug("getLastRenewalDate(): "+licProfScriptModel.getLastRenewalDate())
				logDebug("getLastUpdateDate(): "+licProfScriptModel.getLastUpdateDate())
				logDebug("getLicenseBoard(): "+licProfScriptModel.getLicenseBoard())
				logDebug("getLicenseExpirDate(): "+licProfScriptModel.getLicenseExpirDate())
				logDebug("getLicenseNbr(): "+licProfScriptModel.getLicenseNbr())
				logDebug("getLicenseProfessionalModel(): "+licProfScriptModel.getLicenseProfessionalModel())
				logDebug("getLicenseType(): "+licProfScriptModel.getLicenseType())
				logDebug("getLicesnseOrigIssueDate(): "+licProfScriptModel.getLicesnseOrigIssueDate())
				logDebug("getMaskedSsn(): "+licProfScriptModel.getMaskedSsn())
				logDebug("getPhone1(): "+licProfScriptModel.getPhone1())
				logDebug("getPhone1CountryCode(): "+licProfScriptModel.getPhone1CountryCode())
				logDebug("getPhone2(): "+licProfScriptModel.getPhone2())
				logDebug("getPhone2CountryCode(): "+licProfScriptModel.getPhone2CountryCode())
				logDebug("getPhone3(): "+licProfScriptModel.getPhone3())
				logDebug("getPhone3CountryCode(): "+licProfScriptModel.getPhone3CountryCode())
				logDebug("getPostOfficeBox(): "+licProfScriptModel.getPostOfficeBox())
				logDebug("getPrimStatusCode(): "+licProfScriptModel.getPrimStatusCode())
				logDebug("getPrintFlag(): "+licProfScriptModel.getPrintFlag())
				logDebug("getSalutation(): "+licProfScriptModel.getSalutation())
				logDebug("getSelfIns(): "+licProfScriptModel.getSelfIns())
				logDebug("getSerDes(): "+licProfScriptModel.getSerDes())
				logDebug("getSocialSecurityNumber(): "+licProfScriptModel.getSocialSecurityNumber())
				logDebug("getState(): "+licProfScriptModel.getState())
				logDebug("getSuffixName(): "+licProfScriptModel.getSuffixName())
				logDebug("getTitle(): "+licProfScriptModel.getTitle())
				logDebug("getTypeFlag(): "+licProfScriptModel.getTypeFlag())
				logDebug("getWorkCompExempt(): "+licProfScriptModel.getWorkCompExempt())
				logDebug("getZip(): "+licProfScriptModel.getZip())
			}
		}else{
			logDebug("WARNING: no license professional available on the application:");
		}
	}else{ 
		logDebug("**ERROR: getting Cap LP: " + capLPResult.getErrorMessage());
	}
		
		
	
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)