/**
 * TOBE.data.Dataset
 * 데이터의 성질·표현이 완전하고 자기 모순이 없음.
 * @author azki
 */
var Dataset = TOBE.data.Dataset = TOBE.ClassUtils.create(
TOBE.ClassUtils.makeMembers({
	booleanVars: {
		enableevent: true,
		_loadState: false,
		_destroy: false
	},
	intVars: {
		colcount: 0,
		constcount: 0,
		rowcount: 0,
		rowposition: -1,
		_nColCount: 0,
		_backLen: 0
	},
	stringVars: {
		id: "",
		name: "",
		keystring: "",
		_beforeKeystring: ""
	},
	objectVars: {
		parent: null,
		_columnList: null,
		_columnIndexMap: null,
		_constColumnIndexMap: null,
		_rowList: null,
		_rowIndexList: null,
		_rowDeletedIndexList: null,
		_eventListenerList: null
	},
	eventVars: {
		oncolumnchanged: null,
		onload: null,
		onrowposchanged: null,
		onrowsetchanged: null,
		onvaluechanged: null
	}
})
,
{
	ROWTYPE_EMPTY: 0,//존재하지 않는 Row 상태
	ROWTYPE_NORMAL: 1,//초기 Row 상태
	ROWTYPE_INSERT: 2,//추가된 Row 상태
	ROWTYPE_UPDATE: 4,//수정된 Row 상태
	ROWTYPE_DELETE: 8,//삭제된 Row 상태
	ROWTYPE_GROUP: 16,//Group 정보 Row 상태
	
	REASON_LOAD: 0,//Dataset의 Load가 완료되었을 때
	REASON_LOADPROCESS: 1,//Dataset을 Loading 중일 때 
	REASON_RESET: 2,//Dataset의 변경사항을 무시하고 이전상태로 Reset되었을 때
	REASON_LOADCONTENT: 3,//ADL 또는 FDL에 정의된 Dataset의 Load가 완료되었을 때. Form의 onload() 이벤트보다 먼저 발생합니다.
	REASON_ASSIGN: 10,//Dataset이 Assign 되었을 때
	REASON_COPY: 11,//Dataset이 복사되었을 때
	REASON_APPEND: 12,//Dataset이 추가되었 때
	REASON_MERGE: 13,//Dataset이 통합되었을 때
	REASON_DELETE: 20,//Dataset의 Row가 삭제되었을 때
	REASON_DELETEALL: 22,//Dataset의 모든 Row가 삭제되었을 때
	REASON_CLEARDATA: 23,//Dataset의 모든 Row가 완전 삭제되었을 때
	REASON_CLEAR: 24,//Dataset의 모든 Column 및 Row가 완전히 삭제되었을 때
	REASON_SORTGROUP: 30,//Dataset의 데이터가 정렬 또는 그룹화 되었을 때
	REASON_FILTER: 31,//Dataset의 데이터가 Filter 되었을 때
	REASON_MOVE: 32,//Dataset의 Row가 다른 위치로 이동되었을 때
	REASON_EXCHANGE: 33,//Dataset의 두 Row가 서로 위치가 바뀌었을 때
	REASON_CHANGELAYOUT: 34,//Dataset의 Column 정보가 변경되었을 때
	REASON_CHANGESTATUS: 40,//Dataset의 Row 상태(Type, Select)이 변경되었을 때
	REASON_ENABLEEVENT: 41,//Dataset의 enableevent 속성이 'true'가 되었을 때

	REASON_BINDSOURCE: 90,//Dataset을 Bind 했을 때 

	_isConst: true
}
,
{
	_isData: true
	,
	_TYPE: "Dataset"
	,
	initialize: function(id) {
		this._setId(id);
		this._applyId();
		this._setName(id);
		
		this._columnList = [];
		this._columnIndexMap = {};
		this._constColumnIndexMap = {};
		
		this._rowList = [];
		this._rowIndexList = [];
		this._rowDeletedIndexList = [];
		
		this._eventListenerList = new TOBE.EventListenerList();
	}
	,
	setId: TOBE.emptyFn
	,
	getLoadState: function() {
		return this._loadState;
	}
	,
	setLoadState: function(loaded) {
		this._loadState = loaded;
		if (loaded == true) {
			this._event_load(
				new TOBE.Event.DSLoad(this, 0, "", this.REASON_LOAD)
			);
			this._setRowpositionWithEvent(this._rowIndexList.length? 0: -1);
		}
		else {
			//TODO:이벤트 해제 등등...
		}
	}
	,
	_setRowData: function(rowData) {
		if (this.parent == null) {
			this._rowList = rowData;
			var indexList = this._rowIndexList = [];
			var i, len = rowData.length;
			for (i = 0; i < len; ++i) {
				rowData[i].tp = this.ROWTYPE_NORMAL;
				indexList.push(i);
			}
		}
	}
	,
	addEventListener: function(type, func) {
		var functionCount, callbackFunctions, i, list = this._eventListenerList;
		if (functionCount = list.getListenerCount(type)) {
			callbackFunctions = list.getListeners(type);
			for (i = 0; i < functionCount; ++i) {
				if (func == callbackFunctions[i]) {
					return false;
				}
			}
		}
		list.addListener(type, func);
		return true;
	}
	,
	removeEventListener: function(type, func) {
		this._eventListenerList.removeListener(type, func);
	}
	,
	_fireEvent: function(eventType, dataset, e) {
		var functionCount, callbackFunctions, i, list = this._eventListenerList;
		if (list) {
			if ("eventid" in e == false) {
				e.eventid = "on"+eventType;
			}
			if (functionCount = list.getListenerCount(eventType)) {
				callbackFunctions = list.getListeners(eventType);
				for (i = 0; i < functionCount; ++i) {
					callbackFunctions[i].apply(this, [dataset, e]);
				}
			}
			eventType = "ALL";
			if (functionCount = list.getListenerCount(eventType)) {
				callbackFunctions = list.getListeners(eventType);
				for (i = 0; i < functionCount; ++i) {
					callbackFunctions[i].apply(this, [dataset, e]);
				}
			}
		}
	}
	,
	__applyEnableevent: function() {
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_ENABLEEVENT)
			);
		}
	}
	,
	__obtainColcount: function() {
		return this._columnList.length;
	}
	,
	__obtainConstcount: function() {
		return this._columnList.length - this._nColCount;
	}
	,
	__obtainRowcount: function() {
		return this._rowIndexList.length;
	}
	,
	//////////////////////////////////////////
	// column
	addColumn: function(id, type, size) {
		if (id in this._columnIndexMap) {
			return;
		}
		if (id in this._constColumnIndexMap) {
			return;
		}
		type = type.toUpperCase();
		switch (type) {
			case "INT":
			case "FLOAT":
			case "BIGDECIMAL":
			case "DATE":
			case "TIME":
			case "DATETIME":
				break;
			default:
				type = "STRING";
		}
		size = parseInt(size, 10);
		if (isNaN(size)) {
			size = 256;
		}
		this._addColumn(id, type, size);
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_CHANGELAYOUT)
			);
		}
	}
	,
	_addColumn: function(id, type, size) {
		var index = this._columnIndexMap[id] = this._nColCount++;
		var colObj = new TOBE.data.DataSetColumnInfo(id, type, size);
		this._columnList.splice(index, 0, colObj);
	}
	,
	addConstColumn: function(id, value) {
		if (id in this._columnIndexMap) {
			return;
		}
		if (id in this._constColumnIndexMap) {
			return;
		}
		this._addConstColumn(id, value);
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_CHANGELAYOUT)
			);
		}
	}
	,
	_addConstColumn: function(id, value) {
		this._columnList.push({
			name: id,
			value: value
		});
		this._constColumnIndexMap[id] = this._columnList.length - this._nColCount - 1;
	}
	,
	updateColID: function(col, newColId) {
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return -1;
		}
		//check newColId
		if (typeof newColId != "string") {
			return -1;
		}
		if (newColId in this._columnIndexMap || newColId in this._constColumnIndexMap) {
			return -1;
		}
		var oldColId = colObj.name;
		if ("value" in colObj) {
			this._constColumnIndexMap[newColId] = this._constColumnIndexMap[oldColId];
			delete this._constColumnIndexMap[oldColId];
		}
		else {
			this._columnIndexMap[newColId] = this._columnIndexMap[oldColId];
			delete this._columnIndexMap[oldColId];
		}
		colObj.name = newColId;
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_CHANGELAYOUT)
			);
		}
		return col;
	}
	,
	getColCount: function() {
		return this._columnList.length;
	}
	,
	getColID: function(index) {
		index = parseInt(index, 10);
		if (isNaN(index)) {
			index = 0;
		}
		return this._getColId(index);
	}
	,
	_getColId: function(index) {
		if (index in this._columnList) {
			return this._columnList[index].name;
		}
	}
	,
	getConstColID: function(index) {
		index = parseInt(index, 10);
		if (isNaN(index)) {
			index = 0;
		}
		return this._getColId(this._nColCount + index);
	}
	,
	getConstColumn: function(key) {
		var colObj = this._getConstCol(key);
		return colObj? colObj.value: undefined;
	}
	,
	_getConstCol: function(key) {
		if (key in this._constColumnIndexMap) {
			key = this._constColumnIndexMap[key];
		}
		key += this._nColCount;
		if (key in this._columnList) {
			var colObj = this._columnList[key];
			if (colObj && "value" in colObj) {
				return colObj;
			}
		}
		return null;
	}
	,
	getConstCount: function() {
		return this._columnList.length - this._nColCount;
	}
	,
	setConstColumn: function(key, value) {
		var colObj = this._getConstCol(key);
		if (colObj) {
			//canchange?
			var before = colObj.value;
			colObj.value = value;
			var index = this._columnList.length;
			while (index >= 0) {
				if (this._columnList[index] == colObj) {
					break;
				}//compare reference.
				--index;
			}
			//event
			if (this._getEnableevent()) {
				this._event_columnchanged(
					new TOBE.Event.DSColChange(this, -1, index, colObj.name, before, value)
				);
				this._event_valuechanged(
					new TOBE.Event.DSColChange(this, -1, index, colObj.name, before, value)
				);
			}
			return true;
		}
		return false;
	}
	,
	// end of column
	//////////////////////////////////////////
	// row
	getRowposition: function() {
		return this._getRowposition();
	}
	,
	setRowposition: function(rowPos) {
		this._setRowpositionWithEvent(rowPos);
	}
	,
	_setRowpositionWithEvent: function(oldPos, newPos) {
		//canrowposchange?
		if (arguments.length == 1) {
			newPos = oldPos;
			oldPos = this._getRowposition();
		}
		if (newPos != oldPos) {
			this._setRowposition(newPos);
			//event
			if (this._getEnableevent()) {
				this._event_rowposchanged(
					new TOBE.Event.DSRowPosChange(this, oldPos, newPos)
				);
			}
		}
		this._event_valuechanged(
			new TOBE.Event.DSColChange(this, newPos, -1, "", undefined, undefined)
		);
	}
	,
	getColumn: function(row, col) {
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return;
		}
		if ("value" in colObj) {
			return colObj.value;
		}
		if (0 <= row && row < this._rowIndexList.length) {
			var realIndex = this._rowIndexList[row];
			var rowObj = this._rowList[realIndex];
			return rowObj[col];
		}
	}
	,
	addRow: function() {
		return this._insertRow(this._rowIndexList.length);
	}
	,
	setColumn: function(row, col, value) {
		//cancolumnchange
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null || "value" in colObj) {
			return false;
		}
		if ("value" in colObj == false && 0 <= row && row < this._rowIndexList.length) {
			var realIndex = this._rowIndexList[row];
			var rowObj = this._rowList[realIndex];
			var before = rowObj[col];
			if (rowObj.tp == this.ROWTYPE_NORMAL) {
				var newRowObj = rowObj.slice(0);
				newRowObj.tp = this.ROWTYPE_UPDATE;
				newRowObj.org = rowObj;//rowtype is normal.
				rowObj = this._rowList[realIndex] = newRowObj;
			}
//	ROWTYPE_EMPTY: 0,//존재하지 않는 Row 상태
//	ROWTYPE_NORMAL: 1,//초기 Row 상태
//	ROWTYPE_INSERT: 2,//추가된 Row 상태
//	ROWTYPE_UPDATE: 4,//수정된 Row 상태
//	ROWTYPE_DELETE: 8,//삭제된 Row 상태
//	ROWTYPE_GROUP: 16,//Group 정보 Row 상태
			rowObj[col] = value;
			//event
			if (this._getEnableevent()) {
				this._event_columnchanged(
					new TOBE.Event.DSColChange(this, row, col, colObj.name, before, value)
				);
				this._event_valuechanged(
					new TOBE.Event.DSColChange(this, row, col, colObj.name, before, value)
				);
			}
			return true;			
		}
		return false;
	}
	,
	deleteRow: function(row) {
		if (0 <= row && row < this._rowIndexList.length) {
			if (this._deleteRow(row)) {
				//event
				if (this._getEnableevent()) {
					this._event_rowsetchanged(new TOBE.Event.DSRowsetChange(this, row, 1, this.REASON_DELETE));
				}
				//[[[rowpos
				var oldR = this._getRowposition();
				var newLen = this._rowIndexList.length;
				if (oldR >= newLen) {
					this._setRowpositionWithEvent(oldR, newLen - 1);
				}
				else {
					if (row <= oldR) {
						this._setRowpositionWithEvent(oldR, oldR > 0 ? oldR - 1 : 0);
					}
				}
				//]]]rowpos
				return 1;
			}
		}
		return 0;
	}
	,
	_deleteRow: function(row) {
		var realIndex = this._rowIndexList.splice(row, 1).pop();
		if (this._rowList[realIndex].tp == this.ROWTYPE_INSERT) {
			this._rowList[realIndex].tp = this.ROWTYPE_EMPTY;
		}
		else {
			if (this._rowList[realIndex].tp == this.ROWTYPE_UPDATE) {
				this._rowList[realIndex] = this._rowList[realIndex].org;
			}
			this._rowList[realIndex].tp = this.ROWTYPE_DELETE;
			this._rowDeletedIndexList.push(realIndex);
		}
		return true;
	}
	,
	getRowCount: function() {
		return this._rowIndexList.length;
	}
	,
	clearData: function() {
		return this._clearData(this.REASON_CLEARDATA);
	}
	,
	_clearData: function(eventReason) {
		this._rowList = [];
		var before = this._rowIndexList.length;
		this._rowIndexList = [];
		this._rowDeletedIndexList = [];
		this._backLen = 0;
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, eventReason)
			);
		}
		//rowpos
		this._setRowpositionWithEvent(-1);
		return before;
	}
	,
	clear: function() {
		this._columnList = [];
		this._columnIndexMap = {};
		this._constColumnIndexMap = {};
		this._nColCount = 0;
		return this._clearData(this.REASON_CLEAR);
	}
	,
	deleteAll: function() {
		var before = this._rowIndexList.length;
		if (before > 0) {
			var i = before;
			while (--i >= 0) {
				this._deleteRow(i);
			}
			//event
			if (this._getEnableevent()) {
				this._event_rowsetchanged(
					new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_DELETEALL)
				);
			}
			//rowpos
			this._setRowpositionWithEvent(-1);
		}
		return before;
	}
	,
	applyChange: function() {
		var newRowList = [];
		var i, before = this._rowIndexList.length;
		for (i = 0; i < before; ++i) {
			var rowObj = this._rowList[this._rowIndexList[i]];
			rowObj.tp = this.ROWTYPE_NORMAL;
			delete rowObj.org;
			newRowList.push(rowObj);
		}
		this._backLen = newRowList.length;
		this._rowList = newRowList;
		this._rowDeletedIndexList = [];
	}
	,
	reset: function() {
		var i, newRowList = [];
		this._rowIndexList = [];
		var i;
		for (i = 0; i < this._backLen; ++i) {
			this._rowIndexList.push(i);
			var rowObj = this._rowList[i];
			if (rowObj.org) {
				newRowList.push(rowObj.org);
			}
			else {
				rowObj.tp = this.ROWTYPE_NORMAL;
				delete rowObj.org;
				newRowList.push(rowObj);
			}
		}
		//this._backLen = newRowList.length;
		this._rowList = newRowList;
		this._rowDeletedIndexList = [];
		//event
		if (this._getEnableevent()) {
			this._event_load(
				new TOBE.Event.DSLoad(this, 0, "", this.REASON_RESET)
			);
		}
		var oldR = this._getRowposition();
		var newLen = this._backLen;
		if (oldR >= newLen) {
			this._setRowpositionWithEvent(oldR, newLen - 1);
		}
	}
	,
	getDeletedColumn: function(row, col) {
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return;
		}
		if ("value" in colObj) {
			return colObj.value;
		}
		if (0 <= row && row < this._rowDeletedIndexList.length) {
			var realIndex = this._rowDeletedIndexList[row];
			var rowObj = this._rowList[realIndex];
			return rowObj[col];
		}
	}
	,
	getDeletedRowCount: function() {
		return this._rowDeletedIndexList.length;
	}
	,
	getOrgColumn: function(row, col) {
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return;
		}
		if ("value" in colObj) {
			return colObj.value;
		}
		if (0 <= row && row < this._rowIndexList.length) {
			var realIndex = this._rowIndexList[row];
			var rowObj = this._rowList[realIndex];
			if ("org" in rowObj) {
				return rowObj.org[col];
			}
			return rowObj[col];
		}
	}
	,
	getRowType: function(row) {
		if (0 <= row && row < this._rowIndexList.length) {
			var realIndex = this._rowIndexList[row];
			var rowObj = this._rowList[realIndex];
			return rowObj.tp;
		}
		return this.ROWTYPE_EMPTY;
	}
	,
	exchangeRow: function(row1, row2) {
		if (0 <= row1 && row1 < this._rowIndexList.length && 0 <= row2 && row2 < this._rowIndexList.length) {
			var realIndex1 = this._rowIndexList[row1];
			var realIndex2 = this._rowIndexList[row2];
			this._rowIndexList[row1] = realIndex2;
			this._rowIndexList[row2] = realIndex1;
			//event
			if (this._getEnableevent()) {
				this._event_rowsetchanged(
					new TOBE.Event.DSRowsetChange(this, row1, 1, this.REASON_EXCHANGE)
				);
				this._event_rowsetchanged(
					new TOBE.Event.DSRowsetChange(this, row2, 1, this.REASON_EXCHANGE)
				);
				var oldPos = this._getRowposition();
				if (oldPos == row1) {
					this._setRowpositionWithEvent(row2);
				}
				else {
					if (oldPos == row2) {
						this._setRowpositionWithEvent(row1);
					}
				}
			}
			return true;	
		}
		return false; 
	}
	,
	insertRow: function(row) {
		return this._insertRow(row);
	}
	,
	_insertRow: function(rowIndex) {
		if (rowIndex < 0) {
			rowIndex = 0;
		}
		if (rowIndex > this._rowIndexList.length) {
			rowIndex = this._rowIndexList.length;
		}
		var rowObj = [];
		rowObj.tp = this.ROWTYPE_INSERT;
		this._rowList.push(rowObj);
		this._rowIndexList.splice(rowIndex, 0, this._rowList.length - 1);
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, rowIndex, 1, this.REASON_APPEND)
			);
		}
		//rowpos
		this._setRowpositionWithEvent(rowIndex);
		return rowIndex;
	}
	,
	moveRow: function(oldRow, newRow) {
		if (0 <= oldRow && oldRow < this._rowIndexList.length) {
			if (newRow < 0) {
				newRow = 0;
			}
			if (newRow >= this._rowIndexList.length) {
				newRow = this._rowIndexList.length - 1;
			}
			var rowIndex = this._rowIndexList.splice(oldRow, 1).pop();
			this._rowIndexList.splice(newRow, 0, rowIndex);
			//event
			if (this._getEnableevent()) {
				this._event_rowsetchanged(
					new TOBE.Event.DSRowsetChange(this, newRow, 1, this.REASON_MOVE)
				);
			}
			return newRow;
		}
		return -1;
	}
	,
	appendData: function(source) {
		var beforeRowLen = this._rowIndexList.length;
		var realRowIndex = this._rowList.length;
		var rowLen = source._rowIndexList.length;
		for (i = 0; i < rowLen; ++i) {
			var newRowObj = source._rowList[source._rowIndexList[i]].slice(0);
			newRowObj.tp = this.ROWTYPE_NORMAL;
			this._rowList.push(newRowObj);
			this._rowIndexList.push(realRowIndex++);
		}
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, beforeRowLen, beforeRowLen + rowLen, this.REASON_APPEND)
			);
		}
		if (this._getRowposition() < 0) {
			this._setRowpositionWithEvent(0);
		}
	}
	,
	copyData: function(source) {
		if (source && source._TYPE == "Dataset") {
			//init
			this._columnList = [];
			this._columnIndexMap = {};
			this._constColumnIndexMap = {};
			this._nColCount = 0;
			this._rowList = [];
			this._rowIndexList = [];
			this._rowDeletedIndexList = [];
			this._backLen = 0;
			this._setRowposition(-1);
			//copy col
			var i;
			var colLen = source._columnList.length;
			for (i = 0; i < colLen; ++i) {
				var colObj = source._columnList[i];
				if ("value" in colObj) {
					this._addConstColumn(colObj.name, colObj.value);
				}
				else {
					this._addColumn(colObj.getName(), colObj.getType(), colObj.getSize());
				}
			}
			//copy row
			var rowLen = source._rowIndexList.length;
			for (i = 0; i < rowLen; ++i) {
				var newRowObj = source._rowList[source._rowIndexList[i]].slice(0);
				newRowObj.tp = this.ROWTYPE_NORMAL;
				this._rowList.push(newRowObj);
				this._rowIndexList.push(i);
			}
			this._backLen = rowLen;
			//event
			if (this._getEnableevent()) {
				this._event_rowsetchanged(
					new TOBE.Event.DSRowsetChange(this, 0, rowLen, this.REASON_COPY)
				);
			}
			//rowpos
			this._setRowpositionWithEvent(0);
			return rowLen;
		}
		return null;
	}
	,
	_loadFromTransaction: function(source) {
		if (source._destroy) {
			return;
		}
		var copyList = [
			"_columnList",
			"_columnIndexMap",
			"_constColumnIndexMap",
			"_nColCount",
			"_rowList",
			"_rowIndexList",
			"_rowDeletedIndexList",
			"_backLen"
		];
		var i, len = copyList.length;
		for (i = 0; i < len; ++i) {
			this[copyList[i]] = source[copyList[i]];
		}
		this._setRowposition(source._getRowposition());
		//event
		if (this._getEnableevent()) {
			this._event_load(
				new TOBE.Event.DSLoad(this, 0, "", this.REASON_LOAD)
			);
			this._setRowpositionWithEvent(this._rowIndexList.length? 0: -1);
		}
		source._destroy = true;
	}
	,
	getAvg: function(col, start, end) {
		var range = this._getStartAndEnd(start, end);
		var count = range.end - range.start;
		if (count) {
			return this._getSum(col, range.start, range.end) / count;
		}
		return 0;
	}
	,
	_getStartAndEnd: function(start, end) {
		if (start == undefined) {
			start = 0;
			end = this._rowIndexList.length;
		}
		else {
			if (end == undefined) {
				end = this._rowIndexList.length;
			}
		}
		return {
			start: start,
			end: end
		}
	}
	,
	getSum: function(col, start, end) {
		var range = this._getStartAndEnd(start, end);
		return this._getSum(col, range.start, range.end);
	}
	,
	_getSum: function(col, start, end) {
		var count = end - start;
		if (count <= 0 || isNaN(count)) {
			return 0;
		}
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return;
		}
		if ("value" in colObj) {
			return colObj.value * count;
		}
		var cIndex;
		if (0 <= end && end <= this._rowIndexList.length) {
			cIndex = end;
		}
		else {
			cIndex = this._rowIndexList.length;
		}
		var sum = 0;
		while (start < cIndex && 0 < cIndex) {
			sum += 1*this._rowList[this._rowIndexList[--cIndex]][col];
		}
		return sum;
	}
	,
	getMin: function(col, start, end) {
		var range = this._getStartAndEnd(start, end);
		return this._getMinAndMax(col, range.start, range.end).min;
	}
	,
	getMax: function(col, start, end) {
		var range = this._getStartAndEnd(start, end);
		return this._getMinAndMax(col, range.start, range.end).max;
	}
	,
	_getMinAndMax: function(col, start, end) {
		var count = end - start;
		if (count <= 0 || isNaN(count)) {
			return 0;
		}
		if (col in this._columnIndexMap) {
			col = this._columnIndexMap[col];
		}//id to index
		else {
			if (col in this._constColumnIndexMap) {
				col = this._constColumnIndexMap[col] + this._nColCount;
			}
		}
		var colObj = this._columnList[col];
		if (colObj == null) {
			return;
		}
		if ("value" in colObj) {
			return {
				max: colObj.value,
				min: colObj.value
			};
		}
		var cIndex;
		if (0 <= end && end <= this._rowIndexList.length) {
			cIndex = end;
		}
		else {
			cIndex = this._rowIndexList.length;
		}
		var min = null;
		var max = null;
		var value;
		while (start < cIndex && 0 < cIndex) {
			value = 1*this._rowList[this._rowIndexList[--cIndex]][col];
			if (value < min || min == null) {
				min = value;
			}
			if (max < value || max == null) {
				max = value;
			}
		}
		return {
			max: max,
			min: min
		};
	}
	,
	updateSortGroup: function(keyStr) {
		this._setKeystring(keyStr);
		this._applyKeystring();
	}
	,
	__applyKeystring: function() {
		var ks = this._getKeystring();
		if (ks == this._beforeKeystring) {
			return;
		}
		this._beforeKeystring = ks;
		var ksArr = ks.split(":");
		if (ksArr.length != 2 || ksArr[0].toLowerCase() != "s") {
			return;
		}
		var colsStr = ksArr[1];
		var colArr = colsStr.replace(/\-/g, "+-").split("+");
		var i, len = colArr.length;
		var colList = [];
		var ascList = [];
		var isAsc, col, colObj;
		for (i = len - 1; i >= 0; --i) {
			if (colArr[i].length > 0) {
				isAsc = colArr[i].charAt(0) != "-";
				col = isAsc? colArr[i]: colArr[i].substr(1);
				if (col in this._columnIndexMap) {
					col = this._columnIndexMap[col];
				}//id to index
				else {
					if (col in this._constColumnIndexMap) {
						col = this._constColumnIndexMap[col] + this._nColCount;
					}
				}
				colObj = this._columnList[col];
				if (colObj != null && !("value" in colObj)) {
					colList.push(col);
					ascList.push(isAsc);
				}
			}
		}
		var cFn = this._compareForSort;
		var rList = this._rowList;
		var index = colList.length - 1;
		this._rowIndexList = this._rowIndexList.sort(function(a, b){
			return cFn(rList[a], rList[b], colList, ascList, index);
		});
		//event
		if (this._getEnableevent()) {
			this._event_rowsetchanged(
				new TOBE.Event.DSRowsetChange(this, -1, -1, this.REASON_SORTGROUP)
			);
		}
		//this._setRowpositionWithEvent(this._rowIndexList.length? 0: -1);
	}
	,
	_compareForSort: function(rowObj1, rowObj2, colList, ascList, index) {
		var col = colList[index];
		var isAsc = ascList[index];
		if (rowObj1[col] > rowObj2[col]) {
			return isAsc? 1: -1;
		}
		if (rowObj1[col] < rowObj2[col]) {
			return isAsc? -1: 1;
		}
		if (index > 0) {
			return arguments.callee(rowObj1, rowObj2, colList, ascList, index - 1);
		}
		return 0;
	}
	,
	saveXML: function(id, type) {
		var typeChar = "n";
		switch (type) {
			case "a":
			case "all":
			case "All":
				typeChar = "u";
				break;
			case "u":
			case "update":
			case "Update":
				typeChar = "u";
		}
		return (new TOBE.tx.PlatformXmlDataSerializer()).serializeForDataset(this, {
			"name": id,
			"type": typeChar
		});
	}
	//TODO.
	//getSelect
	//clearSelect
	//selectRow
});


