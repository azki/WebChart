/**
 * @author azki
 */
TOBE.Event = {
	KEY_BACKSPACE: 8,
	KEY_TAB:       9,
	KEY_RETURN:   13,
	KEY_ESC:      27,
	KEY_LEFT:     37,
	KEY_UP:       38,
	KEY_RIGHT:    39,
	KEY_DOWN:     40,
	KEY_DELETE:   46,
	KEY_HOME:     36,
	KEY_END:      35,
	KEY_PAGEUP:   33,
	KEY_PAGEDOWN: 34,
	KEY_INSERT:   45,
	getKey: function(e) {
		return e.charCode || e.keyCode;
	},
	getKeyCode: function(e) {
		if (TOBE.Browser.Gecko) {
			if (0 < e.keyCode && e.keyCode <= 46) {
				return e.keyCode;
			}
			else {
				return e.charCode;
			}
		}
		else {
			return e.keyCode;
		}
	}
	,
	cache: {}
	,
	removedCacheName: []
	,
	cacheSeq: 0
	,
	element: function(event) {
		var TEXT_NODE = 3;
		var node = event.target || event.srcElement;
		return node? (node.nodeType == TEXT_NODE? node.parentNode: node): null;
	}
	,
	stop: function(event) {
		if (TOBE.Browser.IE) {
			event.returnValue = false;
			event.cancelBubble = true;
		}
		else {
			event.preventDefault();
			event.stopPropagation();
		}
		event.stopped = true;
		return false;
	}
	,
	pointerX: function(event) {
		return event.pageX 
		|| (event.clientX 
		+ (TOBE.$d.documentElement.scrollLeft 
		|| TOBE.$d.body.scrollLeft
		));
	}
	,
	pointerY: function(event) {
		return event.pageY 
		|| (event.clientY 
		+ (TOBE.$d.documentElement.scrollTop 
		|| TOBE.$d.body.scrollTop));
	}
	,
	observe: function(element, name, callback) {
		if (element._tobeEventID == null) {
			var newName;
			if (this.removedCacheName.length > 0) {
				newName = this.removedCacheName.pop();
			}
			else {
				newName = (this.cacheSeq++).toString(36);
			}
			this.cache[
				element._tobeEventID = newName
			] = [element];
		}
		var wrapper = (function(e, n, c) {
			var w = function(event) {
				c.call(e, event || window.event)
			};
			w.c = c;
			return w;
		})(element, name, callback);
		this.cache[element._tobeEventID].push([name, wrapper]);
		if (element.addEventListener) {
			element.addEventListener(name, wrapper, false);
		} else {
			element.attachEvent("on" + name, wrapper);
		}
	}
	,
	stopObserving: function(element, name, callback) {
		var eventsArray, i, item, wrapper;
		if (element._tobeEventID == null) {
			return;
		}
		eventsArray = this.cache[element._tobeEventID];
		wrapper = null;
		for (i = 1; item = eventsArray[i]; ++i) {
			if (item[1].c == callback && item[0] == name) {
				wrapper = item[1];
				eventsArray.splice(i, 1);
				break;
			}
		}
		if (eventsArray.length <= 1) {
			delete this.cache[element._tobeEventID];
			this.removedCacheName.push(element._tobeEventID);
			element._tobeEventID = null;
		}
		if (wrapper) {
			if (element.removeEventListener) {
				element.removeEventListener(name, wrapper, false);
			}
			else {
				element.detachEvent("on" + name, wrapper);
			}
		}
	}
};

/**
 * isButton
 * @param {object} event
 * @param {int} code (0: left, 1: right, 2: wheel button) 
 * @return {boolean}
 */
if (TOBE.Browser.IE) {
	TOBE.Event.isButton = function(event, code){
		return event.button == [1, 4, 2][code];
	};
}
else {
	//TODO: FF 에서 mousemove 이벤트 시 안먹힘.
	TOBE.Event.isButton = function(event, code) {
		return event.which ? (event.which === code + 1) : (event.button === code);
	};
}
TOBE.Event.buttonString =  function(event) {
	if (TOBE.Event.isButton(event, 0)) {
		return "lbutton";
	}
	if (TOBE.Event.isButton(event, 1)) {
		return "wheelbutton";
	}
	if (TOBE.Event.isButton(event, 2)) {
		return "rbutton";
	}
	return "none";
};

if (window.attachEvent) {
	window.attachEvent("onunload", function() {
		var cache = TOBE.Event.cache;
		for (var i = 0, item; item = cache[i]; ++i) 
			for (var j = 1, subItem; subItem = item[j]; ++j) {
				item[0].detachEvent("on" + subItem[0], subItem[1]);
				subItem[1] = null;
			}
	});
}

//EVENT

TOBE.Event.Object = function(obj) {
	this.fromobject = obj;
};

