/**
 * @fileOverview
 *
 * @author Choi, Jongkwan
 */

/**
 * @class <p>지원하는 데이터의 형식(type)을 정의한다.
 *
 * <p>정의된 데이터의 형식은 다음과 같다.
 * <blockquote>
 *    <table border="thin">
 *        <tr class="TableSubHeadingColor">
 *            <th>XPlatform 형식</th>
 *            <th>JavaScript API</th>
 *            <th>JavaScript 형식</th>
 *            <th>Java API</th>
 *            <th>Java 형식</th>
 *            <th>설 명</th>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>-</td>
 *            <td>DataTypes.UNDEFINED</td>
 *            <td>undefined</td>
 *            <td>DataTypes.UNDEFINED</td>
 *            <td>null</td>
 *            <td>미정의</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>-</td>
 *            <td>DataTypes.NULL</td>
 *            <td>null</td>
 *            <td>DataTypes.NULL</td>
 *            <td>null</td>
 *            <td>미정의</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>STRING</td>
 *            <td>DataTypes.STRING</td>
 *            <td>string</td>
 *            <td>DataTypes.STRING</td>
 *            <td>String</td>
 *            <td>문자열</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>INT</td>
 *            <td>DataTypes.INT</td>
 *            <td>number</td>
 *            <td>DataTypes.INT</td>
 *            <td>int</td>
 *            <td>4 byte 정수</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>BOOL</td>
 *            <td>DataTypes.BOOLEAN</td>
 *            <td>boolean</td>
 *            <td>DataTypes.BOOLEAN</td>
 *            <td>boolean</td>
 *            <td>참 또는 거짓</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>DECIMAL</td>
 *            <td>DataTypes.NUMBER</td>
 *            <td>number</td>
 *            <td>DataTypes.LONG</td>
 *            <td>long</td>
 *            <td>8 byte 정수</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>FLOAT</td>
 *            <td>DataTypes.FLOAT</td>
 *            <td>number</td>
 *            <td>DataTypes.FLOAT</td>
 *            <td>float</td>
 *            <td>4 byte 실수</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>DECIMAL</td>
 *            <td>DataTypes.NUMBER</td>
 *            <td>number</td>
 *            <td>DataTypes.DOUBLE</td>
 *            <td>double</td>
 *            <td>8 byte 실수</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>DECIMAL</td>
 *            <td>DataTypes.DECIMAL</td>
 *            <td>number</td>
 *            <td>DataTypes.DECIMAL</td>
 *            <td>java.math.BigDeciaml</td>
 *            <td>-</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>DATE</td>
 *            <td>DataTypes.DATE</td>
 *            <td>Date</td>
 *            <td>DataTypes.DATE</td>
 *            <td>java.util.Date</td>
 *            <td>일자 (yyyyMMdd)</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>TIME</td>
 *            <td>DataTypes.TIME</td>
 *            <td>Date</td>
 *            <td>DataTypes.TIME</td>
 *            <td>java.util.Date</td>
 *            <td>시간 (HHmmssSSS)</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>DATETIME</td>
 *            <td>DataTypes.DATE_TIME</td>
 *            <td>Date</td>
 *            <td>DataTypes.DATE_TIME</td>
 *            <td>java.util.Date</td>
 *            <td>일자와 시간 (yyyyMMddHHmmssSSS)</td>
 *        </tr>
 *        <tr class="TableRowColor">
 *            <td>BLOB</td>
 *            <td>DataTypes.BLOB</td>
 *            <td>TODO 정의</td>
 *            <td>DataTypes.BLOB</td>
 *            <td>byte[]</td>
 *            <td>byte 배열</td>
 *        </tr>
 *    </table>
 * </blockquote>
 *
 * @constructor
 */
