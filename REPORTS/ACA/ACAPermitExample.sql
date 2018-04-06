SELECT
	asiPiv1.type
	,b.B1_ALT_ID unit
	,asiPiv1.mke
	,asiPiv1.yr
	,asiPiv1.serialVIN
	,asiPiv1.licPlt
	,asiPiv1.licPltSte
	,asiPiv1.vehOwnr
	,asiPiv2.strDat
	,asiPiv2.strTime
	,asiPiv2.exprDat
	,asiPiv2.exprTime

FROM B1PERMIT b

LEFT OUTER JOIN (
	SELECT
		bc1.SERV_PROV_CODE
		,bc1.B1_PER_ID1
		,bc1.B1_PER_ID2
		,bc1.B1_PER_ID3
		,bc1.B1_CHECKBOX_DESC
		,bc1.B1_CHECKLIST_COMMENT
	FROM BCHCKBOX bc1
	WHERE
		2=2
		AND bc1.REC_STATUS = 'A'
		AND bc1.B1_CHECKBOX_DESC IN ('Type','Year','Make','Serial#/VIN','License Plate #','License Plate State','Vehicle Owner')
	)
PIVOT(
	MAX(B1_CHECKLIST_COMMENT)
	FOR B1_CHECKBOX_DESC IN ('Type' AS type,'Year' AS yr,'Make' AS mKe,'Serial#/VIN' AS serialVIN,'License Plate #' AS licPlt,'License Plate State' AS licPltSte,'Vehicle Owner' AS vehOwnr) --REPEAT FIELD LABELS IN QUOTES AND ALIAS NEW COLUMN NAMES
)  asiPiv1 ON
	b.SERV_PROV_CODE = asiPiv1.SERV_PROV_CODE
	AND b.B1_PER_ID1 = asiPiv1.B1_PER_ID1
	AND b.B1_PER_ID2 = asiPiv1.B1_PER_ID2
	AND b.B1_PER_ID3 = asiPiv1.B1_PER_ID3

LEFT OUTER JOIN (
	SELECT
		bc1.SERV_PROV_CODE
		,bc1.B1_PER_ID1
		,bc1.B1_PER_ID2
		,bc1.B1_PER_ID3
		,bc1.B1_CHECKBOX_DESC
		,bc1.B1_CHECKLIST_COMMENT
	FROM BCHCKBOX bc1
	WHERE
		2=2
		AND bc1.REC_STATUS = 'A'
		AND bc1.B1_CHECKBOX_DESC IN ('Start Date','Start Time','Expiration Date','Expiration Time')
	)
PIVOT(
	MAX(B1_CHECKLIST_COMMENT)
	FOR B1_CHECKBOX_DESC IN ('Start Date' AS strDat,'Start Time' AS strTime,'Expiration Date' AS exprDat,'Expiration Time' AS exprTime) --REPEAT FIELD LABELS IN QUOTES AND ALIAS NEW COLUMN NAMES
)  asiPiv2 ON
	b.SERV_PROV_CODE = asiPiv2.SERV_PROV_CODE
	AND b.B1_PER_ID1 = asiPiv2.B1_PER_ID1
	AND b.B1_PER_ID2 = asiPiv2.B1_PER_ID2
	AND b.B1_PER_ID3 = asiPiv2.B1_PER_ID3
			

WHERE
	1=1
	AND b.SERV_PROV_CODE = 'MSP'
	AND b.SERV_PROV_CODE = '{?agencyid}'
	AND b.B1_PER_GROUP = 'MCD'
	AND b.B1_PER_TYPE = 'Intrastate Motor Carrier'
	AND b.B1_PER_SUB_TYPE = '72 hour Permit'
	AND b.B1_PER_CATEGORY = 'NA'	
	AND b.REC_STATUS = 'A'
	AND b.B1_ALT_ID = '{?capid}'