TOBE.Event.DSColChange = function(obj, row, col, columnid, oldvalue, newvalue) {
	TOBE.Event.Object.apply(this, [obj]);
	this.row = row;
	this.col = col;
	this.columnid = columnid;
	this.oldvalue = oldvalue;
	this.newvalue = newvalue;
};

TOBE.Event.DSLoad = function(obj, errorcode, errormsg, reason) {
	TOBE.Event.Object.apply(this, [obj]);
	this.errorcode = errorcode;
	this.errormsg = errormsg;
	this.reason = reason;
};

TOBE.Event.DSRowPosChange = function(obj, oldRow, NewRow) {
	TOBE.Event.Object.apply(this, [obj]);
	this.newrow = NewRow;
	this.oldrow = oldRow;
};

TOBE.Event.DSRowsetChange = function(obj, row, count, reason) {
	TOBE.Event.Object.apply(this, [obj]);
	this.row = row;
	this.count = count;
	this.reason = reason;
};

TOBE.Event.Timer = function(obj, id) {
	TOBE.Event.Object.apply(this, [obj]);
	this.timerid = id;
};

TOBE.Event.SetFocus = function(obj) {
	TOBE.Event.Object.apply(this, [obj]);
};

TOBE.Event.KillFocus = function(obj) {
	TOBE.Event.Object.apply(this, [obj]);
};

TOBE.Event.Key = function(obj, e) {
	TOBE.Event.Object.apply(this, [obj]);
	this.altKey = e.altKey;
	this.ctrlKey = e.ctrlKey;
	this.shiftKey = e.shiftKey;
	this.keycode = "keycode" in e? e.keycode: TOBE.Event.getKey(e);
	//TODO: XRE keycode 필요..
};

TOBE.Event.Mouse = function(obj, e) {
	TOBE.Event.Object.apply(this, [obj]);
	this.altKey = e.altKey;
	this.ctrlKey = e.ctrlKey;
	this.shiftKey = e.shiftKey;
	var element = TOBE.Event.element(e);
	if (element) {
		this.screenX = TOBE.Event.pointerX(e);
		this.screenY = TOBE.Event.pointerY(e);
		this.button = TOBE.Event.buttonString(e);
		this.clientX = e.layerX;
		this.clientY = e.layerY;
		var widgetPosition = TOBE.$getElementPosition(obj._element);
		this.canvasX = this.screenX - widgetPosition.left;
		this.canvasY = this.screenY - widgetPosition.top;
	}
	else {
		this.screenX = e.screenX;
		this.screenY = e.screenY;
		this.button = e.button;
		this.clientX = e.clientX;
		this.clientY = e.clientY;
		this.canvasX = e.canvasX;
		this.canvasY = e.canvasY;
	}
};

TOBE.Event.Click = function(obj, e) {
	TOBE.Event.Mouse.apply(this, arguments);
};

TOBE.Event.Move = function(obj) {
	TOBE.Event.Object.apply(this, [obj]);
	this.x = obj._getX();
	this.y = obj._getY();
};

TOBE.Event.Size = function(obj) {
	TOBE.Event.Object.apply(this, [obj]);
	this.cx = obj._getWidth();
	this.cy = obj._getHeight();
};

TOBE.Event.EditClick = function(obj, e, caretpos) {
	TOBE.Event.Click.apply(this, [obj, e]);
	this.caretpos = caretpos == null? 0: caretpos;
};

TOBE.Event.ItemClick = function(obj, e, index) {
	TOBE.Event.Click.apply(this, [obj, e]);
	this.index = index;
};

TOBE.Event.ListBoxClick = function(obj, e, index) {
	TOBE.Event.ItemClick.apply(this, [obj, e, index]);
};

TOBE.Event.RadioMouse = function(obj, e, index, itemText, itemValue) {
	TOBE.Event.ItemClick.apply(this, [obj, e, index]);
	this.itemtext = itemText;
	this.itemvalue = itemValue;
};

TOBE.Event.TextChanged = function(obj, beforeText, afterText) {
	TOBE.Event.Object.apply(this, [obj]);
	this.posttext = afterText;
	this.pretext = beforeText;
};

TOBE.Event.Change = function(obj, beforeText, beforeValue, afterText, afterValue) {
	TOBE.Event.TextChanged.apply(this, [
		obj, 
		beforeText, 
		afterText 
	]);
	this.postvalue = afterValue;
	this.prevalue = beforeValue;
};

TOBE.Event.ItemChange = function(obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue) {
	TOBE.Event.Change.apply(this, [
		obj, 
		beforeText, 
		beforeValue, 
		afterText, 
		afterValue
	]);
	this.postindex = afterIndex;
	this.preindex = beforeIndex;
};

TOBE.Event.ComboCloseUp = function(obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, isSelect) {
	TOBE.Event.ItemChange.apply(this, [
		obj, 
		beforeIndex,
		beforeText, 
		beforeValue, 
		afterIndex,
		afterText, 
		afterValue
	]);
	this.isselect = isSelect;
};


