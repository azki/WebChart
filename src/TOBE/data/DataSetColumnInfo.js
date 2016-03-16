/**
 * TOBE.data.DataSetColumnInfo
 * Dataset ColumnInfo
 * @author azki
 */
TOBE.data.DataSetColumnInfo = TOBE.ClassUtils.create(
TOBE.ClassUtils.makeMembers({
	intVars: {
		size: 0
	},
	stringVars: {
		name: "",
		type: ""
		/*
String 문자열 
Int 정수형 
Float 실수형 
BigDecimal 실수형 
Date 날짜 : YYYYMMDD(0000/01/01 ~ 9999/12/31) 
Time 시간 : HHmmssuuu(msec포함가능) 
DateTime 일시 : YYYYMMDDHHmmssuuu (msec포함가능) 
		 */
	}
})
,
{
	initialize: function(name, type, size) {
		this._setName(name);
		this._setType(type);
		this._setSize(size);
	}
});
