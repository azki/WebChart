/**
 * @author azki
 */
/*
Interface PlatformXmlDataSource

public:
	insertEmptyRow(index: int)
	deleteRow(index: int)

	appendDataSource: function(index: int, source: TOBE.data.PlatformXmlDataSource)
	getClone(): TOBE.data.PlatformXmlDataSource
	
	getColumnHeader(index: int): TOBE.data.ColumnHeader
	getColumnHeaderList(index: int, count: int): array of TOBE.data.ColumnHeader
	getColumnCount(): int
	
	getRow(index: int): TOBE.data.DataRow
	getRowList(index: int, count: int): array of TOBE.data.DataRow
	getRowCount(): int

	setParent(dataset: TOBE.data.DataSet)

protected:
	_getElementStartIndexs(): array of ._elementStartIndexs
	_getRowElementsList(): array of ._rowElementsList
	_increaseStartIndex(index: int)
*/
TOBE.data.PlatformXmlDataSource = TOBE.ClassUtils.create({
	initialize: function(element, startIndex) {
		this._parent = null;
		this._element = element;
		
		this._columnHeaderList;
		this._createColumnHeaderList();
		
		this._elementStartIndexs = [startIndex? startIndex: 0];
		this._rowElementsList;
		this._rowCount;
		this._createRowElementsList();
	},
	insertEmptyRow: function(index) {
		var elementsCount = this._elementStartIndexs.length;
		var arrIndex = this._getArrIndexByIndex(0, elementsCount - 1, index);
		var i;
		for (i = arrIndex + 1; i < elementsCount; ++i) {
			++this._elementStartIndexs[i];
		}
		++this._rowCount;
		this._convertHtmlObjectsToArray(arrIndex);
		var elementIndex =  index - this._elementStartIndexs[arrIndex];
		this._rowElementsList[arrIndex].splice(elementIndex, 0, null);
	},
	deleteRow: function(index) {
		var elementsCount = this._elementStartIndexs.length;
		var arrIndex = this._getArrIndexByIndex(0, elementsCount - 1, index);
		var i;
		for (i = arrIndex + 1; i < elementsCount; ++i) {
			--this._elementStartIndexs[i];
		}
		--this._rowCount;
		this._convertHtmlObjectsToArray(arrIndex);
		var elementIndex =  index - this._elementStartIndexs[arrIndex];
		this._rowElementsList[arrIndex].splice(elementIndex, 1);
	},
	_convertHtmlObjectsToArray: function(index) {
		if (this._rowElementsList[index].constructor != Array) {
			var htmlObject = this._rowElementsList[index];
			var len = htmlObject.length;
			var list = this._rowElementsList[index] = [];
			var i;
			for (i = 0; i < len; ++i) {
				list.push(htmlObject[i]);
			}
		}
	},
	_getElementStartIndexs: function() {
		return this._elementStartIndexs;
	},
	_getRowElementsList: function() {
		return this._rowElementsList;
	},
	appendDataSource: function(index, source) {
		var rList = source._getRowElementsList();
		var iList = source._getElementStartIndexs();
		var i, len = iList.length;
		for (i = 0; i < len; ++i) {
			this._appendRowElementsWithIndex(index+iList[i], rList[i]);
		}
	},
	_appendRowElementsWithIndex: function(index, rowElements) {
		this._elementStartIndexs.push(index);
		this._appendRowElements(rowElements);
	},
	_increaseStartIndex: function(index) {
		var i, len = this._elementStartIndexs.length;
		for (i = 0; i < len; ++i) {
			this._elementStartIndexs[i] += index;
		}
	},
	getClone: function(startIndex) {
		var source = new TOBE.data.PlatformXmlDataSource(null);
		source._element = this._element;
		source._columnHeaderList = this._columnHeaderList;
		source._elementStartIndexs = this._elementStartIndexs;
		source._rowElementsList = this._rowElementsList;
		source._rowCount = this._rowCount;
		if (startIndex != null && startIndex != 0) {
			source._increaseStartIndex(startIndex);
		}
		return source;
	},
	getColumnHeader: function(index) {
		return this._columnHeaderList[index];
	},
	getColumnHeaderList: function(index, count) {
		return this._columnHeaderList.slice(index, index+count);
	},
	getColumnCount: function() {
		return this._columnHeaderList.length;
	},
	getRow: function(index) {
		return this._toDataRow(this._getRowElementByIndex(index));
	},
	getRowList: function(index, count) {
		var list = [];
		var i = 0;
		while (i < count) {
			list[i] = this.getRow(index++);
			++i;
		}
		return list;
	},
	getRowCount: function() {
		return this._rowCount;
	},
	_getRowElementByIndex: function(index) {
		var arrIndex = this._getArrIndexByIndex(0, this._elementStartIndexs.length - 1, index);
		var elementIndex =  index - this._elementStartIndexs[arrIndex];
		if (elementIndex < 0) {
			console.debug(this._elementStartIndexs[arrIndex], arrIndex, index, elementIndex)
		}
		return this._rowElementsList[arrIndex][elementIndex];
	},
	_getArrIndexByIndex: function(startArrIndex, endArrIndex, index) {
		//quick search.
		var range = endArrIndex - startArrIndex;
		if (range < 2) {
			if (index < this._elementStartIndexs[endArrIndex]) {
				return startArrIndex;
			}
			return endArrIndex;
		}
		var centerArrIndex = ((range % 2)?range + 1: range) / 2 + startArrIndex;
		if (index < this._elementStartIndexs[centerArrIndex]) {
			return this._getArrIndexByIndex(startArrIndex, centerArrIndex, index);
		}
		else {
			return this._getArrIndexByIndex(centerArrIndex, endArrIndex, index);
		}
	},
	_createRowElementsList: function() {
		this._rowElementsList = [];
		this._rowCount = 0;
		var rowElements = this._getRowElementsByRootElement(this._element);
		this._appendRowElements(rowElements);
	},
	_getRowElementsByRootElement: function(element) {
		if (element) {
			var i, rootChildren = element.childNodes;
			for (i = rootChildren.length - 1; i >= 0; --i) {
				if (rootChildren.item(i).nodeName == "Rows") {
					return rootChildren.item(i).getElementsByTagName("Row");
				}
			}
		}
		return null;
	},
	_appendRowElements: function(rowElements) {
		if (rowElements) {
			this._rowCount += rowElements.length;
		}
		this._rowElementsList.push(rowElements);
	},
	_createColumnHeaderList: function() {
		if (this._element == null) {
			return;
		}
		this._columnHeaderList = [];
		var rootChildren = this._element.childNodes;
		var i, columnInfoElement = null;
		for (i = 0; i < rootChildren.length; ++i) {
			if (rootChildren.item(i).nodeName == "ColumnInfo") {
				columnInfoElement = rootChildren.item(i);
				break;
			}
		}
		if (columnInfoElement) {
			var columnElements = columnInfoElement.childNodes;
			var columnCount = columnElements.length;
			var columnHeaderListCount = 0, obj;
			for (i = 0; i < columnCount; ++i) {
				if (obj = this._toColumnHeader(columnElements.item(i))) {
					this._columnHeaderList[columnHeaderListCount++] = obj;
				}
			}
		}
	},
	_toColumnHeader: function(element) {
		if (element.nodeName == "Column") {
			var name = element.getAttribute("id");
			var dataType = this._toDataType(element.getAttribute("type"));
			var dataSize = this._toDataSize(element.getAttribute("size"));
			return new TOBE.data.ColumnHeader(name, dataType, dataSize);
		} else if (element.nodeName == "ConstColumn") {
			var name = element.getAttribute("id");
			var dataType = this._toDataType(element.getAttribute("type"));
			var dataSize = this._toDataSize(element.getAttribute("size"));
			var value = element.getAttribute("value");
			return new TOBE.data.ConstantColumnHeader(name, value, dataType, dataSize);
		} else {
			return null;
		}
	},
	_toDataRow: function(element) {
		var list = element.childNodes;
		var count = list.length;
		var row = this._parent._createRow();
		for (var i = 0; i < count; i++) {
			if (list.item(i).nodeName == "Col") {
				var name = list.item(i).getAttribute("id");
				var index = this._parent.indexOfColumnHeader(name);
				if (index != -1) {
					var value = TOBE.data.XmlUtils.getChildText(list.item(i));
					if (TOBE.Object.isUndefined(value)) {
						row.remove(index);
					} else {
						row.set(index, value);
					}
				}
			}
		}
		return row;
	},
	_toDataType: function(dataType) {
		return TOBE.data.DataTypes.toIntType(dataType);
	},
	_toDataSize: function(dataSize) {
		if (dataSize == null) {
			return null;
		}
		var dataSize = parseInt(dataSize, 10);
		return (isNaN(dataSize)) ? null : dataSize;
	},
	setParent: function(dataset) {
		this._parent = dataset;
	}
});
