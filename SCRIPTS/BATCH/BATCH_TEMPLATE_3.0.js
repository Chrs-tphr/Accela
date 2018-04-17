/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_EXPIRATION_TEMPLATE_3.0.js  Trigger: Batch
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
	
}
