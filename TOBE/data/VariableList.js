/**
 * @fileOverview
 *
 * @author azki
 */

/**
 * 기본 생성자이다.
 * @class <p>단일 데이터를 가지고 있는 Variable들을 저장한다.
 * Variable은 식별자(name) 또는 위치(index)를 통하여 참조할 수 있다.
 *
 * @constructor
 */
TOBE.data.VariableList = TOBE.ClassUtils.create();

TOBE.data.VariableList.prototype = {

	/** @private */
	_TypeConverter: TOBE.data.TypeConverter,

	/**
	 * 초기화를 수행한다.
	 */
	initialize: function() {
		this._values = [];
		this._map = {};
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 반환한다.
	 *
	 * @private
	 * @deprecated
	 * @param {string or int} key 식별자(name or index)
	 * @return {object} 값
	 */
	get: function(/* string or int */key) {
		return this.getObject(key);
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {object} 값
	 */
	getObject: function(/* string or int */key) {
		if (TOBE.Object.isNumber(key)) {
			return this._getObjectViaIndex(key);
		} else {
			return this._getObjectByName(key);
		}
	},

	/** @private */
	_getObjectByName: function(/* string */name) {
		if (TOBE.Object.isUndefined(this._map[name])) {
			return undefined;
		} else {
			return this._map[name].value;
		}
	},

	/** @private */
	_getObjectViaIndex: function(/* int */index) {
		if (TOBE.Object.isUndefined(this._values[index])) {
			return undefined;
		} else {
			return this._values[index].value;
		}
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 string 형식으로 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {string} 값
	 */
	getString: function(/* string or int */key) {
		return this._TypeConverter.toString(this.getObject(key));
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 number 형식으로 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {number} 값
	 */
	getNumber: function(/* string or int */key) {
		return this._TypeConverter.toNumber(this.getObject(key));
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 boolean 형식으로 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {boolean} 값
	 */
	getBoolean: function(/* string or int */key) {
		return this._TypeConverter.toBoolean(this.getObject(key));
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 Date 형식으로 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {Date} 값
	 */
	getDateTime: function(/* string or int */key) {
		return this._TypeConverter.toDateTime(this.getObject(key));
	},

	/**
	 * 값(value)을 해당하는 식별자(name or index)에 설정한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @param {object} value 값
	 */
	set: function(/* string or int */key, /* object */value) {
		if (TOBE.Object.isNumber(key)) {
			this._setViaIndex(key, value);
		} else {
			this._setByName(key, value);
		}
	},

	/** @private */
	_setByName: function(/* string */name, /* object */value) {
		this._checkName(name);

		this._map[name].value = value;
	},

	/** @private */
	_setViaIndex: function(/* int */index, /* object */value) {
		this._checkIndex(index);

		this._values[index].value = value;
	},

	/**
	 * 식별자(name)와 값(value)을 가지는 데이터를 추가한다.
	 *
	 * @param {string} name 식별자(name)
	 * @param {object} value 값
	 */
	add: function(/* string */name, /* object */value) {
		this._checkName(name, false);

		this._values.push(this._map[name] = {name: name, value: value});
	},

	/**
	 * 식별자(name)와 값(value)을 가지는 데이터를 해당하는 위치(index)에 추가한다.
	 *
	 * @param {int} index 위치(index)
	 * @param {string} name 식별자(name)
	 * @param {object} value 값
	 */
	insert: function(/* int */index, /* string */name, /* object */value) {
		this._checkName(name, false);
		this._checkIndex(index, true);

		this._values.splice(index, 0, this._map[name] = {name: name, value: value});
	},

	/**
	 * 해당하는 식별자(name or index)의 데이터를 삭제한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {object} 삭제된 값
	 */
	remove: function(/* string or int */key) {
		if (TOBE.Object.isNumber(key)) {
			return this._removeViaIndex(key);
		} else {
			return this._removeByName(key);
		}
	},

	/** @private */
	_removeByName: function(/* string */name) {
		if (this.contains(name)) {
			return this._removeViaIndex(this.indexOf(name));
		} else {
			return undefined;
		}
	},

	/** @private */
	_removeViaIndex: function(/* int */index) {
		if (this.contains(index)) {
			var removedValue = this._values[index].value;
			delete this._map[this._values[index].name];
			this._values.splice(index, 1);

			return removedValue;
		} else {
			return undefined;
		}
	},

	/**
	 * 모든 데이터를 삭제한다.
	 */
	clear: function() {
		this._map = {};
		this._values = [];
	},

	/**
	 * 데이터의 갯수를 반환한다.
	 *
	 * @return {int} 데이터의 갯수
	 */
	size: function() {
		return this._values.length;
	},

	/**
	 * 식별자(name)에 해당하는 위치(index)를 반환한다.
	 *
	 * @param {string} name 식별자(name)
	 * @return {int} 위치(index)
	 */
	indexOf: function(/* string */name) {
		var count = this._values.length;

		for (var i = 0; i < count; i++){
			if (this._values[i].name == name){
				return i;
			}
		}

		return -1;
	},

	/**
	 * 식별자(name or index)의 포함 여부를 검사한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return 포함 여부
	 */
	contains: function(/* string or int */key) {
		if (TOBE.Object.isNumber(key)) {
			return this._containsViaIndex(key);
		} else {
			return this._containsByName(key);
		}
	},

	/** @private */
	_containsByName: function(/* string */name) {
		return (! TOBE.Object.isUndefined(this._map[name]));
	},

	/** @private */
	_containsViaIndex: function(/* int */index) {
		return (index >= 0 && index < this._values.length);
	},

	/**
	 * 식별자(name)들을 반환한다.
	 *
	 * @return {string[]} 식별자(name)들
	 */
	keyList: function() {
		var list = [];

		for (var key in this._map) {
			list.push(key);
		}

		return list;
	},

	/**
	 * 값(value)들을 반환한다.
	 *
	 * @return {object[]} 값(value)들
	 */
	valueList: function() {
		var list = [];
		var count = this._values.length;

		for (var i = 0; i < count; i++) {
			list.push(this._values[i].value);
		}

		return list;
	},

	/** @private */
	_checkName: function(/* string */name, /* boolean */exists) {
		var hasToExist = (TOBE.Object.isUndefined(exists) || exists == true);
		var isExists = this.contains(name);

		if (hasToExist) {
			if (! isExists) {
				throw new TOBE.lang.IllegalArgumentError("식별자(name) 미존재, name=" + name);
			}
		} else {
			if (isExists) {
				throw new TOBE.lang.IllegalArgumentError("식별자(name) 중복, name=" + name);
			}
		}
	},

	/** @private */
	_checkIndex: function(/* int */index, /* boolean */insert) {
		var max = this._values.length;

		if (TOBE.Object.isUndefined(insert) || insert == false) {
			max--;
		}

		if (index < 0 || index > max) {
			throw new TOBE.lang.IndexOutOfBoundsError("위치(index) 범위 초과"
				+ ", max=" + max
				+ ", index=" + index);
		}
	}
}
