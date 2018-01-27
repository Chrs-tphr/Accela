var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
	if(isNaN(nDays)){
		throw("Day is a invalid number!");
	}
	return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}

var msg = "";
var block = false;

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASIT::EQUIPMENT LIST::Year");
var variable1=expression.getValue("$$today$$");
var variable2=expression.getValue("ASIT::EQUIPMENT LIST::FORM");

var totalRowCount = expression.getTotalRowCount();

for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
	msg = "";
	
	variable0=expression.getValue(rowIndex, "ASIT::EQUIPMENT LIST::Year");
	variable2=expression.getValue(rowIndex, "ASIT::EQUIPMENT LIST::FORM");
	
	var asitYear = parseInt(variable0.getValue());
	msg += "asitYear: "+asitYear+" / ";
	
	var currentYear = new Date(variable1.getValue()).getFullYear();
	
	if(variable0.getValue() == null){
		msg += "Please enter the vehicle year";
		block = true;
	}
	if(asitYear < parseInt(1900) || asitYear > parseInt(currentYear+1)){
		msg += "Please enter a valid 4 digit year";
		block = true;
	}
	
	variable0.message = msg;
	expression.setReturn(rowIndex,variable0);
	
	if(block){
		variable2.blockSubmit=true;
		expression.setReturn(rowIndex,variable2);
	}
}


