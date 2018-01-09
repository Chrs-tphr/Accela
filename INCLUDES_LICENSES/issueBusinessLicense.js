function issueBusinessLicense() {

	monthsToInitialExpire=12;
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
		tmpNewDate = dateAddMonths(null, monthsToInitialExpire);
 		thisLic = new licenseObject(newLicIdString,newLicId) ; 
		thisLic.setExpiration(dateAdd(tmpNewDate,0)) ; 
		thisLic.setStatus("Active");
		changeApplicantToLicenseHolder(newLicId);
	}
	
} 