function updateAssetFromASI(attrField, asiField){//attrField: field name of attribute to get value from, asiField: field name of ASI field to update.
	var asiFieldValue = getAppSpecific(asiField);
	logDebug(asiFieldValue);
	assetObj = aa.asset.getAssetListByWorkOrder(capId, null);
	if(assetObj.getSuccess()){
		assetList = assetObj.getOutput();
		for(a in assetList){
			thisAsset = assetList[a].getAssetDataModel();
			thisAssetMaster = thisAsset.getAssetMaster();
			attrObj = aa.asset.getAssetData(thisAssetMaster.getG1AssetSequenceNumber());
			dataList = attrObj.getSuccess() ? attrObj.getOutput().getDataAttributes() : null;
			if(dataList != null){
				for(d=0;d<dataList.size();d++){
					thisAttrib = dataList.get(d);
					logDebug("   Existing data:"+thisAttrib.getG1AttributeName()+": "+thisAttrib.getG1AttributeValue());
					if(attrField == thisAttrib.getG1AttributeName()){
						thisAttrib.setG1AttributeValue(asiFieldValue);
						logDebug("   The asset: "+attrObj+" Has new data:"+thisAttrib.getG1AttributeName()+": "+thisAttrib.getG1AttributeValue());
					}
				}
			}
			thisAsset.setDataAttributes(dataList);
			logDebug("Updating Asset Data List: " + aa.asset.editAsset(thisAsset).getSuccess());
		}
	}
	else{
		logDebug("**ERROR: Could not get asset list");
	}
}