TOBE.data.DataTypes = {

	/**
	 * 정의되지 않은 형식
	 * @static
	 * @type int
	 */
	UNDEFINED:  0,
	/**
	 * null 형식
	 * @static
	 * @type int
	 */
	NULL:       1,
	/**
	 * string 형식
	 * @static
	 * @type int
	 */
	STRING:     2,
	/**
	 * int 형식
	 * @static
	 * @type int
	 */
	INT:        3,
	/**
	 * boolean 형식
	 * @static
	 * @type int
	 */
	BOOLEAN:    4,
	/**
	 * float 형식
	 * @static
	 * @type int
	 */
	FLOAT:      6,
	/**
	 * number 형식
	 * @static
	 * @type int
	 */
	NUMBER:     7,
	/**
	 * Decimal 형식
	 * @static
	 * @type int
	 */
	DECIMAL:    8,
	/**
	 * 일자 형식 (yyyyMMdd)
	 * @static
	 * @type int
	 */
	DATE:       9,
	/**
	 * 시간 형식 (HHmmssSSS)
	 * @static
	 * @type int
	 */
	TIME:      10,
	/**
	 * 일자와 시간 형식 (yyyyMMddHHmmssSSS)
	 * @static
	 * @type int
	 */
	DATE_TIME: 11,
	/**
	 * byte 배열 형식
	 * @static
	 * @type int
	 */
	BLOB:      12,

	/**
	 * 정의되지 않은 형식
	 * @static
	 * @type string
	 */
	STR_UNDEFINED: "undefined",
	/**
	 * null 형식
	 * @static
	 * @type string
	 */
	STR_NULL:      "null",
	/**
	 * string 형식
	 * @static
	 * @type string
	 */
	STR_STRING:    "string",
	/**
	 * int 형식
	 * @static
	 * @type string
	 */
	STR_INT:       "int",
	/**
	 * boolean 형식
	 * @static
	 * @type string
	 */
	STR_BOOLEAN:   "bool",
	/**
	 * float 형식
	 * @static
	 * @type string
	 */
	STR_FLOAT:     "float",
	/**
	 * number 형식
	 * @static
	 * @type string
	 */
	STR_NUMBER:    "number",
	/**
	 * Decimal 형식
	 * @static
	 * @type string
	 */
	STR_DECIMAL:   "decimal",
	/**
	 * 일자 형식
	 * @static
	 * @type string
	 */
	STR_DATE:      "date",
	/**
	 * 시간 형식
	 * @static
	 * @type string
	 */
	STR_TIME:      "time",
	/**
	 * 일자와 시간 형식
	 * @static
	 * @type string
	 */
	STR_DATE_TIME: "datetime",
	/**
	 * byte 배열 형식
	 * @static
	 * @type string
	 */
	STR_BLOB:      "blob",

	/**
	 * 정의되지 않은 형식의 기본 크기
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_UNDEFINED: 8,
	/**
	 * null 형식의 기본 크기
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_NULL:      0,
	/**
	 * string 형식의 기본 크기
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_STRING:    32,
	/**
	 * int 형식의 기본 크기, 그러나 숫자 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_INT:       4,
	/**
	 * boolean 형식의 기본 크기, 그러나 boolean 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_BOOLEAN:   2,
	/**
	 * float 형식의 기본 크기, 그러나 숫자 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_FLOAT:     4,
	/**
	 * number 형식의 기본 크기, 그러나 숫자 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_NUMBER:    8,
	/**
	 * Decimal 형식의 기본 크기, 그러나 숫자 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_DECIMAL:   16,
	/**
	 * 일자 형식의 기본 크기, 그러나 일자 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_DATE:      6,
	/**
	 * 시간 형식의 기본 크기, 그러나 시간 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_TIME:      9,
	/**
	 * 일자와 시간 형식의 기본 크기, 그러나 일자와 시간 형식의 기본 크기는 무의미하다.
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_DATE_TIME: 17,
	/**
	 * byte 배열 형식의 기본 크기
	 * @static
	 * @type int
	 */
	DEFAULT_SIZE_BLOB:      256,

	/**
	 * null 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_NULL:      null,
	/**
	 * String 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_STRING:    "",
	/**
	 * int 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_INT:       0,
	/**
	 * boolean 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_BOOLEAN:   false,
	/**
	 * float 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_FLOAT:     0.0,
	/**
	 * number 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_NUMBER:    0,
	/**
	 * Decimal 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_DECIMAL:   0.0,
	/**
	 * 일자를 포함한 Date 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_DATE:      null,
	/**
	 * 시간을 포함한 Date 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_TIME:      null,
	/**
	 * 일자와 시간을 포함한 Date 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_DATE_TIME: null,
	/**
	 * byte 배열 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_BLOB:      null,
	/**
	 * object 형식의 기본값
	 * @static
	 */
	DEFAULT_VALUE_OBJECT:    null,

	/**
	 * 데이터 형식의 기본 값을 반환한다.
	 *
	 * @static
	 * @param {int} type 데이터 형식
	 * @return {object} 기본 값
	 */
	getDefaultValue: function(/* int */type) {
		if (type == TOBE.data.DataTypes.STR_STRING) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_STRING;
		} else if (type == TOBE.data.DataTypes.STR_INT) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_INT;
		} else if (type == TOBE.data.DataTypes.STR_BOOLEAN) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_BOOLEAN;
		} else if (type == TOBE.data.DataTypes.STR_FLOAT) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_FLOAT;
		} else if (type == TOBE.data.DataTypes.STR_NUMBER) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NUMBER;
		} else if (type == TOBE.data.DataTypes.STR_DECIMAL) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DECIMAL;
		} else if (type == TOBE.data.DataTypes.STR_DATE) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE;
		} else if (type == TOBE.data.DataTypes.STR_TIME) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_TIME;
		} else if (type == TOBE.data.DataTypes.STR_DATE_TIME) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_DATE_TIME;
		} else if (type == TOBE.data.DataTypes.STR_BLOB) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_BLOB;
		} else if (type == TOBE.data.DataTypes.STR_NULL) {
			return TOBE.data.DataTypes.DEFAULT_VALUE_NULL;
		} else {
			return TOBE.data.DataTypes.DEFAULT_VALUE_UNDEFINED;
		}
	},

	/**
	 * 데이터 형식의 기본 크기를 반환한다.
	 * 숫자 형식 또는 일자 형식인 경우 기본 크기가 무의미하다.
	 *
	 * @static
	 * @param {int} type 데이터 형식
	 * @return {int} 기본 크기
	 */
	getDefaultSize: function(/* int */type) {
		if (typeof type == "number") {
			return this._getDefaultSizeByIntType(type);
		} else if (typeof type == "string") {
			return this._getDefaultSizeByStringType(type);
		} else {
			return TOBE.data.DataTypes.DEFAULT_SIZE_UNDEFINED;
		}
	},

	/**
	 * string 형식으로 정의된 데이터 형식을 int 형식으로 변환한다.
	 *
	 * @static
	 * @param {string} type string 형식의 데이터 형식
	 * @return {int} int 형식의 데이터 형식
	 */
	toIntType: function(/* string */type) {
		if (type == null) {
			return TOBE.data.DataTypes.UNDEFINED;
		}

		var type = typeof type;

		if (type == "string") {
			return this._stringToIntType(type);
		} else if (type == "number") {
			return this._numberToIntType(type);
		} else {
			return TOBE.data.DataTypes.UNDEFINED;
		}
	},

	/**
	 * int 형식으로 정의된 데이터 형식을 string 형식으로 변환한다.
	 *
	 * @static
	 * @param {int} type int 형식의 데이터 형식
	 * @return {string} string 형식의 데이터 형식
	 */
	toStringType: function(/* int */type) {
		if (type == TOBE.data.DataTypes.STRING) {
			return TOBE.data.DataTypes.STR_STRING;
		} else if (type == TOBE.data.DataTypes.INT) {
			return TOBE.data.DataTypes.STR_INT;
		} else if (type == TOBE.data.DataTypes.BOOLEAN) {
			return TOBE.data.DataTypes.STR_BOOLEAN;
		} else if (type == TOBE.data.DataTypes.FLOAT) {
			return TOBE.data.DataTypes.STR_FLOAT;
		} else if (type == TOBE.data.DataTypes.NUMBER) {
			return TOBE.data.DataTypes.STR_NUMBER;
		} else if (type == TOBE.data.DataTypes.DECIMAL) {
			return TOBE.data.DataTypes.STR_DECIMAL;
		} else if (type == TOBE.data.DataTypes.DATE) {
			return TOBE.data.DataTypes.STR_DATE;
		} else if (type == TOBE.data.DataTypes.TIME) {
			return TOBE.data.DataTypes.STR_TIME;
		} else if (type == TOBE.data.DataTypes.DATE_TIME) {
			return TOBE.data.DataTypes.STR_DATE_TIME;
		} else if (type == TOBE.data.DataTypes.BLOB) {
			return TOBE.data.DataTypes.STR_BLOB;
		} else if (type == TOBE.data.DataTypes.NULL) {
			return TOBE.data.DataTypes.STR_NULL;
		} else {
			return TOBE.data.DataTypes.STR_UNDEFINED;
		}
	},

	/**
	 * 값(value)으로부터 데이터의 형식을 판단한다.
	 *
	 * @static
	 * @param {object} value 값
	 * @param {boolean} include nul 형식 포함 여부
	 * @return {int} 데이터의 형식
	 */
	findType: function(/* object */value, /* boolean */include) {
		// TODO how blob type ?
		if (value === undefined) {
			return TOBE.data.DataTypes.UNDEFINED;
		} else if (value === null) {
			if (typeof include == "boolean" && include == false) {
				return TOBE.data.DataTypes.UNDEFINED;
			} else {
				return TOBE.data.DataTypes.NULL;
			}
		}

		var type = typeof value;

		if (type == "string") {
			return TOBE.data.DataTypes.STRING;
		} else if (type == "number") {
			return TOBE.data.DataTypes.NUMBER;
		} else if (type == "boolean") {
			return TOBE.data.DataTypes.BOOLEAN;
		} else {
			return TOBE.data.DataTypes.UNDEFINED;
		}
	},

	/**
	 * Binary 형식 여부를 검사한다.
	 *
	 * @static
	 * @param {int} type 데이터 형식
	 * @return {boolean} Binary 형식 여부
	 */
	isBinary: function(/* int */type) {
		return (type == TOBE.data.DataTypes.BLOB);
	},

	/** @private */
	_getDefaultSizeByIntType: function(/* int */type) {
		if (type == TOBE.data.DataTypes.STRING) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_STRING;
		} else if (type == TOBE.data.DataTypes.INT) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_INT;
		} else if (type == TOBE.data.DataTypes.BOOLEAN) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_BOOLEAN;
		} else if (type == TOBE.data.DataTypes.FLOAT) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_FLOAT;
		} else if (type == TOBE.data.DataTypes.NUMBER) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_NUMBER;
		} else if (type == TOBE.data.DataTypes.DECIMAL) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DECIMAL;
		} else if (type == TOBE.data.DataTypes.DATE) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DATE;
		} else if (type == TOBE.data.DataTypes.TIME) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_TIME;
		} else if (type == TOBE.data.DataTypes.DATE_TIME) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DATE_TIME;
		} else if (type == TOBE.data.DataTypes.BLOB) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_BLOB;
		} else if (type == TOBE.data.DataTypes.NULL) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_NULL;
		} else {
			return TOBE.data.DataTypes.DEFAULT_SIZE_UNDEFINED;
		}
	},

	/** @private */
	_getDefaultSizeByStringType: function(/* int */type) {
		if (type == TOBE.data.DataTypes.STR_STRING) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_STRING;
		} else if (type == TOBE.data.DataTypes.STR_INT) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_INT;
		} else if (type == TOBE.data.DataTypes.STR_BOOLEAN) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_BOOLEAN;
		} else if (type == TOBE.data.DataTypes.STR_FLOAT) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_FLOAT;
		} else if (type == TOBE.data.DataTypes.STR_NUMBER) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_NUMBER;
		} else if (type == TOBE.data.DataTypes.STR_DECIMAL) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DECIMAL;
		} else if (type == TOBE.data.DataTypes.STR_DATE) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DATE;
		} else if (type == TOBE.data.DataTypes.STR_TIME) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_TIME;
		} else if (type == TOBE.data.DataTypes.STR_DATE_TIME) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_DATE_TIME;
		} else if (type == TOBE.data.DataTypes.STR_BLOB) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_BLOB;
		} else if (type == TOBE.data.DataTypes.STR_NULL) {
			return TOBE.data.DataTypes.DEFAULT_SIZE_NULL;
		} else {
			return TOBE.data.DataTypes.DEFAULT_SIZE_UNDEFINED;
		}
	},

	/** @private */
	_stringToIntType: function(/* string */type) {
		var type = type.toLowerCase();

		if (type == TOBE.data.DataTypes.STR_STRING) {
			return TOBE.data.DataTypes.STRING;
		} else if (type == TOBE.data.DataTypes.STR_INT) {
			return TOBE.data.DataTypes.INT;
		} else if (type == TOBE.data.DataTypes.STR_BOOLEAN) {
			return TOBE.data.DataTypes.BOOLEAN;
		} else if (type == TOBE.data.DataTypes.STR_FLOAT) {
			return TOBE.data.DataTypes.FLOAT;
		} else if (type == TOBE.data.DataTypes.STR_NUMBER) {
			return TOBE.data.DataTypes.NUMBER;
		} else if (type == TOBE.data.DataTypes.STR_DECIMAL) {
			return TOBE.data.DataTypes.DECIMAL;
		} else if (type == TOBE.data.DataTypes.STR_DATE) {
			return TOBE.data.DataTypes.DATE;
		} else if (type == TOBE.data.DataTypes.STR_TIME) {
			return TOBE.data.DataTypes.TIME;
		} else if (type == TOBE.data.DataTypes.STR_DATE_TIME) {
			return TOBE.data.DataTypes.DATE_TIME;
		} else if (type == TOBE.data.DataTypes.STR_BLOB) {
			return TOBE.data.DataTypes.BLOB;
		} else if (type == TOBE.data.DataTypes.STR_NULL) {
			return TOBE.data.DataTypes.NULL;
		} else {
			return TOBE.data.DataTypes.UNDEFINED;
		}
	},

	/** @private */
	_numberToIntType: function(/* number */type) {
		if (type === Math.floor(type)) {
			if (type >= TOBE.data.DataTypes.UNDEFINED && type <= TOBE.data.DataTypes.BLOB) {
				return type;
			}
		}

		return TOBE.data.DataTypes.UNDEFINED;
	}
};
