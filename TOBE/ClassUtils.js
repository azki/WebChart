/**
 * @author azki
 */
TOBE.ClassUtils = {};

TOBE.ClassUtils.create = function() {
	var meIndex = arguments.length - 1;
	var _class = function() {
		this.initialize.apply(this, arguments);
	};
	if (meIndex > -1) {
		var proto = _class.prototype = arguments[meIndex];
		var m, i, _super;
		for (i = meIndex - 1; i >= 0; --i) {
			_super = arguments[i];
			if (_super.constructor == Function) {
				_super = _super.prototype;
			}
			if (_super._isConst) {
				for (m in _super) {
					if ("_isConst" != m) {
						_class[m] = proto[m] = _super[m];
					}
				}
			}
			else {
				for (m in _super) {
					if (m in proto) {
						if (proto[m] && proto[m].constructor == Function) {
							proto[m]._super = _super[m];
						}
					}
					else {
						proto[m] = _super[m];
					}
				}
			}
		}
	}
	_class._isClass = true;
	return _class;
};

TOBE.ClassUtils.makeMembers = function(varsObj) {
	if (! varsObj) return;
	var result = {};
	var baseGetSetFunction = function(obj, varName, functionNameBody, needApplyEvent) {
		var _setFunctionName = "_set"+functionNameBody;
		var _obtainFunctionName = "_obtain"+functionNameBody;
		var __obtainFunctionName = "__obtain"+functionNameBody;
		obj[_obtainFunctionName] = function(){
			if (this[__obtainFunctionName] != TOBE.emptyFn) {
				this[_setFunctionName](this[__obtainFunctionName]());
			}
		};
		obj[__obtainFunctionName] = TOBE.emptyFn;
		var _getFunctionName = "_get"+functionNameBody;
		obj[_getFunctionName] = function() {
			return this[varName];
		};
		obj["get"+functionNameBody] = function() {
			this[_obtainFunctionName]();
			return this[_getFunctionName]();
		};
		var _applyFunctionName = "_apply"+functionNameBody;
		obj["set"+functionNameBody] = function(v) {
			this[_setFunctionName](v);
			this[_applyFunctionName]();
		};
		if (needApplyEvent) {
			typesGetSetFunctions.eventVars(
				obj, 
				"onapply"+functionNameBody, 
				"Onapply"+functionNameBody, 
				null
			);
			//[[[ _apply
			var __applyFunctionName = "__apply"+functionNameBody;
			var _fireApplyFunctionName = "_fireApply"+functionNameBody+"Event";
			var _fireApplyFunctionArg = {
				name: varName
			};
			obj["_apply"+functionNameBody] = function() {
				this[__applyFunctionName]();
				if (this._rendered && this[_fireApplyFunctionName]) {
					this[_fireApplyFunctionName](_fireApplyFunctionArg);
				}
			};
			//]]] _apply
			//[[[ __apply
			var _an_applyFunctionName = "_an_apply"+functionNameBody;
			obj["__apply"+functionNameBody] = function() {
				if (this._isWidget == null) return;
				var array = this._getApplyElements(functionNameBody);
				var value = this._getStyleOrProperty(varName);
				for (var i = 0, item; item = array[i]; ++i) {
					if (item._isWidget) 
						this._linkObjectsFunction(item, functionNameBody, value);
					else 
						if (this[_an_applyFunctionName]) 
							this[_an_applyFunctionName](item, value);
				}
			};
			//]]] __apply
		}
	};
	var typesGetSetFunctions = {
		booleanVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				return this[varName] == true;
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = v == true;
			};
		}
		,
		intVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				return this[varName] != null && isFinite(this[varName])? +this[varName]: 0;
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = v != null && isFinite(v)? +v: 0;
			};
		}
		,
		uintVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				return (isFinite(this[varName]) && this[varName] > 0)? +this[varName]: 0;
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = (isFinite(v) && v > 0)? +v: 0;
			};
		}
		,
		nullableStringVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				var v = this[varName];
//				if (v == null) return null;
//				return v.constructor == String? v: (isFinite(v)? ""+v: "");
//			};
			obj["_set"+functionNameBody] = function(v) {
				if (v == null) {
					this[varName] = null;
				}
				else {
					this[varName] = v.constructor == String? v: (isFinite(v)? ""+v: "");
				}
			};
		}
		,
		stringVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				var v = this[varName];
