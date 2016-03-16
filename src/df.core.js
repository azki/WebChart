/**
 * @author Sangchual Cha
 */

/**
 * Canvas based GUI Framework
 */

df = {} ; 
df.utils = {} ;
df.env = {} ;
df.canvas = {} ;
df.canvas.graphics = {} ;
df.canvas.context = {} ;

/**
 * global variables and functions
 */

df.version = "0.1.1" ;

df.browser = {
	    IE: !!(window.attachEvent && !window.opera),
	    Opera: !!window.opera,
	    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Chrome: navigator.userAgent.indexOf("Chrome") > -1,
	    Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
		MobileSafari: navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		ScriptManager: navigator.userAgent.indexOf('ScriptManager') > -1
	} ;
	
/**
 * $ chain function
 * @param {Object} obj
 */

df.$ = function(obj) {
		if (obj == null) {
			return null;
		}
		return new this._$init(obj);
	} ;
	
df.$d = function(){
	return window.document;
	} ;

df.$c = function(tag) {
		return window.document.createElement(tag);
	} ;
	
df.$g = function(id) {
		return window.document.getElementById(id);
	} ;

df.$t = function(str) {
		return window.document.createTextNode(str);
	} ;

df.$A = function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
} ;

df.$f = null ;

df.$dd = function(n, id){
	var a = [] ;
	var c = n.childNodes ;
	
	if(c.length > 0) {
		for(var i = 0 ; i < c.length; i++) {
			var s = new String(c.item(i).id) ;
			if(id == undefined || s.indexOf(id) >= 0) {
				a.push(c.item(i)) ;
			}
		}
		
		for(var i = 0 ; i < a.length; i++) {
			df.$dd(a[i]) ;
			n.removeChild(a[i]) ;
		}
	}
}

df.$ddd = function(n, id){
	var a = [] ;
	var c = n.childNodes ;
	
	if(c.length > 0) {
		for(var i = 0 ; i < c.length; i++) {
			var s = new String(c.item(i).id) ;
			if(id == undefined || s == id) {
				a.push(c.item(i)) ;
			}
		}
		
		for(var i = 0 ; i < a.length; i++) {
			df.$ddd(a[i]) ;
			n.removeChild(a[i]) ;
		}
	}
}

/**
 * base functions
 */
df.emptyFunction = function() { } ;

df._toString = Object.prototype.toString ;

df.keys = function(object) {
  var results = [];
  for (var property in object)
    results.push(property);
  return results;
} ;

df.values = function(object) {
  var results = [];
  for (var property in object)
    results.push(object[property]);
  return results;
} ;

df.isArray = function(object) {
  return _toString.call(object) == "[object Array]";
} ;

df.isFunction = function(object) {
  return typeof object === "function";
} ;

df.isString = function(object) {
  return _toString.call(object) == "[object String]";
} ;

df.isNumber = function(object) {
  return _toString.call(object) == "[object Number]";
} ;

df.isUndefined = function(object) {
  return typeof object === "undefined";
} ;

	
/**
 * Environment variables
 */

if ("sessionId" in df.env == false) df.env.sessionId = "" ;

df.env.minLeft = 0 ;
df.env.maxLeft = 800 ;

df.env.minTop = 0 ;
df.env.maxTop = 600 ;

df.env.minRight = 0 ;
df.env.maxRight = 800 ;

df.env.minBottom = 0 ;
df.env.maxBottom = 600 ;

df.env.minWidth = 0 ;
df.env.maxWidth = 800 ;

df.env.minHeight = 0 ;
df.env.maxHeight = 600 ;

df.env.unit = "px" ;

/**
 * Generate UUID to assign unique ID into each Object.
 */
df.utils.uuid = function () {
	var ret = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
    return ret;
	} ;

	
/**
 * returns property name array of the object, o
 *
 * @param {Object} o
 */
df.utils.getPropertyNames = function(o) {
	var r = [] ;
	for(name in o) r.push(name) ;
	return r ;
} ;		

/**
 * copies properties 
 *
 * @param {Object} from
 * @param {Object} to
 */
df.utils.copyProperties = function(from, to) {
	if(!to) to = {} ;
	for(p in from) {
		if(p in to) to[p] = from[o] ;
	}
} ;

/**
 *  selects element "e" in the array "a" if the predicate function "f(e)"" returns true 
 * 
 * @param {Array} a
 * @param {Boolean function} f
 */
df.utils.filterArray = function(a, f) {
	var r = [] ;
	
	if (typeof f == "function" && typeof a == "array") {
		var len = a.length;
		for (var i = 0; i < len; i++) {
			var e = a[i];
			if (f(e)) r.push(e);
		}
	}	
	return r ;
} ;

/**
 * returns execution result of f(e) such that e is an element of the array, a
 * 
 * @param {Array} a
 * @param {Function} f
 */
df.utils.mapArray = function(a, f) {
	var r = [] ;
	
	if(typeof f == "function") {
		var len = a.length ;
		for(var i = 0 ; i < len; i++) {
			r[i] = f(a[i]) ;
		}
	}
	
	return r ;
} ;

/**
 * binds the function, f to the method of the object, o
 * 
 * @param {Object} o
 * @param {Object} f
 */
df.utils.bindMethod = function(o, f) {
	return function() { return f.apply(o, arguments) ; } ;
} ;

/**
 * 함수 f를 지정된 전달인자와 함께 호출해 주는 함수를 반환한다.
 * 이렇게 반환된 함수는 또한 추가적인 전달인자들과 함께 호출될 수 있다.
 * 이것을 때때로 currying 이라 불린다.
 * @param {Object} f
 */
df.utils.bindArguments = function (f) {
	var boundArgs = arguments ;
	return function() {
		var arges = [] ;
		for(var i = 0 ; i < boundArgs.length; i++) args.push(boundArgs[i]) ;
		for(var i = 0 ; i < arguments.length; i++) args.push(arguments[i]) ;
		return f.apply(this, args) ;
	} ;
} ;


/**
 * 
 * @param {Object} o
 * @param {string} name
 * @param {function} predicate
 */
df.utils.makeProperty = function(o, name, predicate) {
	var value ;
	
	o["get" + name] = function() { return value ; } ;
	o["set" + name] = function(newValue) {
		if(predicate && !predicate(newValue)) {
			throw "set" + name + " : invalid value " + newValue ;
		}
		else {
			value =newValue ; 
		}
	} ;	
} ;

df.utils.inspect = function(inspector, title) {
	var expr, r ;
	
	if("ignore" in arguments.callee) return ;
	
	while(true) {
		var msg = "" ;
		if(title) msg = title + "\n" ;
		
		if(expr) msg += "\n" + expr + " =====> " + r + "\n" ;
		else expr = "" ;
		
		msg += "Enter an expression to evaluate" ;
		expr = prompt(msg, expr) ;
		if(!expr)  return ;
		
		result = inspector(expr) ;
	} ;
} ;

df.utils.defindClass = function(data) {
	var className = data.name ;
	var superclass = data.extend || Object ;
	var constructor = data.construct || function() {} ;
	var method = data.methods || {} ;
	var statics = data.statics || {} ;
	var borrows ;
	var provides ;
	
	if(!data.borrows) borrow = [] ;
	else if(data.borrows instanceof Array) borrows = data.borrows ;
	else borrows = [ data.borrows] ;
	
	if(!data.provides) provides = [] ;
	else if(data.provides instanceof Array) provides = data.provides ;
	else provides = [ data.provides] ;
} ;


df.utils.extend = function(child, parent) {
	for(var p in parent) {
		if(! (p in child)) {
			child[p] = parent[p] ;
		}
	}
} ;

/**
 * 
 * 특정 Element부터의 top, left 값을 구합니다.
 * 
 * id1 컴퍼넌트에서 id2 컴퍼넌트 까지의 offset을 구합니다.
 * 반환값은 closure를 사용하지 않고 "offsetLeft | offsetTop" 의 형태로 반환합니다.
 * 
 * @param {Object} id1
 * @param {Object} id2
 */
df.utils.getOffsetPosition = function(id1, id2) {
	var e = df.$g(id1) ;
	
	var position = "" ; 
	if(e != null && e != undefined) {
		var p = e.parentNode ;	
		var found = false ;
		
		var offsetLeft = e.offsetLeft ; 
		var offsetTop = e.offsetTop ;
		 
		while(!found && p) {
			
			if(p.id == id2) {
				found = true ;
			}
			else {
				offsetLeft = offsetLeft + p.offsetLeft ; 
				offsetTop = offsetTop + p.offsetTop ; 
			}
			
			p = p.parentNode ;
		}
		
		if(found) {
			position = offsetLeft + "|" + offsetTop ;
		}
	}
	
	return position ;
}

df.utils.getOffsetLeft = function(str) {
	return parseInt(str.substring(0, str.indexOf("|"))) ;
}

df.utils.getOffsetTop = function(str) {
	return parseInt(str.substring(str.indexOf("|")+1)) ;
}

/**
 * d framework의 Log 관련 초기화 영역
 */
df.env.log = {} ;
df.env.log.enabled = true ; /// Log 출력 활성화 및 비활성화 여부
df.env.log.maxRecussion = 3; 
df.env.log.category = [{name: "information", enabled: true}, 
                       {name: "trace",       enabled: true}, 
					   {name: "warning",     enabled: true}, 
					   {name: "critical",    enabled: true}] ;
/// Log의 분류 및 각 분류별 정보 표시 여부

/**
 * D Frame 로그 출력 함수
 * @param {Object} category - 로그의 분류
 * @param {Object} message  - 사용자 메시지
 * @param {Object} object   - 로그 대상 객체
 * @param {Object} e - 예외 객체
 */
df.utils.log = function(category, message, object, e) {
	
	if(!df.env.log.enabled) return ;
	
	var id = "df_log" ;
	var className = id + "_" + category ;
	
	var table = df.$g(id) ;
	
	if (table == "undefined" || table == null) {
		table = df.$c("table");
		table.border = 1 ;
		table.id = id ;
		table.className = className ;
		df.$d.body.appendChild(table) ;
	}
	
	if(!table) return ;
	
	var time = "[" + new Date() + "]" ; 
	e = (e == null || typeof e == "undefined" ? "" : e.toString()) ; 
	
	
	var line = df.$c("tr") ;
	var lineCategory = df.$c("th") ;
	var lineTime = df.$c("th") ;
	var lineMessage = df.$c("th") ;
	var lineException = df.$c("th") ;
	var lineObject = df.$c("th") ;

	line.className = className ;
	
	lineCategory.appendChild(df.$t(category)) ; 
	lineTime.appendChild(df.$t(time)) ; 
	lineMessage.appendChild(df.$t(message)) ; 
	lineException.appendChild(df.$t(e)) ; 
	
	if(object && typeof object == "object") {
		lineObject.appendChild(df.utils.log.makeTable(object, 0)) ;
	}
	
	line.appendChild(lineCategory) ; 
	line.appendChild(lineTime) ; 
	line.appendChild(lineMessage) ; 
	line.appendChild(lineException) ; 
	line.appendChild(lineObject) ; 
	
	table.appendChild(line) ;
} ;

df.utils.log.makeTable = (function(object, level) {
	
	if(level > df.env.log.maxRecussion) {
		return df.$t(object.toString()) ;
	}
	
	var table = df.$c("table") ;
	table.border = 1 ;
	
	var header = df.$c("tr") ;
	var headerName = df.$c("th") ;
	var headerType = df.$c("th") ;
	var headerValue = df.$c("th") ;
	
	headerName.appendChild(df.$t("Name")) ;
	headerType.appendChild(df.$t("Type")) ;
	headerValue.appendChild(df.$t("Value")) ;
	
	header.appendChild(headerName) ;
	header.appendChild(headerType) ;
	header.appendChild(headerValue) ;
	
	table.appendChild(header) ;
	
	var names = [] ;
	
	for(var name in object) names.push(name) ;
	names.sort() ;
	
	for(var i = 0 ; i < names.length; i++) {
		var name, value, type ;
		name = names[i] ;
		
		try {
			value = object[name] ;
			type = typeof value ;
		}
		catch(e) {
			value = "<unknown value>" ;
			type = "unknown" ;
		} ;
		
		if(type == "function") value = "{/*Source codes woundldn't be shown.*/}" ;
		
		var row = df.$c("tr") ;
		row.vAlign = "top" ;
		
		var rowName = df.$c("th") ;
		var rowType = df.$c("th") ;
		var rowValue = df.$c("th") ;		
		
		rowName.appendChild(df.$t(name)) ;
		rowType.appendChild(df.$t(type)) ;
		
		if(type == "object") {
			rowValue.appendChild(df.utils.log.makeTable(object[name], level+1)) ;
		}
		else {
			rowValue.appendChild(df.$t(value)) ;	
		}
		
		row.appendChild(rowName) ;
		row.appendChild(rowType) ;
		row.appendChild(rowValue) ;
		
		table.appendChild(row) ;
	}
	
	return table ;
}) ;

	
/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * df.canvas 글로벌 객체는 Canvas 매니저 이다.
 * 
 * 시스템에서 Canvas를 사용하기 위해서는 df.canvas.create() 를 호출한다.
 * 그러면 df.canvas.list에 Canvas 인스턴스가 추가하고 이를 사용하게 된다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

/**
 * Default position and size
 */
df.canvas.x = 0 ;
df.canvas.y = 0 ;
df.canvas.width = 800 ;
df.canvas.height = 600 ;

df.canvas.list = [] ;

/**
 * 
 * Create new Canvas object with parameters
 * 
 * @param {Object} parent
 * @param {Object} id
 * @param {Object} x
 * @param {Object} y
 * @param {Object} width
 * @param {Object} height
 */
df.canvas.append = function (parent, name, x, y, width, height) {

	// Parent가 id로 설정된 경우 (형식이 문자열이라면), id를 기준으로 element롤 가지고 온다.
	if (typeof(parent) == "string") parent = df.$d.getElementById(parent) ;
	
	// 만일 parent가 설정되지 않았거나, id로 가지고 온 element가 존재하지 않는 놈이라면, body를 기본으로 한다.
	if (typeof(parent) == "undefined" || parent == null) parent = df.$d.body ;
	
	if (typeof(id) != "string" || id.length <= 0) {
		id = df.utils.uuid() ;
	}
	
	var canvas = document.createElement("canvas") ;
	canvas.id = name ;
	
	this.setPosition(canvas, x, y, width, height) ;
	
	parent.appendChild(canvas) ;
	
	df.canvas.list.push({"name":name, "canvas":canvas}) ;
	
	return canvas ;
} ;

/**
 * Canvas 배열에서 해당하는 id를 기준으로 Canvas 객체를 반환합니다.
 * @param id 찾고자 하는 id
 */
df.canvas.getCanvanWidthName = function(name) {
	var canvas = null ;
	var found = false ;

	for(var i = 0 ; i < df.canvas.list.length && !found ; i++) {
		
		var item = df.canvas.list[i] ;
		
		if(item.name == name) {
			canvas = item.canvas ;
			found = true ;
		}
	}	
	
	return canvas ;
} ;

/**
 * Canvas 배열에서 해당하는 index를 기준으로 Canvas 객체를 반환합니다.
 * @param index 찾고자 하는 위치
 */
df.canvas.getCanvanWidthIndex = function(index) {
	var canvas = null ;
	
	if(index >= 0 && index < df.canvas.list.length) {
		var item = df.canvas.list[index] ;
		canvas = item.canvas ;
	}
	
	return canvas ;
} ;

/**
 * Canvas 배열에서 해당하는 element id를 기준으로 Canvas 객체를 반환합니다.
 * @param id 찾고자 하는 element id
 */
df.canvas.getCanvanWidthElementId = function(id) {
	var canvas = null ;
	
	if(typeof id == "string") {
		canvas = df.$g(id) ;
	}
	
	return canvas ;
} ;

/**
 * 
 * @param {Object} canvas
 * @param {Object} cx
 * @param {Object} cy
 * @param {Object} width
 * @param {Object} height
 */			
df.canvas.setPosition = function(canvas, cx, cy, width, height) {
	if(canvas != null) {
		canvas.style.position = "absolute" ;
		canvas.style.left = cx + "px";
		canvas.style.top = cy + "px";
		
		canvas.width = width ;
		canvas.height = height ;
	}
} ;


if (typeof(df.canvas.graphics) == "undefined") 		df.canvas.graphics = {} ;

df.canvas.graphics.rect = {left:0, top:0, right:0, bottom:0} ;

df.canvas.graphics.width = function() {
	return (this.rect.right - this.rect.left) ;
} ;
df.canvas.graphics.height = function() {
	return (this.rect.bottom - this.rect.top) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * df.class OO 구현을 위한 클래스 관련 함수
 * 
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

df.classutil = function(){} ;

df.classutil.extend = function(destination, source) {
	
	var line = "" ;
	var log = "destination : " + destination + ", source : " + source + "\r\n\r\n" ; 
		
    for (var property in source) {
      	destination[property] = source[property];
	  	line = property + " = " + source[property] + "(" + typeof(source[property]) + ")" ;
	    
	  log = log + line + "\r\n" ;
	}
	  
	//alert(log) ;
	
    return destination;
} ;

df.classutil.create = function() {
    var parent = null, properties = df.$A(arguments);
	
    if (df.isFunction(properties[0]))
      parent = properties.shift();

	// 이제 _class instance를 정의합니다.
	var _class = function() {
		// 생성자를 호출 합니다.
		this.initialize.apply(this, arguments);
	};
	
	if(parent) {
		var subclass = function() {};
		
		//df.classutil.extend(subclass.prototype, parent) ;
		//df.classutil.extend(subclass.prototype, parent.prototype) ;
		
		subclass.prototype = parent.prototype ;
		
		_class.prototype = new subclass() ;
		
	}
	
	_class.prototype.superclass = parent ;
	_class.prototype.subclasses = [];
	_class.prototype.constructor = _class;

	return _class ; 	
} ;

df.classutil.beget = function(cls) {
    function F() {}
    F.prototype = cls;
    return new F();
}

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfObject Class
 * 
 * dfObject 클래스의 역할은 스스로를 식별할 수 있는 id를 가지는 것이다.
 * 그래서 dfObject 클래스의 instance는 df.utils.uuid()를 통해 생성된 고유 실별번호 ._id 를 가지게 된다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfObject = df.classutil.create() ;
 
dfObject.prototype.initialize = function() {
	this._id = df.utils.uuid() ;
	
	this.major = 0 ;
	this.minor = 0 ;
	this.build = 1 ;
	
	this.species = "dfObject" ;
	
	//alert("dfObject.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfRect 클래스
 * 
 * 위치 정보를 설정한다. 위치 정보는 left(X), right(Y)로 설정되며, right, bottom과  width, height를 사용한다.
 *  
 * @param left  x 값, 영역의 좌상단 X 값
 * @param top   y 값, 영역의 좌상단 Y 값
 * @param right x + width 값, 영역의 우하단 X 값
 * @param bottom + hright, , 영역의 우하단 Y 값
 * @return 반환값 없음

 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfRect = df.classutil.create() ; 

dfRect.prototype.initialize = function(left, top, right, bottom) {
	
	this.top = 0 ;
	this.y = 0 ;
	this.left = 0 ;
	this.x = 0 ;
	
	this.width = 0 ;
	this.height = 0 ;

	this.set(left, top, right, bottom) ; 
} ;

/**
 * top property getter / setter
 */
dfRect.prototype.setTop = function(top) {
	this.top = top ;
	this.y = top ;
} ;                                                                    
	
dfRect.prototype.getTop = function() {
	return this.top + df.env.unit ;
} ;
	
/**
 * y property getter / setter
 */
dfRect.prototype.setY = function(y) {
	this.top = y ;
	this.y = y ;
} ;                                                                    
	
dfRect.prototype.getY = function() {
	return this.y + df.env.unit ;
} ;

/**
 * left property getter / setter
 */
dfRect.prototype.setLeft = function(left) {
	this.left = left ;
	this.x = left ;
} ;
	
dfRect.prototype.getLeft = function() {
	return this.left + df.env.unit ;
} ;
	
/**
 * x property getter / setter
 */
dfRect.prototype.setX = function(x) {
	this.left = x ;
	this.x = x ;
} ;

dfRect.prototype.getX = function() {
	return this.x + df.env.unit ;
} ;

/**
 * right property getter / setter
 */
dfRect.prototype.setRight = function(right) {
	this.right = right ;
} ;

dfRect.prototype.getRight = function() {
	return this.right + df.env.unit ;
} ;

/**
 * bottom property getter / setter
 */
dfRect.prototype.setBottom = function(bottom) {
	this.bottom = bottom ;
} ;

dfRect.prototype.getBottom = function() {
	return this.bottom + df.env.unit ;
} ;

/**
 * width property getter / setter
 */
dfRect.prototype.setWidth = function(width) {
	this.right = this.left + width ;
	this.width = width ;
} ;

dfRect.prototype.getWidth = function() {
	return this.width + df.env.unit ;
} ;

/**
 * height property getter / setter
 */
dfRect.prototype.setHeight = function(height) {
	this.bottom = this.top + height ;
	this.height = height ;
} ;

dfRect.prototype.getHeight = function() {
	return this.height + df.env.unit ;
	
} ;

/**
 * dfRect 프로퍼티를 초기화 한다.
 */
dfRect.prototype.set = function(left, top, right, bottom) {
	
	this.setLeft(left) ;
	this.setTop(top) ;
	this.setRight(right) ;
	this.setBottom(bottom) ;
	
	this.width = right - left ;
	this.height = bottom - top ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfPosition 클래스
 * 
 * 위치 정보를 설정한다. 위치 정보는 left(X), right(Y)로 설정되며, right, bottom과  width, height를 사용한다.
 *  
 * @param style CSS position 값  
 * @param left  x 값, 영역의 좌상단 X 값
 * @param top   y 값, 영역의 좌상단 Y 값
 * @param right x + width 값, 영역의 우하단 X 값
 * @param bottom + hright, , 영역의 우하단 Y 값
 * @return 반환값 없음
 * 
 * 나중에 (언제일 지는... ?) 위의 dfRect를 상속받도록 구현하도록 하자...
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfPosition = df.classutil.create() ; 
dfPosition.prototype.initialize = function(position, left, top, right, bottom) {
	
	this.top = 0 ;
	this.y = 0 ;
	this.left = 0 ;
	this.x = 0 ;
	
	this.width = 0 ;
	this.height = 0 ;

	this.position = "relative" ;
	
	this.set(position, left, top, right, bottom) ; 
} ;

/**
 * style property getter / setter
 */
dfPosition.prototype.setPosition = function(position) {
	this.position = position ;
} ;
	
dfPosition.prototype.getPosition = function() {
	return this.position ;
} ;
	
/**
 * top property getter / setter
 */
dfPosition.prototype.setTop = function(top) {
	this.top = top ;
	this.y = top ;
} ;                                                                    
	
dfPosition.prototype.getTop = function() {
	return this.top + df.env.unit ;
} ;
	
/**
 * y property getter / setter
 */
dfPosition.prototype.setY = function(y) {
	this.top = y ;
	this.y = y ;
} ;                                                                    
	
dfPosition.prototype.getY = function() {
	return this.y + df.env.unit ;
} ;

/**
 * left property getter / setter
 */
dfPosition.prototype.setLeft = function(left) {
	this.left = left ;
	this.x = left ;
} ;
	
dfPosition.prototype.getLeft = function() {
	return this.left + df.env.unit ;
} ;
	
/**
 * x property getter / setter
 */
dfPosition.prototype.setX = function(x) {
	this.left = x ;
	this.x = x ;
} ;

dfPosition.prototype.getX = function() {
	return this.x + df.env.unit ;
} ;

/**
 * right property getter / setter
 */
dfPosition.prototype.setRight = function(right) {
	this.right = right ;
} ;

dfPosition.prototype.getRight = function() {
	return this.right + df.env.unit ;
} ;

/**
 * bottom property getter / setter
 */
dfPosition.prototype.setBottom = function(bottom) {
	this.bottom = bottom ;
} ;

dfPosition.prototype.getBottom = function() {
	return this.bottom + df.env.unit ;
} ;

/**
 * width property getter / setter
 */
dfPosition.prototype.setWidth = function(width) {
	this.right = this.left + width ;
	this.width = width ;
} ;

dfPosition.prototype.getWidth = function() {
	return this.width + df.env.unit ;
} ;

/**
 * height property getter / setter
 */
dfPosition.prototype.setHeight = function(height) {
	this.bottom = this.top + height ;
	this.height = height ;
} ;

dfPosition.prototype.getHeight = function() {
	return this.height + df.env.unit ;
	
} ;

/**
 * dfPosition의 프로퍼티를 초기화 한다.
 */
dfPosition.prototype.set = function(position, left, top, right, bottom) {
	
	this.setPosition(position) ;
	
	this.setLeft(left) ;
	this.setTop(top) ;
	this.setRight(right) ;
	this.setBottom(bottom) ;
	
	this.width = right - left ;
	this.height = bottom - top ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfComponent Class
 * 
 * dfComponent는 ID, 이름, 설명, 클래스명을 가진다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfComponent = df.classutil.create(dfObject) ; 

// 클래스 상속
//df.classutil.extend(dfComponent, ) ;

dfComponent.prototype.initialize = function(){
	
	dfObject.prototype.initialize.call(this) ;	
	//dfObject.prototype.call()
	
	this.e = null ;			// HTML element 오브젝트
	this.name = "" ;     	// 컴퍼넌트의 이름이다. 실체 프로그램에서는 name을 참조하게 된다.
	this.tooltiptype = "default" ;
	this.tooltext = "" ;   	
	this.className = "" ; 	// CSS 클래스 id 
	
	this.position = new dfPosition("relative", 0, 0, 0, 0) ;
	this.rect = new dfPosition("relative", 0, 0, 0, 0) ;
	
	this.parent = null; 	// 부모 컴퍼넌트, dfComponent를 상속받은 놈이여야 한다.
	this.style = new dfStyle() ;
	this.canvasName = "" ;
	
	this.species = "dfComponent" ;
	
	
	//alert("dfComponent.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**
 * Script에서 동적으로 Component를 생성한 후에 초기화하는 Method입니다.
 * 
 * @param name
 * @param left 		생성 위치의 bottom 좌표
 * @param top		생성 위치의 left 좌표
 * @param right		생성 위치의 right 좌표
 * @param bottom	생성 위치의 top 좌표
 * @return
 */
dfComponent.prototype.init = function(name, left, top, right, bottom) {
	this.setPosition(left, top, right, bottom) ;
	this.name = name ;
} ;


/**
 * 클라이언트 영역을 설정/변경 합니다. x, y, width, height를 설정합니다. 
 * 
 * @param x
 * @param y
 * @param width
 * @param height
 * @return
 */
dfComponent.prototype.setPosition = function(left, top, right, bottom) {
	
	if (left < 0 && top < 0 && right < 0 && bottom < 0) {
		this.position.setLeft(0) ;
		this.position.setTop(0) ;
		this.position.setWidth(0) ;
		this.position.setHeight(0) ;
	}
	else {
		this.position.setPosition("absolute") ;
		
		this.position.setLeft(left) ;
		this.position.setTop(top) ;
		this.position.setWidth(right - left) ;
		this.position.setHeight(bottom - top) ;
	}	
} ;


dfComponent.prototype.setRect = function(){
	var left = this.style.padding.left ;
	var top = this.style.padding.top
	var right = this.position.width - this.style.padding.left - this.style.padding.right ;
	var bottom = this.position.height - this.style.padding.top - this.style.padding.bottom ;
	
	this.rect.setLeft(left) ;
	this.rect.setTop(top) ;
	this.rect.setWidth(right - left) ;
	this.rect.setHeight(bottom - top) ;
}

/**
 * 설정된 위치, 크기를 적용합니다.
 * 컴퍼넌트의 x, y, width, height 속성은 applyPosition()을 호출함으로 실제 적용됩니다.
 * @return
 */
dfComponent.prototype.applyPosition = function() {
	if (this.e != null) {
		this.e.style.position = this.position.getPosition();
		this.e.style.top = this.position.getTop();
		this.e.style.left = this.position.getLeft();
		this.e.style.width = this.position.getWidth();
		this.e.style.height = this.position.getHeight();
	}
} ;

/**
 * 설정된 Style을 적용합니다.
 * 컴퍼넌트의 스타일은 component.style 에 설정하며, 이는 applyStype() 함수를 호출함으로 실제 적용됩니다.
 * @return
 */
dfComponent.prototype.initStyle = function() {
	this.initBackgroundStyle() ;
	this.initBorderStyle() ;
	this.initFontStyle() ;
	this.initMiscStyle() ;
} ;

dfComponent.prototype.initBackgroundStyle = function() {
} ;

dfComponent.prototype.initBorderStyle = function() {
} ;

dfComponent.prototype.initFontStyle = function() {
} ;

dfComponent.prototype.initMiscStyle = function() {
} ;


dfComponent.prototype.applyStyle = function() {
	this.applyBackgorundStyle() ;
	this.applyBorderStyle() ;
	this.applyFontStyle() ;
	this.applyMiscStyle() ;
} ;


dfComponent.prototype.applyBackgorundStyle = function() {
} ;

dfComponent.prototype.applyBorderStyle = function() {
} ;

dfComponent.prototype.applyFontStyle = function() {
} ;

dfComponent.prototype.applyMiscStyle = function() {
} ;

/**
	 * canvasName Setter / Getter
	 */
dfComponent.prototype.setCanvasName = function(canvasName) {
	this.canvasName = canvasName ;
} ;

dfComponent.prototype.getCanvasName = function() {
	return this.canvasName ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfContainer Class
 * 
 * dfContainer 클래스는 자식 컴퍼넌트 목록을 관리하며, 이벤트를 나누어 준다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfContainer = df.classutil.create(dfComponent) ; 

dfContainer.prototype.initialize = function(){
	
	dfComponent.prototype.initialize.call(this) ;	


	this.children = [] ;	// 자식들 배열
	this.species = "dfContainer" ;
	
	//alert("dfContainer.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**
 * 자식을 하나 주가 합니다.
 * @param component 추가할 자식 컴퍼넌트
 * @return
 */
dfContainer.prototype.appendChild = function(component) {
  
  this.e.appendChild(component.e) ; 					// HTML element 간의 관계를 만들어 줍니다.
  this.children.push(component) ;   					// 배열에 자식을 하나 주가합니다.
  
  component.setCanvasName(this.getCanvasName()) ;		// canvasName를 세습합니다.
  
  return this.children.length ;
} ;

/**
 * name 값을 가지는 컴퍼넌트를 삭제합니다.
 * 동일한 이름의 컨퍼넌트가 존재하는 경우 이를 모두 삭제합니다.
 * children 배열에 있는 것과 this.e 의 ChildNodes의 것도 모두 삭제합니다.
 * 
 * @param {Object} name
 */
dfContainer.prototype.removeChildithName = function(name) {
	var found = false ;
	var a = [] ;

	for(var i = 0 ; i < this.children.length; i++) {
		var c = this.children[i] ;
		
		if(c.name == name) {
			found = true ;
			a.push(i) ;
		}
	}
	
	if(found) {
		for(var i = 0 ; i < a.length; i++) {
			this.children.splice(a[i], 1) ;
		}
		
		df.$ddd(this.e, name) ;				
	}
};

/**
 * name 값을 포함하는 컴퍼넌트를 삭제합니다.
 * 동일한 이름의 컨퍼넌트가 존재하는 경우 이를 모두 삭제합니다.
 * children 배열에 있는 것과 this.e 의 ChildNodes의 것도 모두 삭제합니다.
 * 
 * @param {Object} name
 */
dfContainer.prototype.removeChildContainsName = function(name) {
	var found = false ;
	var a = [] ;

	for(var i = 0 ; i < this.children.length; i++) {
		var c = this.children[i] ;
		
		if(c.name.indexOf(name) >= 0) {
			found = true ;
			a.push(i) ;
		}
	}
	
	if(found) {
		for(var i = 0 ; i < a.length; i++) {
			delete this.children.splice(a[i], 1) ;
		}
		
		df.$dd(this.e, name) ;				
	}
};


dfContainer.prototype.getCount = function() {
	return children.length ;
} ;

dfContainer.prototype.arrange = function() {
} ;

dfContainer.prototype.updateCanvasName = function(canvasName) {
	this.setCanvasName(canvasName) ;
	
	for(var i = 0 ; i < children.length; i++) {
		var child = children[i] ;
		child.updateCanvasName(canvasName) ;
	} ;
} ;

//클래스 상속
//df.classutil.extend(dfContainer, dfComponent) ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfAnchor 클래스 부모 Component의 크기에 따라 크기를 자동으로 조절되게 할지를 설정하는 Property입니다.
 * 
 * @param left 		true / false
 * @param top 		true / false
 * @param right 	true / false
 * @param bottom 	true / false
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfAnchor = df.classutil.create() ; 

dfAnchor.prototype.initialize = function(left, top, right, bottom) {
	this.set(left, top, right, bottom) ;
} ;

dfAnchor.prototype.set = function(left, top, right, bottom) {
	this.left = left ;
	this.top = top ;
	this.right = right ;
	this.bottom = bottom ;
} ;
	
/**
 * left property getter / setter
 */
dfAnchor.prototype.setLeft = function(left) {
	this.left = left ;
} ;

dfAnchor.prototype.getLeft = function() {
	return this.left ;
} ;

/**
 * top property getter / setter
 */
dfAnchor.prototype.setTop = function(top) {
	this.top = top ;
} ;

dfAnchor.prototype.getTop = function() {
	return this.top ;
} ;

/**
 * right property getter / setter
 */
dfAnchor.prototype.setRight = function(right) {
	this.right = right ;
} ;

dfAnchor.prototype.getRight = function() {
	return this.right ;
} ;

/**
 * bottom property getter / setter
 */
dfAnchor.prototype.setBottom = function(bottom) {
	this.bottom = bottom ;
} ;

dfAnchor.prototype.getBottom = function() {
	return this.bottom ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfControl Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfControl = df.classutil.create(dfContainer) ; 

dfControl.prototype.initialize = function() {
	dfContainer.prototype.initialize.call(this) ;	

	this.data = new dfData() ; 
	this.anchor = new dfAnchor(true, true, false, false) ;
	this.bindgestureset = null ;	// Gesture 객체를 바인딩 한다.
	this.canvas = null ; 			// 캔바스 객체를 반환한다.
	this.className = "" ; 				// CSS 클래스 명
	this.currentstyle = this.style ;
	this.dropformat = "" ;			// drop을 허용하는 format을 지정하는 Property 입니다.
	this.enable = true ;			// 활성화 여부를 지정하는 Property 입니다.
	this.enableevent = true ; 		// Event를 발생할지 여부를 결정하는 Property 입니다.
	this.enableredraw = true ;		// 변화가 발생했을 때 redraw 할지 여부를 지정하는 Property 입니다.
	this.transparenthittest = false ;
	this.usebitmapcache = false ;
	this.visible = true ;
	
	this.species = "dfControl" ;
	
	//alert("dfControl.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**
 * transition 그룹의 애니메이션을 지정하는 Method 입니다.
 * 
 * applyTrans()를 호출하면 해당 시점의 컴포넌트의 모습을 저장합니다.playTrans()를 호출할 때까지 
 * 해당 컴포넌트의 모습은 화면에 표시되지 않습니다.
 * playTrans()를 호출하면 applyTrans()를 호출할 때의 모습과 playTrans()를 호출할 때의 모습에 의해 
 * 변화되는 애니메이션을 요청합니다. playTrans()의 호출은 transition 애니메이션을 요청하는 것 뿐이므로, 
 * 애니메이션의 동작과 관련이 없습니다.

 * @param animation
 * @return
 */
dfControl.prototype.applyTrans = function(animation) {
} ;

/**
 * Component 가 그려지는 순서를 동일 레벨 Component 들 중에서 가장 앞쪽으로 가져오는 Method 입니다.
 * 
 * @return
 */
dfControl.prototype.bringToFront = function() {
} ;

/**
 * Component 가 그려지는 순서를 동일 레벨 Component 들 중에서 한단계 앞쪽으로 가져오는 Method 입니다
 * 
 * @return
 */
dfControl.prototype.brintToPrev = function() {
} ;

/**
 * Script에서 동적으로 생성한 Component를 삭제하는 Method입니다.
 * 
 * @return
 */
dfControl.prototype.destroy = function() {
} ;

/**
 * Component 를 Form 내의 특정위치와 크기로 이동하는 Method 입니다.
 * 
 * @param left
 * @param top
 * @param right
 * @param bottom
 * @return
 */
dfControl.prototype.move = function(left, top, right, bottom) {
} ;

/**
 * Component 가 그려지는 순서를 인자값으로 주어진  Component 를 기준으로 한단계 뒷쪽으로 이동시키는 Method 입니다.
 * 
 * @param target
 * @return
 */
dfControl.prototype.moveToNext = function(target) {
} ;

/**
 * Component 가 그려지는 순서를 인자값으로 주어진  Component 를 기준으로 한단계 앞쪽으로 이동시키는 Method 입니다.
 * 
 * @param target
 * @return
 */
dfControl.prototype.moveToPrev = function(target) {
} ;

/**
 * transition 그룹의 애니메이션을 요청하는 Method 입니다.
 * 
 * @return
 */
dfControl.prototype.playTrans = function() {
} ;

/**
 * Component 를 Printer로 출력하는 Method 입니다.
 * 
 * @param defaultPrint 	Printer에 대한 설정창 없이 print 할지 여부. [Default Value = true]
 * @param hAligh		출력될 이미지가 용지의 수평방향에 출력될 위치를 지정. "left" / "center" / "right" [Default Value = "center"]
 * @param vAligh		출력될 이미지가 용지의 수직방향에 출력될 위치를 지정. "top" / "middle" / "bottom" / [Default Value = "center"]
 * @return
 */
dfControl.prototype.print = function(defaultPrint, hAligh, vAligh) {
} ;

/**
 * draw 하는 Method 입니다.
 * 
 * @return
 */
dfControl.prototype.draw = function() {
} ;


/**
 * redraw 하는 Method 입니다.
 * 
 * @return
 */
dfControl.prototype.redraw = function() {
} ;

/**
 * 크기를 변경하는 Method 입니다.
 * @param width
 * @param height
 * @return
 */
dfControl.prototype.resize = function(width, height) {
} ;

/**
 * image 파일로 Export 하는 Method 입니다.
 * @param file
 * @param imageType
 * @param jpegQualityFactor
 * @return
 */
dfControl.prototype.saveToImage = function(file, imageType, jpegQualityFactor) {
} ;

/**
 * ImageObject로 Export 하는 Method 입니다.
 * @return
 */
dfControl.prototype.saveToImageObject = function() {
} ;

/**
 * Component 가 그려지는 순서를 동일 레벨 Component 들 중에서 가장 뒷쪽으로 보내는 Metho입니다.
 */
dfControl.prototype.sendToBack = function() {
} ;

/**
 * Component 가 그려지는 순서를 동일 레벨 Component 들 중에서 한단계 뒷쪽으로 보내는 Method 입니다.
 */
dfControl.prototype.sendToNext = function() {
} ;

/**
 * Component에 Focus를 주는 Method입니다.
 */
dfControl.prototype.setFocus = function() {
} ;

/**
 * Label의 타입을 반환한다.
 * 
 * 0 : 일반 텍스트
 * 1 : DataSet에 바인드 되어 있는 컬럼 (bind:columnid)
 * 2 : Expression (expr:expression)
 * 
 * @param {Object} label
 */ 
dfControl.prototype.getLabelType = function(label) {
	var type = 0 ;
	
	if (this.isBindLabel(label)) {
		type = 1 ;
	}
	else if(this.isExprLabel(label)) {
		type = 2 ;
	}
	return type ;
} ;

/**
 * Label의 타입이 DataSet에 바인드되어 있는 컬럼이 아닌지 여부를 반환한다.
 * @param {Object} label
 */
dfControl.prototype.isBindLabel = function(label){
	var s = new String(label) ;
	var b = false ; 
	
	if(s.toUpperCase().indexOf("BIND:") >= 0) {
		b = true ;
	}
	
	return b ;
} ;

/**
 * Label의 타입이 Expression의 여부를 반환한다. 
 * @param {Object} label
 */
dfControl.prototype.isExprLabel = function(label){
	var s = new String(label) ;
	var b = false ; 
	
	if(s.toUpperCase().indexOf("EXPR:") >= 0) {
		b = true ;
	}
	
	return b ;
} ;


/**
 * DataSet에 바인드되어 있는 column id를 얻어 온다.
 * @param {Object} label
 */
dfControl.prototype.getBindColumn = function(label){
	var column = label ;
	
	if(this.isBindLabel(label)) {
		var s = new String(label) ;
		var bind = new String("BIND:") ;
		var start= s.toUpperCase().indexOf(bind) + bind.length ;
		column = s.substr(start) ; 
	}
	
	return column ;
}

/**
 * Expression 표현식을 얻어 온다.
 * @param {Object} label 
 */
dfControl.prototype.getExpression = function(label){
	var column = label ;
	
	if(this.isExprLabel(label)) {
		var s = new String(label) ;
		var expr = new String("EXPR:") ;
		var start= s.toUpperCase().indexOf(expr) + expr.length ;
		column = s.substr(start) ; 
	}
	
	return column ;
}




/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfCanvas Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfCanvas = df.classutil.create() ; 

dfCanvas.prototype.initialize = function(parent, name, left, top, right, bottom){
	this.position = new dfPosition("absolute", left, top, right, bottom) ;

	this.canvas = null ;
	this.context = null ; 
	
	this.parent = parent ;
	this.name = name ;
	
	this.canvas = df.canvas.append(this.parent, this.name, this.position.left, this.position.top, this.position.width, this.position.height) ;
	
	if (this.canvas != null) {
		this.context = this.canvas.getContext("2d") ; 
	}
} ;

/**
 * canvasName Setter / Getter
 */
dfCanvas.prototype.setName = function(name) {
	this.name = name ;
} ;

dfCanvas.prototype.getName = function() {
	return this.name ;
} ;

/**
 * canvas Setter / Getter
 */
dfCanvas.prototype.setCanvas = function(canvas) {
	this.canvas = canvas ;
} ;

dfCanvas.prototype.getCanvas = function() {
	return this.canvas ;
} ;


/**
 * context Setter / Getter
 */
dfCanvas.prototype.setContext = function(context) {
	this.context = context ;
} ;

dfCanvas.prototype.getContext = function() {
	return this.context ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * CanvasGraphic Class
 * 
 * CanvasGraphic 클래스는 Graphics와 관련된 다양한 Operations를 제공한다. 
 * 예를 들어 라인을 그리거나, 사각형을 그리거나 파이 조각을 그린다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfCanvasGraphics = df.classutil.create() ; 

/**
 * CanvasGraphic를 초기화 합니다.  
 * 
 * @param {Object} canvas
 */
dfCanvasGraphics.prototype.initialize = function(canvas) {
	this.setCanvas(canvas.getCanvas()) ;
	this.setContext(canvas.getContext()) ;
} ; 

/**
 * Canvas 객체를 설정한다.
 * @param {Object} canvas
 */
dfCanvasGraphics.prototype.setCanvas = function(canvas) {
	this.canvas = canvas ;
} ;

/**
 * Canvas 객체를 반환한다.
 */
dfCanvasGraphics.prototype.getCanvas = function() {
	return this.canvas ;
} ;

/**
 * 2D Context를 설정한다.
 * @param {Object} context
 */
dfCanvasGraphics.prototype.setContext = function(context) {
	this.context = context ;
} ;

/**
 * 2D Context를 반환한다.
 */
dfCanvasGraphics.prototype.getContext = function() {
	return this.context ;
} ;


/**
 * 라인을 그린다. 이 함수는 사선을 그리는 것을 목적으로 사용된다.  
 *  
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 * @param {Object} color
 * @param {Object} thickness
 */
dfCanvasGraphics.prototype.drawLine = function(x1, y1, x2, y2, color, thickness) {
	if (this.isValidCanvas()) {

		this.context.strokeStyle = color ;		
		this.context.beginPath() ;
		

		this.context.moveTo(x1, y1) ;
		this.context.lineTo(x2, y2) ;
		
		this.context.lineWidth = thickness ; 
		this.context.stroke() ;

		this.context.closePath() ; 
	}
}

/**
 * 가로 직선을 그린다.
 * 
 * HTML5 canvas에서 직선을 그릴때에는 2가지를 고려해야 한다.
 * 
 * 첫번째에는 라인의 Width값이 커지면 지정된 좌표를 중심으로 두꺼워진다. 이것은 그래프를 그리면서
 * 원하지 않은 결과를 발생시킬 것이다.
 * 
 * 두번째에는 1 크기의 두께의 라인은 실제 좌표값을 중심으로 0.5 씩 두께를 가지는 것이다.
 * 
 * 1. option값에 따라 설정된 좌표값을 기준으로 라인을 아래쪽으로 밀거나 윗쪽으로 밀게 된다.
 * 2. thickness == 1 ? -0.5 : (thickness / 2) - 1  ; 을 통해서 좌표와 라인을 일치 시킨다.
 *  
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} length
 * @param {Object} color
 * @param {Object} thickness
 * @param {Object} option
 */
dfCanvasGraphics.prototype.drawVLine = function(x1, y1, length, color, thickness, option) {
	var x2, y2, t1 ;
	t1 = thickness == 1 ? -0.5 : (thickness / 2) - 1  ;
	
	if(option == undefined || option == 0) {
		x1 = x2 = x1 + t1 ; 
	}
	else {
		x1 = x2 = x1 - t1 ; 
	}
	
	y2 = y1 + length ;
	
	this.drawLine(x1, y1, x2, y2, color, thickness) ;
}

/**
 * 세로 직선을 그린다.
 * 
 * option값에 따라 설정된 좌표값을 기준으로 라인을 위로 밀거나 아래쪽으로 밀게 된다.
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} length
 * @param {Object} color
 * @param {Object} thickness
 * @param {Object} option
 */dfCanvasGraphics.prototype.drawHLine = function(x1, y1, length, color, thickness, option) {
	var x2, y2, t1 ;
	t1 = thickness == 1 ? -0.5 : (thickness / 2) - 1  ;
	
	x2 = x1 + length ; 

	if(option == undefined || option == 0) {
		y1 = y2 = y1  + t1  ;
	}
	else {
		y1 = y2 = y1  - t1  ;
	}

	
	this.drawLine(x1, y1, x2, y2, color, thickness) ;
}

/**
 * 사각형 영역을 채운다.
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 * @param {Object} fillColor
 */
dfCanvasGraphics.prototype.fillRect = function(x1, y1, x2, y2, fillColor) {
	if (this.isValidCanvas()) {
		this.context.fillStyle = fillColor ;		
		this.context.fillRect(x1, y1, (x2-x1+1), (y2-y1+1)) ;
	}
}

/**
 * 사각형을 그려 준다.
 * 
 * 라인의 두께가 넓어지면 사각형의 안쪽방향으로 커지게 된다.
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 * @param {Object} color
 * @param {Object} thickness
 * @param {Object} fillColor
 */
dfCanvasGraphics.prototype.drawRect = function(x1, y1, x2, y2, color, thickness, fillColor){
	if (this.isValidCanvas()) {
		var lx1, ly1, lx2, ly2, t1 ;
		
		t1 = thickness == 1 ? -0.5 : (thickness / 2) - 1  ;
		
		lx1 = x1 + t1 ;
		ly1 = y1 + t1 ;
		lx2 = x2 - t1 ;
		ly2 = y2 - t1 ; 
		
		this.context.strokeStyle = color ;
		if(fillColor != undefined) {
			this.context.fillStyle = fillColor ;
		}
				
		this.context.beginPath() ;
		
		this.context.lineWidth = thickness ; 

		this.context.moveTo(lx1, ly1) ;
		
		this.context.lineTo(lx2, ly1) ;
		this.context.lineTo(lx2, ly2) ;
		this.context.lineTo(lx1, ly2) ;
		this.context.lineTo(lx1, ly1) ;
		
		if(fillColor != undefined) {
			this.context.fill() ;
		}
		this.context.stroke() ;
		
		this.context.closePath() ; 
	}
}

/**
 * 정사각형을 그립니다.
 */
dfCanvasGraphics.prototype.drawSquare = function(x1, y1, size, color, thickness, fillColor){
	if (this.isValidCanvas()) {
		this.drawRect(x1,y1, x1+size, y1+size, color, thickness, fillColor) ;
	}
}



/**
 * 삼각형을 그려 준다.
 * 
 * 라인의 두께가 넓어지면 사각형의 안쪽방향으로 커지게 된다.
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 * @param {Object} color
 * @param {Object} thickness
 * @param {Object} fillColor
 */
dfCanvasGraphics.prototype.drawTri = function(x1, y1, x2, y2, color, thickness, fillColor){
	if (this.isValidCanvas()) {
		var lx1, ly1, lx2, ly2, t1 ;
		
		t1 = thickness == 1 ? -0.5 : (thickness / 2) - 1  ;
		
		lx1 = x1 + t1 ;
		ly1 = y1 + t1 ;
		lx2 = x2 - t1 ;
		ly2 = y2 - t1 ; 
		
		var n = ly2 - ly1 ;
		var a = Math.sqrt((n * n) * (1/3)) ;
		
		lx1 = lx1 + ((lx2 - lx1) / 2) - a ;
		lx2 = lx1 + ((lx2 - lx1) / 2) + a ;

		this.context.strokeStyle = color ;
		if(fillColor != undefined) {
			this.context.fillStyle = fillColor ;
		}
				
		this.context.beginPath() ;
		
		this.context.lineWidth = thickness ; 

		this.context.moveTo(lx1, ly2) ;

		this.context.lineTo(lx1 + ((lx2 - lx1) / 2), ly1) ;
		this.context.lineTo(lx2, ly2) ;
		this.context.lineTo(lx1, ly2) ;
		
		if(fillColor != undefined) {
			this.context.fill() ;
		}
		this.context.stroke() ;
		
		this.context.closePath() ; 
	}
}

/**
 * 원을 그립니다.
 * 
 * @param {Object} x 중심점의 X 좌표
 * @param {Object} y 중심점의 Y 좌표
 * @param {Object} radius 반지름
 * @param {Object} thickness 선의 굵기
 * @param {Object} lineColir 선의 색깔
 * @param {Object} fillColor 채움색
 */
dfCanvasGraphics.prototype.drawCircle = function(x, y, radius, color, thickness, fillColor) {

	if (this.isValidCanvas()) {
		
		var beginRadian = ((0 / 360) * Math.PI * 2);
		var endRadian = beginRadian + ((360 / 360) * Math.PI * 2);
		
		this.context.lineWidth = thickness ;
		this.context.strokeStyle = color ;

		this.context.beginPath() ;
		

		if(fillColor != undefined) {
			this.context.fillStyle = fillColor ;
		}
		 
		this.context.arc(x, y, radius, beginRadian, endRadian, false) ; 

		this.context.closePath();

		if(fillColor != undefined) {
			this.context.fill() ;
		}

		this.context.stroke();
	}
	
}

/**
 * Arc - 파이를 그립니다.
 * 
 * @param {Object} x 중심점의 X 좌표
 * @param {Object} y 중심점의 Y 좌표
 * @param {Object} radius 반지름
 * @param {Object} angle 라디안 각도
 * @param {Object} thickness 선의 굵기
 * @param {Object} lineColir 선의 색깔
 * @param {Object} fillColor 채움색
 */
dfCanvasGraphics.prototype.drawArc = function(x, y, radius, beginAngle,endAngle, color, thickness, fillColor) {
	
	if (this.isValidCanvas()) {
		
		var beginRadian = ((beginAngle / 360) * Math.PI * 2);
		var endRadian = beginRadian + ((endAngle / 360) * Math.PI * 2);
		
		this.context.lineWidth = thickness ;
		this.context.strokeStyle = color ;

		this.context.beginPath() ;
		

		if(fillColor != undefined) {
			this.context.fillStyle = fillColor ;
		}
		 
		this.context.moveTo(x, y) ;
		this.context.arc(x, y, radius, beginRadian, endRadian, false) ; 

		this.context.closePath();

		if(fillColor != undefined) {
			this.context.fill() ;
		}

		this.context.stroke();
	}
	
}

/**
 * 현재 적절한 Canvas를 가지고 있는지 반환합니다.
 */
dfCanvasGraphics.prototype.isValidCanvas = function(){
	var bValid = false ; 
	if (this.canvas != null && this.canvas != undefined) {
		if(this.context != null && this.context != undefined) {
			bValid = true ;
		}
	}
	
	return bValid ;
}
/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * 접근성을 지정하는 Property 입니다.
 * 
 * 현재 설정 가능하지만 동작하지는 않습니다.
 * Application의 enableaccessbility가 설정되면 컴포넌트별로 설정된 접근성 형식으로 OS의 접근성 인터페이스가 동작합니다.
 * 각 Component에서 accessibility가 실행되면 application의 onaccessibility Event가 발생됩니다.

 * @param desclevel 접근성의 Description을 실행하는 Level을 지정하는 Property 입니다.
 * @param enabled 접근성을 실행할지 여부를 결정하는 Property 입니다.
 * @param description 접근성의 description을 설정하는 Property 입니다.
 * @param label 접근성의 label을 설정하는 Property 입니다.
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfAccessbility = df.classutil.create() ; 

dfAccessbility.prototype.initialize = function(desclevel, enabled, description, label) {
	this.set(desclevel, enabled, description, label) ; 
} ;

dfAccessbility.prototype.set = function(desclevel, enabled, description, label) {
	this.setDesclevel(desclevel) ;
	this.setEnabled(enabled) ;
	this.setDescription(description) ;
	this.setLabel(label) ;
} ;

/**
 * desclevel property getter / setter
 */
dfAccessbility.prototype.setDesclevel = function(desclevel) {
	this.desclevel = desclevel ;
} ;

dfAccessbility.prototype.setDesclevel= function() {
	return this.desclevel ;
} ;

/**
 * enabled property getter / setter
 */
dfAccessbility.prototype.setEnabled = function(enabled) {
	this.enabled = enabled ;
} ;

dfAccessbility.prototype.getEnabled = function() {
	return this.enabled ;
} ;

/**
 * description property getter / setter
 */
dfAccessbility.prototype.setDescription = function(description) {
	this.description = description ;
} ;

dfAccessbility.prototype.getDescription = function() {
	return this.description ;
} ;

/**
 * label property getter / setter
 */
dfAccessbility.prototype.setLabel = function(label) {
	this.label = label ;
} ;

dfAccessbility.prototype.getLabel = function() {
	return this.label ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * text에 대한 align을 지정하는 Property 입니다.
 * 
 * @param hAligh 수평 정렬을 지정 합니다. "left" | "center" | "right"
 * @param vAligh 수직 정렬을 지정 합니다. "top" | "middle" | "bottom"
 * 
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfAlign = df.classutil.create() ; 

dfAlign.prototype.initialize = function(hAligh, vAligh){
	this.set(hAligh, vAligh) ;
} ;

/**
 * hAligh property getter / setter
 */
dfAlign.prototype.setHAligh = function(hAligh) {
	this.hAligh = hAligh ;
} ;

dfAlign.prototype.getHAligh = function() {
	return this.hAligh ;
} ;

/**
 * vAligh property getter / setter
 */
dfAlign.prototype.setVAligh = function(vAligh) {
	this.vAligh = vAligh ;
} ;

dfAlign.prototype.getVAligh = function() {
	return this.vAligh ;
} ;

dfAlign.prototype.set = function(hAligh, vAligh) {
	this.setHAligh(hAligh) ;
	this.setVAligh(vAligh) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfBackground 클래스
 * 
 * @param clientOnly 배경 image의 영역을 지정하는 Property입니다. true / false
 * @param color      컴포넌트의 배경색을 설정하는 Property 입니다.
 * @param image      배경에 들어갈 image 정보를 설정하는 Property 입니다. 
 * @param imageEdge  배경 image가 Client 전영역에 맞게 출력될 때 image의 네 모서리 영역은 고정시키고 나머지 영역을 stretch 시키거나 
 *                    repeat 하는 Property입니다. 
 * @param position    배경 image가 출력되는 위치를 지정하는 property입니다.
 * @param repeat     배경 image 의 드로잉 방법을 지정하는 Property입니다. true / false
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfBackground = df.classutil.create() ; 

dfBackground.prototype.initialize = function(clientOnly, color, image, imageEdge, position, repeat){
	this.set(clientOnly, color, image, imageEdge, position, repeat) ; 
} ;

/**
 * clientOnly property getter / setter
 */
dfBackground.prototype.setClientOnly = function(clientOnly) {
	this.clientOnly = clientOnly ;
} ;
dfBackground.prototype.getClientOnly = function() {
	return this.clientOnly ;
} ;

/**
 * color property getter / setter
 */
dfBackground.prototype.setColor = function(color) {
	this.color = color ;
} ;
dfBackground.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * image property getter / setter
 */
dfBackground.prototype.setImage = function(image) {
	this.image = image ;
} ;

dfBackground.prototype.getImage = function() {
	return this.image ;
} ;

/**
 * imageEdge property getter / setter
 */
dfBackground.prototype.setImageEdge = function(imageEdge) {
	this.imageEdge = imageEdge ;
} ;

dfBackground.prototype.getImageEdge = function() {
	return this.imageEdge ;
} ;

/**
 * position property getter / setter
 */
dfBackground.prototype.setPosition = function(position) {
	this.position = position ;
} ;

dfBackground.prototype.getPosition = function() {
	return this.position ;
} ;

/**
 * repeat property getter / setter
 */
dfBackground.prototype.setRepeat = function(repeat) {
	this.repeat = repeat ;
} ;

dfBackground.prototype.getRepeat = function() {
	return this.repeat ;
} ;

dfBackground.prototype.set = function(clientOnly, color, image, imageEdge, position, repeat) {
	this.setClientOnly(clientOnly) ;
	this.setColor(color) ; 
	this.setImage(image) ;
	this.setImageEdge(imageEdge) ;
	this.setPosition(position) ;
	this.setRepeat(repeat) ;
} ; 
	

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfLineBorder 클래스
 * 
 * @param color  Line 의 색상을 지정하는 Property 입니다. style이 "double"인 경우 바깥쪽 선의 색상을 지정합니다.
 * @param color2 Line 의 색상을 지정하는 Property 입니다. style이 "double"인 경우 안쪽 Line 의 색상을 지정합니다.
 * @param style  Line의 형태에 대한 속성을 설정하는 Property 입니다. 
 *                 - none   : 테두리 보이지 않음 
 *                 - solid  : 일반적인 실선 테두리 
 *                 - dotted : 동그라미 점선 테두리 
 *                 - dashed : 네모점선 테두리 
 * @param width  Line 의 너비에 대한 속성을 설정하는 Property 입니다.
 * @return
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfLineBorder = df.classutil.create() ; 

dfLineBorder.prototype.initialize = function(color, color2, style, width){
	this.set(color, color2, style, width) ; 
} ;

/**
 * color property getter / setter
 */
dfLineBorder.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfLineBorder.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * color2 property getter / setter
 */
dfLineBorder.prototype.setColor2 = function(color2) {
	this.color2 = color2 ;
} ;

dfLineBorder.prototype.getColor2 = function() {
	return this.color2 ;
} ;

/**
 * style property getter / setter
 */
dfLineBorder.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfLineBorder.prototype.getStyle = function() {
	return this.style ;
} ;

/**
 * width property getter / setter
 */
dfLineBorder.prototype.setWidth = function(width) {
	this.width = width ;
} ;

dfLineBorder.prototype.getWidth = function() {
	return this.width + df.env.unit ;
} ;

dfLineBorder.prototype.set = function(color, color2, style, width) {
	this.setColor(color) ;
	this.setColor2(color2) ;
	this.setStyle(style) ;
	this.setWidth(width) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfLineBorder 클래스
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfBorder = df.classutil.create() ; 

dfBorder.prototype.initialize = function(color, color2, style, width){
	this.left = new dfLineBorder(color, color2, style, width) ;
	this.top = new dfLineBorder(color, color2, style, width) ;
	this.right = new dfLineBorder(color, color2, style, width) ;
	this.bottom = new dfLineBorder(color, color2, style, width) ;
	
	this.set(color, color2, style, width) ; 
} ;


/**
 * color property getter / setter
 */
dfBorder.prototype.setColor = function(color) {
	this.color = color ;
	
	this.left.setColor(color) ;
	this.top.setColor(color) ;
	this.right.setColor(color) ;
	this.bottom.setColor(color) ;
} ;

dfBorder.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * color2 property getter / setter
 */
dfBorder.prototype.setColor2 = function(color2) {
	this.color2 = color2 ;
	
	this.left.setColor2(color2) ;
	this.top.setColor2(color2) ;
	this.right.setColor2(color2) ;
	this.bottom.setColor2(color2) ;
} ;

dfBorder.prototype.getColor2 = function() {
	return this.color2 ;
} ;

/**
 * style property getter / setter
 */
dfBorder.prototype.setStyle = function(style) {
	this.style = style ;
	
	this.left.setStyle(style) ;
	this.top.setStyle(style) ;
	this.right.setStyle(style) ;
	this.bottom.setStyle(style) ;
} ;

dfBorder.prototype.getStyle = function() {
	return this.style ;
} ;

/**
 * width property getter / setter
 */
dfBorder.prototype.setWidth = function(width) {
	this.width = width ;
	
	this.left.setWidth(width) ;
	this.top.setWidth(width) ;
	this.right.setWidth(width) ;
	this.bottom.setWidth(width) ;
} ;

dfBorder.prototype.getWidth = function() {
	return this.width + df.env.unit ;
} ;

dfBorder.prototype.set = function(color, color2, style, width) {
	this.setColor(color) ;
	this.setColor2(color2) ;
	this.setStyle(style) ;
	this.setWidth(width) ;
} ; 

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * @param type   		bordertype을 지정하는 Property 입니다.  
 *                    		- 'beveljoin' : 모서리의 라인 결합 형태가 bevel형.
 *                    		- 'normal' : 박스형.
 *                    		- 'round' : 모서리가 둥근 박스형.
 *                    		- 'roundjoin' : 모서리의 라인 결합 형태가 round형.
 * @param radiusy		bordertype이 "round" 일 경우 둥근모서리의 가로 반지름 입니다. ex) 5px
 * @param leftTop 		bordertype이 "round" 일 경우 좌측 상단의 border를 라운드로 적용할지 여부 입니다. true / false
 * @param rightTop  	bordertype이 "round" 일 경우 좌측 하단의 border를 라운드로 적용할지 여부 입니다. true / false
 * @param leftBottom 	bordertype이 "round" 일 경우 좌측 하단의 border를 라운드로 적용할지 여부 입니다.true / false
 * @param rightBottom 	bordertype 이 "round" 일 경우 우측 하단의 border를 라운드로 적용할지 여부 입니다. true / false
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfBorderType = df.classutil.create() ; 

dfBorderType.prototype.initialize = function(type, radiusy, leftTop, rightTop, leftBottom, rightBottom){
	this.set(type, radiusy, leftTop, rightTop, leftBottom, rightBottom) ; 
} ;


/**
 * type property getter / setter
 */
dfBorderType.prototype.setType = function(type) {
	this.type = type ;
} ;

dfBorderType.prototype.getType = function() {
	return this.type ;
} ;

/**
 * radiusy property getter / setter
 */
dfBorderType.prototype.setRadiusy = function(radiusy) {
	this.radiusy = radiusy ;
} ;

dfBorderType.prototype.getRadiusy = function() {
	return this.radiusy ;
} ;

/**
 * leftTop property getter / setter
 */
dfBorderType.prototype.setLeftTop = function(leftTop) {
	this.leftTop  = leftTop ;
} ;

dfBorderType.prototype.getLeftTop = function() {
	return this.leftTop ;
} ;


/**
 * rightTop property getter / setter
 */
dfBorderType.prototype.setRightTop = function(rightTop) {
	this.rightTop  = rightTop ;
} ;

dfBorderType.prototype.getRightTop = function() {
	return this.rightTop ;
} ;

 
/**
 * leftBottom property getter / setter
 */
dfBorderType.prototype.setLeftBottom = function(leftBottom) {
	this.leftBottom  = leftBottom ;
} ;

dfBorderType.prototype.getLeftBottom = function() {
	return this.leftBottom ;
} ;

 
/**
 * rightBottom property getter / setter
 */
dfBorderType.prototype.setRightBottom = function(rightBottom) {
	this.rightBottom  = rightBottom ;
} ;

dfBorderType.prototype.getRightBottom = function() {
	return this.rightBottom ;
} ;

dfBorderType.prototype.set = function(type, radiusy, leftTop, rightTop, leftBottom, rightBottom) {
	this.setType(type) ;
	this.setRadiusy(radiusy) ; 
	this.setLeftTop(leftTop) ; 
	this.setRightTop(rightTop) ; 
	this.setLeftBottom(leftBottom) ; 
	this.setRightBottom(rightBottom) ; 
} ; 
	

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfFont 클래스
 * 
 * @param face Font 종류 값을 지정하는 Property 입니다. Font의 Face Name은 System 설정에 따르게 되며, 설치되지 않는 Font는 System이 정한 Rule에 따라 표현됩니다.
 * @param size Font 크기 값을 지정하는 Property 입니다.
 * @param type Font Type 값을 지정하는 Property 입니다. "normal" / "italic"
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfFont = df.classutil.create() ; 

dfFont.prototype.initialize = function(face, size, type){
	this.set(face, size, type) ;
} ;


/**
 * 폰트와 관련된 CSS Style 문자열을 반환한다.
 */
dfFont.prototype.getStyle = function() {
	var strStyle = "" ; 
	strStyle = strStyle + "font-family:" + this.face + ";" ;
	strStyle = strStyle + "font-size:" + this.getSize()  ;
	return strStyle ;
} ;

/**
 * face property getter / setter
 */
dfFont.prototype.setFace = function(face) {
	this.face = face ;
} ;

dfFont.prototype.getFace = function() {
	return this.face ;
} ;

/**
 * size property getter / setter
 */
dfFont.prototype.setSize = function(size) {
	this.size = size ;
} ;

dfFont.prototype.getSize = function() {
	return this.size + df.env.unit ;
} ;

/**
 * type property getter / setter
 */
dfFont.prototype.setType = function(type) {
	this.type = type ;
} ;

dfFont.prototype.getType = function() {
	return this.type ;
} ;

dfFont.prototype.set = function(face, size, type) {
	this.setFace(face) ;
	this.setSize(size) ;
	this.setType(type) ;
} ; 


 /**************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * 
  * dfGlow 클래스 border 를 강조하는 glow effect 를 지정하는 Property 입니다.
  * 
  * @param color 	glow의 색을 설정하는 프로퍼티 입니다.
  * @param factor	Component의 border 를 강조하는 glow effect 를 지정하는 Property 입니다.
  * @return
  * 
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  */

var dfGlow = df.classutil.create() ; 

dfGlow.prototype.initialize = function(color, factor){
	 this.set(color, factor) ; 
} ;

/**
 * type property getter / setter
 */
dfGlow.prototype.setColor = function(color) {
	 this.color = color ;
 } ;
 
 dfGlow.prototype.getColor = function() {
	 return this.color ;
 } ;
 
 
/**
 * type property getter / setter
 */
 dfGlow.prototype.setFactor = function(factor) {
	 this.factor = factor ;
 } ;
 
 dfGlow.prototype.setFactor = function() {
	 return this.factor ;
 } ;
 
 
 dfGlow.prototype.set = function(color, factor) {
	 this.setColor(color) ; 
	 this.setFactor(factor) ; 
 } ;
 
 
 /**************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * 
  * dfGradation 클래스
  * 
  * 
  * @param style 		배경영역에 대해서 gradation style을 지정하는 Property 입니다 
  * 						- 'linear' : 선형 gradation.
  * 						- 'none' : gradation을 적용하지 않음.
  * 						- 'radial' : 원형 gradation.
  * @param startColor 	gradation 시작 Color
  * @param startX 		gradation 시작 위치 : nX % : 시작 x 비율
  * @param startY 		gradation 시작 위치 : nY % : 시작 y 비율
  * @param endColor		gradation 종료 Color
  * @param endX			gradation 종료 위치 : nX % : 종료 x 비율
  * @param endY			gradation 종료 위치 : nY % : 종료 y 비율
  * @param peglistColor	gradation 중간 Color : 생략가능,복수반복
  * @param peglistMiddle gradation 중간 위치 생략가능,복수반복 / nMiddle % : 중간 비율
  * @return
  * 
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  * ************************************************************************************************************************************
  */
 var dfGradation = df.classutil.create() ; 

 dfGradation.prototype.initialize = function(style, startColor, startX, startY, endColor, endX, endY, peglistColor, peglistMiddle) {
	 this.set(style, startColor, startX, startY, endColor, endX, endY, peglistColor, peglistMiddle) ;
 } ;

 
/**
 * style property getter / setter
 */
 dfGradation.prototype.setStyle = function(style) {
	 this.style = style ;
 } ;
 
 dfGradation.prototype.getStyle = function() {
	 return this.style ;
 } ;


/**
 * startColor property getter / setter
 */
 dfGradation.prototype.setStartColor = function(startColor) {
	 this.startColor = startColor ;
 } ;
 
 dfGradation.prototype.getStartColor = function() {
	 return this.startColor ;
 } ;

 
/**
 * startX property getter / setter
 */
 dfGradation.prototype.setStartX = function(startX) {
	 this.startX = startX ;
 } ; 
 
 dfGradation.prototype.getStartX = function() {
	 return this.startX ;
 } ; 


/**
 * startY property getter / setter
 */
 dfGradation.prototype.setStartY = function(startY) {
	 this.startY = startY ; 
 } ; 
 
 dfGradation.prototype.getStartY = function() {
	 return this.startY ; 
 } ; 


 /**
 * endColor property getter / setter
 */
 dfGradation.prototype.setEndColor = function(endColor) {
	 this.endColor = endColor ;
 } ;
 
 dfGradation.prototype.getEndColor = function() {
	 return this.endColor ;
 } ;

 
 
/**
 * endX property getter / setter
 */
 dfGradation.prototype.setEndX = function(endX) {
	 this.endX = endX ;
 } ; 
 
 dfGradation.prototype.getEndX = function() {
	 return this.endX ;
 } ; 

 
/**
 * endY property getter / setter
 */
 dfGradation.prototype.setEndY = function(endY) {
	 this.endY = endY ;
 } ; 
 
 dfGradation.prototype.getEndY = function() {
	 return this.endY ;
 } ; 


 /**
 * peglistColor property getter / setter
 */
 dfGradation.prototype.setPeglistColor = function(peglistColor) {
	 this.peglistColor = peglistColor ;
 } ; 
 
 dfGradation.prototype.getPeglistColor = function() {
	 return this.peglistColor ;
 } ; 

 
/**
 * peglistMiddle property getter / setter
 */
 dfGradation.prototype.setPeglistMiddle = function(peglistMiddle) {
	 this.peglistMiddle = peglistMiddle ;
 } ; 
 
 dfGradation.prototype.getPeglistMiddle = function() {
	 return this.peglistMiddle ;
 } ; 
 
 
 dfGradation.prototype.set = function(style, startColor, startX, startY, endColor, endX, endY, peglistColor, peglistMiddle) {
	 this.setStyle(style) ;
	 this.setStartColor(startColor) ;
	 this.setStartX(startX) ;
	 this.setStartY(startY) ;
	 this.setEndColor(endColor) ;
	 this.setEndX(endX) ;
	 this.setEndY(endY) ;
	 this.setPeglistColor(peglistColor) ;
	 this.setPeglistMiddle(peglistMiddle) ;
 } ;
 


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfLocation Class 위치하는 방식을 지정하는 Property 입니다.
 * 
 * @param location
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
 var dfFillbrush = df.classutil.create() ; 

 dfFillbrush.prototype.initialize = function(antialiasing, color, style) {
	this.set(antialiasing, color, style) ; 
 } ;

/**
 * antialiasing property getter / setter
 */
dfFillbrush.prototype.setAntialiasing = function(antialiasing) {
	this.antialiasing = antialiasing ;
} ;

dfFillbrush.prototype.getAntialiasing = function() {
	this.antialiasing ;
} ;

/**
 * color property getter / setter
 */
dfFillbrush.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfFillbrush.prototype.getColor = function() {
	this.color ;
} ;

/**
 * style property getter / setter
 */
dfFillbrush.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfFillbrush.prototype.getStyle = function() {
	this.style ;
} ;


dfFillbrush.prototype.set = function(antialiasing, color, style) {
	 this.setAntialiasing(antialiasing) ;
	 this.setColor(color) ;
	 this.setStyle(style) ;
} ;

 
/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfLocation Class 위치하는 방식을 지정하는 Property 입니다.
 * 
 * @param location
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
 var dfLocation = df.classutil.create() ; 

 dfLocation.prototype.initialize = function(location) {
	this.set(location) ; 
 } ;

/**
 * location property getter / setter
 */
 dfLocation.prototype.setLocation = function(location) {
	this.location = location ;
} ;

dfLocation.prototype.getLocation = function() {
	this.location ;
} ;

dfLocation.prototype.set = function(location) {
	this.setLocation(location) ; 
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfMargin 클래스 위치하는 영역에서의 margin을 지정하는 Property 입니다.
 * 
 * @param top		상단 margin 값 입니다.
 * @param left		좌측 margin 값 입니다.
 * @param bottom	하단 margin 값 입니다.
 * @param right		우측 margin 값 입니다.
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfMargin = df.classutil.create() ; 

dfMargin.prototype.initialize = function(left, top, right, bottom) {
	this.set(left, top, right, bottom) ;
} ;


/**
 * left property getter / setter
 */
dfMargin.prototype.setLeft = function(left) {
	this.left = left ;
} ;

dfMargin.prototype.getLeft = function() {
	return this.left  + df.env.unit ;
} ;

/**
 * top property getter / setter
 */
dfMargin.prototype.setTop = function(top) {
	this.top = top ;
} ;

dfMargin.prototype.getTop = function() {
	return this.top + df.env.unit ;
} ;

/**
 * right property getter / setter
 */
dfMargin.prototype.setRight = function(right) {
	this.right = right ;
} ;

dfMargin.prototype.getRight = function() {
	return this.right + df.env.unit ;
} ;

/**
 * bottom property getter / setter
 */
dfMargin.prototype.setBottom = function(bottom) {
	this.bottom = bottom ;
} ;

dfMargin.prototype.getBottom = function() {
	return this.bottom  + df.env.unit ;
} ;

dfMargin.prototype.set = function(left, top, right, bottom) {
	this.setLeft(left) ;
	this.setTop(top) ;
	this.setRight(right) ;
	this.setBottom(bottom) ;
} ;
 

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfPadding 클래스 text에 대한 padding을 지정하는 Property 입니다.
 * 
 * @param left		좌측 여백 입니다.
 * @param top		상단 여백 입니다.
 * @param right		우측 여백 입니다.
 * @param bottom 	하단 여백 입니다.
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfPadding = df.classutil.create() ; 

dfPadding.prototype.initialize = function(left, top, right, bottom){
	this.set(left, top, right, bottom) ;
} ;

/**
 * left property getter / setter
 */
dfPadding.prototype.setLeft = function(left) {
	this.left = left ;
} ;

dfPadding.prototype.getLeft = function() {
	return this.left  + df.env.unit ;
} ;

/**
 * top property getter / setter
 */
dfPadding.prototype.setTop = function(top) {
	this.top = top ;
} ;

dfPadding.prototype.getTop = function() {
	return this.top + df.env.unit ;
} ;

/**
 * right property getter / setter
 */
dfPadding.prototype.setRight = function(right) {
	this.right = right ;
} ;

dfPadding.prototype.getRight = function() {
	return this.right + df.env.unit ;
} ;

/**
 * bottom property getter / setter
 */
dfPadding.prototype.setBottom = function(bottom) {
	this.bottom = bottom ;
} ;

dfPadding.prototype.getBottom = function() {
	return this.bottom  + df.env.unit ;
} ;

dfPadding.prototype.set = function(left, top, right, bottom) {
	this.setLeft(left) ;
	this.setTop(top) ;
	this.setRight(right) ;
	this.setBottom(bottom) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfBrush 클래스 출력할 Brush를 지정하는 Property 입니다.
 * 
 * @param antialiasing 영역 내부를 채울시 채운부분의 antialiasing 여부를 적용합니다.
 * @param color		   영역 내부 색상을 설정합니다.
 * @param style		   영역 내부 무늬종류를 설정합니다.	
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfBrush = df.classutil.create() ; 

dfBrush.prototype.initialize = function(antialiasing, color, style){
	this.set(antialiasing, color, style) ; 
} ;

/**
 * antialiasing property getter / setter
 */
dfBrush.prototype.setAntialiasing = function(antialiasing) {
	this.antialiasing = antialiasing ;
} ;

dfBrush.prototype.getAntialiasing = function() {
	return this.antialiasing ;
} ;

/**
 * color property getter / setter
 */
dfBrush.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfBrush.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * style property getter / setter
 */
dfBrush.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfBrush.prototype.getStyle = function() {
	return this.style ;
} ;


dfBrush.prototype.set = function(antialiasing, color, style) {
	this.setAntialiasing(antialiasing) ;
	this.setColor(color) ;
	this.setStyle(style) ;
} ;
	

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfHatch 클래스 hatch 정보를 설정하는 Property 입니다.
 * 
 * @param color		   빗금의 색상을 지정합니다.
 * @param style		   빗금의 무늬를 지정합니다.	
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfHatch = df.classutil.create() ; 

dfHatch.prototype.initialize = function(color, style){
	this.set(color, style) ;
} ;

/**
 * color property getter / setter
 */
dfHatch.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfHatch.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * style property getter / setter
 */
dfHatch.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfHatch.prototype.getStyle = function() {
	return this.style ;
} ;


dfHatch.prototype.set = function(color, style) {
	this.setColor(color) ;
	this.setStyle(style) ;
} ;
	

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfStrokePen 클래스 stroke에 대한 속성을 설정하는 Property 입니다.
 * 
 * @param antialiasing stroke 를 antialias 를 적용하여 그릴지를 지정합니다.
 * @param color		   stroke 의 색상을 지정합니다.
 * @param style		   stroke 의 종류를 지정합니다.
 * @param width		   stroke 의 두께를 지정합니다.
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfStrokePen = df.classutil.create() ; 

dfStrokePen.prototype.initialize = function(antialiasing, color, style, width) {
	this.set(antialiasing, color, style, width) ;
} ;


/**
 * antialiasing property getter / setter
 */
dfStrokePen.prototype.setAntialiasing = function(antialiasing) {
	this.antialiasing = antialiasing ;
} ;

dfStrokePen.prototype.getAntialiasing = function() {
	return this.antialiasing ;
} ;

/**
 * color property getter / setter
 */
dfStrokePen.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfStrokePen.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * style property getter / setter
 */
dfStrokePen.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfStrokePen.prototype.getStyle = function() {
	return this.style ;
} ;

/**
 * width property getter / setter
 */
dfStrokePen.prototype.setWidth = function(width) {
	this.width = width ;
} ;

dfStrokePen.prototype.getWidth = function() {
	return this.width ;
} ;

dfStrokePen.prototype.set = function(antialiasing, color, style, width) {
	this.setAntialiasing(antialiasing) ;
	this.setColor(color) ;
	this.setStyle(style) ;
	this.setWidth(width) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfStyle Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfStyle = df.classutil.create() ; 

dfStyle.prototype.initialize = function(){
	this.accessibility = new dfAccessbility("", false, "", "") ;
	this.aligh = new dfAlign("center", "left") ;
	this.background = new dfBackground(true, "white", "", "", new dfPosition("relative", 0, 0, 0, 0), false) ;
	this.blur = 0 ; //  흐림효과 (Blurring) 를 지정하는 Property 입니다. nBlur 값이 커질수록 많이 흐려지며 0 이하의 값은 0 으로 처리됩니다.
	this.border = new dfBorder("black", "black", "solid", 1) ;
	this.borderType = new dfBorderType("normal", 0, false, false, false, false) ;
	this.color = "black" ;			//text에 대한 color를 지정하는 Property 입니다.
	this.cursor = "defalut" ;
	this.font = new dfFont("Times New Roman", 10, "normal") ; 
	this.glow = new dfGlow("transparent", 0) ;
	this.gradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ;
	this.hideeffect = "" ;
	this.location = new dfLocation("top, center") ;
	
	this.margin = new dfMargin(0, 0, 0, 0) ;
	this.padding = new dfPadding(2, 2, 2, 2) ;
	
	this.mouseentereffect = "" ;
	this.mouseleaveeffect = "" ;
	this.moveeffect = "" ; 
	
	this.opacity = 100 ; 
	
	this.shadow = "" ;
	
	this.transformation = "" ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 *
 * dfTooltip Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfTooltip = df.classutil.create() ; 

dfTooltip.prototype.initialize = function(){
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfData Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfData = df.classutil.create() ; 

dfData.prototype.initialize = function(name, value){
	this.name = "" ;
	this.value = "" ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfMainframe Class
 * 
 * dfMainframe 클래스는 <div> 를 기본 HTML element로 하며, Cavas를 오브젝트를 생성하고 관리한다.
 * 특별한 형태의 container라고 할 수 있는 dfFrame은 최상위 컨테이너로써 이벤트 처리, Canvas 오브젝트 관리를 기본 목적으로 한다.   

 * @param name
 * @param left
 * @param top
 * @param right
 * @param bottom
 * @return
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfMainframe = df.classutil.create(dfControl) ; 

dfMainframe.prototype.initialize = function(name, left, top, right, buttom) {
	dfControl.prototype.initialize.call(this) ; 
	this.init(name, left,top, right, buttom) ;

	this.parentObj = null ;
	this.canvas = null ;
	 
	this.e = df.$c("div") ; // HTML element 를 하나 만든다.
	this.e.id = name ; 
	
	this.canvasName = name + "_canvas" ; 
	this.canvas = new dfCanvas(this.e,this.canvasName, 0, 0, this.position.width, this.position.height) ;
	this.graphics = new dfCanvasGraphics(this.canvas) ;

	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	this.applyStyle() ;
	this.species = "dfMainframe" ;
	
	//alert("dfMainframe.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**
 * parentObj property setter / getter
 */
dfMainframe.prototype.setParentHTMLObject = function(obj) {
	this.parentObj = obj ;
	this.parentObj.appendChild(this.e) ;
} ;

dfMainframe.prototype.getParentHTMLObject = function() {
	return this.parentObj = obj ;
} ;

/**
 * graphics property setter / getter
 */
dfMainframe.prototype.getGraphics = function() {
	return this.graphics ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfMainframe.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfMainframe.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(1) ;
} ;

dfMainframe.prototype.initFontStyle = function() {
} ;

dfMainframe.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfMainframe.prototype.applyBackgorundStyle = function() {
	this.e.style.backgroundColor = this.style.background.getColor() ;
} ;

dfMainframe.prototype.applyBorderStyle = function() {
	//this.e.style.borderStyle = this.style.border.getStyle() ;
	//this.e.style.borderWidth = this.style.border.getWidth() ;
	//this.e.style.borderColor = this.style.border.getColor() ;
	this.e.style.borderLeftStyle = this.style.border.left.getStyle() ; 
	this.e.style.borderLeftWidth = this.style.border.left.getWidth() ; 
	this.e.style.borderLeftColor = this.style.border.left.getColor() ; 
	
	this.e.style.borderTopStyle = this.style.border.top.getStyle() ; 
	this.e.style.borderTopWidth = this.style.border.top.getWidth() ; 
	this.e.style.borderTopColor = this.style.border.top.getColor() ; 

	this.e.style.borderRightStyle = this.style.border.right.getStyle() ; 
	this.e.style.borderRightWidth = this.style.border.right.getWidth() ; 
	this.e.style.borderRightColor = this.style.border.right.getColor() ; 

	this.e.style.borderBottomStyle = this.style.border.bottom.getStyle() ; 
	this.e.style.borderBottomWidth = this.style.border.bottom.getWidth() ; 
	this.e.style.borderBottomColor = this.style.border.bottom.getColor() ; 
} ;

dfMainframe.prototype.applyFontStyle = function() {
} ;

dfMainframe.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfMainframe.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 *
 * dfLabel Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfLabel = df.classutil.create(dfControl) ; 

dfLabel.prototype.initialize = function(name, left, top, right, bottom){
	
	dfControl.prototype.initialize.call(this) ; 
	
	this.e = df.$c("div") ;
	this.e.id = name ; 
	
	this.inner = df.$c("div") ;
	this.inner.id = name + "__inner__" ; 
		
	this.label = df.$t("") ;
	this.label.id = name + "__text__" ;
	
	this.init(name, left, top, right, bottom) ;
	 
	this.initStyle() ;
	this.applyStyle() ;
	this.applyPosition() ;
	
	this.text = ""  ;
	

	this.e.appendChild(this.inner) ;
	this.inner.appendChild(this.label) ;
	
	this.species = "dfLabel" ;
} ;


/**
 * Label의 텍스트를 설정합니다.
 */
dfLabel.prototype.setText = function(text) {
	this.text = ""  ;
	this.inner.firstChild.nodeValue = text ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfLabel.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfLabel.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(0) ;
} ;

dfLabel.prototype.initFontStyle = function() {
	this.style.font.setFace("Arial Black") ;
} ;

dfLabel.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfLabel.prototype.applyBackgorundStyle = function() {
	this.e.style.backgroundColor = this.style.background.getColor() ;
} ;

dfLabel.prototype.applyBorderStyle = function() {
	this.e.style.borderLeftStyle = this.style.border.left.getStyle() ; 
	this.e.style.borderLeftWidth = this.style.border.left.getWidth() ; 
	this.e.style.borderLeftColor = this.style.border.left.getColor() ; 
	
	this.e.style.borderTopStyle = this.style.border.top.getStyle() ; 
	this.e.style.borderTopWidth = this.style.border.top.getWidth() ; 
	this.e.style.borderTopColor = this.style.border.top.getColor() ; 

	this.e.style.borderRightStyle = this.style.border.right.getStyle() ; 
	this.e.style.borderRightWidth = this.style.border.right.getWidth() ; 
	this.e.style.borderRightColor = this.style.border.right.getColor() ; 

	this.e.style.borderBottomStyle = this.style.border.bottom.getStyle() ; 
	this.e.style.borderBottomWidth = this.style.border.bottom.getWidth() ; 
	this.e.style.borderBottomColor = this.style.border.bottom.getColor() ; 
} ;

dfLabel.prototype.applyFontStyle = function() {
	this.e.style.fontFamily = this.style.font.getFace() ;
	this.e.style.fontSize = this.style.font.getSize() ;
} ;

dfLabel.prototype.applyMiscStyle = function() {
	this.e.style.display = "table" ;
	this.inner.style.display = "table-cell" ;
	
	this.e.style.textAlign = this.style.aligh.hAligh ;
	this.inner.style.verticalAlign = this.style.aligh.vAligh ;	  	
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfLabel.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfImage Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfImage = df.classutil.create(dfControl) ; 

dfImage.prototype.initialize = function(name, left, top, right, bottom){

	dfControl.prototype.initialize.call(this) ; 

	this.style.background = "white" ;
	this.style.foreground = "black" ;

	this.style.borderColor = "black" ;
	this.style.borderStyle = "solid" ;
	this.style.borderWidth = "1px" ;
	
	this.src = "" ; 
	
	this.e = df.$c("img") ;
	
	this.init(name, left, top, right, bottom) ; 
	this.species = "dfImage" ;
} ;

dfImage.prototype.setSrc = function(src) {
	this.e.src = src ;
} ;




/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfShape Class
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfShape = df.classutil.create(dfControl) ; 

dfShape.prototype.initialize = function(name, left, top, right, bottom){

	dfControl.prototype.initialize.call(this) ; 

	this.init(name, left, top, right, bottom) ; 

	this.src = "" ; 
	
	this.e = df.$c("div") ;
	this.e.id = name ;
	
	this.thickness = 0 ;
	this.color = "black" ;
	this.fillColor = "white" ;
	
	/**
	 * Shape의 스타일 종류 입니다.
	 */
	this.type = 0 ;
		
	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;

	this.species = "dfShape" ;
} ;

/**
 * 사각형을 그립니다.
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawRect = function(thickness, lineColor, fillColor) {
	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var g = df.$f.getGraphics() ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	//g.drawRect(left, top, left + 16, top + 20, color, thickness, "yellow") ;
	g.drawRect(left, top, left + width, top + height, lineColor, thickness, fillColor) ;
}



/**
 * 사각형을 그립니다.
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawRect = function(thickness, lineColor, fillColor) {
	var g = df.$f.getGraphics() ;
	
	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	//g.drawRect(left, top, left + 16, top + 20, color, thickness, "yellow") ;
	g.drawRect(left, top, left + width, top + height, lineColor, thickness, fillColor) ;
}


/**
 * 라인이 중앙에 걸치고 크기는 영역의 절반인 사각형을 그립니다.
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawRectWithLine = function(thickness, color, fillColor) {
	var g = df.$f.getGraphics() ;

	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	g.drawLine(left, top + (height * 0.5), left + width, top + (height * 0.5),  fillColor, thickness) ;  
	g.drawRect(left + ((width / 2) / 2), 
	           top + ((height / 2) / 2), 
	           left + ((width / 2) / 2) + (width / 2), 
			   top + ((height / 2) / 2) + (height / 2), color, thickness, fillColor) ;
}

/**
 * 라인이 중앙에 걸치고 크기는 영역의 절반인 원을 그립니다.
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawCircleWithLine = function(thickness, color, fillColor) {
	var g = df.$f.getGraphics() ;

	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	g.drawLine(left, top + (height * 0.5), left + width, top + (height * 0.5),  fillColor, thickness) ; 
	g.drawCircle(left + (width / 2), 
	             top +  (height / 2), 
	             (height / 4), color, thickness, fillColor) ;
}


/**
 * 라인이 중앙에 걸치고 크기는 영역의 절반인 사각형을 그립니다.
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawTriWithLine = function(thickness, color, fillColor) {
	var g = df.$f.getGraphics() ;

	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	g.drawLine(left, top + (height * 0.5), left + width, top + (height * 0.5), fillColor, thickness) ; 
	g.drawTri(left + ((width / 2) / 2), 
	          top + ((height / 2) / 2), 
	          left + ((width / 2) / 2) + (width / 2), 
			  top + ((height / 2) / 2) + (height / 2), color, thickness, fillColor) ;
}

/**
 * 중앙에 걸치는 라인은 그립니다. 
 * 
 * @param {Object} thickness 선의 굵기
 * @param {Object} color 선 색깔
 */
dfShape.prototype.drawWithLine = function(thickness, color, fillColor) {
	var g = df.$f.getGraphics() ;

	var top = 0 ;
	var left  = 0 ;
	
	var width = this.e.clientWidth ; 
	var height = this.e.clientHeight ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	left = left + this.style.padding.left ;
	top = top + this.style.padding.top ;
	width = width - this.style.padding.left - this.style.padding.right ;
	height = height - this.style.padding.top - this.style.padding.bottom ;
	
	g.drawLine(left, top + (height * 0.5), left + width, top + (height * 0.5),  fillColor, thickness) ; 
}



/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfShape.prototype.initBackgroundStyle = function() {
} ;

dfShape.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(0) ;
} ;

dfShape.prototype.initFontStyle = function() {
} ;

dfShape.prototype.initMiscStyle = function() {
	this.style.padding.set(2, 2, 2, 2) ; 
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfShape.prototype.applyBackgorundStyle = function() {
} ;

dfShape.prototype.applyBorderStyle = function() {
	this.e.style.borderLeftStyle = this.style.border.left.getStyle() ; 
	this.e.style.borderLeftWidth = this.style.border.left.getWidth() ; 
	this.e.style.borderLeftColor = this.style.border.left.getColor() ; 
	
	this.e.style.borderTopStyle = this.style.border.top.getStyle() ; 
	this.e.style.borderTopWidth = this.style.border.top.getWidth() ; 
	this.e.style.borderTopColor = this.style.border.top.getColor() ; 

	this.e.style.borderRightStyle = this.style.border.right.getStyle() ; 
	this.e.style.borderRightWidth = this.style.border.right.getWidth() ; 
	this.e.style.borderRightColor = this.style.border.right.getColor() ; 

	this.e.style.borderBottomStyle = this.style.border.bottom.getStyle() ; 
	this.e.style.borderBottomWidth = this.style.border.bottom.getWidth() ; 
	this.e.style.borderBottomColor = this.style.border.bottom.getColor() ; 
} ;

dfShape.prototype.applyFontStyle = function() {
} ;

dfShape.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfShape.prototype.applyPosition = function() {
	this.e.style.position = this.position.getPosition() ;
	
	this.e.style.top = this.position.getTop() ;
	this.e.style.left = this.position.getLeft() ;
	this.e.style.width = this.position.getWidth();
	this.e.style.height = this.position.getHeight();
} ;
