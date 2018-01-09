function convertRenewalToReal() {
	var capID = getCapId();
	var partialCapID = getPartialCapID(capID);
	var result = aa.cap.isRenewalInProgess(capID);
	if (result.getSuccess()) {
		//1. Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
		aa.cap.updateAccessByACA(capID, "N");			

		var parentLicenseCAPID = result.getOutput();
		//2 . Copy key information from child CAP to parent CAP.
		logDebug("Copying key information from renewal CAP to license CAP");
		copyKeyInfo(capID, parentLicenseCAPID);
	
		//3. move renew document to parent cap
		aa.cap.transferRenewCapDocument(partialCapID, parentLicenseCAPID, true);
		logDebug("Transfer document for renew cap. Source Cap: " + partialCapID + ", target Cap:" + parentLicenseCAPID);

		//4. Send auto-issurance license email to public user
		if (sendLicEmails) aa.expiration.sendAutoIssueLicenseEmail(parentLicenseCAPID);
		//logDebug("send auto-issuance license email to citizen user.");
		aa.env.setValue("isAutoIssuanceSuccess", "Yes");
	}
	else { logDebug("isRenewalInProgress returned error " + result.getErrorMessage()); }
}