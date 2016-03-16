/**
 * @fileOverview
 *
 * @author Choi, Jongkwan
 */

/**
 * @class <p>데이터를 다른 형식의 데이터로 변환한다.
 * <p>데이터의 변환은 손실이 발생할 수 있으므로, 정확한 계산이 요구되는 경우에는 주의를 기울인다.
 *
 * @constructor
 */
TOBE.data.TypeConverter = {

	/* boolean 값들 */
	_BOOLEAN_VALUES: {
		"true": true
		, "True": true
		, "TRUE": true
		, "yes": true
		, "Yes": true
		, "YES": true
		, "y": true
		, "Y": true
		, "on": true
		, "On": true
		, "ON": true
		,"1": true

		, "false": false
		, "False": false
		, "FALSE": false
		, "no": false
		, "No": false
		, "NO": false
		, "n": false
		, "N": false
		, "off": false
		, "Off": false
		, "OFF": false
		,"0": false
	},

	/* 기본 시간 */
	_DEFAULT_YEAR:     1970,
	_DEFAULT_MONTH:       0,
	_DEFAULT_DATE:        1,
	_DEFAULT_HOUR:        0,
	_DEFAULT_MINUTE:      0,
	_DEFAULT_SECOND:      0,
	_DEFAULT_MILLISECOND: 0,

	_INIT_DATE: new Date(0),
	_MAX_MILLISECONDS: 100000000 * 24 * 60 * 60 * 1000,
	_MIN_MILLISECONDS: -100000000 * 24 * 60 * 60 * 1000,

	/**
	 * 데이터를 string 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {String} string 형식으로 변환된 데이터
	 */
	toString: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_STRING;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			return value;
		} else if (type == "number") {
			return value.toString();
		} else if (type == "boolean") {
			return value.toString();
		} else if (type == "object") {
			if (value instanceof Date) {
				return this._formatDateTime(value);
			} else {
				return value.toString();
			}
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_STRING;
		}
	},

	/**
	 * 데이터를 int 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {number} int 형식으로 변환된 데이터
	 */
	toInt: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var parsedInt = parseInt(value, 10);

			if (isNaN(parsedInt)) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
			} else {
				return parsedInt;
			}
		} else if (type == "number") {
			return Math.floor(value);
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
		} else if (type == "object") {
			if (value instanceof Date) {
				return value.getTime();
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
			}
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
		}
	},

	/**
	 * 데이터를 boolean 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {boolean} boolean 형식으로 변환된 데이터
	 */
	toBoolean: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var bool = this._BOOLEAN_VALUES[value];

			if (bool === undefined) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
			} else {
				return bool;
			}
		} else if (type == "number") {
			return ! isNaN(value) && value != 0;
//			return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
		} else if (type == "boolean") {
			return value;
		} else if (type == "object") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
		}
	},

	/**
	 * 데이터를 float 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {number} float 형식으로 변환된 데이터
	 */
	toFloat: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var parsedFloat = parseFloat(value);

			if (isNaN(parsedFloat)) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
			} else {
				return parsedFloat;
			}
		} else if (type == "number") {
			// CHECK float == number ?
			return value;
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
		} else if (type == "object") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
		}
	},

	/**
	 * 데이터를 number 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {number} number 형식으로 변환된 데이터
	 */
	toNumber: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var num = new Number(value);

			if (isNaN(num)) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
			} else {
				return num;
			}
		} else if (type == "number") {
			return value;
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
		} else if (type == "object") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
		}
	},

	/**
	 * 데이터를 Decimal 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {number} Decimal 형식으로 변환된 데이터
	 */
	toDecimal: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var num = new Number(value);

			if (isNaN(num)) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
			} else {
				return num;
			}
		} else if (type == "number") {
			// CHECK decimal == number ?
			return value;
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
		} else if (type == "object") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
		}
	},

	/**
	 * 데이터를 일자를 포함한 Date 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {Date} 일자를 포함한 Date 형식으로 변환된 데이터
	 */
	toDate: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var date = this._parseDate(value);

			if (date === null) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
			} else {
				return this._datetimeToDate(date);
			}
		} else if (type == "number") {
			if (this._isValidTime(value)) {
				var date = new Date(value);

				return this._datetimeToDate(date);
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
			}
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
		} else if (type == "object") {
			if (value instanceof Date) {
				return this._datetimeToDate(value);
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
			}
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
		}
	},

	/**
	 * 데이터를 시간을 포함한 Date 형식으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {Date} 시간을 포함한 Date 형식으로 변환된 데이터
	 */
	toTime: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var date = this._parseDate(value);

			if (date === null) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
			} else {
				return this._datetimeToTime(date);
			}
		} else if (type == "number") {
			if (this._isValidTime(value)) {
				var date = new Date(value);

				return this._datetimeToTime(date);
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
			}
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
		} else if (type == "object") {
			if (value instanceof Date) {
				return this._datetimeToTime(value);
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
			}
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
		}
	},

	/**
	 * 데이터를 일자와 시간을 포함한 Date 형식으로 변환한다.
	 *
	 * 데이터가 string 형식인 경우 지원하는 형식은 다음과 같이 5가지이며,
	 * 자바의 <code>java.text.SimpleDateFormat</code>를 참조한다.
	 *
	 * <blockquote>
	 *    <table border="thin">
	 *        <tr class="TableSubHeadingColor">
	 *            <th>형 식</th>
	 *            <th>예 제</th>
	 *            <th>설 명</th>
	 *        </tr>
	 *        <tr class="TableRowColor">
	 *            <td>yyyyMMddHHmmssZZZ</td>
	 *            <td>20070829144235416</td>
	 *            <td>2007년 08월 29일 14시 42분 35초 416</td>
	 *        </tr>
	 *        <tr class="TableRowColor">
	 *            <td>yyyyMMddHHmmss</td>
	 *            <td>20070829144235</td>
	 *            <td>2007년 08월 29일 14시 42분 35초 000</td>
	 *        </tr>
	 *        <tr class="TableRowColor">
	 *            <td>yyyyMMdd</td>
	 *            <td>20070829</td>
	 *            <td>2007년 08월 29일 00시 00분 00초 000</td>
	 *        </tr>
	 *        <tr class="TableRowColor">
	 *            <td>HHmmssZZZ</td>
	 *            <td>144235416</td>
	 *            <td>1970년 01월 01일 14시 42분 35초 416</td>
	 *        </tr>
	 *        <tr class="TableRowColor">
	 *            <td>HHmmss</td>
	 *            <td>144235</td>
	 *            <td>1970년 01월 01일 14시 42분 35초 000</td>
	 *        </tr>
	 *    </table>
	 * </blockquote>
	 *
	 * @static
	 * @param {object} value 데이터
	 * @return {Date} 일자와 시간을 포함한 Date 형식으로 변환된 데이터
	 */
	toDateTime: function(/* object */value) {
		if (value === undefined) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
		} else if (value === null) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		}

		var type = typeof value;

		if (type == "string") {
			var date = this._parseDate(value);

			if (date === null) {
				return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
			} else {
				return date;
			}
		} else if (type == "number") {
			if (this._isValidTime(value)) {
				return new Date(value);
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
			}
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
		} else if (type == "object") {
			if (value instanceof Date) {
				return value;
			} else {
				return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
			}
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
		}
	},

	/** @private */
	toBlob: function(/* object */value) {
		// TODO toBlob 구현
//		throw new Error("toBlob(value) 미구현");
		return value;
	},

	/**
	 * 데이터를 해당하는 데이터 형식(type)으로 변환한다.
	 *
	 * @static
	 * @param {object} value 데이터
	 * @param {int} type 데이터의 형식
	 * @return {object} 변환된 데이터
	 */
	convert: function(/* object */value, /* int */type) {
		var DataTypes = TOBE.data.DataTypes;

		if (type == DataTypes.STRING) {
			return this.toString(value);
		} else if (type == DataTypes.INT) {
			return this.toInt(value);
		} else if (type == DataTypes.BOOLEAN) {
			return this.toBoolean(value);
		} else if (type == DataTypes.FLOAT) {
			return this.toFloat(value);
		} else if (type == DataTypes.NUMBER) {
			return this.toNumber(value);
		} else if (type == DataTypes.DECIMAL) {
			return this.toDecimal(value);
		} else if (type == DataTypes.DATE) {
			return this.toDate(value);
		} else if (type == DataTypes.TIME) {
			return this.toTime(value);
		} else if (type == DataTypes.DATE_TIME) {
			return this.toDateTime(value);
		} else if (type == DataTypes.BLOB) {
			return this.toBlob(value);
		} else {
			return DataTypes.DEFAULT_VALUE_UNDEFINED;
		}
	},

	/** @private */
	_datetimeToDate: function(/* Date */datetime) {
		datetime.setHours(TOBE.data.TypeConverter._DEFAULT_HOUR);
		datetime.setMinutes(TOBE.data.TypeConverter._DEFAULT_MINUTE);
		datetime.setSeconds(TOBE.data.TypeConverter._DEFAULT_SECOND);
		datetime.setMilliseconds(TOBE.data.TypeConverter._DEFAULT_MILLISECOND);

		return datetime;
	},

	/** @private */
	_datetimeToTime: function(/* Date */datetime) {
		datetime.setFullYear(TOBE.data.TypeConverter._DEFAULT_YEAR);
		datetime.setMonth(TOBE.data.TypeConverter._DEFAULT_MONTH);
		datetime.setDate(TOBE.data.TypeConverter._DEFAULT_DATE);

		return datetime;
	},

	/** @private */
	_parseDate: function(/* string */str) {
		var len = str.length;

		// yyyyMMddHHmmssZZZ
		if (len == 17) {
			var year = str.substring(0, 4);
			var month = str.substring(4, 6);
			var date = str.substring(6, 8);
			var hour = str.substring(8, 10);
			var minute = str.substring(10, 12);
			var second = str.substring(12, 14);
			var millisecond = str.substring(14);

			return this._toDateTime(year, month, date, hour, minute, second, millisecond);
		// yyyyMMddHHmmss
		} else if (len == 14) {
			var year = str.substring(0, 4);
			var month = str.substring(4, 6);
			var date = str.substring(6, 8);
			var hour = str.substring(8, 10);
			var minute = str.substring(10, 12);
			var second = str.substring(12);

			return this._toDateTime(year, month, date, hour, minute, second);
		// yyyyMMdd
		} else if (len == 8) {
			var year = str.substring(0, 4);
			var month = str.substring(4, 6);
			var date = str.substring(6);

			return this._toDate(year, month, date);
		// HHmmssZZZ
		} else if (len == 9) {
			var hour = str.substring(0, 2);
			var minute = str.substring(2, 4);
			var second = str.substring(4, 6);
			var millisecond = str.substring(6);

			return this._toTime(hour, minute, second, millisecond);
		// HHmmss
		} else if (len == 6) {
			var hour = str.substring(0, 2);
			var minute = str.substring(2, 4);
			var second = str.substring(4, 6);

			return this._toTime(hour, minute, second);
		} else {
			return null;
		}
	},

	/** @private */
	_formatDateTime: function(/* Date */datetime) {
		var year = datetime.getFullYear().toString();
		var month = this._leftPad(datetime.getMonth() + 1);
		var date = this._leftPad(datetime.getDate());
		var hour = this._leftPad(datetime.getHours());
		var minute = this._leftPad(datetime.getMinutes());
		var second = this._leftPad(datetime.getSeconds());
		var millsecond = this._leftPad(datetime.getMilliseconds(), 3);

		return year + month + date + hour + minute + second;
	},

	/** @private */
	_toDate: function(/* string */yearStr, /* string */monthStr, /* string */dateStr) {
		var year = parseInt(yearStr, 10);
		if (isNaN(year)) {
			return null;
		} else if (year < 1970) {
			return null;
		}

		var month = parseInt(monthStr, 10);
		if (isNaN(month)) {
			return null;
		} else if (month < 1 || month > 12) {
			return null;
		}

		var date = parseInt(dateStr, 10);
		if (isNaN(date)) {
			return null;
		} else if (date < 1 || date > 31) {
			return null;
		}

		var hour = this._DEFAULT_HOUR;
		var minute = this._DEFAULT_MINUTE;
		var second = this._DEFAULT_SECOND;
		var millisecond = this._DEFAULT_MILLISECOND;

		return new Date(year, month - 1, date, hour, minute, second, millisecond);
	},

	/** @private */
	_toTime: function(/* string */hourStr, /* string */minuteStr, /* string */secondStr,
		/* string */millisecondStr) {

		var hour = parseInt(hourStr, 10);
		if (isNaN(hour)) {
			return null;
		} else if (hour < 0 || hour > 23) {
			return null;
		}

		var minute = parseInt(minuteStr, 10);
		if (isNaN(minute)) {
			return null;
		} else if (minute < 0 || minute > 59) {
			return null;
		}

		var second = parseInt(secondStr, 10);
		if (isNaN(second)) {
			return null;
		} else if (second < 0 || second > 59) {
			return null;
		}

		var millisecond = this._DEFAULT_MILLISECOND;

		if (! TOBE.Object.isUndefined(millisecondStr)) {
			var millisecond = parseInt(millisecondStr, 10);
			if (isNaN(millisecond)) {
				return null;
			} else if (millisecond < 0 || millisecond > 999) {
				return null;
			}
		}

		var year = this._DEFAULT_YEAR;
		var month = this._DEFAULT_MONTH;
		var date = this._DEFAULT_DATE;

		return new Date(year, month, date, hour, minute, second, millisecond);
	},

	/** @private */
	_toDateTime: function(/* string */yearStr, /* string */monthStr, /* string */dateStr,
		/* string */hourStr, /* string */minuteStr, /* string */secondStr,
		/* string */millisecondStr) {

		var date = this._toDate(yearStr, monthStr, dateStr);
		var time = this._toTime(hourStr, minuteStr, secondStr, millisecondStr);

		date.setHours(time.getHours());
		date.setMinutes(time.getMinutes());
		date.setSeconds(time.getSeconds());
		date.setMilliseconds(time.getMilliseconds());

		return date;
	},

	/** @private */
	_isValidTime: function(/* number */time) {
		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Date
		if (TOBE.data.DataUtils.isInt(time)) {
			return (time <= this._MAX_MILLISECONDS && time >= this._MIN_MILLISECONDS);
		} else {
			return false;
		}
	},

	/** @private */
	_leftPad: function(/* number */value, /* int */count) {
		if (count == 3) {
			if (value >= 100) {
				return value.toString();
			} else if (value >= 10) {
				return "0" + value.toString();
			} else {
				return "00" + value.toString();
			}
		} else {
			if (value < 10) {
				return "0" + value.toString();
			} else {
				return value.toString();
			}
		}
	}
}