TOBE.Event.Load = function(obj, url) {
	TOBE.Event.Object.apply(this, [obj]);
	this.url = url;
};

TOBE.Event.Drag = function(obj, e, source, dragData, userdata) {
	TOBE.Event.Mouse.apply(this, [obj, e]);
	this.sourceobject = source;
	this.dragdata = dragData;
	this.userdata = userdata;
};

TOBE.Event.GridClick = function(obj, e, beforeCell, beforeCol, beforeRow, afterCell, afterCol, afterRow) {
	TOBE.Event.Click.apply(this, [obj, e]);
	this.cell = afterCell;
	this.col = afterCol;
	this.row = afterRow;
	this.oldcell = beforeCell;
	this.oldcol = beforeCol;
	this.oldrow = beforeRow;
};

TOBE.Event.GridEdit = function(obj, cell, col, row, value) {
	TOBE.Event.Object.apply(this, [obj]);
	this.cell = cell;
	this.col = col;
	this.row = row;
	this.value = value;
};

TOBE.Event.GridFormatChanged = function(obj, newvalue, oldvalue, reason) {
	TOBE.Event.Object.apply(this, [obj]);
	this.newvalue = newvalue;
	this.oldvalue = oldvalue;
	this.reason = reason;
};

TOBE.Event.GridSelect = function(obj, cell, col, row, subrow) {
	TOBE.Event.Object.apply(this, [obj]);
	this.cell = cell;
	this.col = col;
	this.row = row;
	this.subrow = subrow;
};

TOBE.Event.GridTreeStatus = function(obj, cell, realrow, row, reason) {
	TOBE.Event.Object.apply(this, [obj]);
	this.cell = cell;
	this.realrow = realrow;
	this.row = row;
	this.reason = reason;
};

TOBE.Event.GridMouse = function(cell, row) {
	this.cell = cell;
	this.row = row;
};

TOBE.Event.MouseWheel = function(obj, e, amount) {
	TOBE.Event.Mouse.apply(this, [obj, e]);
	this.amount = amount;
};

TOBE.Event.Scroll = function(obj, pos) {
	TOBE.Event.Object.apply(this, [obj]);
	this.pos = pos;
};

///]] basic

TOBE.Event.CalendarCloseUp = function(obj, beforeText, afterText, beforeValue, afterValue) {
	TOBE.Event.Object.apply(this, [obj]);
	this.pretext = beforeText;
	this.posttext = afterText;
	this.prevalue = beforeValue;
	this.postvalue = afterValue;
};

TOBE.Event.CalendarDayClick = function(obj, date) {
	TOBE.Event.Object.apply(this, [obj]);
	this.date = date;
};

TOBE.Event.CalendarSpin = function(obj, beforeText, afterText, beforeValue, afterValue) {
	TOBE.Event.Object.apply(this, [obj]);
	this.pretext = beforeText;
	this.posttext = afterText;
	this.prevalue = beforeValue;
	this.postvalue = afterValue;
};

TOBE.Event.MenuClick = function(obj, id, userdata) {
	TOBE.Event.Object.apply(this, [obj]);
	this.id = id;
	this.userdata = userdata;
};

TOBE.Event.Spin = function(obj, beforeText, afterText, beforeValue, afterValue, isUp) {
	TOBE.Event.Object.apply(this, [obj]);
	this.pretext = beforeText;
	this.posttext = afterText;
	this.prevalue = beforeValue;
	this.postvalue = afterValue;
	this.up = isUp;
};

TOBE.Event.UploadStart = function(obj, type, id) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
};

TOBE.Event.UploadProgress = function(obj, type, id, bytesLoaded, bytesTotal) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
	this.bytesloaded = bytesLoaded;
	this.bytestotal = bytesTotal;
};

TOBE.Event.UploadCancel = function(obj, type, id) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
};

TOBE.Event.UploadComplete = function(obj, type, id) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
};

TOBE.Event.UploadCompleteData = function(obj, type, id, data) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
	this.data = data;
};

TOBE.Event.FileSelect = function(obj, type, fileList) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.filelist = fileList;
};

TOBE.Event.UploadError = function(obj, type, id, status) {
	TOBE.Event.Object.apply(this, [obj]);
	this.type = type;
	this.id = id;
	this.status = status;
};

TOBE.Event.UpdateCompleteData = function(obj) {
	TOBE.Event.Object.apply(this, [obj]);
};

/////////////////////////////////////////

if (TOBE.Browser.IE) {
	TOBE.Event.observe(window, "load", function() {
		TOBE.Event.observe(TOBE.$d.body, "selectstart", function(e){
			var element = TOBE.Event.element(e);
			if (element && ((element.tagName == "INPUT" && element.type == "text") || element.tagName == "TEXTAREA")) {
				return true;
			}
			return TOBE.Event.stop(e);
		});
	});
}
