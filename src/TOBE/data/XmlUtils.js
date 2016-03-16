/**
 * TOBE.data.XmlUtils
 */
TOBE.data.XmlUtils = {
	findNode: function(parent, nodeType, fromEnd) {
		if (parent) {
			var children = parent.childNodes;
			if (children) {
				var child, i, len = children.length;
				if (fromEnd) {
					for (i = len - 1; i >= 0; --i) {
						child = children.item(i);
						if (child.nodeType == nodeType) {
							return child;
						}
					}
				}
				else {
					for (i = 0; i < len; ++i) {
						child = children.item(i);
						if (child.nodeType == nodeType) {
							return child;
						}
					}
				}
			}
		}
		return null;
	}
	,
	getFirstChildElement: function(parent) {
		return this.findNode(parent, 1);
	}
	,
	getLastChildElement: function(parent) {
		return this.findNode(parent, 1, true);
	}
	,
	getChildText: function(parent) {
		var node = this.findNode(parent, 3);
		return node? node.data: "";
	}
	,
	parseDocument: function(str) {
		if (window.DOMParser) {
			return (new DOMParser()).parseFromString(str, "text/xml");
		}
		else {
			var doc = new ActiveXObject("MSXML2.DOMDocument");
			doc.async = false;
			doc.loadXML(str);
			return doc;
		}
	}
	,
	documentToXml: function(document) {
		if ("xml" in document) {
			return document.xml;
		}
		else {
			if (window.XMLSerializer) {
				return (new XMLSerializer()).serializeToString(document);
			}
		}
		return "";
	}
}
