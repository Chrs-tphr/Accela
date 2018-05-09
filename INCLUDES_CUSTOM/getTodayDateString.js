function getTodayDateString(){//optional param: adjust days + or -
	var nDays = 0;
	if(arguments.length > 0){
		var nDays = arguments[0];
	}
	var d = new Date(dateAdd(null,nDays));
	var month = d.getMonth()+1;
	var day = d.getDate();
	var year = d.getFullYear();
	return month+"/"+day+"/"+year;
}