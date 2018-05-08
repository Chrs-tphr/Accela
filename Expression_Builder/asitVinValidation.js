var nonAlphaNumericArray = [" ","`","~","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","{","]","}","\\","|",";",":","'","\"",",","<",".",">","/","?"];

var msg = "";
var block = false;

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASIT::EQUIPMENT LIST::Serial#/VIN");
var variable1=expression.getValue("ASIT::EQUIPMENT LIST::FORM");


var totalRowCount = expression.getTotalRowCount();

for(var updateWhichRowIndex=0;updateWhichRowIndex<totalRowCount;updateWhichRowIndex++){
	variable0=expression.getValue(updateWhichRowIndex, "ASIT::EQUIPMENT LIST::Serial#/VIN");
	variable1=expression.getValue(updateWhichRowIndex, "ASIT::EQUIPMENT LIST::FORM");
	if(variable0.value!=null && !variable0.value.equals("")){
		
		var vinString = variable0.getValue();
		
		for(i=0;i<nonAlphaNumericArray.length;i++){
			if((vinString.length < 16 || vinString.length > 17) || vinString.indexOf(nonAlphaNumericArray[i]) != -1){
				variable0.message='Please enter a valid VIN';
				expression.setReturn(updateWhichRowIndex,variable0);
				variable1.blockSubmit=true;
				expression.setReturn(updateWhichRowIndex,variable1);
				break;
			}
		}
	}
}
