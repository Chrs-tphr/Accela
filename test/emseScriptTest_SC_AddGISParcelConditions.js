/*
 * emseScriptTest_SC_AddGISParcelConditions.js
 */

var myCapId = "";
var myUserId = "ADMIN";
var eventName = "ApplicationStatusUpdateAfter";

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = false; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

try{
	showDebug = true;
	
	//--------START UPDATE FOR TEST RUN AND FULL REFERENCE PARCEL UPDATE--------//
	
	var testUpdate = true;// set to true to run script for testParcelArray only. Set to false to run for all reference parcels 
	var testParcelArray = ["2833001063","2833008031","2842007058","2812076001","2839011021","2826144027","2859008028","2866012016","2811065900"];//enter test parcel numbers in array
	
	//---------END UPDATE FOR TEST RUN AND FULL REFERENCE PARCEL UPDATE---------//
	
	
	function refGetGISInfo(svc,layer,attributename){
		// use buffer info to get info on the current object by using distance 0
		var distanceType = "feet";
		var retString;
		
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if(bufferTargetResult.getSuccess()){
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(attributename);
		}else{
			logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage());
			return false;
		}
		var gisObjResult = aa.gis.getParcelGISObjects(RefParcelNumber); //get gis objects for the parcel number
		if(gisObjResult.getSuccess()) var fGisObj = gisObjResult.getOutput();
		else{
			logDebug("**WARNING: Getting GIS objects for Ref Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
			return false;
		}
		for(a1 in fGisObj){// for each GIS object on the Cap.  We'll only send the last value
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);
			if(bufchk.getSuccess()) var proxArr = bufchk.getOutput();
			else{
				logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
				return false;
			}
			for(a2 in proxArr){
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for(z1 in proxObj){
					var v = proxObj[z1].getAttributeValues()
					retString = v[0];
				}
			}
		}
		return retString
	}
	
	function refProximity(svc,layer,numDistance){// optional: distanceType
		// use with all events except ApplicationSubmitBefore
		
		var distanceType = "feet";
		if(arguments.length == 4) distanceType = arguments[3]; // use distance type in arg list
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if(bufferTargetResult.getSuccess()){
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(layer + "_ID");
		}else{
			logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage());
			return false;
		}
		var gisObjResult = aa.gis.getParcelGISObjects(RefParcelNumber); //get gis objects for the parcel number
		if(gisObjResult.getSuccess()) var fGisObj = gisObjResult.getOutput();
		else{
			logDebug("**WARNING: Getting GIS objects for Ref Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
			return false;
		}
		for(a1 in fGisObj){// for each GIS object on the Cap
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
			if(bufchk.getSuccess()) var proxArr = bufchk.getOutput();
			else{
				logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
				return false;
			}
			for(a2 in proxArr){
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				if(proxObj.length){
					return true;
				}
			}
		}
	}
	
	function refProximityToAttribute(svc,layer,numDistance,distanceType,attributeName,attributeValue){
		// use with all events except ApplicationSubmitBefore
		
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if(bufferTargetResult.getSuccess()){
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(attributeName);
		}else{
			logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage());
			return false;
		}
		var gisObjResult = aa.gis.getParcelGISObjects(RefParcelNumber); //get gis objects for the parcel number
		if(gisObjResult.getSuccess()){
			var fGisObj = gisObjResult.getOutput();
		}else{
			logDebug("**WARNING: Getting GIS objects for Ref Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
			return false;
		}
		for(a1 in fGisObj){// for each GIS object on the Cap
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
			if(bufchk.getSuccess()){
				var proxArr = bufchk.getOutput();
			}else{
				logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
				return false;
			}
			for(a2 in proxArr){
				proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for (z1 in proxObj){
					var v = proxObj[z1].getAttributeValues()
					retString = v[0];
					
					if(retString && retString.equals(attributeValue)) return true;
				}
			}
		}
	}
	
	function refParcelConditionExists(condtype){
		var pcResult = aa.parcelCondition.getParcelConditions(RefParcelNumber);
		if(!pcResult.getSuccess()){
//			logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage());
			return false;
		}
		pcs = pcResult.getOutput();
		for(pc1 in pcs)
			if (pcs[pc1].getConditionType().equals(condtype)) return true;
	}
	
	function removeRefParcelCondition(parcelNum,cType,cDesc){
		var pcResult = aa.parcelCondition.getParcelConditions(parcelNum);
		if(!pcResult.getSuccess()){
//			logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage());
			return false;
		}
		var pcs = pcResult.getOutput();
		for(pc1 in pcs){
			if(pcs[pc1].getConditionType().equals(cType) && pcs[pc1].getConditionDescription().equals(cDesc)){
				var rmParcelCondResult = aa.parcelCondition.removeParcelCondition(pcs[pc1].getConditionNumber(),parcelNum);
				if(rmParcelCondResult.getSuccess()){
					logDebug("Successfully removed condition from Parcel " + parcelNum + "  (" + cType + ") " + cDesc);
				}else{
					logDebug( "**ERROR: removing ("+cType+") condition from Parcel " + parcelNum);
				}
			}
		}
	}
	
	function getUniqueRefParcelNumbers(){
		var refParcelList = new Array();
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection(); logDebug("Creating DB Connection");
		var SQL = "SELECT L1_PARCEL_NBR as return_string FROM L3PARCEL INNER JOIN RSERV_PROV ON RSERV_PROV.APO_SRC_SEQ_NBR = L3PARCEL.SOURCE_SEQ_NBR WHERE RSERV_PROV.SERV_PROV_CODE = 'SANTACLARITA'";
		var dbStmt = conn.prepareStatement(SQL); logDebug("Preparing SQL");
		dbStmt.executeQuery(); logDebug("Executing Query");
		results = dbStmt.getResultSet();
		while(results.next()){
			refParcelList.push(results.getString("return_string"))
		}
		logDebug("Reference Parcel Numbers Found: "+refParcelList.length);
		dbStmt.close(); logDebug("Query Complete");
		conn.close(); logDebug("DB Connection Closed");
		return refParcelList;
	}
	
	var uRPNums = getUniqueRefParcelNumbers();
	
	logDebug(" *** The Reference Parcel results are listed below:");
	
	for(i=0; i<uRPNums.length; i++){
		var RefParcelNumber = uRPNums[i];
		//if testUpdate = false script updates all parcels, if testUpdate = true script only updates test parcels
		if(RefParcelNumber != "" && ((testUpdate == false) || exists(RefParcelNumber,testParcelArray))){
			logDebug("*** Parcel #: "+RefParcelNumber);
			var cType = "Parcel";
			var cStatus = "Applied";
			var cDesc = "";
			var cComment = "";
			var cImpact = "Notice";
			
			//elected official property check
			cDesc = "500 feet of Elected Official Parcel";
			cComment = "Parcel is within 500 feet of Elected Official Parcel";
			if(refProximity("SANTACLARITA","City Council Parcels",500)){
				logDebug("Parcel is within 500 feet of Elected Official Parcel");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(!refProximity("SANTACLARITA","City Council Parcels",500)){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			//school check
			cDesc = "1000 feet of School";
			cComment = "Parcel is within 1000 feet of a school";
			if(refProximity("SANTACLARITA","Schools",1000)){
				logDebug("Parcel is within 1000 feet of a school");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(!refProximity("SANTACLARITA","Schools",1000)){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			//residential check
			cDesc = "300 feet of Residential";
			cComment = "Parcel is within 300 feet of residential";
			 if(refProximityToAttribute("SANTACLARITA","ParcelOutlines",300,"feet","ZONETYPE","RESIDENTIAL")){
				logDebug("Parcel is within 300 feet of residential");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(!refProximityToAttribute("SANTACLARITA","ParcelOutlines",300,"feet","ZONETYPE","RESIDENTIAL")){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			//city boundary check
			cDesc = "Not in City";
			cComment = "Parcel is not located within Santa Clarita city limits";
			if(refGetGISInfo("SANTACLARITA","ParcelOutlines", "Juris") != "CITY"){
				logDebug("Parcel is not in the city");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(refGetGISInfo("SANTACLARITA","ParcelOutlines", "Juris") == "CITY"){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			//flood zone High check
			cDesc = "High risk Flood Zone";
			cComment = "Parcel is in a HIGH risk Flood Zone";
			if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") == "High"){
				logDebug("Parcel is in a HIGH risk Flood Zone");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") != "High"){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			//flood zone Moderate-to-Low check
			cDesc = "Moderate-to-Low risk Flood Zone";
			cComment = "Parcel is in a Moderate-to-Low risk Flood Zone";
			if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") == "Moderate-to-Low"){
				logDebug("Parcel is in a Moderate-to-Low risk Flood Zone");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") != "Moderate-to-Low"){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}

			/*
			 * do not add to dev
			 //flood zone Moderate check
			cDesc = "LOW risk Flood Zone";
			cComment = "Parcel is in a LOW risk Flood Zone";
			if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") == "Low"){
				logDebug("Parcel is in a LOW risk Flood Zone");
				if(!refParcelConditionExists(cDesc)) addParcelCondition(RefParcelNumber,cType,cStatus,cDesc,cComment,cImpact);
				else logDebug("Condition: "+cDesc+", already exists. No update made!");
			}else if(refGetGISInfo("SANTACLARITA","Flood Zone (DFIRM)","RISK") != "Low"){
				//***ADD updateParcelConditionStatus
				removeRefParcelCondition(RefParcelNumber,cType,cDesc);
			}*/
		}
	}
}catch(err){
	logDebug("A JavaScript Error occured: " + err.message);
}
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug);