/**
 * @author azki
 */
if (!window.TOBEENV) {
	window.TOBEENV = {};
}
if ("fdlCache" in window.TOBEENV == false) {
	window.TOBEENV.fdlCache = false;
}
//debug//window.TOBEENV.fdlCache = true;
if ("tobeError" in window.TOBEENV == false) {
	window.TOBEENV.tobeError = true;
}
//debug//window.TOBEENV.tobeError = false;
if ("sessionId" in window.TOBEENV == false) {
	window.TOBEENV.sessionId = "";
}
//debug//TOBEENV.parentOnloadFirst = true;

window.TOBEENV.logs = [];
window.TOBEENV.logs.print = function() {
	var count = 0;
	var msg;
	while(msg = TOBEENV.funcCalled[count]) {
		trace(msg);
	}
}
window.TOBEENV.funcCalled = [];
window.TOBEENV.funcTrace = false; //스크립트에서 true로 설정하면 debug창에 결과를 출력한다.
window.TOBEENV.funcTrace.print = function() {
	var count = 0;
	var funcInfo;
	while(funcInfo = TOBEENV.funcCalled[count]) {
		trace("- Func Name="+funcInfo.name+", Called="+funcInfo.count);
	}
}
//로그 메세지 규칙 : 컴포넌트명/컴포넌트ID.펑션명/메세지/error-obj

if (!window.TOBEENV.resourcePath) {
	window.TOBEENV.resourcePath = window.TOBEENV.context + "/resources/images/";
}

//정적로딩.
window.TOBEENV.preload = {};

window.userNotify = function(id, msg) {
	var nFn;
	try {
		var nFn = window.parent != null && window.parent != window && window.parent.TOBE_usernofity;
	}
	catch (e) {
		return;
	}
	if (typeof nFn == "function") {
		id = parseInt(id, 10);
		if (isNaN(id)) {
			id = 0;
		}
		if (!msg) {
			msg = "";
		}
		else {
			msg += "";
		}
		return window.parent.TOBE_usernofity(id, msg);
	}
};

if (!window.trace) {
	window.trace = function(str) {
		if (window.console && typeof window.console.log == "function") {
			window.console.log(str);
		}
		else {
			if (window.YAHOO && window.YAHOO.log) {
				YAHOO.log(str);
			}
			else {
				if (arguments.callee.traceCount) {
					++arguments.callee.traceCount;
				}
				else {
					arguments.callee.traceCount = 1;
				}
				TOBE.$d.title = "trace[" + arguments.callee.traceCount + "] : " + str;
			}
		}
	};
}


/**
 * TOBE
 */
