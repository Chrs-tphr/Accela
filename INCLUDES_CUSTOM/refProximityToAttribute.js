function refProximityToAttribute(svc,layer,numDistance,distanceType,attributeName,attributeValue){
	// use with all events except ApplicationSubmitBefore
	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if(bufferTargetResult.getSuccess()){
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributeName);
	}else{
		logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage());
		return false;
	}
	var gisObjResult = aa.gis.getParcelGISObjects(RefParcelNumber); //get gis objects for the parcel number
	if(gisObjResult.getSuccess()){
		var fGisObj = gisObjResult.getOutput();
	}else{
		logDebug("**WARNING: Getting GIS objects for Ref Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
		return false;
	}
	for(a1 in fGisObj){// for each GIS object on the Cap
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
		if(bufchk.getSuccess()){
			var proxArr = bufchk.getOutput();
		}else{
			logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
			return false;
		}
		for(a2 in proxArr){
			proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj){
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				
				if(retString && retString.equals(attributeValue)) return true;
			}
		}
	}
}