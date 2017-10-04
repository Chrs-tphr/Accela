var myCapId = "BLD17-00076";
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
	
	function viewObj(obj){
		for(var key in obj){
			if(typeof obj[key] == 'function')
				logDebug(key + '()');
			else
				logDebug(key + ": " + obj[key]);
		}
	}
	
	function doesContractorHaveValidBusinessLicense(capId){
		var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
		if(capLicenseResult.getSuccess()){
			var capLicenseArr = capLicenseResult.getOutput();
			if(capLicenseArr !== null){
				if(capLicenseArr.length > 0){
					licProfScriptModel = capLicenseArr[0];
					licModel = licProfScriptModel.getLicenseProfessionalModel();
					rlpId = licProfScriptModel.getLicenseNbr();
//					logDebug("Current transactional license number " + rlpId);
					
					//lp info
					var lpBusinessLicense = licProfScriptModel.getBusinessLicense();
					logDebug("lpBusinessLicense: "+lpBusinessLicense);
										
					if(lpBusinessLicense){
						//get business license record
						var licenseCapIdModel = aa.cap.getCapID(lpBusinessLicense).getOutput();
						var contractorLic = aa.expiration.getLicensesByCapID(licenseCapIdModel).getOutput();
						var bLExpStatus = contractorLic.getExpStatus();
						logDebug("Found Business License: "+lpBusinessLicense+", with expiration status of: "+bLExpStatus);
						if(matches(bLExpStatus,"Active","About to Expire")){
							return true;
						}else{
							return false;
						}
					}else{
						logDebug("No Business License attached to contractor");
						return false;
					}
				}
			}else{
				logDebug("No LP's on record");
				return false;
			}
		}
		return false;
	}
	
	function doesContractorHaveClassCode(capId,reqCCode){//reqCCode = comma separated, no space.
		var reqCCode = reqCCode.split(",");
		var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
		if(capLicenseResult.getSuccess()){
			var capLicenseArr = capLicenseResult.getOutput();
			if(capLicenseArr !== null){
				if(capLicenseArr.length > 0){
					licProfScriptModel = capLicenseArr[0];
					licModel = licProfScriptModel.getLicenseProfessionalModel();
					
					//get lp attributes
					var lpAttrList = licProfScriptModel.getAttributes();
					var lpClassCodeArray = [];
					for(i in lpAttrList){
						var thisAttr = lpAttrList[i];
						
						if(matches(thisAttr.getAttributeName(),"CLASS CODE 1","CLASS CODE 2","CLASS CODE 3","CLASS CODE 4")){
							lpClassCode = thisAttr.getAttributeValue();
							if(exists(lpClassCode,reqCCode)){
								logDebug("Contractor has required Class Code "+reqCCode);
								return true;
							}
						}
					}
					logDebug("Contractor does not have required Class Code "+reqCCode+" for permit type");
					showMessage = true; comment("Contractor does not have required Class Code "+reqCCode+" for permit type");
					return false;
				}
			}else{
				logDebug("No LP's on record");
				showMessage = true; comment("No LP's on record");
				return false;
			}
		}
		logDebug("No LP's on record");
		showMessage = true; comment("No LP's on record");
		return false;
	}
	
	var conBL = doesContractorHaveValidBusinessLicense(capId);
	var conCC = doesContractorHaveClassCode(capId,"A,C10");
	
	logDebug("conBL: "+conBL);
	logDebug("conCC: "+conCC);
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)