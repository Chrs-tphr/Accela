/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_SCHEDULED_INSPECTION_EMAIL.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/01/08 JHS
| Version 2.0 - Updated for Masters Scripts 2.0  02/13/14 JHS
| Version 3.0 - Uses productized Includes files where appropriate and adding test parameters
| Jobs configured: 
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
message = "";
br = "<br>";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if(bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I"){
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if(bzr.getSuccess()){
		SAScript = bzr.getOutput().getDescription();
	}
}

if(SA){
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA,useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
}else{
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_BATCH",null,false));

function getScriptText(vScriptName, servProvCode, useProductScripts){
	if(!servProvCode) servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if(useProductScripts){
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		}else{
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	}catch (err){
		return "";
	}
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
showDebug = true;
if(String(aa.env.getValue("showDebug")).length > 0){
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if(batchJobResult.getSuccess()){
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
}else{
	logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

aa.env.setValue("fromDate", "");
aa.env.setValue("toDate", "");
 
var fromDate = getParam("fromDate"); // Hardcoded dates.   Use for testing only
var toDate = getParam("toDate"); // ""
var dFromDate = aa.date.parseDate(fromDate); //
var dToDate = aa.date.parseDate(toDate); //

var lookAheadDays = aa.env.getValue("lookAheadDays"); // Number of days from today
var daySpan = aa.env.getValue("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)


/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();

if(!fromDate.length){ // no "from" date, assume today
	fromDate = dateAdd(null, 0);//fromDate = dateAdd(null, parseInt(lookAheadDays))
}
if(!toDate.length){ // no "to" date, assume today
	toDate = fromDate;
	//toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan))
}

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

try{
	mainProcess();
}catch (err){
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess(){
	var fDate = convertJsDateToYYYYMMDD(new Date(dateAdd(null,0)));//logDebug(fDate);
	var tDate = convertJsDateToYYYYMMDD(new Date(dateAdd(null,0)));//logDebug(tDate);
	var inspectionArray = aa.inspection.getInspections(fDate,tDate);
	if(inspectionArray.getSuccess()){
		var inspArray = inspectionArray.getOutput();
		if(inspArray.length){
			var inspArrayL = inspArray.length; logDebug("----inspArrayL: "+inspArrayL);
			for(i in inspArray){
				var thisInsp = inspArray[i];
				
				var inspDetails = thisInsp.getInspection();
				
				var capId = inspDetails.getCapID().toString().split("-");
				var i_id1 = capId[0];
				var i_id2 = capId[1];
				var i_id3 = capId[2];
				var i_capResult = aa.cap.getCapID(i_id1, i_id2, i_id3);
				if (i_capResult.getSuccess()){
					var capID = i_capResult.getOutput(); logDebug("----capID: "+capID);
					capId = capID;
				}
					
				var altId = capID.getCustomID(); 
				if(!matches(altId,"MEP18-00966"))continue;//for testing only
				logDebug("----altId: "+altId);
				
				var type = inspDetails.getInspectionType(); logDebug("----Type: "+type);
				var date = inspDetails.getScheduledDate(); logDebug("----Scheduled Date: "+date);
				
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
				var emailBody = "is schedule for today, "+emailDate+". Your inspector will arrive between "+timeParam+". If you have questions please contact "+contactOptions;
				logDebug(br+emailBody+br);
				
				var contactTypesArray = new Array("Applicant");
				var contactObjArray = getContactObjs(capId,contactTypesArray);

				if(contactObjArray.length > 0){
					for (iCon in contactObjArray) {
						var tContactObj = contactObjArray[iCon];
						logDebug("Contact Name: " + tContactObj.people.getFirstName() + " " + tContactObj.people.getLastName());
						if(!matches(tContactObj.people.getEmail(),null,undefined,"")) {
							logDebug("Contact Email: " + tContactObj.people.getEmail());
							var eParams = aa.util.newHashtable();
							addParameter(eParams, "$$InspectionType$$", type);
							addParameter(eParams, "$$EmailBody$$", emailBody);
							addParameter(eParams, "$$recordTypeAlias$$", cap.getCapType().getAlias());
							if(matches(tContactObj.people.getFirstName(),null,undefined,"") || (tContactObj.people.getLastName(),null,undefined,"")) {
								addParameter(eParams, "$$ApplicantFullName$$", tContactObj.people.getFullName());
							} else {
								addParameter(eParams, "$$ApplicantFullName$$", tContactObj.people.getFirstName() + " " + tContactObj.people.getLastName());
							}
							getRecordParams4Notification(eParams);
							tContactObj.getEmailTemplateParams(eParams);
							getPrimaryAddressLineParam4Notification(eParams);
							getContactParams4Notification(eParams,contactTypesArray);
							
							sendNotification(agencyReplyEmail,tContactObj.people.getEmail(),"","BLD_SCHEDULED_INSPECTION_REMINDER",eParams,null);
						}
					}
				}
			}
		}
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





































