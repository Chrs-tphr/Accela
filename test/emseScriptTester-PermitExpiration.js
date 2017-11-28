var myCapId = "replaceWithAltId";
var myUserId = "ADMIN";

/* ASB  */  //var eventName = "ApplicationSubmitBefore";
/* ASA  */  //var eventName = "ApplicationSubmitAfter";
/* ASUB  */  //var eventName = "ApplicationStatusUpdateBefore";
/* ASUA  */  var eventName = "ApplicationStatusUpdateAfter";
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
	
	function mainProcess() {
		var testAltId = "BLD17-01028";
		var capFilterType = 0;
		var capFilterStatus = 0;
		var capFilterExpirationDate = 0;
		var capCount = 0;
		var capsWithIssuedDate = 0;
		var myCaps;
		var today = new Date();
		var tDay = today.getMonth()+"/"+today.getDate()+"/"+today.getFullYear();

		var capResult = aa.cap.getByAppType("Building", "Permit", "NA", "NA");
		if (capResult.getSuccess()) {
			myCaps = capResult.getOutput();
			logDebug("Processing " + myCaps.length + " records");
		} else {
			logDebug("ERROR: Getting records, reason is: " + capResult.getErrorType() + ":" + capResult.getErrorMessage());
		}
		
		var capStatus, count;
		var counts = {};

		for (index in myCaps){
		    
			cap = myCaps[index];
			capId = cap.getCapID();
			altId = capId.getCustomID();

			if(altId != testAltId)continue;
			
//			capStatus = cap.getCapStatus();
//		    count = counts[capStatus];
//		    counts[capStatus] = count ? count + 1 : 1;
		    
//		    if(capStatus && matches(capStatus,"Issued","Permit Issued","Finaled","Inactive","Cancelled","X_Cancelled","Denied"))continue;
		    
			if(!matches(altId.slice(0,3),"BLD","MEP"))continue;
			
//			var permitIssued = getAppSpecific("Permit Issued",capId);
//			
//			if(!matches(permitIssued,"",null))continue;
		    
			if(capCount>1000)break;
			
			logDebug(br+"Processing record: "+altId);
			
			//get asi opened date
			var oDate = getAppSpecific("Application Submittal",capId);
			logDebug("oDate: "+oDate);
			
			if(matches(oDate,null,"null","")){
				logDebug(br+""+altId+": does not have an App Submittal Date.");
				capFilterExpirationDate++;
				continue;
			}
			
//			if(dateDiff(oDate,new Date())>540){
//				logDebug("Application should be Expired");
//				continue;
//			}
			
			//get asi app exp date
			var cExpDate = getAppSpecific("Application Expiration",capId);
			logDebug("cExpDate: "+cExpDate);
			if(matches(cExpDate,null,"null","")){
				logDebug(br+""+altId+": does not have a App Expiration Date.");
				capFilterExpirationDate++;
				continue;
			}
			
			//dst to std is 0.958333333333 under, should be 1
			//std to dst is 1.041666666666 over, should be 1
			
			
			//count days between dates
			var daysBetween = Math.round(dateDiff(oDate, cExpDate));
			logDebug("Existing dates: oDate: "+oDate+", cExpDate: "+cExpDate);
			logDebug("daysBetween: "+daysBetween);
			//populate app exp and ext dates
			if(daysBetween > 360){
				logDebug("Duration: 540");
				//populate asi app exp date
				editAppSpecific("Application Expiration",dateAdd(oDate,540),capId);
				//populate asi app ext date 1
				editAppSpecific("Application Extension",dateAdd(oDate,180),capId);
				//populate asi app ext date 2
				editAppSpecific("2nd Application Extension",dateAdd(oDate,360),capId);
			}else if(daysBetween > 180){
				logDebug("Duration: 360");
				//populate asi app exp date
				editAppSpecific("Application Expiration",dateAdd(oDate,360),capId);
				//populate asi app ext date 1
				editAppSpecific("Application Extension",dateAdd(oDate,180),capId);
			}else{
				logDebug("Duration: 180");
				//populate asi app exp date
				editAppSpecific("Application Expiration",dateAdd(oDate,180),capId);
			}
		    capCount++;
		    
		}
		for(var key in counts){
			logDebug(key+" : "+counts[key]);
		}
	}
	
	mainProcess();
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)