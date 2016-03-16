/**
 * EventListenerList 
 * 이벤트 콜백을 관리하는 클래스이다
 * @author azki
 * @version 2007121817
 */
TOBE.EventListenerList = TOBE.ClassUtils.create(
/*no extends*/
TOBE.ClassUtils.makeMembers({
	objectVars: {
		_eventList: null
	}
})
,
{
	/**
	 * TOBE.EventListenerList
	 * @constructor
	 */
	initialize: function() {
		this._eventList = {};
	}
	,
	addListener: function(type, func) {
		if (type in this._eventList) {
			this._eventList[type].push(func);
		}
		else {
			this._eventList[type] = [func]; // array
		}
	}
	,
	clearListener: function(type){
		var beforeLength = 0;
		if (type in this._eventList) {
			beforeLength = this._eventList[type].length;
			this._eventList[type] = [];
		}
		return beforeLength;
	}
	,
	removeListener: function(type, func) {
		var eventList = this._eventList[type];
		if (!eventList) {
            return 0;
        }
		if (func && func.f) {
            for (var i = eventList.length - 1; i >= 0; i--) {
                // length-1 ~ 0 (descending) because array length--;
                if (eventList[i].obj == func.obj && eventList[i].fn == func.fn) {
                    eventList.splice(i, 1); // remove array member
                    break;
                }
            }
		}
		else {
            for (var i = eventList.length - 1; i >= 0; i--) {
                // length-1 ~ 0 (descending) because array length--;
                if (eventList[i] == func) {
                    eventList.splice(i, 1); // remove array member
                    break;
                }
            }
		}
		return eventList.length;
	}
	,
	getListeners: function(type) {
		return this._eventList[type];
	}
	,
	getListenerCount: function(type) {
		return (type in this._eventList)? this._eventList[type].length: 0;
	}
});
