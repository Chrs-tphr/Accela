/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_APPLICATION_EXPIRES.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/01/08 JHS
| Version 2.0 - Updated for Masters Scripts 2.0  02/13/14 JHS
| Backing up in repo 11/16/16
| Version 3.0 - J Chalk 11/29/16, using productized Includes files where appropriate and adding test parameters
| Jobs configured: Building Permit App Expires, Building MEP App Expires
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
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA,useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_BATCH",null,false));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
showDebug = true;
if (String(aa.env.getValue("showDebug")).length > 0) {
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if (batchJobResult.getSuccess()) {
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
	logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//******************************************************* test parameters Building Permit App Job
/*
aa.env.setValue("appGroup", "Building");
aa.env.setValue("appTypeType", "Permit");
aa.env.setValue("appSubtype", "NA");
aa.env.setValue("appCategory", "NA");
aa.env.setValue("testAltId", "BLD16-03500");


aa.env.setValue("appStatus", "In Review");
aa.env.setValue("newApplicationStatus", "Expired");
*/
 
//******************************************************* test parameters Building MEP App Job
/*
aa.env.setValue("appGroup", "Building");
aa.env.setValue("appTypeType", "MEP");
aa.env.setValue("appSubtype", "NA");
aa.env.setValue("appCategory", "NA");
aa.env.setValue("appStatus", "In Review");
aa.env.setValue("newApplicationStatus", "Expired");
*/ 
 
//var fromDate = getParam("fromDate"); // Hardcoded dates.   Use for testing only
//var toDate = getParam("toDate"); // ""
//var dFromDate = aa.date.parseDate(fromDate); //
//var dToDate = aa.date.parseDate(toDate); //
//var lookAheadDays = aa.env.getValue("lookAheadDays"); // Number of days from today
//var daySpan = aa.env.getValue("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
var appGroup = getParam("appGroup"); //   app Group to process {Licenses}
var appTypeType = getParam("appTypeType"); //   app type to process {Rental License}
var appSubtype = getParam("appSubtype"); //   app subtype to process {NA}
var appCategory = getParam("appCategory"); //   app category to process {NA}
var testAltId = getParam("testAltId");
//var expStatus = getParam("expirationStatus"); //   test for this expiration status
//var newExpStatus = getParam("newExpirationStatus"); //   update to this expiration status
//var appStatus = getParam("appStatus");
//var newAppStatus = getParam("newApplicationStatus"); //   update the CAP to this status
//var gracePeriodDays = getParam("gracePeriodDays"); //	bump up expiration date by this many days
//var setPrefix = getParam("setPrefix"); //   Prefix for set ID
//var inspSched = getParam("inspSched"); //   Schedule Inspection
//var skipAppStatusArray = getParam("skipAppStatus").split(","); //   Skip records with one of these application statuses
//var emailAddress = getParam("emailAddress"); // email to send report
//var sendEmailToContactTypes = getParam("sendEmailToContactTypes"); // send out emails?
//var emailTemplate = getParam("emailTemplate"); // email Template
//var deactivateLicense = getParam("deactivateLicense"); // deactivate the LP
//var lockParentLicense = getParam("lockParentLicense"); // add this lock on the parent license
//var createRenewalRecord = getParam("createTempRenewalRecord"); // create a temporary record
//var feeSched = getParam("feeSched"); //
//var feeList = getParam("feeList"); // comma delimted list of fees to add
//var feePeriod = getParam("feePeriod"); // fee period to use {LICENSE}
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();

//if (!fromDate.length) { // no "from" date, assume today
//	fromDate = dateAdd(null, 0);//fromDate = dateAdd(null, parseInt(lookAheadDays))
//}
//if (!toDate.length) { // no "to" date, assume today
//	toDate = fromDate;
//	//toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan))
//}
//var mailFrom = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");
//var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
//acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

//logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

appGroup = appGroup == "" ? "*" : appGroup;
appTypeType = appTypeType == "" ? "*" : appTypeType;
appSubtype = appSubtype == "" ? "*" : appSubtype;
appCategory = appCategory == "" ? "*" : appCategory;
var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

try {
	mainProcess();
} catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

//if (emailAddress.length)
//	aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	var capFilterType = 0;
	//	var capFilterInactive = 0;
	//	var capFilterError = 0;
	var capFilterStatus = 0;
	var capFilterExpirationDate = 0;
	//	var capDeactivated = 0;
	var capCount = 0;
	var myCaps;

	var capResult = aa.cap.getByAppType(appGroup, appTypeType, appSubtype, appCategory);
	if (capResult.getSuccess()) {
		myCaps = capResult.getOutput();
		logDebug("Processing " + myCaps.length + " records");
	} else {
		logDebug("ERROR: Getting records, reason is: " + capResult.getErrorType() + ":" + capResult.getErrorMessage());
		return false;
	}

	for (index in myCaps){
		
		cap = myCaps[index];
		capId = cap.getCapID();
		altId = capId.getCustomID();
		
		if(!matches(altId,testAltId)){
			continue;
		}
		logDebug(br+"Processing record: "+altId);

		var capStatus = cap.getCapStatus();

		appTypeResult = cap.getCapType(); //create CapTypeModel object
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");
		
		//populate permit exp date
		var iResultDateArr = new Array();
		var iResultDateTimeArr = new Array();
		var capInspArrScriptObj = aa.inspection.getInspections(capId);
		if(capInspArrScriptObj.getSuccess()){
			var capInspArr = capInspArrScriptObj.getOutput();
			if(capInspArr.length){
				for(insp in capInspArr){
					var tInsp = capInspArr[insp];
					//get inspection info
					
					var irs = tInsp.getInspectionStatus();
					
					if(matches(irs, "Not Inspected", "Not Ready", "Pending", "Cancelled")){
						continue;
					}else{
						var isd = tInsp.getInspectionDate();
						if(isd){
							iResultDateArr.push(convertDate(isd).getTime());
						}
					}
				}
				
				var irdta = iResultDateArr.sort().reverse();
				var lastValidInspResultDateTime = irdta[0];
				if(lastValidInspResultDateTime){
					if(getAppSpecific("Permit Expiration",capId) == dateAdd(new Date(lastValidInspResultDateTime), 181)){
						logDebug(altId+": No update required");
					}else{
						logDebug(altId+": Updating Permit Expiration from: "+getAppSpecific("Permit Expiration",capId)+", to: "+dateAdd(new Date(lastValidInspResultDateTime),181));
						editAppSpecific("Permit Expiration", dateAdd(new Date(lastValidInspResultDateTime), 181));
						capFilterExpirationDate++;
					}
				}
			}else{
				logDebug(altId+": No inspections on cap");
			}
		}else{
			logDebug(altId+": Could not get inspection sObj for cap ");
		}
	}

//	logDebug("Total CAPS qualified date range: " + myExp.length);
//	logDebug("Ignored due to application type: " + capFilterType);
//	logDebug("Ignored due to CAP Status: " + capFilterStatus);
//	logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
	logDebug("Total CAPS processed: " + capCount);
	logDebug("Total CAPS updated: " + capFilterExpirationDate);
}
