/*------------------------------------------------------------------------------------------------------/
| SVN $Id: External_LP_CA_EB_1_1.js   2010-01-05   john.schomp $
| Program : External_LP_CA_EB_1_1.js
|
| Usage   : Expression Builder Script that will validate a license and populate demographic fields.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : Expression builder script to be used on Professional portlet.  Execute on LP::onPopulate
|           and/or LP::professionalModel:licensenbr for best results.   
|
| 11/21/2012 : 1.1 : Dane Quatacker, Accela - Updated to use HTTP GET for retrieving data from CSLB
|
/------------------------------------------------------------------------------------------------------*/


var msg = "";
var servProvCode=expression.getValue("$$servProvCode$$").value;
var returnMessage = "";
// get the EMSE biz object
var aa = expression.getScriptRoot();

// License Number that the user entered or selected
var licNum = expression.getValue("LP::professionalModel*licensenbr").value;

// Rest of the license...

var expAddressLine1 = expression.getValue("LP::professionalModel*address1");
var expAddressLine2 = expression.getValue("LP::professionalModel*address2");
var expBusinessName = expression.getValue("LP::professionalModel*businessname");
var expCity = 		expression.getValue("LP::professionalModel*city");
var expState = 		expression.getValue("LP::professionalModel*state");
var expPhone1 = expression.getValue("LP::professionalModel*phone1")
var expZip = expression.getValue("LP::professionalModel*zip")
var expComments = expression.getValue("LP::professionalModel*comment");
var licType = expression.getValue("LP::professionalModel*licensetype");

var document;
var root;        
var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
var vOutObj = aa.httpClient.get(aURLArgList);
var isError = false;

if(vOutObj.getSuccess()){
	var vOut = vOutObj.getOutput();
    	var sr =  aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
	var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
	document = saxBuilder.build(sr);
    	root = document.getRootElement();
    	errorNode = root.getChild("Error");
}
else{
	isError = true;
}

if (isError){
	expression.addMessage("The CSLB web service is currently unavailable");
}
else if (errorNode)
	{
	expression.addMessage("CSLB information returned an error for license " + licNum + " : " + unescape(errorNode.getText()).replace(/\+/g," "));
	}
else
	{
	var lpBiz = root.getChild("BusinessInfo");
	var lpStatus = root.getChild("PrimaryStatus");
	var lpClass = root.getChild("Classifications");
	var lpBonds = root.getChild("ContractorBond");
	var lpWC = root.getChild("WorkersComp");

	// Primary Status
	// 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
	var stas = lpStatus.getChildren();
	for (i=0 ; i<stas.size(); i++) {
		var sta = stas.get(i);

		if (sta.getAttribute("Code").value != "10")
			returnMessage+="License:" + licNum + ", " + unescape(sta.getAttribute("Desc").value).replace(/\+/g," ") + " ";
		}


	expAddressLine1.value = unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g," ");
	expAddressLine2.value = unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g," ");
	expBusinessName.value = unescape(lpBiz.getChild("Name").getText()).replace(/\+/g," ");
	expCity.value = unescape(lpBiz.getChild("City").getText()).replace(/\+/g," ");
	expState.value = unescape(lpBiz.getChild("State").getText()).replace(/\+/g," ");
	expPhone1.value = unescape(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g," ");
  	expZip.value = unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g," ");
	licType.value = "Contractor";

/*	var WCs = lpWC.getChildren();
  	WC = WCs.get(0);
 	expComments.value =  'Workers Comp Status: ' + WC.getAttribute("ExemptDesc").value;	
 	expComments.value += '\r\n  Ins Code: ' + WC.getAttribute("InsCoCde").value;
*/
 /* 	var LCs = lpClass.getChildren();
  	LC = LCs.get(0);
 	expComments.value =  'License Classifications: ' + LC.getAttribute("Code").value;  
	expComments.value += ' : ' + LC.getAttribute("Desc").value;
*/
  	expression.setReturn(expAddressLine1);
  	expression.setReturn(expAddressLine2);
  	expression.setReturn(expBusinessName);
  	expression.setReturn(expCity);
 	expression.setReturn(expState);
  	expression.setReturn(expPhone1);
  	expression.setReturn(expZip);
	expression.setReturn(expComments);
	expression.setReturn(licType);

	if (returnMessage.length > 0)
		expression.addMessage("CSLB report status: " + returnMessage);
	}

