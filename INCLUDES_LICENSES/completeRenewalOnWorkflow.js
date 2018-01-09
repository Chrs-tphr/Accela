function completeRenewalOnWorkflow() {
	var capID = getCapId();
	var parentLicenseCAPID = getParentCapIDForReview(capID)
	if (parentLicenseCAPID != null) {
		if (isWorkflowApproveForReview(capID, aa.env.getValue("WorkflowTask"), aa.env.getValue("SD_STP_NUM"), aa.env.getValue("ProcessID"), aa.env.getValue("WorkflowStatus"))) {
			var partialCapID = getPartialCapID(capID);
			if (isReadyRenew(parentLicenseCAPID)) {
				renewalCapProject = getRenewalCapByParentCapIDForReview(parentLicenseCAPID);
				if (renewalCapProject != null) {
					aa.cap.updateAccessByACA(capID, "N");			
					if (activeLicense(parentLicenseCAPID)) {
						renewalCapProject.setStatus("Complete");
						logDebug("license(" + parentLicenseCAPID + ") is activated.");
						aa.cap.updateProject(renewalCapProject);
						copyKeyInfo(capID, parentLicenseCAPID);
						aa.cap.transferRenewCapDocument(partialCapID, parentLicenseCAPID, false);
						logDebug("Transfer document for renew cap. Source Cap: " + partialCapID + ", target Cap: " + parentLicenseCAPID);
						if (sendLicEmails) aa.expiration.sendApprovedNoticEmailToCitizenUser(parentLicenseCAPID);
					}
				}
			}
		}
		if (isWorkflowDenyForReview(capID, aa.env.getValue("WorkflowTask"), aa.env.getValue("SD_STP_NUM"), aa.env.getValue("ProcessID"),  aa.env.getValue("WorkflowStatus"))) {
			if (isReadyRenew(parentLicenseCAPID)) {
				renewalCapProject = getRenewalCapByParentCapIDForReview(parentLicenseCAPID);
				if (renewalCapProject != null) {
					if (sendLicEmails) aa.expiration.sendDeniedNoticeEmailToCitizenUser(parentLicenseCAPID)
				}
			}
		}
	}
}