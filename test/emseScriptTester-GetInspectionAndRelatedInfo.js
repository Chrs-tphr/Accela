var myCapId = "replaceWithAltId";
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
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

//
// User code goes here
//

try {
	showDebug = true;
//INSERT TEST CODE START
	
	function viewObj(obj){
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
	}
	
	function convertJsDateToYYYYMMDD(jsdate){
		var d = jsdate.getDate();
		var m = jsdate.getMonth()+1;
		if(m < 10) m = "0"+m;
		var y = jsdate.getFullYear();
		var fDate = y+"-"+m+"-"+d;
		return fDate;
	}
	
	function getDayName(date){
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var dayName = days[date.getDay()];
		return dayName;
	}
	
	function getClockTimeFromJsDate(jsdate){
		var h = jsdate.getHours();
		var m = jsdate.getMinutes();
		var s = jsdate.getSeconds();
		var l = (h < 12) ? "am" : "pm";
		h = (h > 12) ? h-12 : h;
		var ct = h+":"+zeroPad(m,2)+l;
		return ct;
	}
	
	function addMinutesToStringTime(stringTime,minutes){
		var tArr = stringTime.split(":");
		var h = Number(tArr[0]);//logDebug("h: "+h);
		var m = Number(tArr[1]);//logDebug("m: "+m);
		var nm = m+minutes;//logDebug("nm: "+nm);
		var htm = h*60;//logDebug("htm: "+htm);
		var ntm = htm+nm;//logDebug("ntm: "+ntm);
		var nh = parseInt(ntm/60);//logDebug("nh: "+nh);
		var nhtm = nh*60;//logDebug("nhtm: "+nhtm);
		var nm = ntm-nhtm;//logDebug("nm: "+nm);
		if(nh>11){
			var l = "pm";
			if(nh>12){
				nh = nh-12;
			}
		}else{
			var l = "am"
		}
		var nts = nh+":"+zeroPad(nm,2)+l;//logDebug(nts);
		return nts;
	}
	
	getClockTimeFromJsDate(new Date());
	
	var dtest = new Date();
	dtest.setMinutes(dtest.getMinutes()+120);
	logDebug(dtest);
	
	logDebug("jsDate Start and End Test: "+getClockTimeFromJsDate(new Date())+" - "+getClockTimeFromJsDate(dtest));
	
	var br = "<br>";
	
	var fDays = -12;
	var tDays = -12;
	var tWindow = 120;
	
	var fDate = convertJsDateToYYYYMMDD(new Date(dateAdd(null,fDays)));
	logDebug(fDate);
	
	var tDate = convertJsDateToYYYYMMDD(new Date(dateAdd(null,tDays)));
	logDebug(tDate);
	
	var inspectionArray = aa.inspection.getInspections(fDate,tDate);
	if(inspectionArray.getSuccess()){
		var inspArray = inspectionArray.getOutput();
		if(inspArray.length){
			var inspArrayL = inspArray.length; logDebug("----inspArrayL: "+inspArrayL);
			for(i in inspArray){
				var thisInsp = inspArray[i];
//				viewObj(thisInsp);
				
				var inspDetails = thisInsp.getInspection();
//				viewObj(inspDetails);
				
				var type = inspDetails.getInspectionType(); logDebug("----Type: "+type);
				var date = inspDetails.getScheduledDate(); logDebug("----Scheduled Date: "+date);
//				viewObj(date);
				
				var emailDate = ((date.getMonth()+1)+"/"+date.getDate()+"/"+(date.getYear()+1900));
				
				var time2 = inspDetails.getScheduledTime2(); logDebug("----Scheduled Time: "+time2);
				
				if(time2){
					var sTime = addMinutesToStringTime(time2,0);
					var eTime = addMinutesToStringTime(time2,120);
					var timeParam = sTime+" - "+eTime;
				}else if(inspDetails.getScheduledTime() == "AM"){
					var timeParam = "8am - 12pm";
				}else{
					var timeParam = "12pm - 4pm";
				}
				logDebug("----Scheduled Time: "+timeParam);
				
				var capId = inspDetails.getCapID().toString().split("-");
				var i_id1 = capId[0];
				var i_id2 = capId[1];
				var i_id3 = capId[2];
				var i_capResult = aa.cap.getCapID(i_id1, i_id2, i_id3);
				if (i_capResult.getSuccess())
					var capID = i_capResult.getOutput(); logDebug("----capID: "+capID);
//				viewObj(capID);
				var altId = capID.getCustomID(); logDebug("----altId: "+altId);
				
				var inspector = thisInsp.getInspector();
				var iUserId = inspector.getGaUserID();
				
				var sysUserObj = aa.person.getUser(iUserId);
				if(sysUserObj.getSuccess()){
					var su = sysUserObj.getOutput();
					var suName = su.getFullName(); logDebug("----Inspector Full Name: "+suName);
					var suEmail = su.getEmail(); logDebug("----Inspector Email: "+suEmail);
					var suPhone = su.getPhoneNumber(); logDebug("----Inspector Phone: "+suPhone);
					if(suPhone){
						var suPhoneFormatted = "("+suPhone.substring(0,3)+") "+suPhone.substring(3,6)+"-"+suPhone.substring(6,10);
					}else{
						suPhoneFormatted = null;
					}
				}
				
				var contactOptions = "";
				
				if(suName && suEmail && suPhone){
					contactOptions = suName+", by phone at "+suPhoneFormatted+" or email at "+suEmail+". You may also contact ";
				}else if(suName && suEmail){
					contactOptions = suName+", by email at "+suPhoneFormatted+". You may also contact ";
				}else if(suName && suPhone){
					contactOptions = suName+", by phone at "+suPhoneFormatted+". You may also contact ";
				}
				
				contactOptions += "the City of Santa Clarita Building and Safety Department at (661) 255-4935."
				var emailBody = "For permit number "+altId+", your inspection: "+type+" is schedule for today, "+emailDate+". Your inspector will arrive between "+timeParam+". If you have questions please contact "+contactOptions;
				logDebug(br+emailBody+br);
			}
		}
	}

	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)