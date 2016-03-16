/**
 * @fileOverview
 *
 * @author azki
 */

/**
 * 기본 생성자이다.
 * @class <p>2차원 데이터를 가지고 있는 <code>DataSet</code>들을 저장한다.
 * DataSet은 식별자(name) 또는 위치(index)를 통하여 참조할 수 있다.
 *
 * @constructor
 */
TOBE.data.DataSetList = TOBE.ClassUtils.create();

TOBE.data.DataSetList.prototype = {

	/**
	 * 초기화를 수행한다.
	 */
	initialize: function() {
		this._list = [];
	},

	/**
	 * 식별자(name or index)에 해당하는 DataSet을 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {TOBE.data.DataSet} DataSet
	 */
	get: function(/* string or int */key) {
		if (TOBE.Object.isNumber(key)) {
			return this._getViaIndex(key);
		} else {
			return this._getByName(key);
		}
	},

	/** @private */
	_getByName: function(/* string */name) {
		return this._getViaIndex(this.indexOf(name));
	},

	/** @private */
	_getViaIndex: function(/* int */index) {
		return this._list[index];
	},

	/**
	 * DataSet을 해당하는 위치(index)에 설정한다.
	 *
	 * @param {int} index 위치
	 * @param {TOBE.data.DataSet} ds DataSet
	 */
	set: function(/* int */index, /* TOBE.data.DataSet */ds) {
		this._checkName(ds.getName(), index);
		this._checkIndex(index);

		this._list[index] = ds;
	},

	/**
	 * DataSet을 추가한다.
	 *
	 * @param {TOBE.data.DataSet} ds DataSet
	 */
	add: function(/* TOBE.data.DataSet */ds) {
		this._checkName(ds.getName());

		this._list[this._list.length] = ds;
	},

	/**
	 * DataSet을 해당하는 위치(index)에 추가한다.
	 *
	 * @param {int} index 위치
	 * @param {TOBE.data.DataSet} ds DataSet
	 */
	insert: function(/* int */index, /* TOBE.data.DataSet */ds) {
		this._checkName(ds.getName());
		this._checkIndex(index, true);

		this._list.splice(index, 0, ds);
	},

	/**
	 * 해당하는 식별자(name or index)의 DataSet을 삭제한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {TOBE.data.DataSet} 삭제된 DataSet
	 */
	remove: function(/* string or int */key) {
		if (this.contains(key)) {
			if (TOBE.Object.isNumber(key)) {
				return this._removeViaIndex(key);
			} else {
				return this._removeByName(key);
			}
		} else {
			return undefined;
		}
	},

	/** @private */
	_removeByName: function(/* string */name) {
		return this._removeViaIndex(this.indexOf(name));
	},

	/** @private */
	_removeViaIndex: function(/* int */index) {
		return this._list.splice(index, 1);
	},

	/**
	 * 모든 DataSet들을 삭제한다.
	 */
	clear: function() {
		this._list = [];
	},

	/**
	 * DataSet의 갯수를 반환한다.
	 *
	 * @return {int} DataSet의 갯수
	 */
	size: function() {
		return this._list.length;
	},

	/**
	 * 식별자(name)에 해당하는 위치(index)를 반환한다.
	 *
	 * @param {string} name 식별자
	 * @return {int} 위치(index)
	 */
	indexOf: function(/* string */name) {
		if (TOBE.data.StringUtils.isEmpty(name)) {
			return -1;
		}

		var count = this._list.length;

		for (var i = 0; i < count; i++) {
			if (this._list[i].getName() == name) {
				return i;
			}
		}

		return -1;
	},

	/**
	 * 식별자(name or index)에 해당하는 DataSet의 포함 여부를 검사한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {boolean} DataSet의 포함 여부
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
		return (this.indexOf(name) >= 0);
	},

	/** @private */
	_containsViaIndex: function(/* int */index) {
		return (index >= 0 && index < this._list.length);
	},

	/** @private */
	_checkName: function(/* string */name, /* int */index) {
		if (TOBE.data.StringUtils.isEmpty(name)) {
			throw new TOBE.lang.IllegalArgumentError("식별자(name) 부적합, name=" + name);
		}

		if (name.charAt(0) == ' ') {
			if (TOBE.data.StringUtils.trim(name) == "") {
				throw new TOBE.lang.IllegalArgumentError("식별자(name) 부적합, name=" + name);
			}
		}

		var count = this._list.length;
		var index = (TOBE.Object.isUndefined(index)) ? -1 : index;

		for (var i = 0; i < count; i++) {
			if (i != index && this._list[i].getName() == name) {
				throw new TOBE.lang.IllegalArgumentError("식별자(name) 중복, name=" + name);
			}
		}
	},

	/** @private */
	_checkIndex: function(/* int */index, /* boolean */insert) {

		var lastIndex = this._list.length;
		if (TOBE.Object.isUndefined(insert) || insert == false) {
			lastIndex--;
		}

		if (index < 0 || index > lastIndex) {
			throw new TOBE.lang.IndexOutOfBoundsError("DataSet의 위치 부적합, index=" + index);
		}
	}
}
