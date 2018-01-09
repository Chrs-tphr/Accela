function issueProfessionalLicense() {
	
	// select statement to determine expiration date based on license type
	if (arguments.length > 0){
		var newLicId = aa.cap.getCapID(arguments[0]).getOutput()
		var newLicIdString = arguments[0]
	}
	else {
		newLicId = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], "License",null);
		if (newLicId) {
			copyOwner(capId, newLicId);
			newLicIdString = newLicId.getCustomID(); 
			updateAppStatus("Issued","Originally Issued",newLicId);
			var ignore = lookup("EMSE:ASI Copy Exceptions","License/*/*/*"); 
			var ignoreArr = new Array();
			if(ignore != null) ignoreArr = ignore.split("|"); 
			copyAppSpecific(newLicId,ignoreArr);
			copyASITables(capId,newLicId);
			editAppSpecific("First Issuance Date", sysDateMMDDYYYY, newLicId);
			changeApplicantToLicenseHolder(newLicId);
 	
			thisLic = new licenseObject(newLicIdString,newLicId) ;
			expUnit = thisLic.b1Exp.getExpUnit();
			expInterval = thisLic.b1Exp.getExpInterval()	;
			var newExpDate;
                 	var currentYear = sysDate.getYear(); // Current year
			logDebug("Renewal Code is " + thisLic.getCode());
			currExpDate = thisLic.b1ExpDate;
			currExpJSDate = new Date(currExpDate);
			if (currExpJSDate < new Date()) {
				if (expUnit == "DAYS") {
					newExpDate = dateAdd(currExpDate, expInterval);
				 }
			 	 if (expUnit == "MONTHS") {
					 newExpDate = dateAddMonths(currExpDate, expInterval);
				 }
				 if (expUnit == "YEARS") {
					 newExpDate = dateAddMonths(currExpDate, expInterval * 12);
				 }
			}
			logDebug("the new exp date is " + newExpDate);
        		thisLic.setExpiration(newExpDate);
			// select statement to update expiration status based on ASI
			thisLic.setStatus("Active");
		}
	}
}