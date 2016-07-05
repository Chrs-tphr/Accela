//individual exercise 2 START
if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
	if(balanceDue > 0){
		if(AInfo["Job Cost"] > 1000){
			showMessage = true;
			comment("The record has a $"+balanceDue+" balance which must be paid before it can be issued.");
			cancel = true;
		}
	}
}
//individual exercise 2 END