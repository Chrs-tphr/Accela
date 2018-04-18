function getClockTimeFromJsDate(jsdate){
	var h = jsdate.getHours();
	var m = jsdate.getMinutes();
	var s = jsdate.getSeconds();
	var l = (h < 12) ? "am" : "pm";
	h = (h > 12) ? h-12 : h;
	var ct = h+":"+zeroPad(m,2)+" "+l;
	return ct;
}