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

var nonAlphaNumericArray = [" ","`","~","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","{","]","}","\\","|",";",":","'","\"",",","<",".",">","/","?"];
var block = false;

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASIT::EQUIPMENT LIST::Year");
var variable1=expression.getValue("$$today$$");
var variable2=expression.getValue("ASIT::EQUIPMENT LIST::FORM");
var variable3=expression.getValue("ASIT::EQUIPMENT LIST::Serial#/VIN");

var totalRowCount = expression.getTotalRowCount();

for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
	variable0=expression.getValue(rowIndex, "ASIT::EQUIPMENT LIST::Year");
	variable2=expression.getValue(rowIndex, "ASIT::EQUIPMENT LIST::FORM");
	variable3=expression.getValue(rowIndex, "ASIT::EQUIPMENT LIST::Serial#/VIN");
	
	var asitYear = parseInt(variable0.getValue());
	
	var currentYear = new Date(variable1.getValue()).getFullYear();
	
	if((variable0.value!=null && !variable0.value.equals("")) && (!parseInt(variable0.getValue()) || String(variable0.getValue()).length != 4 || asitYear < parseInt(1900) || asitYear > parseInt(currentYear+1))){
		variable0.message = "Please enter a valid 4 digit year";
		expression.setReturn(rowIndex,variable0);
		block = true;
	}
	
	if(variable3.value!=null && !variable3.value.equals("")){
		var vinString = String(variable3.getValue());
		for(i=0;i<nonAlphaNumericArray.length;i++){
			if((vinString.length < 16 || vinString.length > 17) || vinString.indexOf(nonAlphaNumericArray[i]) != -1){
				variable3.message='Please enter a valid VIN';
				expression.setReturn(rowIndex,variable3);
				block = true;
				break;
			}
		}
	}
}

if(block){
	variable2.blockSubmit=true;
	expression.setReturn(rowIndex,variable2);
}

