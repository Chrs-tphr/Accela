function dateAddDstAdjusted(date, addDays){
	//enhanced function that uses the dateAdd and dateDiff functions to adjust the output for crossing std and dst dates.
	var days = addDays;
	var bnDate = dateAdd(date,addDays);
	logDebug("bnDate: "+bnDate);
	var dd = dateDiff(date,bnDate)
	logDebug("dd: "+dd);
	if(dd = addDays){
		logDebug("No Adjustment needed");
	}else if(dd < addDays){
		days = addDays+1;
		logDebug("Adjusted date DST");
	}else if(dd > addDays){
		days = addDays-1;
		logDebug("Adjusted date STD");
	}else{
		logDebug("failure");
	}
	return dateAdd(date,days);
}