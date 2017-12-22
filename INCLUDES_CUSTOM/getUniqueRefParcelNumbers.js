function getUniqueRefParcelNumbers(){
	var refParcelList = new Array();
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection(); logDebug("Creating DB Connection");
	var SQL = "SELECT L1_PARCEL_NBR as return_string FROM L3PARCEL INNER JOIN RSERV_PROV ON RSERV_PROV.APO_SRC_SEQ_NBR = L3PARCEL.SOURCE_SEQ_NBR WHERE RSERV_PROV.SERV_PROV_CODE = 'SANTACLARITA'";
	var dbStmt = conn.prepareStatement(SQL); logDebug("Preparing SQL");
	dbStmt.executeQuery(); logDebug("Executing Query");
	results = dbStmt.getResultSet();
	while(results.next()){
		refParcelList.push(results.getString("return_string"))
	}
	logDebug("Reference Parcel Numbers Found: "+refParcelList.length);
	dbStmt.close(); logDebug("Query Complete");
	conn.close(); logDebug("DB Connection Closed");
	return refParcelList;
}