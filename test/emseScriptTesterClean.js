var myCapId = "BLD17-00078";
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

	function setAgencyTsiInfo(){
		var agencyName;
		//AQMD Asbestos Demo/Removal
		agencyName == "AQMD Asbestos Demo/Removal";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//AQMD Small Business Assistance
		agencyName == "AQMD Small Business Assistance";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//CAL/OSHA
		agencyName == "CAL/OSHA";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//Castaic Lake Water Agency
		agencyName == "Castaic Lake Water Agency";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//City Address Assignment
		agencyName == "City Address Assignment";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//City Engineering Services
		agencyName == "City Engineering Services";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//City Environmental Services
		agencyName == "City Environmental Services";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//City Landscape Maint Division
		agencyName == "City Landscape Maint Division";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//City Planning
		agencyName == "City Planning";
		editTaskSpecific(agencyName,"Address","23920 VALENCIA BOULEVARD, SUITE 140, SANTA CLARITA, CA 91355");
		editTaskSpecific(agencyName,"Hours","7:30 AM - 5:30 PM (M-TH), 8 AM - 5 PM (F)");
		editTaskSpecific(agencyName,"Phone Number","(661)255-4330");
		editTaskSpecific(agencyName,"Requirements","PLANNING APPROVAL STAMP ON FINAL PLANS REQUIRED");
		
		//City Urban Forestry Oaks
		agencyName == "City Urban Forestry Oaks";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Env Health Septic
		agencyName == "County Env Health Septic";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Fire Petrochem
		agencyName == "County Fire Petrochem";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Fire Prevention
		agencyName == "County Fire Prevention";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Health Radiation Mgmt
		agencyName == "County Health Radiation Mgmt";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Health Services Food
		agencyName == "County Health Services Food";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Industrial Waste
		agencyName == "County Industrial Waste";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Recreational Waters
		agencyName == "County Recreational Waters";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//County Sanitation District
		agencyName == "County Sanitation District";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//Dept of Consv Oil Gas Geo
		agencyName == "Dept of Consv Oil Gas Geo";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//School District Elementary
		agencyName == "School District Elementary";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//School District Wm S Hart
		agencyName == "School District Wm S Hart";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
		
		//Southern California Edison
		agencyName == "Southern California Edison";
		editTaskSpecific(agencyName,"Address","");
		editTaskSpecific(agencyName,"Hours","");
		editTaskSpecific(agencyName,"Phone Number","");
		editTaskSpecific(agencyName,"Requirements","");
	}
	
	setAgencyTsiInfo();

//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)