function updateASIFromAsset(attrField, asiField){//attrField: field name of attribute to get value from, asiField: field name of ASI field to update.
	var attrValueArray = [];
	var attrArrayLocation = [];
	assetObj = aa.asset.getAssetListByWorkOrder(capId, null);
	if(assetObj.getSuccess()){
		assetList = assetObj.getOutput();
		for(a in assetList){
			thisAssetMaster = assetList[a].getAssetDataModel().getAssetMaster();
			attrObj = aa.asset.getAssetData(thisAssetMaster.getG1AssetSequenceNumber());
			dataList = attrObj.getSuccess() ? attrObj.getOutput().getDataAttributes().toArray() : null;
			if(dataList != null){
				logDebug("List of Attributes and Values:")
				for(d in dataList){
					logDebug("   "+dataList[d].getG1AttributeName()+": "+dataList[d].getG1AttributeValue());
					// var attrName = dataList[d].getG1AttributeName();
					// if(attrName == attrField){
					if(attrField == dataList[d].getG1AttributeName()){
						// var attrValue = dataList[d].getG1AttributeValue();
						// attrValueArray.push(attrValue);
						attrValueArray.push(dataList[d].getG1AttributeValue());
					}
				}
			}
		}
		editAppSpecific(asiField, attrValueArray[0]);
		logDebug("***SUCCESS***");
	}
	else{logDebug("**ERROR: Could not get asset list")};
}