window.TOBE = {
//	_xStSeq: 0
//	,
//	_xCtSeq: 0
//	,
//	_xSt: []
//	,
	Version: ""
	,
	emptyFn: function(){}
	,
	error: function(e, at) {
		alert((e.message? e.message: e) + "\n\nat : " + at);
	}
	,
	Browser: {
	    IE: !!(window.attachEvent && !window.opera),
	    Opera: !!window.opera,
	    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Chrome: navigator.userAgent.indexOf("Chrome") > -1,
	    Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
		MobileSafari: navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		ScriptManager: navigator.userAgent.indexOf('ScriptManager') > -1
	}
	,
	Object: {
		isNumber: function(v) {
			return typeof v == "number";
		}
		,
		isString: function(v) {
			return typeof v == "string";
		}
		,
		isUndefined: function(v) {
			return v === undefined;
		}
		,
		isArray: function(v) {
			return v != null && v.constructor == Array;
		}
		,
		isFunction: function(v) {
			return typeof v == "function";
		}
		,
		isObject: function(v) {
			return v != null && typeof v == "object";
		}
	}
	,
	/**
	 * $ chain
	 * @param {object} obj
	 * @return {object} $ chain
	 */
	$: function(obj) {
		if (obj == null) {
			return null;
		}
		return new this._$init(obj);
	}
	,
	$d: window.document
	,
	/**
	 * $c
	 * return new Element
	 * @param {string} tagType
	 * @return {Element}
	 */
	$c: function(tag) {
		return this.$d.createElement(tag);
	}
	,
	/**
	 * $g
	 * return element by id
	 * @param {string} id
	 * @return {Element}
	 */
	$g: function(id) {
		return this.$d.getElementById(id);
	}
	,
	/**
	 * $t
	 * return new TextNode
	 * @param {string} str
	 * @return {Element} TextNode
	 */
	$t: function(str) {
		return this.$d.createTextNode(str);
	}
	,
	/**
	 * $gs
	 * get style to element
	 * @param {Element} e element
	 * @param {string} n name
	 * @return {string}
	 */
	$gs: function(e, n) {
		return e.style[n];
		//debug
//		if (e.uniqueID in TOBE._xSt) {
//			return TOBE._xSt[e.uniqueID][n] || "";
//		}
//		return "";
	}
	,
	/**
	 * $s
	 * set style to element
	 * @param {Element} e element
	 * @param {string} n name
	 * @param {string} v value
	 */
	$s: function(e, n, v) {
		e.style[n] != v? e.style[n] = v: 0;
		//debug
//		var o = TOBE._xSt;
//		if (e.uniqueID) {
//			var oo;
//			if (oo = o[e.uniqueID]) {
//				if (n in oo) {
//					if (oo[n] != v) e.style[n] = oo[n] = v;
//				}
//				else if (v) e.style[n] = oo[n] = v;
//			}
//			else {
//				if (v) {
//					e.style[n] = (o[e.uniqueID] = {})[n] = v;
//				}
//			}
//		}
//		else {
//			if (!v) return;
//			e.style[n] = (o[e.uniqueID = ++TOBE._xStSeq] = {})[n] = v;
//		}
	}
	,
//	$uniqueID: function(e) {
//		return ("uniqueID" in e)? e.uniqueID: e.uniqueID = ++TOBE._xCtSeq;
//	}
//	,
	$realStyle: function(obj, cssProperty, jsProperty) {
		var cssValue = null;
		if(obj.currentStyle) {
			cssValue = obj.currentStyle[jsProperty];
		}
		else if(window.getComputedStyle) {
			cssValue = document.defaultView.getComputedStyle(obj, null).getPropertyValue(cssProperty);
		}
		return cssValue;
	}
	,
	/**
	 * $p
	 * set property to element
	 * @param {Element} e element
	 * @param {string} n name
	 * @param {string} v value
	 */
	$p: function(e, n, v) {
		e[n] != v? e[n] = v: 0;
	}
	,
	/**
	 * $getSelectionStart
	 * @param {Element} input
	 * @return {int}
	 */
	$getSelectionStart: function(input) {
		try {
			if (input.selectionStart) {
				return input.selectionStart;
			}
			else {
				if (document.selection) {
					var selectionRange = document.selection.createRange();
					var textRange = input.createTextRange();
					var len = textRange.text.length;
					if (textRange.inRange(selectionRange)) {
						var pos = 0;
						while (selectionRange.compareEndPoints("StartToStart", textRange) > 0) {
							selectionRange.moveStart("character", -1);
							if (len < ++pos) {
								return -1;
							}
						}
						return pos;
					}
					else {
						if (selectionRange.parentElement() == input) {
							var pos = 0, beforeText = selectionRange.text;
							while (true) {
								selectionRange.moveStart("character", -1);
								if (beforeText == selectionRange.text) {
									return pos;
								}
								if (len < ++pos) {
									return -1;
								}
								beforeText = selectionRange.text;
							}
						}
						return -1;
					}
				}
				else {
					return 0;
				}
			}
		}
		catch (e) {
			return -1;
		}
	}
	,
	/**
	 * $getSelectionEnd
	 * @param {Element} input
	 * @return {int}
	 */
	$getSelectionEnd: function(input) {
		try {
			if (input.selectionEnd) {
				return input.selectionEnd;
			}
			else {
				if (document.selection) {
					var selectionRange = document.selection.createRange();
					var textRange = input.createTextRange();
					var len = textRange.text.length;
					if (textRange.inRange(selectionRange)) {
						var pos = 0;
						while (selectionRange.compareEndPoints("EndToStart", textRange) > 0) {
							selectionRange.moveEnd("character", -1);
							if (len < ++pos) {
								return -1;
							}
						}
						return pos;
					}
					else {
						if (selectionRange.parentElement() == input) {
							var pos = 0, beforeText = selectionRange.text;
							while (true) {
								selectionRange.moveEnd("character", 1);
								if (beforeText == selectionRange.text) {
									return len - pos;
								}
								if (len < ++pos) {
									return -1;
								}
								beforeText = selectionRange.text;
							}
						}
						return -1;
					}
				}
				else {
					return 0;
				}
			}
		}
		catch (e) {
			return -1;
		}
	}
	,
	/**
	 * $setSelection
	 * @param {element} input
	 * @param {int} start
	 * @param {int} end
	 */
	$setSelection: function(input, start, end) {
		if (end == null) {
			end = start;
		}
		if (input.setSelectionRange) {
			try {
				input.focus();
				input.setSelectionRange(start, end);
			}
			catch (ignore) {}
		}
		else {
		    if (input.createTextRange) {
				try {
					var range = input.createTextRange();
					range.collapse(true);
					range.moveEnd("character", end);
					range.moveStart("character", start);
					range.select();
				}
				catch (ignore) {}
			}
		}
	}
	,
	$getElementPosition: function(element) {
		var top = 0;
		var left = 0;
		var p = element;
		var skipTd = false;
		while (p.parentNode && p != TOBE.$d.body) {
			if (skipTd && p.tagName == "TABLE") {
				skipTd = false;
			}
			if (TOBE.$gs(p, "position") == "absolute") {
				skipTd = true;
			}
			if (skipTd && p.tagName == "TD") {
				p = p.parentNode;
			}
			else {
				if (p.tagName == "TR" || p.tagName == "TBODY") {
					p = p.parentNode;
					continue;
				}
				if (p.scrollLeft) {
					left -= p.scrollLeft;
				}
				if (p.scrollTop) {
					top -= p.scrollTop;
				}
				var borderWidth = TOBE.$realStyle(p, "border-left-width", "borderLeftWidth");
				//4-border
				borderWidth = parseInt(borderWidth, 10);
				if (borderWidth > 0) {
					if (TOBE.Browser.Gecko && p.tagName != "TABLE") {
						top += borderWidth * 2;
						left += borderWidth * 2;
					}
					if (TOBE.Browser.IE || TOBE.Browser.WebKit) {
						top += +borderWidth;
						left += +borderWidth;
					}
				}//border
				top += +p.offsetTop;
				left += +p.offsetLeft;
				p = p.parentNode;
			}
		}
		return {
			top: top,
			left: left
		};	
	}
	,
	$ef: function(eName, obj, e) {
		var func, fValue = obj["_getOn"+eName]();
		if (fValue) {
			if (func = fValue.constructor == Function? fValue: TOBE.$f(obj, fValue)) {
				if (e) {
					e.eventid = "on"+eName;
				}
				func(obj, e);
			}
		}
	}
	,
	$getPageSize: function() {
	    var xScroll, yScroll;
	    if (window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else {
			if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			}
			else {
				if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight) { // Explorer 6 strict mode
					xScroll = document.documentElement.scrollWidth;
					yScroll = document.documentElement.scrollHeight;
				}
				else { // Explorer Mac...would also work in Mozilla and Safari
					xScroll = document.body.offsetWidth;
					yScroll = document.body.offsetHeight;
				}
			}
		}
	    var windowWidth, windowHeight;
	    if (self.innerHeight) { // all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		}
		else {
			if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			}
			else {
				if (document.body) { // other Explorers
					windowWidth = document.body.clientWidth;
					windowHeight = document.body.clientHeight;
				}
			}
		}
	    // for small pages with total height less then height of the viewport
	    if (yScroll < windowHeight) {
	        pageHeight = windowHeight;
	    }
	    else {
	        pageHeight = yScroll;
	    }
	    // for small pages with total width less then width of the viewport
	    if (xScroll < windowWidth) {
	        pageWidth = windowWidth;
	    }
	    else {
	        pageWidth = xScroll;
	    }
	    return [pageWidth, pageHeight, windowWidth, windowHeight];
	}
	,
	_getRegularPath: function(path) {
		var tmp;
		if (path.indexOf("://") > -1) {
			tmp = path.split("://")[1];
			path = tmp.substr(tmp.indexOf("/"));
		}
		if (path.charAt(0) != "/") {
			tmp = location.href.split("://")[1];
			var sIndex = tmp.indexOf("/");
			var eIndex = tmp.lastIndexOf("/") - sIndex + 1;
			tmp = tmp.substr(sIndex, eIndex);
			path = tmp + path;
		}
		while (path.indexOf("/../") > 0) {// if 0 => loop;
			path = path.replace(/[^\/]+\/..\//g, "");
		}
		return path
		.replace(/\/.\//g, "/")
		.replace(/\/.\//g, "/")
		;
	}
	,
	$adl: function(url) {
		var realUrl = this.global.resources.getServiceLocation(url);
		if ("" == realUrl) {
			return;
		}
		var rPath = this._getRegularPath(realUrl);
		if (rPath in TOBEENV.preload) {
			if (TOBEENV.tobeError) {
				try {
					TOBEENV.preload[rPath]();
				}
				catch (e) {
					TOBE.error(e, "adl '" + url + "'");
				}
			}
			else {
				TOBEENV.preload[rPath]();
			}
		}
		else {
			var _ajax = this.$xh();
			_ajax.open("GET", realUrl, false);
			try {
				_ajax.send("");
			}
			catch (e) {
				if (e.message && e.message.indexOf("0x80004005") > -1) {
					return;
				}
			}
			if (TOBE.$_checkAjaxSuccess(_ajax)) {
				if (TOBEENV.tobeError) {
					try {
						eval(_ajax.responseText).apply(window);
					}
					catch (e) {
						TOBE.error(e, "adl '" + url + "'");
					}
				}
				else {
					eval(_ajax.responseText).apply(window);
				}
			}
			_ajax = null;
		}
	}
	,
	$fdl: function(url, self, parent) {
		var realUrl = this.global.resources.getServiceLocation(url);
		if ("" == realUrl) {
			return;
		}
		if (self == null) {
			var formId = TOBEENV.mainFormName;
			formId = formId.substr(0, formId.indexOf("."));
			window.form = self = new TOBE.widget.basic.Form(formId);
		}
		var rPath = this._getRegularPath(realUrl);
		if (rPath in TOBEENV.preload) {
			if (TOBEENV.tobeError) {
				try {
					TOBEENV.preload[rPath](self, parent);
				}
				catch (e) {
					TOBE.error(e, "fdl '" + url + "'");
				}
			}
			else {
				TOBEENV.preload[rPath](self, parent);
			}
		}
		else {
			var result;
			var _ajax = this.$xh();
			if (parent && parent._onloadComplete) {
				_ajax.open("GET", realUrl, true);
				_ajax.onreadystatechange = function(){
					if (TOBE.$_checkAjaxSuccess(_ajax)) {
						result = _ajax.responseText;
						if (TOBEENV.tobeError) {
							try {
								eval(result);
								if (TOBEENV.fdlCache) {
									eval("TOBEENV.preload[rPath]=function(self,parent){" + result + "};");
								}
							}
							catch (e) {
								TOBE.error(e, "fdl '" + url + "'");
							}
						}
						else {
							eval(result);
							if (TOBEENV.fdlCache) {
								eval("TOBEENV.preload[rPath]=function(self,parent){" + result + "};");
							}
						}
						
						_ajax = null;
					}
				}
				try {
					_ajax.send("");
				}
				catch (e) {
					if (e.message && e.message.indexOf("0x80004005") > -1) {
						return;
					}
				}
			}
			else {
				_ajax.open("GET", realUrl, false);
				try {
					_ajax.send("");
				}
				catch (e) {
					if (e.message && e.message.indexOf("0x80004005") > -1) {
						return;
					}
				}
				if (TOBE.$_checkAjaxSuccess(_ajax)) {
					result = _ajax.responseText;
					if (TOBEENV.tobeError) {
						try {
							eval(result);
							if (TOBEENV.fdlCache) {
								eval("TOBEENV.preload[rPath]=function(self,parent){" + result + "};");
							}
						}
						catch (e) {
							TOBE.error(e, "fdl '" + url + "'");
						}
					}
					else {
						eval(result);
						if (TOBEENV.fdlCache) {
							eval("TOBEENV.preload[rPath]=function(self,parent){" + result + "};");
						}
					}
				}
				_ajax = null;
			}
		}
		if (self._TYPE == "Form") {
			var nFn;
			try {
				var nFn = window.parent != null && window.parent != window && window.parent.TOBE_load;
			}
			catch (e) {
				return;
			}
			if (typeof nFn == "function") {
				window.parent.TOBE_load();
			}
		}
	}
	,
	callscript: function(scriptStr) {
		var headerStr = "application.mainframe.childframe.form.";
		if (scriptStr && scriptStr.indexOf(headerStr) > -1) {
			var convScript = scriptStr.substr(scriptStr.indexOf(headerStr) + headerStr.length);
			eval("(window.form." + convScript + ")");
		}
	}
	,
	$include: function(url) {
		if ("" == (url = this.global.resources.getServiceLocation(url))) {
			return "";
		}
		var rPath = this._getRegularPath(url);
		if (rPath in TOBEENV.preload) {
			return TOBEENV.preload[rPath];
		}
		else {
			var _ajax = this.$xh();
			_ajax.open("GET", url, false);
			try {
				_ajax.send("");
			}
			catch (e) {
				if (e.message && e.message.indexOf("0x80004005") > -1) {
					return "";
				}
			}
			var result = "";
			if (TOBE.$_checkAjaxSuccess(_ajax)) {
				TOBEENV.preload[rPath] = result = _ajax.responseText;
			}
			_ajax = null;
			return result;
		}
	}
	,
	/**
	 * $xh
	 * return XMLHttpRequest object
	 * @return {object} XMLHttpRequest
	 */
	$xh: function() {
		return window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
	}
	,
	$_checkAjaxSuccess: function(ajax) {
		if (ajax.readyState == 4) {
			try {
				var statusNum = ajax.status || 200;
				return statusNum >= 200 && statusNum < 300;
			} catch (ignore) {
				return true;
			}
		}
		return false;
	}
	,
	/**
	 * $f
	 * widget이 속해있는 Form 을 찾아 리턴.
	 * name 을 주면 widget이 속해있는 Form 의 변수 name 을 가져온다.
	 * @param {Widget} widget
	 * @param {string} name
	 * @return {object} anything
	 */
	$f: function(widget, name) {
		if (name == null) {
			while (widget) {
				if (widget._TYPE == "Form") {
					return widget;
				}
				if (widget._TYPE == "Div" || widget._TYPE == "PopupDiv" || widget._TYPE == "Tabpage") { 
					if (widget.getUrl() != "") {
						return widget;
					}
				}
				widget = widget.getParent();
			}
			return window;
		}
		else {
			while (widget) {
				if (widget._TYPE == "Form") {
					if (widget[name] != null) {
						return widget[name];
					}
					break;
				}
				if (widget._TYPE == "Div" || widget._TYPE == "PopupDiv" || widget._TYPE == "Tabpage") { 
					if (widget.getUrl() != "" && widget[name] != null) {
						return widget[name];
					}
				}
				widget = widget.getParent();
			}
			return window[name];
		}
	}
	,
	/**
	 * $garbage
	 * DOM API 의 removeChild 대용.. (for prevent IE leaks) 
	 * @param {Element} element
	 */
	$garbage: function(element){
		if (element.parentNode) {
			element.parentNode.removeChild(element);
		}
//		if (this._garbages == null) {
//			this._garbages = TOBE.$c("div");
//			TOBE.$s(this._garbages, "display", "none");
//			TOBE.$d.body.appendChild(this._garbages);
//		}
//		this._garbages.appendChild(element);
	}
	,
	/**
	 * global : control resources
	 */
	global: {
		load: function() {
			if (window.name) {
				var i, list, len;
				var params = new TOBE.tx.TransactionParameters();
				list = TOBE.global.variables;
				len = list.length;
				for (i = 0; i < len; ++i) {
					params.addVariable(list[i], list[i]);
				}
				list = TOBE.global.datasets;
				len = list.length;
				for (i = 0; i < len; ++i) {
					params.addDataSet(list[i], list[i]);
				}
				var deserializer = new TOBE.tx.PlatformXmlDataDeserializer();
				var dom = TOBE.data.XmlUtils.parseDocument(window.name);
				var receiveData = deserializer.deserialize(dom, params);
				window.name = "";
				TOBE.tx.transaction._applyReceiveData(null, params, receiveData);
			}
		},
		datasets: [],
		variables: [],
		resources: {
			_protocolResources: [],
			_imageResources: [],
			_urlResources: [],
			_add: function(resource, hash) {
				if ("id" in hash && "url" in hash) {
					resource.push(hash);
					return resource.length - 1;
				}
				return -1;
			},
			_getById: function(resource, id) {
				var index = resource.length;
				while (--index >= 0) {
					var item = resource[index];
					if (item.id == id) {
						return {
							id: item.id,
							url: item.url
						};
					}
				}
				return null;
			},
			addProtocol: function(hash){
				return this._add(this._protocolResources, hash);
			},
			getProtocol: function(id){
				return this._getById(this._protocolResources, id);
			},
			addImage: function(hash){
				return this._add(this._imageResources, hash);
			},
			getImage: function(id){
				return this._getById(this._imageResources, id);
			},
			addService: function(hash){
				return this._add(this._urlResources, hash);
			},
			getService: function(id){
				return this._getById(this._urlResources, id);
			},
			_getProtocolLocation: function(str) {
				if (str.indexOf("://") > -1) {
					var strA = str.split("://");
					var id = strA[0];
					var url = strA[1];
					var serviceResource = this.getProtocol(id);
					if (serviceResource != null) {
						return serviceResource.url + url;
					}
				}
				return str;
			},
			getImageLocation: function(str){
				//[[[ url('') 제거.
				if (str.indexOf("'") > -1) {
					str = str.substr(str.indexOf("'") + 1);
					str = str.substr(0, str.indexOf("'"));
				}
				if (str.indexOf("(") > -1) {
					str = str.substr(str.indexOf("(") + 1);
					str = str.substr(0, str.indexOf(")"));
				}
				//]]] url('') 제거.
				str = this.getServiceLocation(str);
				if (str.indexOf(".") > -1) {
					return str;
				}
				var resource = this.getImage(str);
				if (resource) {
					return this.getServiceLocation(resource.url);
				}
				return "";
			},
			getServiceLocation: function(str){
				str = this._getProtocolLocation(str);
				if (str.indexOf("::") > -1) {
					var strA = str.split("::");
					var id = strA[0];
					var url = strA[1];
					var serviceResource = this.getService(id);
					if (serviceResource != null) {
						str = serviceResource.url + url;
					}
				}
				str = str.replace(/\\/g, "/");
//				if (TOBEENV.fdlUri && str && str.charAt(0) != "/" && /:\/\//.test(str) == false) {
//					return TOBEENV.fdlUri + "/" + str;
//				}
				return str;
			}
		}
	},
	setCookie: function(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		
		document.cookie = name + "=" + value + expires + "; path=/";
	},
	getCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		
		return null;
	},
	removeCookie: function(name) {
		this.setCookie(name, "", -1);
	},
	getWebColorFromXreColor: function(color) {
		if (color in this._xreNamedColorList) {
			return this._xreNamedColorList[color];
		}
		len = color.length;
		if (len == 7) {
			return color;
		}
		if (len == 9) {
			if (color.charAt(7) == "0") {
				return "transparent";
			}
			return color.substr(0, 7);
		}
		if (len == 8) {
			return "#" + color.substr(2, 6);
		}
		if (len == 10) {
			if (color.charAt(8) == "0") {
				return "transparent";
			}
			return "#" + color.substr(2, 6);
		}
		return "";
	},
	_xreNamedColorList: {
		"":"",
		"@gradation":"",
		"aliceblue":"#F0F8FF",
		"antiquewhite":"#FAEBD7",
		"aqua":"#00FFFF",
		"aquamarine":"#7FFFD4",
		"azure":"#F0FFFF",
		"beige":"#F5F5DC",
		"bisque":"#FFE4C4",
		"black":"#000000",
		"blanchedalmond":"#FFEBCD",
		"blue":"#0000FF",
		"blueviolet":"#8A2BE2",
		"brown":"#A52A2A",
		"burlywood":"#DEB887",
		"cadetblue":"#5F9EA0",
		"chartreuse":"#7FFF00",
		"chocolate":"#D2691E",
		"coral":"#FF7F50",
		"cornflowerblue":"#6495ED",
		"cornsilk":"#FFF8DC",
		"crimson":"#DC143C",
		"cyan":"#00FFFF",
		"darkblue":"#00008B",
		"darkcyan":"#008B8B",
		"darkgoldenrod":"#B8860B",
		"darkgray":"#A9A9A9",
		"darkgreen":"#006400",
		"darkgrey":"#A9A9A9",
		"darkkhaki":"#BDB76B",
		"darkmagenta":"#8B008B",
		"darkolivegreen":"#556B2F",
		"darkorange":"#FF8C00",
		"darkorchid":"#9932CC",
		"darkred":"#8B0000",
		"darksalmon":"#E9967A",
		"darkseagreen":"#8FBC8F",
		"darkslateblue":"#483D8B",
		"darkslategray":"#2F4F4F",
		"darkslategrey":"#2F4F4F",
		"darkturquoise":"#00CED1",
		"darkviolet":"#9400D3",
		"deeppink":"#FF1493",
		"deepskyblue":"#00BFFF",
		"dimgray":"#696969",
		"dimgrey":"#696969",
		"dodgerblue":"#1E90FF",
		"firebrick":"#B22222",
		"floralwhite":"#FFFAF0",
		"forestgreen":"#228B22",
		"fuchsia":"#FF00FF",
		"gainsboro":"#DCDCDC",
		"ghostwhite":"#F8F8FF",
		"gold":"#FFD700",
		"goldenrod":"#DAA520",
		"gray":"#808080",
		"green":"#008000",
		"greenyellow":"#ADFF2F",
		"grey":"#808080",
		"honeydew":"#F0FFF0",
		"hotpink":"#FF69B4",
		"indianred":"#CD5C5C",
		"indigo":"#4B0082",
		"ivory":"#FFFFF0",
		"khaki":"#F0E68C",
		"lavender":"#E6E6FA",
		"lavenderblush":"#FFF0F5",
		"lawngreen":"#7CFC00",
		"lemonchiffon":"#FFFACD",
		"lightblue":"#ADD8E6",
		"lightcoral":"#F08080",
		"lightcyan":"#E0FFFF",
		"lightgoldenrodyellow":"#FAFAD2",
		"lightgray":"#D3D3D3",
		"lightgreen":"#90EE90",
		"lightgrey":"#D3D3D3",
		"lightpink":"#FFB6C1",
		"lightsalmon":"#FFA07A",
		"lightseagreen":"#20B2AA",
		"lightskyblue":"#87CEFA",
		"lightslategray":"#778899",
		"lightslategrey":"#778899",
		"lightsteelblue":"#B0C4DE",
		"lightyellow":"#FFFFE0",
		"lime":"#00FF00",
		"limegreen":"#32CD32",
		"linen":"#FAF0E6",
		"magenta":"#FF00FF",
		"maroon":"#800000",
		"mediumaquamarine":"#66CDAA",
		"mediumblue":"#0000CD",
		"mediumorchid":"#BA55D3",
		"mediumpurple":"#9370DB",
		"mediumseagreen":"#3CB371",
		"mediumslateblue":"#7B68EE",
		"mediumspringgreen":"#00FA9A",
		"mediumturquoise":"#48D1CC",
		"mediumvioletred":"#C71585",
		"midnightblue":"#191970",
		"mintcream":"#F5FFFA",
		"mistyrose":"#FFE4E1",
		"moccasin":"#FFE4B5",
		"navajowhite":"#FFDEAD",
		"navy":"#000080",
		"oldlace":"#FDF5E6",
		"olive":"#808000",
		"olivedrab":"#6B8E23",
		"orange":"#FFA500",
		"orangered":"#FF4500",
		"orchid":"#DA70D6",
		"palegoldenrod":"#EEE8AA",
		"palegreen":"#98FB98",
		"paleturquoise":"#AFEEEE",
		"palevioletred":"#DB7093",
		"papayawhip":"#FFEFD5",
		"peachpuff":"#FFDAB9",
		"peru":"#CD853F",
		"pink":"#FFC0CB",
		"plum":"#DDA0DD",
		"powderblue":"#B0E0E6",
		"purple":"#800080",
		"red":"#FF0000",
		"rosybrown":"#BC8F8F",
		"royalblue":"#4169E1",
		"saddlebrown":"#8B4513",
		"salmon":"#FA8072",
		"sandybrown":"#F4A460",
		"seagreen":"#2E8B57",
		"seashell":"#FFF5EE",
		"sienna":"#A0522D",
		"silver":"#C0C0C0",
		"skyblue":"#87CEEB",
		"slateblue":"#6A5ACD",
		"slategray":"#708090",
		"slategrey":"#708090",
		"snow":"#FFFAFA",
		"springgreen":"#00FF7F",
		"steelblue":"#4682B4",
		"tan":"#D2B48C",
		"teal":"#008080",
		"thistle":"#D8BFD8",
		"tomato":"#FF6347",
		"turquoise":"#40E0D0",
		"violet":"#EE82EE",
		"wheat":"#F5DEB3",
		"white":"#FFFFFF",
		"whitesmoke":"#F5F5F5",
		"yellow":"#FFFF00",
		"yellowgreen":"#9ACD32"
	}
};


/**
 * _$init
 * $ chain init
 * @param {object} anything
 */
window.TOBE._$init
= function(obj) {
	this._ = obj;
};

window.TOBE._$init.prototype.$
= function(name){
	this._ = this.$get(name);
	return this;
};

window.TOBE._$init.prototype.$get
= function(name){
	var obj = this._;
	if (obj == null) {
		throw "Can not get '"+name+"' because is null or not an object.";
	}
	if (obj._isWidget || obj._isData || obj._isSubObj) {
		if (obj.getSubObject) {
			var subObj = obj.getSubObject(name);
			if (subObj) {
				return subObj;
			}
		}
		var fName = name.charAt(0).toUpperCase()+name.substr(1);
		if (obj["get"+fName]) {
			return obj["get"+fName]();
		}
	}
	if (obj.$var) {
		return obj.$var(name);
	}
	return obj[name];
};

window.TOBE._$init.prototype.$set
= function(name, value){
	var obj = this._;
	if (obj == null) {
		throw "Can not set '"+name+"' because is null or not an object.";
	}
	if (obj._isWidget || obj._isData || obj._isSubObj) {
		var fName = name.charAt(0).toUpperCase() + name.substr(1);
		if (obj["set" + fName]) {
			obj["set" + fName](value);
			return value;
		}
	}
	else {
		return obj[name] = value;
	}
	if (obj.$var) {
		return obj.$var(name, value);
	}
	return value;
};

window.TOBE._$init.prototype.$call 
= function(){
	var obj = this._, name = arguments[0], args = [], len = arguments.length, i = 1;
	if (obj == null) {
		throw "Can not call '"+name+"' because is null or not an object.";
	}
	while (i < len) {
		args[i-1] = arguments[i];
		++i;
	}
	if (obj[name] == null) {
		alert("\"" + name + "\" is not found.");
		return;
	}
	if (obj[name].apply) {
		return obj[name].apply(obj, args);
	}
	//[[[for IE native function
	len--;
	var evalStr = "(obj[name](";
	if (len > 0) {
		evalStr += "args[0]";
		i = 1;
		while (i < len) {
			evalStr += ",args["+i+"]";
			++i;
		}
	}
	evalStr += "))";
	return eval(evalStr);
	//]]]for IE native function
};


/**
 * _tobeBind
 * @param {object} o
 */
Function.prototype._tobeBind = function(o) {
	var m = this;
	return function() {
		return m.apply(o, arguments);
	};
};
Function.prototype._tobeUserFnBind = function(o, funcName, fileName) {
	var m = this;
	return function() {
		//TODO: sTime
		var sTime = new Date();
		var result = m.apply(o, arguments);
		
		//TODO: eTime
		var mTime = (new Date()) - sTime;
		
		//수행시간측정
		var key = fileName+'/'+funcName;
		
		//FuncInfo
        var i = 0;
        var funcInfo;
        while (funcInfo = window.TOBEENV.funcCalled[i]) {
        	if(funcInfo.name == key) {
				break;
			}
            ++i;
        }
		if(funcInfo) {
			funcInfo.count++;			
		} else {
			funcInfo = {
				name: key,
				count: 1
			};
			window.TOBEENV.funcCalled.push(funcInfo);
		}
		
		if (TOBEENV.funcTrace) {
			trace('[' + key + ']elapse time=' + mTime + 'ms');
		}
		
		return result;
	};
};

//TOBE.WidgetManager = {
//	_widgets: {},
//	get: function(type) {
//		if (type in this._widgets) {
//			return this._widgets[type].pop();
//		}
//	},
//	store: function(type, widget) {
//		if (type in this._widgets) {
//			this._widgets[type].push(widget);
//		}
//		else {
//			this._widgets[type] = [widget];
//		}
//	}
//};

/**
 * widget
 */
TOBE.widget = {
	basic: {},
	extended: {}
};
TOBE.data = {};
TOBE.tx = {};
