var myCapId = "APP-20170031";
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


	function removeCapAddresses(capId){
		var addrScriptResult = aa.address.getAddressByCapId(capId);
		if(addrScriptResult.getSuccess()){
			var authAddrList = addrScriptResult.getOutput()
			if(authAddrList.length > 0){
				//get address ID
				for(addr in authAddrList){
					var thisAddr = authAddrList[addr];
					var thisAddrId = thisAddr.getAddressId();
					//remove address from Authority
					aa.address.removeAddress(capId, thisAddrId);
					logDebug("Addresses successfully removed from cap")
				}
			}else{
				logDebug("No addresses on cap")
			}
		}else{
			logDebug("Could not get address list from cap")
		}
	}
	
	function removeCapContacts(recordCapId){
		var cons = aa.people.getCapContactByCapID(recordCapId).getOutput();
		for(x in cons){
			conSeqNum = cons[x].getPeople().getContactSeqNumber();
			aa.people.removeCapContact(recordCapId, conSeqNum);
		}
	}
	
	function createCertOfAuth() {
		mpscNum = getMPSCNumFromLP();
		if (mpscNum != null) {
			var existResult = aa.cap.getCapID(mpscNum).getSuccess();
			if(!existResult){
			 	newLicId = createParent(appTypeArray[0], appTypeArray[1], "Certificate of Authority", "NA",null);
				if (newLicId) {
					aa.cap.updateCapAltID(newLicId, mpscNum);
					copyLicensedProf(capId, newLicId);
					newLicIdString = newLicId.getCustomID();
					//updateAppStatus("Issued","Originally Issued",newLicId);
					thisLic = new licenseObject(newLicIdString,newLicId);
					thisLic.setStatus("Active");
		
		            var certIssueDate = getStatusDateinTaskHistory("Certification", "Issued");
		            var certIssueMonth = certIssueDate.getMonth() + 1;
		            var certIssueDay = certIssueDate.getDate();
		            var certIssueYear = 1900 + certIssueDate.getYear();
		            if (certIssueDate != null && certIssueMonth > 9){
		                var certFirstExpYear = certIssueYear + 1;
		                thisLic.setExpiration("12/31/"+certFirstExpYear);
		            }
		            else{
		                certFirstExpYear = certIssueYear;
		                thisLic.setExpiration("12/31/"+certFirstExpYear);
		            }
		            logDebug("The Certificate of Authority was issued on " + certIssueDate + " and will expire on 12/31/" + certFirstExpYear + ".");
		
					if (certIssueDate != null){
						var cIDate = certIssueMonth+"/"+certIssueDay+"/"+certIssueYear;
						thisLic.setIssued(cIDate);
						logDebug("RefLP License Issued Date updated to: "+cIDate);
					}
		
					var ignore = lookup("EMSE:ASI Copy Exceptions","License/*/*/*"); 
					var ignoreArr = new Array();
					if(ignore != null) ignoreArr = ignore.split("|"); 
					copyAppSpecific(newLicId,ignoreArr);
					copyASITables(capId,newLicId);
					linkMPSCtoPU(mpscNum, capId);
					
					//get refLp to edit standard fields for ACA display
					var refLPModel = getRefLicenseProf(mpscNum);
					if(!refLPModel){
						logDebug("Ref LP " + refLPNum + " not found");
					}else{
						refLPModel.setAcaPermission(null);//the system interprets null as Y (this will display in ACA)
						refLPModel.setInsuranceCo("Active");
						aa.licenseScript.editRefLicenseProf(refLPModel);
					}
					
					editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY EXPIRATIO","12/31/"+certFirstExpYear);//sets expiration year on Ref LP
					editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY STATUS","Active");
					editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY STATUS DA",cIDate);
					editRefLicProfAttribute(mpscNum,"INTRASTATE AUTH APP DATE",fileDate);
					editLicProfAttribute(newLicId, mpscNum,"INTRASTATE AUTHORITY EXPIRATIO","12/31/"+certFirstExpYear);//sets expiration year on Cert trans LP
					editLicProfAttribute(newLicId, mpscNum,"INTRASTATE AUTHORITY STATUS","Active");
					editLicProfAttribute(newLicId, mpscNum,"INTRASTATE AUTHORITY STATUS DA",cIDate);
					editLicProfAttribute(newLicId, mpscNum,"INTRASTATE AUTH APP DATE",fileDate);
					
					if (AInfo["Application is Part of a Transfer"] == "Y" || AInfo["Application is Part of a Transfer"] == "Yes") {
						eqListTable = loadASITable("EQUIPMENT_LIST", newLicId);
						newTable = new Array();
						for (var eachRow in eqListTable) {
							thisRow = eqListTable[eachRow];
							newRow = new Array();
							newRow["Type"] = new asiTableValObj("Type", thisRow["Type"].fieldValue, "N");
							newRow["Year"] = new asiTableValObj("Year", thisRow["Year"].fieldValue, "N");
							newRow["Make"] = new asiTableValObj("Make", thisRow["Make"].fieldValue, "N");
							newRow["Serial#/VIN"] = new asiTableValObj("Serial#/VIN", thisRow["Serial#/VIN"].fieldValue, "N");
							newRow["GVWR"] = new asiTableValObj("GVWR", thisRow["GVWR"].fieldValue, "N");
							newRow["Unit/Fleet #"] = new asiTableValObj("Unit/Fleet #", thisRow["Unit/Fleet #"].fieldValue, "N");
							newRow["License Plate State"] = new asiTableValObj("License Plate State", thisRow["License Plate State"].fieldValue, "N");
							newRow["Leased Vehicle Owner"] = new asiTableValObj("Leased Vehicle Owner", thisRow["Leased Vehicle Owner"].fieldValue, "N");
							newRow["Vehicle Action"] = new asiTableValObj("Vehicle Action", ""/*thisRow["Vehicle Action"].fieldValue*/, "N");
							newRow["Status"] = new asiTableValObj("Status", thisRow["Status"].fieldValue, "N");
							newRow["MPSC Decal #"] = new asiTableValObj("MPSC Decal #", thisRow["MPSC Decal #"].fieldValue, "Y");
							var equipUse = thisRow["Equipment Use"].fieldValue;//gets equipment use to set plate fee instead of copying Plate Fee data
							newRow["Equipment Use"] = new asiTableValObj("Equipment Use", equipUse, "N");
							if (equipUse == "Household Goods") pFee = "50.00";
							else pFee = "100.00";
							newRow["Plate Fee"] = new asiTableValObj("Plate Fee", pFee, "N");
							newTable.push(newRow);
						}
						addASITable("EQUIPMENT LIST", newTable);
					}
				}
			}else{
				//Update existing Authority
				logDebug("A Certificate of Authority has already been issued for this CVED number attempting to update the existing Authority.");
				//get existing Authority capId
				var authCapId = aa.cap.getCapID(mpscNum).getOutput();
				
				//link app to existing Certificate of Authority
				addParent(mpscNum);
				
				//link the RefLP to the public user on the new App
				linkMPSCtoPU(mpscNum, capId);//getting the pu from new app and linking to the updated refLp
				
				//copy ASI from app to cert
				var ignore = lookup("EMSE:ASI Copy Exceptions","License/*/*/*"); 
				var ignoreArr = new Array();
				if(ignore != null) ignoreArr = ignore.split("|"); 
				copyAppSpecific(authCapId,ignoreArr);
				
				//remove existing ASIT on Auth and copy ASIT from app to cert
				removeASITable("EQUIPMENT LIST",authCapId);
				removeASITable("CONTINUOUS CONTRACT",authCapId);
				copyASITables(capId, authCapId);
				
				//remove existing addresses on Auth
				removeCapAddresses(capId);
				
				//copy address from app to cert
				copyAddresses(capId, authCapId);
				
				//remove existing Contacts on Auth and copy from app to cert
				removeCapContacts(authCapId);
				copyContacts(capId, authCapId);

				//Update existing reference LP with current info from app
				updateRefLpFromTransLp();
				
				//edit Ref LP for issuance and copy to existing Authority
				editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY EXPIRATIO","12/31/"+certFirstExpYear);//sets expiration year on Ref LP
				editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY STATUS","Active");
				editRefLicProfAttribute(mpscNum,"INTRASTATE AUTHORITY STATUS DA",cIDate);
				editRefLicProfAttribute(mpscNum,"INTRASTATE AUTH APP DATE",fileDate);
				
				var refLPModel = getRefLicenseProf(mpscNum);
				if(!refLPModel){
					logDebug("Ref LP " + refLPNum + " not found");
				}else{
					refLPModel.setAcaPermission(null);//the system interprets null as Y (this will display in ACA)
					refLPModel.setInsuranceCo("Active");
					modifyRefLPAndSubTran(authCapId, refLPModel);
				}
				
				//Updates for issuance Record Status
				updateAppStatus("Active","",authCapId);
				//Updates for issuance Expiration Status and date
				thisLic = new licenseObject(mpscNum,authCapId);
				thisLic.setStatus("Active");

	            var certIssueDate = getStatusDateinTaskHistory("Certification", "Issued");
	            var certIssueMonth = certIssueDate.getMonth() + 1;
	            var certIssueDay = certIssueDate.getDate();
	            var certIssueYear = 1900 + certIssueDate.getYear();
	            if (certIssueDate != null && certIssueMonth > 9){
	                var certFirstExpYear = certIssueYear + 1;
	                thisLic.setExpiration("12/31/"+certFirstExpYear);
	            }
	            else{
	                certFirstExpYear = certIssueYear;
	                thisLic.setExpiration("12/31/"+certFirstExpYear);
	            }
	            logDebug("The Certificate of Authority was issued on " + certIssueDate + " and will expire on 12/31/" + certFirstExpYear + ".");

				if (certIssueDate != null){
					var cIDate = certIssueMonth+"/"+certIssueDay+"/"+certIssueYear;
					thisLic.setIssued(cIDate);
					logDebug("RefLP License Issued Date updated to: "+cIDate);
				}
				
				//update results
				logDebug("The existing Authority: "+mpscNum+" was updated and has been reissued");
			}
		}
	}
	
	createCertOfAuth();
	
//INSERT TEST CODE END
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
	}
// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)