//				return v != null && v.constructor == String? v: (v != null && isFinite(v)? ""+v: ""); 
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = v != null && v.constructor == String? v: (v != null && isFinite(v)? ""+v: "");
			};
		}
		,
		styleVars: function(obj, varName, functionNameBody, defaultVar) {
			typesGetSetFunctions.stringVars.apply(null, arguments);
			obj["_isStyle_"+functionNameBody] = true;
		}
		,
		objectVars: function(obj, varName, functionNameBody) {
			baseGetSetFunction(obj, varName, functionNameBody, true);
//			obj["_get"+functionNameBody] = function() {
//				return this[varName];
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = v;
			};
		}
		,
		eventVars: function(obj, varName, functionNameBody, elementVar) {
			var eventName = varName.substr(0, 2) == "on"? varName.substr(2): varName; // -"on"
			baseGetSetFunction(obj, varName, functionNameBody, false);
//			obj["_get"+functionNameBody] = function() {
//				return this[varName];
//			};
			obj["_set"+functionNameBody] = function(v) {
				this[varName] = v;
			};
			var _getFunctionName = "_get"+functionNameBody;
			var excuteFunctionName = "excute"+functionNameBody;
			obj[excuteFunctionName] = function(obj, e) {
				TOBE.$ef(eventName, obj, e);
			};
			obj["_apply"+functionNameBody] = function() {
				var func = this[_getFunctionName]();
				var bindedDOM1FunctionName = "__event_bindedDOM1Function_"+eventName;
				if ((func == "" || func == null) && this[bindedDOM1FunctionName] != null) {
						this.removeEventListener(eventName, this[bindedDOM1FunctionName]);
						this[bindedDOM1FunctionName] = null;
				}
				else {
					if (this[bindedDOM1FunctionName] == null) {
						this[bindedDOM1FunctionName] = this[excuteFunctionName];
						this.addEventListener(eventName, this[bindedDOM1FunctionName]);
					}
				}
			}
			var eventCallbackFunctionName = "_event_"+eventName;
			var fireEventFunctionName = "_fire"+eventName.charAt(0).toUpperCase()+eventName.substr(1)+"Event";
			obj[eventCallbackFunctionName] = function(e) {
				this[fireEventFunctionName](e);
			};
			obj[fireEventFunctionName] = function(e) {
				//TODO: Widget 모두 상속 받으면 제거.
				if (this._fireEvent) 
					this._fireEvent(eventName, this, e);
			};
			
			if (elementVar == null) return;
			TOBE.ClassUtils.makeMembers.makeEventObserveFunction(obj, eventName, elementVar);
			obj[varName] = null;//event default value is null
		}
	};
	
	//code start->
	for (var typeName in typesGetSetFunctions) {
		var loopObj = varsObj[typeName];
		for (var varName in loopObj) {
			var firstChar = varName.charAt(0);
			result[varName] = loopObj[varName];//default value
			if (firstChar != "_") {
				typesGetSetFunctions[typeName](result, varName, firstChar.toUpperCase() + varName.substr(1), loopObj[varName]);
			}
		}
	}

	return result;
};

TOBE.ClassUtils.makeMembers.makeEventObserveFunction = function(obj, eventName, elementVar, realEventName) {
	var eventCallbackFunctionName = "_event_"+eventName;
	var observeFunctionName = "_eventListen_"+eventName;
	var stopObserveFunctionName = "_eventStop_"+eventName;
	var bindedDOM2FunctionName = "__event_bindedDOM2Function_"+eventName;
	
	obj[observeFunctionName] = function() {
		if (this[bindedDOM2FunctionName] == null)
			this[bindedDOM2FunctionName] = this[eventCallbackFunctionName]._tobeBind(this);
		this._eventObserve(
			this[elementVar], 
			realEventName? realEventName: eventName, 
			this[bindedDOM2FunctionName]
		);
	};
	
	obj[stopObserveFunctionName] = function() {
		this._eventStopObserving(
			this[elementVar], 
			realEventName? realEventName: eventName, 
			this[bindedDOM2FunctionName]
		);
	};
};