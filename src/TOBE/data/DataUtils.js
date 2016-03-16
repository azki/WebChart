/**
 * @fileOverview
 *
 * @author Choi, Jongkwan
 */

/**
 * @class <p>string에 관련된 유용한 함수의 집합이다.
 *
 * @constructor
 */
TOBE.data.StringUtils = {

    /**
     * 문자열을 치환한다.
     *
     * @param {string} str string
     * @param {string} orgStr 치환될 string
     * @param {string} repStr 치환할 string
     * @return {string} 치환된 문자열
     */
    replaceAll: function(/* string */str, /* string */orgStr, /* string */repStr) {
		return str.split(orgStr).join(repStr);
//		for ie performance
//		return str.replace (new RegExp(orgStr, "g"), repStr);
    },

    /**
     * 앞뒤의 공백을 제거한다.
     *
     * @param {string} text string
     * @param {string} direction string (both:양측모두 제거, left:좌측공백제거, right:우측공백제거)
     * @return {string} 앞뒤의 공백이 제거된 string
     */
    trim: function(/* string */text, direction) {
        
        var rtnValue = text;
		
		if (direction && direction != "both") {
			var checkFlag = false;
			var textChars = [];
			if (direction == "right") {
				for (var i = text.length - 1; i >= 0; --i) {
					var charOfText = text.charAt(i);
					if(charOfText != ' ') {
						checkFlag = true;
					}
					if (checkFlag) {
						textChars.unshift(charOfText);
					}
				}
			} else {
				for (var i = 0; i < text.length; ++i) {
					var charOfText = text.charAt(i);
					if(charOfText != ' ') {
						checkFlag = true;
					}
					if (checkFlag) {
						textChars.push(charOfText);
					}	
				}
			}
			rtnValue = textChars.join("");
		} else {
			rtnValue = (text || "").replace(/^\s+|\s+$/g, "");
		}
        
        return rtnValue;
    },

    /**
     * undefined, null 또는 빈 string 여부를 검사한다.
     *
     * @param {string} str string
     * @return {boolean} undefined, null 또는 빈 string 여부
     */
    isEmpty: function(/* string */str) {
        return (str == null || str == "");
    },
    
    /**
     * getTextSize
     * text가 보여지는 사이즈를 계산한다.
     * @param {string} text 값
     * @return {[int,int]} [width, height]
     */    
    getTextSize: function(text, fontName, fontSize, fontBold, fontItalic, fontUnderline, fontStrikeout) {
		var textHeight = 0;
        var textWidth = 0;
        
        if (text && text.length > 0) {
            var preTag = TOBE.$c("pre");
            var textTag = TOBE.$t(text);
            
			TOBE.$s(preTag, "position", "absolute");
            TOBE.$s(preTag, "top", "-500px");
            TOBE.$s(preTag, "left", "-500px");
			
			TOBE.$s(preTag, "fontFamily", fontName);
			TOBE.$s(preTag, "fontSize", fontSize ? fontSize + "pt" : "");
			TOBE.$s(preTag, "fontWeight", fontBold ? "bold" : "");
			TOBE.$s(preTag, "fontStyle", fontItalic ? "italic" : "");
			TOBE.$s(preTag, "textDecoration", (fontUnderline ? "underline " : "") + (fontStrikeout ? "line-through" : ""));
            
            preTag.appendChild(textTag);
            TOBE.$d.body.appendChild(preTag);
			
//            while (textWidth == 0) {
			if (textWidth == 0) {
				textHeight = TOBE.Browser.WebKit? preTag.offsetHeight - 1: preTag.clientHeight;
                textWidth = TOBE.Browser.WebKit? preTag.offsetWidth - 1: preTag.clientWidth;
            }
			
            TOBE.$d.body.removeChild(preTag);
			
			//임시) IE에서 텍스트의 real size가 부정확
			textWidth += 10;
			textHeight += 5;
			
        }
		
        return [textWidth, textHeight];
    },
    
    /**
     * null 또는 공백인 경우 디폴트값으로 리턴
     */        
    nvl: function(value, defValue) {
        
        var valueStr = value+"";
        
        if (value && TOBE.data.StringUtils.trim(valueStr).length > 0) {
            return value;
        } else {
            return defValue;
        }
        
    }
};

/**
 * @class <p>데이터에 관련된 유용한 함수의 집합이다.
 *
 * @constructor
 */
TOBE.data.DataUtils = {

    /**
     * int 여부를 검사한다.
     *
     * @param {number} value 값
     * @return {boolean} int 여부
     */
    isInt: function(/* number */value) {
        if (TOBE.Object.isNumber(value)) {
            return (value === Math.floor(value));
        } else {
            return false;
        }
    },
	
    /**
     * string을 int로 변환한다.
     *
     * @param {string} value 값
     * @param {number} def (변환 실패시의 default값)
     * @return {int} 변환 결과
     */
    parseInt: function(/* string */value, def) {
        if (value) {
			var rtnValue = parseInt(value, 10);
			if (isNaN(rtnValue)) {
				return def;
			} else {
				return rtnValue;
			}
        } else {
            return def;
        }
    }	
};