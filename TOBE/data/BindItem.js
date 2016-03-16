/**
 * BindItem 
 * 컴포넌트
 * @author azki
 */
var BindItem = TOBE.data.BindItem = TOBE.ClassUtils.create(
/*no extends*/
TOBE.ClassUtils.makeMembers({
	stringVars: {//default: ""
		id: "",
		name: "",
		datasetid: "",
		columnid: "",
		compid: "",
		propid: ""
	},
	objectVars: {
		parent: null,
		_loaded: false,
		_beforeValue: null,
		_beforeDisable: null,
		_bindedItem: null
	}
})
,
{
	_TYPE: "BindItem"
	,
	/**
	 * TOBE.data.BindItem
	 * @constructor
	 * @param {string} id
	 */
	initialize: function(id) {
		this._setId(id);
		this._applyId();
	}
	,
	bind: function() {
		
	}
	,
	_callbackFromDataset: function(dataset, e) {
		if (this._loaded == false) {
			return;
		}
		var columnid = this._getColumnid();
		var rowPos = dataset.getRowposition();
		var propid = this._getPropid();
		if (rowPos < 0 && propid == "value") {
			this._beforeValue = undefined;
			var compid = this._getCompid();
			var form = TOBE.$f(this);
			if (form) {
				var comp;
				try {
					if (comp = TOBE.$(form).$get(compid)) {
						TOBE.$(comp).$set(propid, null);
						this._beforeDisable = true;
						comp.setDisableByEmptyRow(true);
					}
				}
				catch (ignore) {
				}
			}
		}
		else {
			var value = dataset.getColumn(rowPos, columnid);
			if (value !== this._beforeValue) {
				this._beforeValue = value;
				var compid = this._getCompid();
				var form = TOBE.$f(this);
				if (form) {
					var comp;
					try {
						if (comp = TOBE.$(form).$get(compid)) {
							TOBE.$(comp).$set(propid, value);
							this._beforeDisable = false;
							comp.setDisableByEmptyRow(false);
						}
					}
					catch (ignore) {
					}
				}
			}
			else {
				if (this._beforeDisable) {
					var compid = this._getCompid();
					var form = TOBE.$f(this);
					if (form) {
						var comp;
						try {
							if (comp = TOBE.$(form).$get(compid)) {
								this._beforeDisable = false;
								comp.setDisableByEmptyRow(false);
							}
						}
						catch (ignore) {
						}
					}
				}
			}
		}
	}
	,
	_callbackFromComponent: function(widget, e) {
		if (this._loaded == false) {
			return;
		}
		if (this._beforeValue !== e.value) {
			this._beforeValue = e.value;
			var form = TOBE.$f(this);
			if (form) {
				var datasetid = this._getDatasetid();
				datasetid = datasetid.replace("@", "");
				if (datasetid) {
					var dataset = TOBE.$(form).$get(datasetid);
					if (dataset) {
						var columnid = this._getColumnid();
						var rowPos = dataset.getRowposition();
						dataset.setColumn(rowPos, columnid, e.value);
					}
				}
			}
		}
	}
	,
	setDatasetid: function() {
		arguments.callee._super.apply(this, arguments);
		//TODO: 이벤트 해지-등록
	}
	,
	setLoadState: function(loaded){
		if (this._loaded) {
			return;
		}
		if (loaded == true) {
			var form = TOBE.$f(this);
			if (form) {
				var datasetid = this._getDatasetid();
				if (datasetid) {
					var ds =TOBE.$(form).$get(datasetid);
					if (ds) {
						this._loaded = true;
						ds.addEventListener("ALL", this._callbackFromDataset._tobeBind(this));
						this._callbackFromDataset(ds, null);
						var propid = this._getPropid();
						if (propid == "value") {
							var compid = this._getCompid();
							var comp = TOBE.$(form).$get(compid);
							if (comp) {
								if (this._bindedItem == null) {
									this._bindedItem = this._callbackFromComponent._tobeBind(this);
								}
								comp.addEventListener("bindvaluechanged", this._bindedItem);
							}
						}
					}
				}
			}
			else {
				//TODO:이벤트 해제 등등...
				this._loaded = false;
			}
		}
	}
});