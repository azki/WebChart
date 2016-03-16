
TOBE.lang = TOBE.lang || {

	extend: function(subc, superc, overrides) {
		if (! superc || ! subc) {
			throw new Error("TOBE.lang.extend failed, please check that "
				+ "all dependencies are included.");
		}
		
		var F = function() { };
		F.prototype = superc.prototype;
		subc.prototype = new F();
		subc.prototype.constructor = subc;
		subc.superclass = superc.prototype;
		if (superc.prototype.constructor == Object.prototype.constructor) {
			superc.prototype.constructor = superc;
		}
		
		if (overrides) {
			for (var i in overrides) {
				subc.prototype[i] = overrides[i];
			}
			
//			TOBE.lang._IEEnumFix(subc.prototype, overrides);
		}
	}
};

TOBE.lang.IllegalArgumentError = function(message) {
	
//	arguments.callee.superclass.constructor.apply(this, "IllegalArgumentError: " + message);
	
	this.name = "IllegalArgumentError";

	//alert(message);
}

TOBE.lang.extend(TOBE.lang.IllegalArgumentError, Error);

TOBE.lang.IndexOutOfBoundsError = function(message) {
	
//	arguments.callee.superclass.constructor.apply(this, "IndexOutOfBoundsError: " + message);
	
	this.name = "IndexOutOfBoundsError";

	//alert(message);
}

TOBE.lang.extend(TOBE.lang.IndexOutOfBoundsError, Error);
