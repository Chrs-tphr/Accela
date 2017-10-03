function viewObj(obj){
	for(var key in obj){
		if(typeof obj[key] == 'function')
			logDebug(key + '()');
		else
			logDebug(key + ": " + obj[key]);
	}
}