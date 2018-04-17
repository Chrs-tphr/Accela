function convertJsDateToYYYYMMDD(jsdate){
	var d = jsdate.getDate();
	var m = jsdate.getMonth()+1;
	if(m < 10) m = "0"+m;
	var y = jsdate.getFullYear();
	var fDate = y+"-"+m+"-"+d;
	return fDate;
}