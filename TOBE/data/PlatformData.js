/**
 * @fileOverview
 *
 * @author azki
 */

/**
 * 기본 생성자이다.
 * @class <p>데이터의 최상위 데이터이고, 데이터 통신 또는 데이터 이동 등의 기본 단위이다.
 * 즉, 서버와 데이터를 송수신하거나, 타 클래스간의 데이터를 전달하는 경우
 * PlatformData를 이용하여 수행한다.
 *
 * <p>PlatformData는 VariableList와 DataSetList를 가지고 있으며, 이를 통해
 * Variable들과 Dataset들을 저장한다.
 *
 * @constructor
 */
TOBE.data.PlatformData = TOBE.ClassUtils.create();

TOBE.data.PlatformData.prototype = {

	// TODO saveType 구현

	/**
	 * 초기화를 수행한다.
	 */
	initialize: function() {
		this._varList = new TOBE.data.VariableList();
		this._dsList = new TOBE.data.DataSetList();
	},

	/**
	 * 식별자(name or index)에 해당하는 값(value)을 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {object} 값
	 */
	getVariable: function(/* string or int */key) {
		return this._varList.get(key);
	},

	/**
	 * 식별자(name)와 값(value)으로 이루어진 데이터를 추가한다.
	 *
	 * @param {string} name 식별자(name)
	 * @param {object} value 값
	 */
	addVariable: function(/* string */name, /* object */value) {
		this._varList.add(name, value);
	},

	/**
	 * 식별자(name)와 값(value)으로 이루어진 데이터의 갯수를 반환한다.
	 *
	 * @return {int} 데이터의 갯수
	 */
	getVariableCount: function() {
		return this._varList.size();
	},

	/**
	 * VariableList를 반환한다.
	 *
	 * @return {TOBE.data.VariableList} VariableList
	 */
	getVariableList: function() {
		return this._varList;
	},

	/**
	 * VariableList를 설정한다.
	 *
	 * @param {TOBE.data.VariableList} varList VariableList
	 */
	setVariableList: function(/* TOBE.data.VariableList */varList) {
		this._varList = varList;
	},

	/**
	 * 식별자(name or index)에 해당하는 DataSet을 반환한다.
	 *
	 * @param {string or int} key 식별자(name or index)
	 * @return {TOBE.data.DataSet} DataSet
	 */
	getDataSet: function(/* string or int */key) {
		return this._dsList.get(key);
	},

	/**
	 * DataSet을 추가한다.
	 *
	 * @param {TOBE.data.DataSet} ds DataSet
	 */
	addDataSet: function(/* TOBE.data.DataSet */ds) {
		this._dsList.add(ds);
	},

	/**
	 * DataSet의 갯수를 반환한다.
	 *
	 * @return {int} DataSet의 갯수
	 */
	getDataSetCount: function() {
		return this._dsList.size();
	},

	/**
	 * DataSetList를 반환한다.
	 *
	 * @return {TOBE.data.DataSetList} DataSetList
	 */
	getDataSetList: function() {
		return this._dsList;
	},

	/**
	 * DataSetList를 설정한다.
	 *
	 * @param {TOBE.data.DataSetList} dsList DataSetList
	 */
	setDataSetList: function(/* TOBE.data.DataSetList */dsList) {
		this._dsList = dsList;
	}
}
