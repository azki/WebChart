/**
 * @author Sangchual CHA
 */

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartStyle Class dfChart에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartStyle = df.classutil.create(dfStyle) ; 

dfChartStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;
	 
	this.focusborder = new dfLineBorder("black", "black", "solid", 1) ;		/// Chart의 focusborder를 지정하는 Property 입니다.
	this.scrollbarsize = -1 ; 											/// Chart의 Scrollbar Size를 지정하는 Property 입니다.
	
	// 아래의 스타일은 dfChart 내부적으로 사용되는 style 입니다.
	this.chartPadding = new dfPadding(2, 2, 2, 2) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChart 클래스 
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChart = df.classutil.create(dfControl) ; 

dfChart.prototype.initialize = function(name, left, top, right, bottom) {
	dfControl.prototype.initialize.call(this) ;
	
	this.style = new dfChartStyle() ; 

	this.init(name, left, top, right, bottom) ;

	this.e = df.$c("div") ;
	this.e.id = name ;
	
	/**
	 * Chart를 구성하는 각 오브젝트의 위치를 결정하는 방법에 대해서는 각각  
	 */
	this.titlePosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.boardPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.LegendPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.axisXPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.axisYPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.axisY2Position = new dfPosition("absolute", 0, 0, 0, 0) ;
	this.scrollbarPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	
	this.viewcount = 5 ; 												/// Chart의 xaxis에서 보여지는 item의 갯수를 지정하는 Property 입니다.
	this.viewmax = 4 ; 													/// Chart의 xaxis에서 보여지는 item의 최대위치를 지정하는 Property 입니다.
	this.viewmin = 0 ; 													/// Chart의 xaxis에서 보여지는 item의 를 지정하는 Property 입니다.
	
	
	
	//this.allocateComponents(); 

	this.autofit = false ;												/// Chart의 xaxis에 대해 scroll이 발생되지 않게 모든 Series이 data가 보일수 있도록 지정하는 Property 입니다
	this.binddataset = null ; 
	this.layout = "" ; 													/// Chart 내부 구성 Layout 의 XML을 얻거나, 동적으로 설정하기 위한 Property 입니다.
	this.rotateaxis = "none" ; 											/// xaxis와 yaxis의 위치를 변화시키는 값을 지정
																		/// 	"none" : 회전시키지 않음.(default)
																		/// 	"exchange" : xaxis, yaxis이 위치를 서로 바꿈
																		/// 	"horzmirror" : yaxis와 y2axis의 위치를 서로 바꿈
																		/// 	"vertmirror" :xaxis의 위치가 상단으로 변경됨
	this.scrollmax = 0 ;												/// Chart의 xaxis Scroll의 max 값을 가지는 ReadOnly Property 입니다.
	this.scrollmin = 0 ;												/// Chart의 xaxis Scroll의 min 값을 가지는 ReadOnly Property 입니다.
	this.scrollpos = 0 ;												/// Chart의 xaxis Scroll의 값을 가지는 ReadOnly Property 입니다.
	this.scrollvisible = "none" ;										/// Chart에서 사용되는 ScrollBar의 Visible 방식을 지정하는 Property 입니다.
																		/// 	"none" : ScrollBar가 출력되지 않습니다.(default)
																		/// 	"axis" : Axis 위에 ScrollBar가 자동으로 출력됨
	this.taborder = 0 ;													/// Form 에서 Component 가 가지는 Tab 키에 따른 포커스 이동순서를 지정하는 Property 입니다.
	this.tabstop = false ; 												/// Tab 키로 포커스를 받을지 여부를 지정하는 Property 입니다.
	this.text = "" ;													/// Chart 에 보여질 값을 지정하는 Property 입니다.
		
	this.barCount = 0 ;													/// Chart에 바 그래프의 갯수
	this.lineCount = 0 ;												/// Chart에 라인 그래프의 갯수
	this.pieCount = 0 ; 												/// Chart에 파이 그래프의 갯수

	this.bars = [] ;													/// 바 그래프인 시리즈의 인덱스 배열
	this.lines = [] ;													/// 라인 그래프인 시리즈의 인덱스 배열
	this.pies = [] ; 													/// 파이 그래프인 시리즈의 인덱스 배열

	this.arrange() ;

	//
	this.title = new dfChartTitle(name + "_title",    this.titlePosition.left, this.titlePosition.top, this.titlePosition.right, this.titlePosition.bottom) ;
	this.legend = new dfChartLegend(name + "_legend", this.LegendPosition.left, this.LegendPosition.top, this.LegendPosition.right, this.LegendPosition.bottom) ;
	this.board = new dfChartBoard(name + "_board",    this.boardPosition.left, this.boardPosition.top, this.boardPosition.right, this.boardPosition.bottom) ;
	
	this.serieses = [] ;												/// Chart에 생성되어 있는 Series List를 Collection으로 가져오는 Property 입니다.

	this.xaxis = new dfChartAxis(name + "_xaxis",   this.axisXPosition.left,  this.axisXPosition.top,  this.axisXPosition.right,  this.axisXPosition.bottom) ;
	this.yaxis = new dfChartAxis(name + "_yaxis",   this.axisYPosition.left,  this.axisYPosition.top,  this.axisYPosition.right,  this.axisYPosition.bottom) ;
	this.y2axis = new dfChartAxis(name + "_y2axis", this.axisY2Position.left, this.axisY2Position.top, this.axisY2Position.right, this.axisY2Position.bottom) ;
	
	this.xaxisscroll = new dfScrollbar(name + "_xscroll", left, top, right, bottom) ;
	
	this.xaxis.type = 1 ; 
	this.yaxis.type = 3 ; 
	this.y2axis.type = 4 ; 
	
	this.seriesesMin = 0 ; 
	this.seriesesMax = 0 ; 
	
	
	// 컴퍼넌트들을 조합합니다.
	this.assemble() ;
	
	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
	
	this.species = "dfChartLegendLabel" ;
} ;

/**
 * 챠트를 예제로 그려 봅니다.
 */
dfChart.prototype.drawSampleBar = function(a) {
	
	this.board.setAxisMajorDegreePos(this.xaxis.degreesPos, this.yaxis.degreesPos, this.y2axis.degreesPos)
	
	this.board.drawSampleBar(a) ;	
	
	for(var i = 0 ; i < a.length ; i++ ) {
		this.legend.addItem(1, a[i].label, 1, "black", "solid", 1, "black", a[i].color, "solid") ;
	}	
}

/**
 * Bind 돤 Dataset을 설정한다. 
 * 
 * Chart의 전체 Series, Axis, Legend와 Bind 되는 Dataset의 ID를 설정하는 Property 입니다.
 * Dataset의 값이 변경되면 해당 Series가 변경됩니다
 * Series의 Select가 bind되어 있는 경우 해당 Select가 변경되면 Dataset의 해당 Column이 변경됩니다.
 * 
 */
dfChart.prototype.setBindDataSet = function(ds){
	if (ds != undefined && ds != null) {
		this.binddataset = ds ; 
		
		this.legend.setBindDataSet(ds) ; 
		this.board.setBindDataSet(ds) ; 
		this.xaxis.setBindDataSet(ds) ; 
		this.yaxis.setBindDataSet(ds) ; 
		this.y2axis.setBindDataSet(ds) ; 
	}	
}	

/**
 * 
 * Chart를 구성하는 컴퍼넌트들의 위치를 설정합니다.
 * 
 * 	this.titlePosition
 * 	this.boardPosition
 * 	this.LegendPosition
 * 	this.axisXPosition
 * 	this.axisYPosition
 * 	this.axisY2Position
 * 	this.scrollbarPosition
 * 
 * @return
 */
dfChart.prototype.arrange = function() {
	this.setRect() ; // Padding, Margin을 고려한 클라이언트 영역을 계산하나. 이 값은 this.rect 를 통해 참조 가능하다.
	
	this.titlePosition.setLeft(0) ;
	this.titlePosition.setTop(0) ;
	this.titlePosition.setWidth(this.rect.width) ;
	this.titlePosition.setHeight(this.rect.height * 0.3) ; 
	
	this.LegendPosition.setLeft(this.rect.width - (this.rect.width * 0.2)) ;
	this.LegendPosition.setTop(this.titlePosition.height) ;
	this.LegendPosition.setWidth(this.rect.width * 0.2) ;
	this.LegendPosition.setHeight(this.rect.height - this.titlePosition.height) ;
	
	this.axisXPosition.setLeft(0) ;
	this.axisXPosition.setTop(this.rect.height - (this.rect.height * 0.1)) ;
	this.axisXPosition.setWidth(this.rect.width * 0.8) ;
	this.axisXPosition.setHeight(this.rect.height * 0.1) ;
	
	this.axisYPosition.setLeft(0) ;
	this.axisYPosition.setTop(this.titlePosition.top + this.titlePosition.height) ;
	this.axisYPosition.setWidth(this.rect.width * 0.15) ;
	this.axisYPosition.setHeight(this.rect.height - this.titlePosition.height) ;
	
	this.boardPosition.setLeft(this.axisYPosition.left + this.axisYPosition.width) ;
	this.boardPosition.setTop(this.titlePosition.top + this.titlePosition.height) ;
	this.boardPosition.setWidth(this.axisXPosition.width - this.axisYPosition.width) ;
	this.boardPosition.setHeight(this.axisYPosition.height - this.axisXPosition.height - 2) ;
	
	// Y2 축의 visible에 따라 추가적인 처리 필요함 
}

/**
 * 
 */
dfChart.prototype.setXUnit = function(majorUnit, minorUnit) {
	this.xaxis.rulermajorunit = majorUnit ;
	this.xaxis.rulerminorunit = minorUnit ;
}

dfChart.prototype.setYUnit = function(majorUnit, minorUnit) {
	this.yaxis.rulermajorunit = majorUnit ;
	this.yaxis.rulerminorunit = minorUnit ;
}

dfChart.prototype.setY2Unit = function(majorUnit, minorUnit) {
	this.y2axis.rulermajorunit = majorUnit ;
	this.y2axis.rulerminorunit = minorUnit ;
}

/**
 * Chart를 구성하는 Object 각각에 대한 위치와 크기를 설정합니다.
 */

dfChart.prototype.allocate = function() {
	// 실제 배치 가능한 영역을 설정합니다. 크기에서 4부분의 Padding 값을 적용합니다. 
	var left = this.style.chartPadding.left ;
	var top = this.style.chartPadding.top ;
	
	var right = this.pisition.width - this.style.chartPadding.left - this.style.chartPadding.right ;
	var bottom = this.pisition.hright - this.style.chartPadding.top - this.style.chartPadding.bottom ;
	
	// 이제 각각 Object의 위치와 크기를 설정합니다. 
	// 설정하는 순서는 레젼드, 타이틀, 그래프 입니다.
	 
	if(this.title.visible) {
	}
		
	this.allocateLegend(left, top, right, bottom) ; 
	this.allocateTitle(left, top, right, bottom) ; 
	this.allocateBoard(left, top, right, bottom) ; 
	this.allocateAxis(left, top, right, bottom) ; 
} ;


/**
 * Title의 위치와 크기를 설정합니다.
 */
dfChart.prototype.allocateTitle = function(left, top, right, bottom) {
} ;

/**
 * Legend의 위치와 크기를 설정합니다.
 */
dfChart.prototype.allocateLegend = function(left, top, right, bottom) {
} ;


dfChart.prototype.allocateBoard = function(left, top, right, bottom) {
} ;

dfChart.prototype.allocateAxis = function(left, top, right, bottom) {
} ;

dfChart.prototype.setAllocaedPosition = function() {
	
} ;

dfChart.prototype.assemble = function() {
	//allocateComponents() ;
	
	this.appendChild(this.title) ;
	this.appendChild(this.legend) ;
	this.appendChild(this.board) ;
	
	this.appendChild(this.xaxis) ;
	this.appendChild(this.yaxis) ;
	this.appendChild(this.y2axis) ;
} ;

/**
 * Chart내에 그래프의 종류의 갯수를 0으로 초기화 한다.
 */
dfChart.prototype.resetChartTypeCont = function(){
	this.barCount = 0 ;
	this.lineCount = 0 ;
	this.pieCount = 0 ; 
}

/**
 * series의 type값에 따라 Chart내에 그래프의 종류의 갯수를 증가한다.  
 * @param {Object} series
 */
dfChart.prototype.updateChartTypeCont = function(series, op) {
	var valid = true ;
	
	if(series != undefined || series != null) {
		switch(series.type) {
			case "line" :
				this.lineCount = (op == undefined || op >= 0) ?  this.lineCount + 1 : this.lineCount -1 ;
				break ;
			case "bar" :
				this.barCount = (op == undefined || op >= 0) ?  this.barCount + 1 : this.barCount -1 ;
				break ;
			case "pie" :
				this.pieCount = (op == undefined || op >= 0) ?  this.pieCount + 1 : this.pieCount -1 ;
				break ;
			default:
				valid = false ;
				break ;
		}
	}
	else {
		this.resetChartTypeCont() ;
		for(var i = 0 ; i < this.serieses.length ; i++) {
			this.updateChartTypeCont(this.serieses[i], 1) ;			
		}
	}
	
	return valid ;
} 


/**
 * 시리즈를 추가합니다.
 * 
 * @param {Object} series
 */
dfChart.prototype.addSeries = function(series) {
	this.serieses.push(series) ;
	this.updateChartTypeCont(series, 1) ; 
	
	// 만일 그래프가 화면에 표시된 상태라면, 화면을 업데이트 합니다.
	//
	//
	
	return this.serieses.length ;
}

/**
 * index 위치의 시리즈 하나를 반환합니다. 
 * @param {Object} index
 */
dfChart.prototype.getSeries = function(index){
	var obj = null ; 
	if (index >= 0 && index < this.getSeriesesCount()) {
		obj = this.serieses[index] ;
	}
	return obj ;
}

/**
 * 시리즈를 갯수를 반환합니다.
 */
dfChart.prototype.getSeriesesCount = function() {
	return this.serieses.length ;
}

/**
 * 시리즈 하나를 제거합니다.
 */
dfChart.prototype.removeSeries = function(index){
	if (index >= 0 && index < this.getSeriesesCount()) {
		var obj = this.serieses.splice(index, 1) ;
		this.updateChartTypeCont(obj, -1) ;
		delete obj ;	
	}

	// 만일 그래프가 화면에 표시된 상태라면, 화면을 업데이트 합니다.
	//
	//

	return this.serieses.length ;
}

/**
 * 모든 시리즈를 제거합니다.
 */
dfChart.prototype.removeSeriesAll = function() {
	while (serieses.length > 0) {
		delete serieses.pop() ;
	}
	this.resetChartTypeCont() ; 

	// 만일 그래프가 화면에 표시된 상태라면, 화면을 업데이트 합니다.
	//
	//
}

/**
 * 각 시리즈 중에서의 최대값과 최소값을 0으로 초기화 한다. 
 */
dfChart.prototype.resetSeriesesMinMax = function(){
	this.seriesesMin = 0 ; 
	this.seriesesMax = 0 ; 
} ;	

/**
 * 각 시리즈 중에서의 최대값과 최소값을 얻어 온다ㅣ. 
 */
dfChart.prototype.getSeriesesMinMax = function() {
	var max = Number.MIN_VALUE ;
	var min = Number.MAX_VALUE ;
	
	// 각각의 시리즈에 대해, 최대값, 최소값을 구하고, 전체 시리즈'들'에 대해서 최대값과 최소값을 얻어 온다.
	for(var i = 0 ; i < this.serieses.length ; i++) {
		this.serieses[i].getMinMax() ;
		
		if (this.serieses[i].max > max) {
			max = this.serieses[i].max ;
		}
		
		if (this.serieses[i].min < min) {
			min = this.serieses[i].min ;
		}
	}
	
	this.max = max ;
	this.min = min ;
}

/**
 * Seriese에 대해 binddataset을 설정합니다. 
 */
dfChart.prototype.setBindDataset = function() {
	for (var i = 0; i < this.serieses.length; i++) {
		this.serieses[i].setBindDataSet(this.binddataset) ; 
	}
}

/**
 * 시리즈를 기준으로 Legend에 아이템을 추가합니다.
 */
dfChart.prototype.addLegendItemWithSerieses = function() {
	this.legend.removeAllItems() ; 
	
	for(var i = 0 ; i < this.serieses.length; i++) {
		this.legend.addItem(this.serieses[i].type, this.serieses[i].style.pointshape, this.serieses[i].label, 1, "black", "solid", 1, "black", this.serieses[i].style.fillbrush.color, "solid") ;
	}
}

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 챠트를 그려 줍니다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfChart.prototype.draw = function() {
	this.setBindDataset() ; 
	this.getSeriesesMinMax() ;
	
	// Legend Item을 추가합니다.
	this.addLegendItemWithSerieses() ;
	
	// 각 축에 대해 챠트를 그릴 수 이는 영역을 설정합니다.	
	this.xaxis.setDrawable(this.axisYPosition.left + this.axisYPosition.width, this.axisXPosition.width - (this.axisYPosition.left + this.axisYPosition.width)) ;
	this.yaxis.setDrawable(this.axisXPosition.height, this.axisYPosition.height - (this.axisXPosition.height)) ;
	this.y2axis.setDrawable(this.axisXPosition.height, this.axisYPosition.height - (this.axisXPosition.height)) ;
	
	// 각 축을 그려 줍니다.
	this.xaxis.draw() ;
	this.yaxis.draw() ;
	this.y2axis.draw() ;
	
	// Biard 영역에 대해 기본 정보를 설정합니다.
	this.board.setAxisMajorDegreePos(this.xaxis.degreesPos, this.yaxis.degreesPos, this.y2axis.degreesPos)
	
	
	// Board에 그래프를 그립니다.
	this.board.draw(this.serieses, 
				this.barCount,
				this.lineCount,
				this.pieCount,
				this.max,
				this.min,
				this.xaxis.viewmin,
				this.xaxis.viewmax) ;
}
	
/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChart.prototype.initBackgroundStyle = function() {
} ;

dfChart.prototype.initBorderStyle = function() {
	this.title.style.border.setColor("black") ;
	this.title.style.border.setColor2("black") ;
	this.title.style.border.setStyle("solid") ;
	this.title.style.border.setWidth(0) ;

	this.legend.style.border.setColor("black") ;
	this.legend.style.border.setColor2("black") ;
	this.legend.style.border.setStyle("solid") ;
	this.legend.style.border.setWidth(1) ;

	this.board.style.border.setColor("black") ;
	this.board.style.border.setColor2("black") ;
	this.board.style.border.setStyle("solid") ;
	this.board.style.border.setWidth(0) ;

	this.xaxis.style.border.setColor("red") ;
	this.xaxis.style.border.setColor2("black") ;
	this.xaxis.style.border.setStyle("solid") ;
	this.xaxis.style.border.setWidth(1) ;

	this.yaxis.style.border.setColor("red") ;
	this.yaxis.style.border.setColor2("black") ;
	this.yaxis.style.border.setStyle("solid") ;
	this.yaxis.style.border.setWidth(1) ;

	this.y2axis.style.border.setColor("black") ;
	this.y2axis.style.border.setColor2("black") ;
	this.y2axis.style.border.setStyle("solid") ;
	this.y2axis.style.border.setWidth(0) ;

	this.xaxisscroll.style.border.setColor("black") ;
	this.xaxisscroll.style.border.setColor2("black") ;
	this.xaxisscroll.style.border.setStyle("solid") ;
	this.xaxisscroll.style.border.setWidth(0) ;

	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(1) ;
} ;

dfChart.prototype.initFontStyle = function() {
} ;

dfChart.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChart.prototype.applyBackgorundStyle = function() {
	
	this.title.applyBackgorundStyle() ; 
	this.legend.applyBackgorundStyle() ; 
	this.board.applyBackgorundStyle() ; 
	this.xaxis.applyBackgorundStyle() ; 
	this.yaxis.applyBackgorundStyle() ; 
	this.y2axis.applyBackgorundStyle() ; 
	this.xaxisscroll.applyBackgorundStyle() ;
	 
} ;

dfChart.prototype.applyBorderStyle = function() {
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

	this.title.applyBorderStyle() ; 
	this.legend.applyBorderStyle() ; 
	this.board.applyBorderStyle() ; 
	this.xaxis.applyBorderStyle() ; 
	this.yaxis.applyBorderStyle() ; 
	this.y2axis.applyBorderStyle() ; 
	this.xaxisscroll.applyBorderStyle() ;
} ;

dfChart.prototype.applyFontStyle = function() {
	this.title.applyFontStyle() ; 
	this.legend.applyFontStyle() ; 
	this.board.applyFontStyle() ; 
	this.xaxis.applyFontStyle() ; 
	this.yaxis.applyFontStyle() ; 
	this.y2axis.applyFontStyle() ; 
	this.xaxisscroll.applyFontStyle() ;
} ;

dfChart.prototype.applyMiscStyle = function() {
	this.title.applyMiscStyle() ; 
	this.legend.applyMiscStyle() ; 
	this.board.applyMiscStyle() ; 
	this.xaxis.applyMiscStyle() ; 
	this.yaxis.applyMiscStyle() ; 
	this.y2axis.applyMiscStyle() ; 
	this.xaxisscroll.applyMiscStyle() ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChart.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartTitleStyle Class dfChartTitle에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfChartTitleStyle = df.classutil.create(dfStyle) ; 

dfChartTitleStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;

	this.subAligh = new dfAlign("center", "left") ;
	this.subColor = "black" ;											/// text에 대한 color를 지정하는 Property 입니다.
	this.subFont = new dfFont("Times New Roman", 10, "normal") ; 
	this.subPadding = new dfPadding(0, 0, 0, 0) ;
} ;

//df.classutil.extend(dfChartTitleStyle, dfStyle) ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 *
 * dfChartTitle 클래스
 * 
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
var dfChartTitle = df.classutil.create(dfControl) ; 

dfChartTitle.prototype.initialize = function(name, left, top, right, bottom){
	
	dfControl.prototype.initialize.call(this) ;

	this.text = "" ;
	this.subtext = "" ;
	 
	this.e = df.$c("div") ;
	this.e.id = name ;
	
	this.style = new dfChartTitleStyle() ;
	 
	this.init(name, left, top, right, bottom) ;
	
	this.mainLabel = new dfLabel(name + "__main_label__", 0, 0, this.position.width, this.getMainLabelHeight(top, bottom)) ;
	this.subLabel = new dfLabel(name + "__sub_label__", 0,  this.getMainLabelHeight(top, bottom), this.position.width, (bottom - top)) ;
	
	//alert(this._id + "\r\n" + this.mainLabel._id + "\r\n" + this.subLabel._id) ;
	
	this.mainLabel.style.aligh.set("center", "middle") ;
	this.subLabel.style.aligh.set("right", "bottom") ;
	
	this.mainLabel.setText(this.text) ; 
	this.subLabel.setText(this.subtext) ; 
	
	this.appendChild(this.mainLabel) ;
	this.appendChild(this.subLabel) ;
	
	this.initStyle() ;
	this.applyPosition() ;
	this.applyStyle() ;
	
	this.species = "dfChartTitle" ;
	
	//alert("dfChartTitle.prototype.initialize \r\n\r\n" + this._id ) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 주 타이틀의 텍스트를 설정합니다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.setText = function(text) {
	this.text = text ;
	this.mainLabel.setText(this.text) ; 
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 서브 타이틀의 텍스트를 설정합니다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.setSubText = function(text) {
	this.subtext = text ; 
	this.subLabel.setText(this.subtext) ; 
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 주 타이틀의 높이를 설정합니다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.getMainLabelHeight = function(top, bottom) {
	var height = (bottom - top) * 0.75 ;
	return height ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 서브 타이틀의 높이를 설정합니다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.getsubLabelHeight = function(top, bottom) {
	var height = (bottom - top) * 0.25 ;
	return height ;
} ;




/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfChartTitle.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfChartTitle.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(4) ;
} ;

dfChartTitle.prototype.initFontStyle = function() {
	this.style.font.setFace("Arial Black") ;
	
	this.mainLabel.style.font.set("Arial Black", 28, "normal") ;
	this.subLabel.style.font.set("Arial Black", 12, "normal") ;
} ;

dfChartTitle.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.applyBackgorundStyle = function() {
	this.e.style.backgroundColor = this.style.background.getColor() ;

	this.mainLabel.applyBackgorundStyle() ; 
	this.subLabel.applyBackgorundStyle() ; 
} ;

dfChartTitle.prototype.applyBorderStyle = function() {
	this.e.style.borderStyle = this.style.border.getStyle() ;
	this.e.style.borderWidth = this.style.border.getWidth() ;
	this.e.style.borderColor = this.style.border.getColor() ;
	
	this.mainLabel.applyBorderStyle() ; 
	this.subLabel.applyBorderStyle() ; 
} ;

dfChartTitle.prototype.applyFontStyle = function() {
	this.e.style.fontFamily = this.style.font.getFace() ;
	this.e.style.fontSize = this.style.font.getSize() ;
	
	this.mainLabel.applyFontStyle() ; 
	this.subLabel.applyFontStyle() ; 
} ;

dfChartTitle.prototype.applyMiscStyle = function() {
	this.mainLabel.applyMiscStyle() ; 
	this.subLabel.applyMiscStyle() ; 
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartTitle.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfMarkline 클래스
 * 
 *  
 * @param color  
 * @param color2
 * @param style
 * @param width
 * @return

 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfMarkline = df.classutil.create() ; 

dfMarkline.prototype.initialize = function(color, color2, style, width){
	this.set(color, color2, style, width) ;
} ;

dfMarkline.prototype.set = function(color, color2, style, width) {
	this.setColor(color) ;
	this.setColor2(color2) ;
	this.setStyle(style) ;
	this.setWidth(width) ;
} ;

/**
 * color property setter / getter
 */
dfMarkline.prototype.setColor = function(color) {
	this.color = color ;
} ;

dfMarkline.prototype.getColor = function() {
	return this.color ;
} ;

/**
 * color2 property setter / getter
 */
dfMarkline.prototype.setColor2 = function(color2) {
	this.color2 = color2 ;
} ;

dfMarkline.prototype.getColor2 = function() {
	return this.color2 ;
} ;

/**
 * style property setter / getter
 */
dfMarkline.prototype.setStyle = function(style) {
	this.style = style ;
} ;

dfMarkline.prototype.getStyle = function() {
	return this.style ;
} ;

/**
 * width property setter / getter
 */
dfMarkline.prototype.setWidth = function(width) {
	this.width = width ;
} ;

dfMarkline.prototype.getWidth = function() {
	return this.width + df.env.unit ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartBoardStyle Class dfChartBorder에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartBoardStyle = df.classutil.create(dfStyle) ; 

dfChartBoardStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;

	this.marklinex = new dfMarkline("black", "black", "solid", 1) ;
	this.marklinex2 = new dfMarkline("black", "black", "solid", 1) ;
	this.markliney = new dfMarkline("black", "black", "solid", 1) ;
	this.markliney2 = new dfMarkline("black", "black", "solid", 1) ;
	
	this.originlinex = new dfMarkline("black", "black", "solid", 1) ;
	this.originlinex2 = new dfMarkline("black", "black", "solid", 1) ;
	this.originliney = new dfMarkline("black", "black", "solid", 1) ;
	this.originliney2 = new dfMarkline("black", "black", "solid", 1) ;

	this.xaxismajorline = new dfMarkline("black", "black", "solid", 1) ;
	this.yaxismajorline = new dfMarkline("black", "black", "solid", 1) ;
	this.yaxisminorline = new dfMarkline("black", "black", "solid", 1) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartBoard 클래스 Chart Series의 배경에 해당하는 Inner Component 입니다.
 * 
 * @param name
 * @param left
 * @param top
 * @param right
 * @param bottom
 * @return
 * 
 * ************************************************************************************************************************************\
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartBoard = df.classutil.create(dfControl) ; 

dfChartBoard.prototype.initialize = function(name, left, top, right, bottom){
	dfControl.prototype.initialize.call(this) ;

	this.style = new dfChartBoardStyle() ;
	
	this.text = "" ; 			// Board 내에 출력될 text를 지정하는 Property 입니다.
	
	this.usemarkx = false ;		// Board에 xAxis의 markline을 표시할시 여부를 지정하는 Property 입니다.
	this.usemarkx2 = false ;	// Board에 x2Axis의 markline을 표시할시 여부를 지정하는 Property 입니다.
	this.usemarky = false ;		// Board에 yAxis의 markline을 표시할시 여부를 지정하는 Property 입니다. 
	this.usemarky2 = false ;	// Board에 y2Axis의 markline을 표시할시 여부를 지정하는 Property 입니다.
	this.useoriginx = false ;	// Board에 xAxis의 originline을 표시할시 여부를 지정하는 Property 입니다.
	this.useoriginx2 = false ;	// Board에 x2Axis의 originline을 표시할시 여부를 지정하는 Property 입니다.
	this.useoriginy = false ;	// Board에 yAxis의 originline을 표시할시 여부를 지정하는 Property 입니다.
	this.useoriginy2 = false ;	// Board에 y2Axis의 originline을 표시할시 여부를 지정하는 Property 입니다.
	this.xaxismajorunit = -1 ;	// Board의 xAxis major line의 간격을 지정하는 Property 입니다. 
	                            //		+n : 주어진 간격으로 Major Line을 출력합니다.
								// 		-1 xAxis의 major line이 출력되는 위치와 동일하게 처리합니다. 
								// 		0 Major Line이 출력되지 않습니다. 
	this.yaxismajorunit = -1 ;	// Board의 yAxis major line의 간격을 지정하는 Property 입니다.
	
	this.init(name, left, top, right, bottom) ;
	
	this.e = df.$c("div") ;
	this.e.id = name ;
	this.binddataset = null ; 
	
	this.textLabel = new dfLabel(name + "_text", 0, 0, 0, 0) ;
	
	this.xaxixMajorDegreePos = [] ; 
	this.yaxixMajorDegreePos = [] ; 
	this.y2axixMajorDegreePos = [] ; 
	
	this.arrange() ; 
	
	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
	
	this.species = "dfChartBoard" ;
} ;

/**
 * Bind 돤 Dataset을 설정한다. 
 * 
 * @param {Object} ds
 */
dfChartBoard.prototype.setBindDataSet = function(ds){
	if (ds != undefined && ds != null) {
		this.binddataset = ds ; 
	}	
}	

/**
 * dfChartboard를 구성하는 요소를 정리합니다.
 */
dfChartBoard.prototype.arrange = function() {
	this.style.padding.bottom = 0 ;
	this.setRect() ; // Padding, Margin을 고려한 클라이언트 영역을 계산하나. 이 값은 this.rect 를 통해 참조 가능하다.
}

/**
 * X축, Y축, Y2축의 Major 눈금에 대한 위치 배열 정보를 설정한다.
 */
dfChartBoard.prototype.setAxisMajorDegreePos = function(x, y, y2) { 
	this.setXAxisMajorDegreePos(x) ; 
	this.setYAxisMajorDegreePos(y) ; 
	this.setY2AxisMajorDegreePos(y2) ; 
}

/**
 * X 축 Major 눈금의 위치에 대한 배열 정보를 설정한다.
 */
dfChartBoard.prototype.setXAxisMajorDegreePos = function(a){
	var count = this.xaxixMajorDegreePos.length ; 
	
	if (count > 0) {
		this.xaxixMajorDegreePos.splice(0, count) ;
	}
	
	for(var i = 0 ; i < a.length; i++) {
		this.xaxixMajorDegreePos.push(a[i]) ;
	}
}

/**
 * Y 축 Major 눈금의 위치에 대한 배열 정보를 설정한다.
 */	
dfChartBoard.prototype.setYAxisMajorDegreePos = function(a){
	var count = this.yaxixMajorDegreePos.length ; 
	
	if (count > 0) {
		this.yaxixMajorDegreePos.splice(0, count) ;
	}
	
	for(var i = 0 ; i < a.length; i++) {
		this.yaxixMajorDegreePos.push(a[i]) ;
	}
}

/**
 * Y2 축 Major 눈금의 위치에 대한 배열 정보를 설정한다.
 */	
dfChartBoard.prototype.setY2AxisMajorDegreePos = function(a){
	var count = this.y2axixMajorDegreePos.length ; 
	
	if (count > 0) {
		this.y2axixMajorDegreePos.splice(0, count) ;
	}
	
	for(var i = 0 ; i < a.length; i++) {
		this.y2axixMajorDegreePos.push(a[i]) ;
	}
}


/**
 * 챠트 그림 영역을 클리어 합니다.
 */
dfChartBoard.prototype.clear = function() {
	var g = df.$f.getGraphics() ;

	var left = 0 ; 
	var top = 0 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}

	//g.fillRect(left + this.position.left, top + this.position.top, left + this.position.right, top + this.position.bottom, "white") ;
	g.fillRect(left, top, left + this.position.width, top + this.position.height, "white") ;
}

/**
 * 챠트를 그립니다.
 * 
 * @param {Object} serieses 그래프 시리즈
 * @param {Object} barCount 시리즈 중 막대 챠트의 갯수
 * @param {Object} lineCount 시리즈 중 라인 챠트의 갯수
 * @param {Object} PieCount 시리즈 증 파이 챠트의 개수 
 * @param {Object} max
 * @param {Object} min
 */
dfChartBoard.prototype.draw = function(serieses, barCount, lineCount, PieCount, max, min, viewMin, viewMax) {
	this.clear() ;
	
	var g = df.$f.getGraphics() ;
	
	/// 해당 컴퍼넌트의 Top Lebel Frame까지의 절대 위치 정보를 얻어 온다.
	/// 아래의 코드가 반복해서 동작한다. 이것을 반복하지 않을 방법을 강구하여 본다. 
	var left = 0 ; 
	var top = 0 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	// 파이챠트가 존재하는 경우 별도 X축 Y축이 없어 진다.

	// 이렇게 분기되는 부분은 dfChart에서 this.board.draw(...) 호출하기 전에 처리하면 어떨까 싶다. 
	if(PieCount <= 0) {
		if(barCount >= 0) {
			this.drawBarChart(serieses, barCount, max, min, left, top, viewMin, viewMax) ;
		}
				
		if(lineCount >= 0) {
			this.drawLineChart(serieses, lineCount, max, min, left, top, viewMin, viewMax) ;
		}		
	}
	else {
		this.drawPieChart(serieses, lineCount, max, min, left, top, viewMin, viewMax) ;		
	}
}

/**
 * 막대 챠트를 그립니다.
 * 
 * @param {Object} serieses 그래프 시리즈
 * @param {Object} barCount 시리즈 중 막대 챠트의 갯수
 * @param {Object} max 시리즈'들' 중에서 최대값
 * @param {Object} min 시리즈'들' 중에서 최대값
 * @param {Object} left 그림 그리는 영역의 왼쪽 좌표
 * @param {Object} top  그림 그리는 영역의 위쪽 좌표
 */
dfChartBoard.prototype.drawBarChart = function(serieses, barCount, max, min, left, top, viewMin, viewMax)
{
	var g = df.$f.getGraphics() ;

	var barTop = 0 ;  // 각 막대 그래프의 위쪽 좌표
	var barLeft = 0 ; // 각 막대 그래프의 왼쪽 좌표
	var barWidth = 0 ;  // 각 막대 그래프의 너비
	var seriesCount = barCount ; 
	var column = ""  ;
	var series = null ;  
	var pos = 0 ;
	var value = 0 ;  
	
	barWidth =  (this.xaxixMajorDegreePos[1] - this.xaxixMajorDegreePos[0]) / (seriesCount + 1);

	for(var i = 0 ; i < serieses.length; i++) { // 시리즈
		column = ""  ;
		series = serieses[i] ;  
		
		if(series.type == "bar") {
			column = this.getBindColumn(series.data) ;  // series.data에 바인딩 된 컬럼명을 가지고 온다.
			series.clearPositions() ;  // 시리즈의 그래프 위치 정보를 초기화 합니다. 
					
			/// 그림을 그리면서 각 시리즈의 영역 정보를 배열에 보관하도록 한다.
			for(var k = viewMin; k <= viewMax; k++) { 
				value = parseFloat(this.binddataset.getColumn(k, column)) ; // binddataset에서 컬럼의 값을 읽어 옵니다. 
				
				barLeft = left + this.xaxixMajorDegreePos[k] + (barWidth * 0.5) + (pos * barWidth) ;
				
				/// 아래의 +2 부분은 padding 값을 가지고 조정해야 한다. 여기에서는 임시로 +2 하였으니, 나중에 꼭 변경하기 바랍니다. 
				barTop = top + this.rect.height - (this.rect.height * (value / max)) + 2; 
				
				/// 그리프를 그릴 때 Origin 값을 고려해야 한다. NOT Yet !!
				series.addPosition(barLeft - left, barTop - top, barLeft + (barWidth-2) - left, this.position.height) ;
				
				/// 아래의 그래프 그리는 부분을 분리하는 것을 고려해 본다.
				/// 즉, 위의  series.addPosition(...) 에서 dfChartBoard.prototype.drawBarChart(...) 을 끝내고
				/// 별도의 Loop을 통해서 그림을 그린다. 각 그래프 영역정보와 그림 그리는 부분은 구분하여, 그래프 영역의 변경없이
				/// 그림만 다시 그릴 수 있도록 합니다. 
				/// 그러기 위해서 (barCount, max, min, left, top, viewMin, viewMax) 값을 저장할 필요가 있는지 고려해야 한다.
				/// 이때 Bar, Line, Chart를 별도록 구분할 필요가 있는지도 확인해 본다. 
				  				
				if(value > min) { // 최소값 보다 큰 경우에만 그립니다.
					g.drawRect(barLeft, barTop, barLeft + (barWidth-2), top + this.position.height, "black", 1, series.style.fillbrush.color);
				}
			}
					
			pos ++ ; 
		}		
		
	}
}

/**
 * 꺽은선 챠트를 그립니다.
 * 
 * @param {Object} serieses 그래프 시리즈
 * @param {Object} barCount 시리즈 중 막대 챠트의 갯수
 * @param {Object} max
 * @param {Object} min
 * @param {Object} left
 * @param {Object} top
 */
dfChartBoard.prototype.drawLineChart = function(serieses, barCount, max, min, left, top, viewMin, viewMax)
{
	var g = df.$f.getGraphics() ;

	var barTop = 0 ;  // 각 막대 그래프의 위쪽 좌표
	var barLeft = 0 ; // 각 막대 그래프의 왼쪽 좌표, 선그래프 에서는 각 막대 그래프의 왼쪽 좌표는 X축 영역의 중심이 되도록 한다.
	var seriesCount = barCount ; 
	var column = ""  ;
	var series = null ;  
	var pos = 0 ;
	var value = 0 ;  
	var majorDegreeWidth = this.xaxixMajorDegreePos[1] - this.xaxixMajorDegreePos[0] ;
	
	for(var i = 0 ; i < serieses.length; i++) { // 전체 시리즈에 대해서
		column = ""  ;
		series = serieses[i] ;  
		
		if (series.type == "line") {
			column = this.getBindColumn(series.data) ;  // series.data에 바인딩 된 컬럼명을 가지고 온다.
			series.clearPositions() ;  // 시리즈의 그래프 위치 정보를 초기화 합니다. 

			/// 그림을 그리면서 각 시리즈의 영역 정보를 배열에 보관하도록 한다.
			for (var k = viewMin; k <= viewMax; k++) {
				value = parseFloat(this.binddataset.getColumn(k, column)); // binddataset에서 컬럼의 값을 읽어 옵니다.
				
				barLeft = left + this.xaxixMajorDegreePos[k] + (majorDegreeWidth * 0.5);
				barTop = top + this.rect.height - (this.rect.height * (value / max));
				
				/// 그리프를 그릴 때 Origin 값을 고려해야 한다. NOT Yet !!
				series.addPosition(barLeft - left, barTop - top, barLeft - left, barTop - top);
			}
		}	
	}
	
	/// 실제 그림을 그립니다. 나중에 아래 부분은 별도의 함수를 구분해 보는 것을 고려해 봅니다.
	
	/// 우선 라인을 그립니다.
	for (var i = 0; i < serieses.length; i++) { // 전체 시리즈에 대해서
		column = "";
		series = serieses[i];
		
		if (series.type == "line") {
			if (series.getPositionCount() > 1) {
				var from = series.getPosition(0) ;
				var to = series.getPosition(0) ;
				
				for (var k = 1; k < series.getPositionCount(); k++) {
					to = series.getPosition(k) ;
					
					g.drawLine(from.x + left, from.y + top, to.x + left, to.y + top, series.style.fillbrush.color, 2) ;
					
					from = to ;
				}
			}
			else if(series.getPositionCount() == 1) {
				var from = series.getPosition(0) ;
				var to = series.getPosition(0) ;
			}
		}
	}
	
	
	/// 라인 위체 네모, 세모 등을 그립니다.
	for (var i = 0; i < serieses.length; i++) { // 전체 시리즈에 대해서
		column = "";
		series = serieses[i];
		
		if (series.type == "line") {
			for (var k = 0; k < series.getPositionCount(); k++) {
				var pos = series.getPosition(k) ;
				var size = 3 ; /// 이 부분은 this.syle.... 을 레퍼런스 하도록 한다.
				
				switch(series.style.pointshape) {
					case  "none" :
						break ;
					case  "rectangle" :
						g.drawRect(pos.x - size + left, pos.y - size + top, pos.x + size + left, pos.y + size + top, "black", 1, series.style.fillbrush.color);
						break ;
					case  "triangle" :
						g.drawTri(pos.x - size + left, pos.y - size + top, pos.x + size + left, pos.y + size + top, "black", 1, series.style.fillbrush.color);
						break ;
					case  "circle" :
						g.drawCircle(pos.x + left, pos.y + top, (size * 2) - 2, "black", 1, series.style.fillbrush.color);
						break ;
				}
			}
		}
	}
}



/**
 * 파이 챠트들 그립니다.
 * 
 * @param {Object} serieses 그래프 시리즈
 * @param {Object} barCount 시리즈 중 막대 챠트의 갯수
 * @param {Object} max
 * @param {Object} min
 * @param {Object} left
 * @param {Object} top
 */
dfChartBoard.prototype.drawPieChart = function(serieses, barCount, max, min, left, top, viewMin, viewMax) {
	var g = df.$f.getGraphics() ;
	
	var column = ""  ;
	var series = null ;
	var done = false ;
	 
	var s_max = 0 ; 
	var s_min = 0 ;
	 
	var cx = left + (this.position.width / 2.0); // 파이가 그려질 중앙 좌표 : x
	var cy = top + (this.position.height / 2.0) ; // 파이가 그려질 중앙 좌표 : y
	
	var r = Math.min((this.position.width / 2.0), (this.position.height / 2.0)) * 0.95 ;  // 파이의 반지름
	var lineWidth = 1 ;
	var strokeStyle = "black" ; 
	var startAngle = -Math.PI/2 ;
	var endAngle = 0.0 ;
	var angles = []  ;
	var total = 0.0 ; 
	
	for(var i = 0 ;!done &&  i < serieses.length; i++) { // 시리즈
		series = serieses[i] ;  
		
		if (series.type == "pie") { // 파이 챠트를 그릴 대상을 찾았습니다. 이제 그리기 시작 합니다.
			column = this.getBindColumn(series.data)  ;
			var count = this.binddataset.getRowCount() ;
			
			s_max = series.max ; 
			s_min = series.min ;
			 
			total = 0 ; 
			
			for (var k = 0; k < count; k++) {
				value = parseFloat(this.binddataset.getColumn(k, column)) ;
				total += value ;
			}
			
			for (var k = 0; k < count; k++) {
				value = parseFloat(this.binddataset.getColumn(k, column)) ;
				angles[k] = value / total * Math.PI*2 ;
			}

			for (var k = 0; k < count; k++) {
				value = parseFloat(this.binddataset.getColumn(k, column)) ;
				endAngle = startAngle + angles[k] ;
				
				g.drawArc(cx, cy, r, startAngle, endAngle, strokeStyle, lineWidth, series.style.fillbrush.color) ;
				
				startAngle = endAngle			
			}
				
			done = true ; // 다 그렸습니다. !!
			
		}
	}
}


/**
 * 샘플 바 챠트를 그려 봅니다.
 * @param {Object} values
 */
dfChartBoard.prototype.drawSampleBar = function(a) {
	var g = df.$f.getGraphics() ;
	
	/// 해당 컴퍼넌트의 Top Lebel Frame까지의 절대 위치 정보를 얻어 온다.
	var left = 0 ; 
	var top = 0 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	// 챠트에 그려주는 값 중에서 최대값을 얻어 온다.
	var max = this.getMaxInArrays(a) ;
	
	
	var barTop = 0 ; // 각 막대 그래프의 왼쪽 좌표
	var barLeft = 0 ; // 각 막대 그래프의 왼쪽 좌표
	var barWidth = 0 ;  // 각 막대 그래프의 너비
	var seriesCount = a.length ; 
	
	if(a.length > 0 &&  a[0].values.length > 1) {
		barWidth =  (this.xaxixMajorDegreePos[1] - this.xaxixMajorDegreePos[0]) / (seriesCount + 1);
	}
	else {
		barWidth =  this.rect.width ;
	}	
	
	barWidth = barWidth ; 
	
	for(var i = 0 ; i < a.length; i++) { // 시리즈 
		for(var k = 0; k < a[i].values.length; k++) { // 각 시리즈 별 값
			barLeft = left + this.xaxixMajorDegreePos[k] + (barWidth * 0.5) + (i * barWidth) ; 
			barTop = top + this.rect.height - (this.rect.height * (a[i].values[k] / max)) ; 
			
			g.drawRect(barLeft, barTop, barLeft + (barWidth-2), top + this.position.height, "black", 1, a[i].color);
		}		
	}
}

/**
 * 배열에서 최대 값을 반환합니다.
 * @param {Object} a
 */
dfChartBoard.prototype.getMaxInArray = function(a) {
	var max = 0 ; 
	
	for( var i = 0; i < a.length; i++) {
		if(a[i] > max) {
			max = a[i] ;	
		}	
	}
	
	return max ;
}

/**
 * 2차원 배열에서 최대 값을 반환합니다.
 * @param {Object} a
 */
dfChartBoard.prototype.getMaxInArrays = function(a) {
	var max = 0 ; 
	var val = 0 ; 
		
	for( var i = 0; i < a.length; i++) {
		val = this.getMaxInArray(a[i].values) ; 
		if(val > max) {
			max = val ;	
		}	
	}
	
	return max ;
}

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartBoard.prototype.initBackgroundStyle = function() {
} ;

dfChartBoard.prototype.initBorderStyle = function() {
} ;

dfChartBoard.prototype.initFontStyle = function() {
} ;

dfChartBoard.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartBoard.prototype.applyBackgorundStyle = function() {
} ;

dfChartBoard.prototype.applyBorderStyle = function() {
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

dfChartBoard.prototype.applyFontStyle = function() {
} ;

dfChartBoard.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartBoard.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartLegendLabelStyle Class dfChartLegendLabel 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartLegendLabelStyle = df.classutil.create(dfStyle) ; 

dfChartLegendLabelStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;
	
	this.lineWidth = 0 ;
	this.lineColor = "black" ;
	this.lineStyle = "solid" ;
	
	this.rectThickness = 0 ;
	this.rectColor = "black" ;
	this.rectFillColor = "white" ;
	this.rectStyle = "solid" ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartLegendLabel 클래스
 * 
 * dfChartLegend에 사용되는 라벨입니다. dfChartLegendLabel 클래스는 아이템 이미지와 테스트로 구성되어 있스빈다.
 * 
 * @param name
 * @param left
 * @param top
 * @param right
 * @param bottom
 * @return
 * 
 * ************************************************************************************************************************************\
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfChartLegendLabel = df.classutil.create(dfControl) ; 

dfChartLegendLabel.prototype.initialize = function(name, left, top, right, bottom){
	dfControl.prototype.initialize.call(this) ;
	
	this.init(name, left, top, right, bottom) ;

	this.style = new dfChartLegendLabelStyle() ; /// Style for Chart Legend Overloading
	
	this.shapePosition = new dfPosition("absolute", 0, 0, 0, 0) ;	 
	this.labelPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
		 
	this.text = "" ;
	
	this.chartType = 0 ; 
	this.pointType = 0 ; 
	
	this.itemShapeSize = 17 ;
	this.gap = 3 ;  

	this.e = df.$c("div") ;
	this.e.id = name ;
	
	this.arrange() ; // 이 컴퍼넌트를 구성하는 dfShape와 dfLabel에 대한 위치와 크기를 결정한다.
	
	this.shape = new dfShape(name + "__shape__", this.shapePosition.left, this.shapePosition.top, this.shapePosition.right, this.shapePosition.bottom) ;
	this.label = new dfLabel(name + "__label__", this.labelPosition.left, this.labelPosition.top, this.labelPosition.right, this.labelPosition.bottom) ;

	this.label.style.aligh.set("left", "middle") ;
	this.label.setText(this.text) ; 

	this.appendChild(this.shape) ;
	this.appendChild(this.label) ;

	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
	
	this.species = "dfChartLegendLabel" ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 이 컴퍼넌트를 구성하는 dfShape와 dfLabel에 대한 위치와 크기를 결정한다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegendLabel.prototype.setText = function(text) {
	this.text = text ;
	this.label.setText(this.text) ; 
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 이 컴퍼넌트를 구성하는 dfShape와 dfLabel에 대한 위치와 크기를 결정한다.
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegendLabel.prototype.arrange = function() {
	
	this.setRect() ; // Padding, Margin을 고려한 클라이언트 영역을 계산하나. 이 값은 this.rect 를 통해 참조 가능하다.
	
	this.shapePosition.setLeft(this.rect.left) ; 
	this.shapePosition.setTop(this.rect.top) ; 
	this.shapePosition.setWidth(this.itemShapeSize) ; 
	this.shapePosition.setHeight(this.itemShapeSize) ; 

	this.labelPosition.setLeft(this.rect.left + this.gap + this.itemShapeSize) ; 
	this.labelPosition.setTop(this.rect.top) ; 
	this.labelPosition.setWidth(this.rect.width - this.itemShapeSize - this.gap) ; 
	this.labelPosition.setHeight(this.itemShapeSize) ; 
} ;


/**
 * Legend 아이템의 타입 별로 
 */
dfChartLegendLabel.prototype.draw = function() {
	switch(this.chartType) {
		case "bar" :
			this.shape.drawRect(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
			break ;
		case "line":
			switch (this.pointType) {
				case  "none" :
					this.shape.drawWithLine(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
					break ;
				case  "rectangle" :
					this.shape.drawRectWithLine(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
					break ;
				case  "triangle" :
					this.shape.drawTriWithLine(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
					break ;
				case  "circle" :
					this.shape.drawCircleWithLine(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
					break ;
			}
			break ;
		case "pie" :
			this.shape.drawRect(this.style.rectThickness, this.style.rectColor, this.style.rectFillColor) ;
			break ;
	}
}
	
/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegendLabel.prototype.initBackgroundStyle = function() {
} ;

dfChartLegendLabel.prototype.initBorderStyle = function() {
	this.shape.style.border.setColor("black") ;
	this.shape.style.border.setColor2("black") ;
	this.shape.style.border.setStyle("solid") ;
	this.shape.style.border.setWidth(0) ;

	this.label.style.border.setColor("black") ;
	this.label.style.border.setColor2("black") ;
	this.label.style.border.setStyle("solid") ;
	this.label.style.border.setWidth(0) ;

	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(0) ;
} ;

dfChartLegendLabel.prototype.initFontStyle = function() {
} ;

dfChartLegendLabel.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegendLabel.prototype.applyBackgorundStyle = function() {
	this.shape.applyBackgorundStyle() ; 
	this.label.applyBackgorundStyle() ; 
} ;

dfChartLegendLabel.prototype.applyBorderStyle = function() {
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

	this.shape.applyBorderStyle() ; 
	this.label.applyBorderStyle() ; 
} ;

dfChartLegendLabel.prototype.applyFontStyle = function() {
	this.shape.applyFontStyle() ; 
	this.label.applyFontStyle() ; 
} ;

dfChartLegendLabel.prototype.applyMiscStyle = function() {
	this.shape.applyMiscStyle() ; 
	this.label.applyMiscStyle() ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegendLabel.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartLegendStyle Class dfChartLegend에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartLegendStyle = df.classutil.create(dfStyle) ; 

dfChartLegendStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;

	this.arrange = "vert" ;			/// Legend의 item과 title의 정렬방식에 대해 지정하는 Property 입니다.
	this.itemalign = new dfAlign("center", "left") ;	/// Legend의 각 item의 text align을 지정하는 Property 입니다.
	this.itembackground = new dfBackground(true, "white", "", "", new dfPosition("absolute", 0, 0, 0, 0), false) ; 	/// Legend의 각 item의 background를 지정하는 Property 입니다.
	this.itemborder = new dfBorder("black", "black", "solid", 1) ;	/// Legend의 각 item의 border를 지정하는 Property 입니다.
	this.itembordertype = new dfBorderType("normal", 0, false, false, false, false) ;
	this.itemcolor = "black" ;
	this.itemfont = new dfFont("Times New Roman", 10, "normal") ;
	this.itemgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ;
	this.itempadding = new dfPadding(0, 0, 0, 0) ;
	
	this.titlealign = new dfAlign("center", "left") ;	/// Legend의 각 item의 text align을 지정하는 Property 입니다.
	this.titlecolor = "black" ;
	this.titlefont = new dfFont("Times New Roman", 10, "normal") ;
	this.titlepadding = new dfPadding(0, 0, 0, 0) ;
	this.titletext = "" ;
	
	this.type = "multi" ;
	
	this.lineWidth = 0 ;
	this.lineColor = "black" ;
	this.lineStyle = "solid" ;
	
	this.rectThickness = 0 ;
	this.rectColor = "black" ;
	this.rectFillColor = "white" ;
	this.rectStyle = "solid" ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 *
 * dfChartLegend 클래스
 * 
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
var dfChartLegend = df.classutil.create(dfControl) ; 

dfChartLegend.prototype.initialize = function(name, left, top, right, bottom){
	dfControl.prototype.initialize.call(this) ;

	this.style = new dfChartLegendStyle() ; /// Style for Chart Legend Overloading
	
	this.init(name, left, top, right, bottom) ;
	 
	this.titlePosition = new dfPosition("absolute", 0, 0, 0, 0) ;	 
	this.itemPosition = new dfPosition("absolute", 0, 0, 0, 0) ;
	
	this.e = df.$c("div") ;
	this.e.id = name ;
	this.binddataset = null ; 
	
	this.arrange() ; // 이 컴퍼넌트를 구성하는 dfShape와 dfLabel에 대한 위치와 크기를 결정한다.
	
	this.series = null ;
	this.serieses = [] ;
	this.items = [] ;

	this.text = "" ; 
	this.title = new dfLabel(name + "__title__", this.titlePosition.left, this.titlePosition.top, this.titlePosition.right, this.titlePosition.bottom) ;
	
	this.title.style.aligh.set("center", "middle") ;
	this.title.setText(this.text) ; 

	this.appendChild(this.title) ;
	
	this.setText("Legend") ;

	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
	
	this.species = "dfChartBoard" ;
	
} ;

/**
 * Bind 돤 Dataset을 설정한다. 
 * 
 * @param {Object} ds
 */
dfChartLegend.prototype.setBindDataSet = function(ds){
	if (ds != undefined && ds != null) {
		this.binddataset = ds ; 
	}	
}	

/**
 * ChartLegend를 구성하는 title과 item에 대한 위치와 크기를 설정합니다.
 */
dfChartLegend.prototype.arrange = function() {
	this.setRect() ; // Padding, Margin을 고려한 클라이언트 영역을 계산하나. 이 값은 this.rect 를 통해 참조 가능하다.
	
	this.titlePosition.setTop(this.rect.top) ; 
	this.titlePosition.setLeft(this.rect.left) ; 

	if(this.style.arrange == "vert") {
		this.titlePosition.setWidth(this.rect.width) ; 
		this.titlePosition.setHeight(20) ;
	}
	else {
		this.titlePosition.setHeight(this.rect.height) ; 
	}
}

/**
 * 화면을 업데이트 합니다.
 */
dfChartLegend.prototype.redraw = function() {
	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
}	

/**
 * series property setter / getter
 */
dfChartLegend.prototype.setSeries = function(series) {
	this.series = series ;
} ;

dfChartLegend.prototype.getSeries = function() {
	return this.series ;
} ;

/**
 * Legend의 Item을 추가합니다. 
 */
dfChartLegend.prototype.addItem = function(chartType, shapeType, text, lineWidth, lineColor, lineStyle, rectThickness, rectColor, rectFillColor, rectStyle) {
	
	var item = new dfChartLegendLabel(this.name + "__item__" + this.items.length + 1, 0, 0, 0, 0) ; 
	
	item.chartType = chartType ; 	
	item.pointType = shapeType ; 	
	
	item.style.lineWidth = lineWidth ;
	item.style.lineColor = lineColor ;
	item.style.lineStyle = lineStyle ;
	
	item.style.rectThickness = rectThickness ;
	item.style.rectColor = rectColor ;
	item.style.rectFillColor = rectFillColor ;
	item.style.rectStyle = rectStyle ;
	
	item.setText(text) ;
	
	if(this.style.arrange == "vert") {
		item.position.left = this.rect.left ;
		item.position.width = this.rect.width ;
		item.position.top = this.rect.top + this.title.position.height + (item.itemShapeSize * this.items.length) + this.style.titlepadding.bottom ;
		item.position.height = item.itemShapeSize ;
	}
	else {
	}	
	
	
	item.applyStyle() ;
	item.applyPosition() ;

	this.items.push(item) ;

	this.appendChild(item) ;
	
	item.draw() ; 
	
	this.redraw() ;		 
}

dfChartLegend.prototype.setText = function(text) {
	this.text = text ; 
	this.title.setText(text) ;
}
	
/**
 * Item의 갯수를 반환합니다.
 */
dfChartLegend.prototype.itemCount = function() {
	return this.items.length ;
}

/**
 * Item을 얻어 옵니다.
 * @param {Object} index
 */
dfChartLegend.prototype.getItem = function(index) {
	var item = null ;
	
	if(index >= 0 && index < this.items.length) {
		item = this.items[index] ;
	}
	
	return item ;
}

/**
 * Index의 Item을 제거합니다.
 */
dfChartLegend.prototype.removeItem = function(index) {
	var count = -1 ; 
	
	if(index >= 0 && index < this.items.length) {
		delete (this.items.splice(index, 1)) ;
		count = this.items.length ;
	}
	
	this.redraw() ;		 

	return count ;
}


/**
 * Item을 모두 제거합니다.
 */
dfChartLegend.prototype.removeAllItems = function() {
	while (this.items.length > 0) {
		delete this.items.pop() ;
	}
	
	this.redraw() ;		 
}

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegend.prototype.initBackgroundStyle = function() {
} ;

dfChartLegend.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(1) ;
	
	this.title.style.border.bottom.setColor("black") ;
	this.title.style.border.bottom.setStyle("solid") ;
	this.title.style.border.bottom.setWidth(1) ;
} ;

dfChartLegend.prototype.initFontStyle = function() {
} ;

dfChartLegend.prototype.initMiscStyle = function() {
	if(this.style.arrange == "vert") {
	}
	else {
	}	
	
	this.style.titlepadding.bottom = 4 ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegend.prototype.applyBackgorundStyle = function() {
} ;

dfChartLegend.prototype.applyBorderStyle = function() {
	this.e.style.borderStyle = this.style.border.getStyle() ;
	this.e.style.borderWidth = this.style.border.getWidth() ;
	this.e.style.borderColor = this.style.border.getColor() ;
	
	this.title.applyBorderStyle() ;
} ;

/**
 * 
 */
dfChartLegend.prototype.applyFontStyle = function() {
	this.title.applyFontStyle() ;
} ;


/**
 * 
 */
dfChartLegend.prototype.applyMiscStyle = function() {
	this.title.applyMiscStyle() ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartLegend.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
	
	this.title.applyPosition() ;
} ;




/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartAxisStyleClass dfChartAxis반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartAxisStyle = df.classutil.create(dfStyle) ; 

dfChartAxisStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;

	this.axissize = 1 ; 								/// Axis의 크기를 지정하는 Property 입니다.
	this.labelalign = new dfAlign("center", "left") ;	/// Axis의 Lable Text가 출력될 기준위치를 지정하는 Property 입니다.
	this.labelcolor = "black" ;							/// Axis에 출력되는 Lable의 색상을 지정하는 Property  입니다.
	this.labelfont = new dfFont("Times New Roman", 10, "normal") ; /// Axis에 출력되는 Lable의 폰트를 지정하는 Property  입니다.
	this.lablepadding = new dfPadding(0, 0, 0, 0) ;		/// 출력되는 label text의 padding을 지정하는 Property 입니다.
	this.labelrotate = 0 ;								/// Lable Text의 회전값을 지정하는 Property 입니다.

	this.markcolor = "black" ;							/// mark lable의 color를 지정하는 Property 입니다.
	this.markfont = new dfFont("Times New Roman", 10, "normal") ; 	/// mark lable의 font를 지정하는 Property 입니다. 
	this.markline = new dfLineBorder("black", "black", "solid", 1) ;///  mark data위치에 출력되는 ruler line을 지정하는 property 입니다.
	this.markpadding = new dfPadding(0, 0, 0, 0) ;		/// 출력되는 mark text의 padding을 지정하는 Property 입니다. 
	this.marksize = 0 ;									/// markline의 크기를 지정하는 Property 입니다.

	this.origincolor = "black" ;							/// origin lable의 color를 지정합니다. 지정하지 않는 경우, lablecolor가 사용됩니다.
	this.originfont = new dfFont("Times New Roman", 10, "normal") ; 	/// origin lable의 font를 지정하는 Property 입니다.
	this.originline = new dfLineBorder("black", "black", "solid", 1) ;///  origin data위치에 출력되는 ruler line을 지정하는 property 입니다.
	this.originpadding = new dfPadding(0, 0, 0, 0) ;		/// 출력되는 text의 padding을 지정하는 Property 입니다. 
	this.originsize = 0 ;									/// originline의 크기를 지정하는 Property 입니다.
	
	this.ruleralign = new dfAlign("center", "middle") ;		/// Axis를 기준으로 Ruler가 출력되는 위치를 지정하는 Property 입니다.
	this.rulermajorline = new dfLineBorder("black", "black", "solid", 3) ;	///  Axis의 Major Ruler Line에 대한 Line Type을 지정하는 Property 입니다.
	this.rulermajorsize = 0 ;								///  Axis의 Major Ruler Line에 대한 길이를 지정하는 Property 입니다.
	this.rulerminorline = new dfLineBorder("black", "black", "solid", 1) ;	/// Axis의 Minor Ruler Line에 대한 Line Type을 지정하는 Property 입니다.
	this.rulerminorsize = 0 ;												/// Axis의 Minor Ruler Line에 대한 길이를 지정하는 Property 입니다.
	this.scrollbarsize = -1 ; 								/// Axis의 Scrollbar Size를 지정하는 Property 입니다.
	
	this.titlealign = new dfAlign("center", "left") ;		/// Axis의 title text가 출력되는 위치를 지정하는 Property 입니다.
	this.titlecolor = "black" ;								/// Axis title의 color를 지정하는 Property 입니다.
	this.titlefont = new dfFont("Times New Roman", 10, "normal") ; /// Axis title의 font를 지정하는 Property 입니다.
	this.titlepadding = new dfPadding(0, 0, 0, 0) ;			/// Axis title text의 padding을 지정하는 Property 입니다.
	this.titlerotate = 0 ;									/// Axis title text의 회전값을 지정하는 Property 입니다.
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartAxisStyleClass dfChartAxis반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartAxisDegree = df.classutil.create(dfControl) ; 

dfChartAxisDegree.prototype.initialize = function(name, left, top, right, bottom) {
	dfControl.prototype.initialize.call(this) ;
	this.init(name, left, top, right, bottom) ;
}


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfChartAxisDegree.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfChartAxisDegree.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(0) ;
} ;

dfChartAxisDegree.prototype.initFontStyle = function() {
	this.style.font.setFace("Arial Black") ;
} ;

dfChartAxisDegree.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxisDegree.prototype.applyBackgorundStyle = function() {
	this.e.style.backgroundColor = this.style.background.getColor() ;
} ;

dfChartAxisDegree.prototype.applyBorderStyle = function() {
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

dfChartAxisDegree.prototype.applyFontStyle = function() {
	this.e.style.fontFamily = this.style.font.getFace() ;
	this.e.style.fontSize = this.style.font.getSize() ;
} ;

dfChartAxisDegree.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxisDegree.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 *
 * dfChartAxis클래스
 * 
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
var dfChartAxis = df.classutil.create(dfControl) ; 

dfChartAxis.prototype.initialize = function(name, left, top, right, bottom) {
	dfControl.prototype.initialize.call(this) ;

	this.init(name, left, top, right, bottom) ;

	this.e = df.$c("div") ;
	this.e.id = name ;
	
	this.binddataset = null ; 
	
	this.autofit = false ;									/// Chart의 Axis에 대한 scroll이 발생되지 않게 모든 Series이 data가 보일수 있도록 지정하는 Property 입니다.
	this.data = "" ;										/// Axis의 data로 사용될 columnid를 지정하는 Property 입니다.
	this.label = "" ; 										/// Axis의 각 major ruler 마다 출력되는 Lable을 지정하는 Property 입니다
	this.labelmask = "" ; 									/// Lable이 출력될 때 사용될 mask를 지정하는 Property입니다.
	this.markdata = 0 ; 									/// yAxis를 기준으로 특정점을 지정하는 Property 입니다.
	this.marklable = "" ; 									/// mark data 위치에 출력될 text *** 확인 필요 !!!
	this.origindata = 0 ;									/// yAxis를 기준으로 기준점을 지정하는 Property 입니다.
	this.originlabel = "" ; 								/// origin data 위치에 출력될 text를 지정하는 Proeprty 입니다.
	this.rulerbasetype = "point" ;							/// xAxis의 ruler가 출력되는 방식에 대해서 지정하는 Property 입니다.
	this.rulermajorunit = 10 ;								/// Axis에서 major line의 간격을 지정하는 Property 입니다.
	this.rulermax = 100 ; 									/// Axis Ruler가 가지는 최대값을 지정하는 Proeprty 입니다.
	this.rulermin = 0 ;										/// Axis Ruler가 가지는 최소값을 지정하는 Proeprty 입니다.
	this.rulerminorunit = -1 ;								/// Axis에서 minor line의 간격을 지정하는 Property 입니다.
	this.rulersort = "none" ;								/// Axis의 ruler가 출력되는 순서를 지정하는 Property 입니다.
	this.scrollmax = 0 ; 									/// Axis Scroll의 max 값을 가지는 ReadOnly Property 입니다.
	this.scrollmin = 0 ;									/// Axis Scroll의 min 값을 가지는 ReadOnly Property 입니다.
	this.scrollpos = 0 ; 									/// Axis Scroll의 값을 가지는 ReadOnly Property 입니다.
	this.scrollvisible = "none" ;							/// Axis ScrollBar의 Visible 방식을 지정하는 Property 입니다.
	this.text = "" ; 										/// ChartAxis 에 보여질 값을 지정하는 Property 입니다.
	this.titletext = "" ;									/// Axis의 title text를 지정하는 Property 입니다.
	this.viewcount = 5 ; 									/// Axis에서 보여지는 item의 갯수를 지정하는 Property 입니다.
	this.viewmax = 4 ; 										/// Axis에서 보여지는 item의 최대위치를 지정하는 Property 입니다.
	this.viewmin = 0 ; 										/// Axis에서 보여지는 item의 를 지정하는 Property 입니다.
	
	this.type =  1 ;										/// 1 : X 축, 3 : Y 축, 4 : Y2 축
	 
	this.style = new dfChartAxisStyle() ;
	 
	this.drawableMin = 0 ;									// Position에 설정된 Width 혹은 Height 에서 그림을 그릴 수 있는
	this.drawableMax = 0 ;                                  // 영역을 설정한다.
	
	this.degreesPos = [] ;
	this.labels = [] ;
	
	// 스타일을 초기화 합니다.
	this.initStyle() ;

	// 포지션, 스타일을 적용합니다.
	this.applyPosition() ;
	
	// 위치를 적용합니다.
	this.applyStyle() ;
	
	this.species = "dfChartAxis" ;
} ;

/**
 * Children 컴퍼넌트 중에서 라벨에 해당하는 인덱스를 추가한다. 
 * 
 * @param {Object} i
 */
dfChartAxis.prototype.addLabelIndex = function(i) {
	this.labels.push(i) ;	
	
	return this.labels.length ; 
}

/**
 * 라벨의 개수를 반환한다.
 */
dfChartAxis.prototype.getLabelCount = function() {
	return this.labels.length ;	
}

/**
 * 라벨 컨트롤을 반환한다.
 * @param {Object} i
 */
dfChartAxis.prototype.getLabel = function(i) {
	var label = null ; 
	
	if(i >= 0 && i < this.labels.length) {
		label = this.children[this.labels[i]] ;
	}
	
	return label ;  	
}

/**
 * 라벨컨트롤의 텍스트를 설정한다.
 * @param {Object} index
 * @param {Object} text
 */
dfChartAxis.prototype.setLabelText = function(index, text) {
	var label = this.getLabel(index) ;
	
	if(label != null) {
		label.setText(text) ;	
	}
}

/**
 * bindset을 설정합니다.
 * @param {Object} ds
 */
dfChartAxis.prototype.setBindDataSet = function(ds){
	if (ds != undefined && ds != null) {
		this.binddataset = ds ; 
	}	
}	

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxis.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfChartAxis.prototype.initBorderStyle = function() {
} ;

dfChartAxis.prototype.initFontStyle = function() {
} ;

dfChartAxis.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxis.prototype.applyBackgorundStyle = function() {
	this.e.style.backgroundColor = this.style.background.getColor() ;
} ;

dfChartAxis.prototype.applyBorderStyle = function() {
	this.e.style.borderWidth = 0 ;
} ;

dfChartAxis.prototype.applyFontStyle = function() {
} ;

dfChartAxis.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxis.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;

/**
 * 그래프를 그릴 수 있는 영역의 최소, 최대값을 설정합니다.
 * 최소 위치 (Pixel)과 길이를 설정합니다. X축 좌표는 좌측에서 우측으로, Y축 좌표는 하단에서 상단으로 설정합니다.
 * Y축의 좌표계가 GDI와는 다르기 때문에, 주의 바랍니다. 
 */
dfChartAxis.prototype.setDrawable = function(drawableMin, drawableLength) {
	this.drawableMin = drawableMin ;
	this.drawableMax = drawableMin +  drawableLength ;
} ;

/**
 * Axis의 Scroll의 Position을 얻어오는 Method 입니다.
 */
dfChartAxis.prototype.getScrollPos = function() {
} ;

/**
 * Axis의 Scroll의 Position을 설정하는 Method 입니다.
 * @param pos
 */
dfChartAxis.prototype.setScrollPos = function(pos) {
} ;

/**
 * axis의 viewcount를 설정하는 Method 입니다.
 * @param count
 */
dfChartAxis.prototype.setViewCount = function(count) {
} ;

/**
 * axis의 viewrange를 설정하는 Method 입니다.
 * @param axisName
 * @param viewMin
 * @param viewMax
 * @return
 */
dfChartAxis.prototype.setViewRange = function(axisName, viewMin, viewMax) {
} ;

/**
 * redraw 하는 Method 입니다.
 */
dfChartAxis.prototype.draw = function() {
	this.drawAxis() ;
	this.drawDegree() ;
	this.drawLabel() ;
	this.drawMark() ;
	this.drawOriin() ;
} ;

dfChartAxis.prototype.drawText = function(){
	var g = df.$f.getGraphics() ;
	 
	g.fillRect(10, 10, 250, 250, "yellow") ;

	g.drawHLine(10, 80, 120, "black", 1) ;

	g.drawHLine(11, 110, 20, "black", 1) ;
	g.drawHLine(31, 110, 20, "black", 2) ;
	g.drawHLine(51, 110, 20, "black", 3) ;
	g.drawHLine(71, 110, 20, "black", 4) ;
	
	g.drawVLine(110, 110, 20, "black", 1) ;
	g.drawVLine(120, 110, 20, "black", 2) ;
	g.drawVLine(130, 110, 20, "black", 3) ;
	g.drawVLine(140, 110, 20, "black", 4) ;
	
	for(var i = 0 ; i < 50; i++) {
		for (var j = 0; j < 50; j++) {
			g.drawSquare(100 + (i * 6), 100 + (j * 6), 3, "black", 1, "green") ;
		}
	}
	//g.drawSquare(100, 100, 2, "black", 1) ;
	g.drawSquare(110, 110, 2, "red", 1, "blue") ;
}

/**
 * X축 및 Y축의 수직선을 그립니다. 
 */
dfChartAxis.prototype.drawAxis = function() {
	if(this.type == 1) {
		this.drawXAxis() ;
	}
	else if(this.type == 3) {
		this.drawYAxis(3) ;
	}
	else if(this.type == 4) {
		this.drawYAxis(4) ;
	}
}

/**
 * X축 수직선은 그립니다.
 */
dfChartAxis.prototype.drawXAxis = function() {
	var g = df.$f.getGraphics() ;
	
	var left = 0 ; 
	var top = 0 ;
	var gap = this.position.width * 0.01 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}

	left = left + gap ; 
	top = top ; 
	
	// 아래의 부분으 좌우에 여백을 두기 위해 5%씩 잘라냅니다. 이 부분은 나중에 변경될 것으로 여겨 집니다.
	g.drawHLine(left, top, this.position.width - (gap*2), this.style.color, this.style.axissize) ;
}

/**
 * Y축 수직선을 그립니다.
 */
dfChartAxis.prototype.drawYAxis = function(type) {
	var g = df.$f.getGraphics() ;
	 
	//var axisBegin = type == 3 ? this.position.right : this.position.left ;
	 
	// 아래의 부분은 하단에 여백을 두기 위해 10% 잘라냅니다. 이 부분은 나중에 변경될 것으로 여겨 집니다.
	var left = 0 ; 
	var top = 0 ;
	var gap = this.position.width * 0.01 ;
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	var axisBegin = type == 3 ? left + this.position.width : left ;

	g.drawVLine(axisBegin, top, this.position.height - gap, this.style.color, this.style.axissize) ;
}


/**
 * 눈금 그리는 알고리즘에 대한 설명 
 * 
 * - 눈금 그리는 방법은 X축의 경우와 Y축의 경우를 각각 나누어 처리하도록 한다. 
 *   ChartAxis의 Property는 구별이 되어 있지 않으나 챠트에서 각 축의 성격이 상이하기 때문에 각각을 구별한다.
 *   ChartAxis의 Type = 1 : 하단 X 축 / Type = 3 : 좌측 Y 축 / type = 4 : 우측 Y 축
 *   
 * - 눈금은 수직선상에 그려진다. 수직선은 ChartAxis의 Postion에서 정한 영역의 좌우 / 상하를 Full로 사용한다.
 * - 눈금의 수직선 전체에 그려지는 것은 아니고 그려지는 영역(this.drawableMin / this.drawableMax)을 설정하고 이를 기준으로 한다.
 *   이 값은 type에 따라 상하 높이 / 좌우 너비로 나뉘어 지게 된다.
 * - 눈금을 그릴수 있는 영역에 몇개의 Major 눈금을 그릴 지 결정한다. -> (this.rulermax - this.rulermin) / this.rulermajorunit
 
 *   계산식은((this.rulermax - this.rulermin) + 1)/ this.rulermajorunit 이 될 수 있다. 실제 구현된 후 요구사항을 확인해 보도록 한다.
 *   이때 스탸일은   style.rulermajorline 와 style.rulermajorsize 를 사용한다.
 *   
 * - Major 눈금 사이에 몇개의 Minor 눈금이 있는지 결정한다.
 *   Minor 눈금을 그린다. 이때 스탸일은   style.rulerminorline 와 style.rulerminorsize 를 사용한다.
 *    
 * - Y 축 좌표가 까리한 부분은 GDI는 좌상단에서 시작하나 챠트는 좌하단에서 시작한다. 
 *   이에 따라 좌표계산 할 때 this.position.bottom에서 해당 값을 빼서 처리한다.
 */


/**
 * 좌표의 눈금을 그려 줍니다.
 */
dfChartAxis.prototype.drawDegree = function() {
	if(this.type == 1) {
		this.drawDegreeX() ;
	}
	else if(this.type == 3) {
		this.drawDegreeY(3) ;
	}
	else if(this.type == 4) {
		this.drawDegreeY(4) ;
	}
}

/**
 * 수직선 상에 큰 눈금이 몇게 들어가는지 알려준다.
 */
dfChartAxis.prototype.getMajorDegreeCount = function() {
	var majorCount =  0;

	majorCount = (this.rulermax - this.rulermin) / this.rulermajorunit ;
	
	if (this.isBindLabel(this.label) || this.isExprLabel(this.label)) {
		if (this.binddataset != null) {
			majorCount = (this.binddataset.getRowCount() > this.viewcount) ? this.viewcount :  this.binddataset.getRowCount() ;
		}
	}
	
	return majorCount ;
}

/**
 * 수직상에 큰 눈금 사이의 간격을 반환한다.  
 */
dfChartAxis.prototype.getMajorDegreeSize = function(){
	var begin = this.drawableMin ; 
	var end = this.drawableMax ; 
	var majorSize = (end - begin) / this.getMajorDegreeCount() ;
	
	return majorSize ;
}	


/*
 * X축의 눈금을 그립니다.
 */
dfChartAxis.prototype.drawDegreeX = function() {
	var g = df.$f.getGraphics() ;  /// Cavas Context를 얻어 옵니다.
	
	/// 컴퍼넌트의 상대 좌표를 얻어 옵니다.
	var left = 0 ; 
	var top = 0 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}
	
	var begin = left + this.drawableMin ; // 실제 챠트를 그릴 수 있는  
	var end = left + this.drawableMax ;   // 물리적 영역을 설정합니다.
	
	// 눈금을 그리는데 필요한 변수들을 선언합니다. 큰 눈금, 작은 눈금 모두 해당됩니다.
	var majorCount = 0 ;
	var majorSize = 0 ;
	var majorThickness =  0 ;
	var majorHeigth =  0 ;
	var majorColor =  "white" ;

	var minorCount =  0 ;
	var minorSize =  0;  
	var minorThickness =  0;
	var minorHeigth =  0;
	var minorColor = "white" ;
	
	var drawMajorDegree = true ; // 큰눈금을 그릴지 여부를 설정합니다. 
	var drawMinorDegree = true ; // 작은 눈금을 그릴지 여부를 설정합니다.
	
	// 민알 binddataset의 컬럼을 이용하여 무언가를 하라고 설정된 경우에
	if (this.isBindLabel(this.label) || this.isExprLabel(this.label)) {
		if (this.binddataset != null) {
			
			/// 바인드된 dataset의 row 갯수가 화면에 보여야 눈금의 갯수 보다 크면, this.viewcount를 화면에 표시되는 갯수를 설정하고
			/// 눈금의 갯수보다 작으면 바인드된 dataset의 row 갯수를 화면에되 표시되는 것으로 설정한다. 
			/// 더불어 this.viewmin와 this.viewmax를 재설정한다.  
			if (this.binddataset.getRowCount() > this.viewcount) {
				majorCount = this.viewcount;
			}
			else {
				majorCount = this.binddataset.getRowCount() ;
				
				this.viewmin = 0 ; 
				this.viewmax = this.binddataset.getRowCount() - 1 ;
			}
			
			majorSize = (end - begin) / majorCount;
			majorThickness = this.style.rulermajorline.width;
			majorHeigth = this.style.rulermajorsize;
			majorColor = this.style.rulermajorline.color;
			
			drawMinorDegree = false;
		}
		else {
			drawMajorDegree = false ;
		}
	}
	else {
		
		majorCount = (this.rulermax - this.rulermin) / this.rulermajorunit ;
		majorSize = (end - begin) / majorCount ;
		majorThickness = this.style.rulermajorline.width ;
		majorHeigth = this.style.rulermajorsize ;
		majorColor = this.style.rulermajorline.color ;
		  
		minorCount =  this.rulermajorunit / this.rulerminorunit ;
		minorSize = majorSize / minorCount ;  
		minorThickness = this.style.rulerminorline.width ;
		minorHeigth = this.style.rulerminorsize ;
		minorColor = this.style.rulerminorline.color ;
	}
			
	var degreeleft = 0 ;
	 
	if(this.rulermajorunit != 0 && drawMajorDegree) {
		this.degreesPos.splice(0, this.degreesPos.length) ;
		
		// Major Degree를 표시합니다.	
		for(var i = 0 ; i < majorCount; i++) {
			degreeLeft = begin + (i * majorSize) ;
			
			this.degreesPos.push(degreeLeft - left - this.drawableMin) ;
			
			if(i > 0 ) { // 첫번째 MajorDegree를 건너뜁니다. 그리고 마지막 MajorDegree도 건너 뜁니다.
				//g.drawVLine(degreeLeft, this.position.top, majorHeigth, majorColor, majorThickness) ;
				g.drawVLine(degreeLeft, top, majorHeigth, majorColor, majorThickness) ;
			}
			
			if(this.rulerminorunit != 0 && drawMajorDegree) {
				// Minor Degree를 표시합니다.
				for (var k = 1; k < minorCount; k++) {
					//g.drawVLine(degreeLeft + (k * minorSize), this.position.top, minorHeigth, minorColor, minorThickness);
					g.drawVLine(degreeLeft + (k * minorSize), top, minorHeigth, minorColor, minorThickness);
				}
			}
		}
	}
}

/*
 * Y축의 눈금을 그립니다.
 */
dfChartAxis.prototype.drawDegreeY = function(type) {
	// Major 눈금을 그립니다.
	// this.rulermajorunit = n (n >= 0) 이면  주어진 간격으로 Major Line을 출력합니다.
	// this.rulermajorunit = -1 이면 xAxis에서는 모든 item 마다 major ruler line이 출력됩니다. yAxis에서는 최소값,최대값만 출력됩니다.
	// this.rulermajorunit = 0  이면 Major Line이 출력되지 않습니다. Axis Lable도 출력되지 않습니다.

	var g = df.$f.getGraphics() ; 

	var left = 0 ; 
	var top = 0 ;
	
	var position = df.utils.getOffsetPosition(this.e.id, df.$f.e.id) ;
	
	if(position.length > 0) {
		left = df.utils.getOffsetLeft(position) ;
		top = df.utils.getOffsetTop(position) ;
	}

	var begin = top + this.position.height - this.drawableMin ; 
	var end = top + this.position.height - this.drawableMax ; 
	
	var majorCount = (this.rulermax - this.rulermin) / this.rulermajorunit ;
	var majorSize = (end - begin) / majorCount ;
	var majorThickness = this.style.rulermajorline.width ;
	var majorWidth = this.style.rulermajorsize ;
	var majorColor = this.style.rulermajorline.color ;
	  
	var minorCount =  this.rulermajorunit / this.rulerminorunit ;
	var minorSize = majorSize / minorCount ;  
	var minorThickness = this.style.rulerminorline.width ;
	var minorWidth = this.style.rulerminorsize ;
	var minorColor = this.style.rulerminorline.color ;
	
	var degreeTop = 0 ; 
	var degreeMajorBegin = 0 ; 
	var degreeMinorBegin = 0 ; 
	
	if(this.rulermajorunit != 0) {
		// degreeMajorBegin = type == 3 ? this.position.right - majorWidth : this.position.left ;
		degreeMajorBegin = type == 3 ? (left + this.position.width) - majorWidth : left ;
		 
		this.degreesPos.splice(0, this.degreesPos.length) ;
		
		// Major Degree를 표시합니다.	
		for(var i = 0 ; i < majorCount; i++) {
			degreeTop = begin + (i * majorSize) ;
			
			this.degreesPos.push(degreeTop) ;

			if(i > 0 ) { // 첫번째 MajorDegree를 건너뜁니다. 그리고 마지막 MajorDegree도 건너 뜁니다.
				g.drawHLine(degreeMajorBegin, degreeTop, majorWidth, majorColor, majorThickness) ;
			}
			
			if(this.rulerminorunit != 0) {
				degreeMinorBegin = type == 3 ? (left + this.position.width) - minorWidth : this.position.left ; 
				// Minor Degree를 표시합니다.
				for (var k = 1; k < minorCount; k++) {
					g.drawHLine(degreeMinorBegin, degreeTop + (k * minorSize), minorWidth, minorColor, minorThickness) ;
				}
			}
		}
		//degreeTop = begin + (majorCount * majorSize) ;
		//g.drawHLine(degreeMajorBegin, degreeTop, majorWidth, majorColor, majorThickness) ;
	}
	//alert(this.degreesPos.toString()) ;
}

/**
 * 좌표축에 라벨을 표시하여 준다.
 * 
 * 라벨의 위치는 2가지 형식이 있다. degree에 표시되는 것과 degree 사이에 표시되는 것이다.
 * this.rulerbasetype = 'distance' 인 경우 ruler line이 각 item 사이에 위치합니다. 
 * 그리고 'point' 인 경우 ruler line이 각 item point에 위치합니다.
 */
dfChartAxis.prototype.drawLabel = function() {
	
	// this.e 하단의 ___lbl____ 을 포함하는 모든 Child를 삭제합니다.
	
	this.removeChildContainsName("___lbl____") ;
	this.labels.splice(0, this.labels.length) ; 
	
	if(this.type == 1) {
		this.drawLabelX() ;
	}
	else if(this.type == 3) {
		this.drawLabelY(3) ;
	}
	else if(this.type == 4) {
		this.drawLabelY(4) ;
	}
}


/**
 * X축에 들어가는 라벨을 표시합니다.
 */
dfChartAxis.prototype.drawLabelX= function(){
	var g = df.$f.getGraphics() ; 
	
	// this.rulerbasetype의 값이 "distance"인 경우에는 위치가 하나 빠진다.
	var count = this.rulerbasetype == "point" ? this.degreesPos.length -1 : this.degreesPos.length ;
	
	// 큰 눈금 사이의 거리를 구합니다. this.rulerbasetype이 point 이거나 distance 인 경우 거리는 모두 같은 값을 사용합니다.
	var width = this.getMajorDegreeSize() ;
	 
	// 라벨의 시작위치 값을 설정합니다.
	var left = this.rulerbasetype == "point" ? this.drawableMin + (width / 2) : this.drawableMin ;
	
	// X 축의 라벨의 Top은 Axis의 Top (수직선이 그려진 부분)에 큰 눈금의 길이값을 더한 것이다.
	var top = this.style.rulermajorsize ; // this.style.axissize ;  
	var bottom = this.position.height ;
	
	/**
	 * 아래의 좌표 계산하는 방법을 설명합니다. (변수의 left, top, right, bottom 이 아니라, new dfLaebl(....)에 첨자로 사용되는 값이다.)
	 * 
	 * left : 시작 left 좌표에서 width를 계속 더합니다. 각 라벨사이에는 ajorDegree의 굵기 만큼 간격을 가집니다. 
	 *        첫번째, 마지막에서는 Y 축의 굵기가 MajorDegree의 굵기 보다 큰 경우 좀 어색하게 그려질 수 있으니 참고바랍니다.
	 * top :  X 좌표의 경우 Axis영역의 상단에 수직선이 있으므로 굵은 눈금의 길이가 top이 된다.
	 * right : left + width 이 기본이 되며 이 값에서 MajorDegree의 굵기 * 2 (좌우) 를 뺀 값을 사용한다. 
	 * bottom : Axis의 최하단 값 = this.position.height
	 */
	
	for(var i = 0 ; i < count; i++) {
		var lblLabel = new dfLabel("___lbl____" + i, 
		                           left + (i * width) + this.style.lablepadding.left, 
		                           top                + this.style.lablepadding.top, 
								   left + (i * width) + width - this.style.lablepadding.right, 
								   bottom                     - this.style.lablepadding.bottom) ;
		
		lblLabel.style.aligh.set("center", "top") ;
		
		lblLabel.setText(this.getLabelText(i)) ;
		
		this.addLabelIndex(this.appendChild(lblLabel) - 1) ;

		lblLabel.style.font.set(this.style.labelfont.face, this.style.labelfont.size, this.style.labelfont.type) ;
		lblLabel.style.border.setWidth(0) ;
		
		lblLabel.applyBackgorundStyle() ; 
		lblLabel.applyBorderStyle() ; 
		lblLabel.applyFontStyle() ; 
		lblLabel.applyMiscStyle() ; 
	}
}

/**
 * Y축에 들어가는 라벨을 설정합니다.
 * 
 * @param {Object} type
 */
dfChartAxis.prototype.drawLabelY = function(type){
	var g = df.$f.getGraphics() ; 
	
	
	// this.rulerbasetype의 값이 "distance"인 경우에는 위치가 하나 빠진다.
	var count = this.rulerbasetype == "point" ? this.degreesPos.length -1 : this.degreesPos.length ;
	
	// 큰 눈금 사이의 거리를 구합니다. this.rulerbasetype이 point 이거나 distance 인 경우 거리는 모두 같은 값을 사용합니다.
	var height = this.getMajorDegreeSize() ;
	var width  = this.position.width - this.style.rulermajorsize ;
	 
	// Y축의 라벨의 left는 tyle이 3인 경우 (왼쪽 Y 축인 경우) 0 이며 
	// tyle이 4인 경우 (오른쪽 Y 축인 경우) Axis의 Left(0) (수직선이 그려진 부분)에 큰 눈금의 길이값을 더한 것이다.
	var left = type == 3 ? 0 : this.style.rulermajorsize ; 
	
	//var top = this.style.rulermajorsize ; // this.style.axissize ;
	var bottom = this.rulerbasetype == "point" ? (this.position.height - this.drawableMin) - (height / 2) : (this.position.height - this.drawableMin) ;
	var top = bottom - height ;
	
	/**
	 * 아래의 좌표 계산하는 방법을 설명합니다. (변수의 left, top, right, bottom 이 아니라, new dfLaebl(....)에 첨자로 사용되는 값이다.)
	 * 
	 */
	
	var align = type == 3 ? "right" : "left" ; 
	for(var i = count ; i > 0 ; i--) {
		var lblLabel = new dfLabel("___lbl____" + i, 
		                           left + this.style.lablepadding.left, 
								   top - ((count - i) * height) + this.style.lablepadding.top, 
								   left  + width - this.style.lablepadding.right, 
								   top - ((count - i) * height)  + height - this.style.lablepadding.bottom) ;
		
		lblLabel.style.aligh.set(align, "middle") ;
		lblLabel.setText(this.getLabelText(count - i)) ;
		
		this.addLabelIndex(this.appendChild(lblLabel) - 1) ;

		lblLabel.style.font.set(this.style.labelfont.face, this.style.labelfont.size, this.style.labelfont.type) ;
		lblLabel.style.border.setWidth(0) ;
		
		lblLabel.applyBackgorundStyle() ; 
		lblLabel.applyBorderStyle() ; 
		lblLabel.applyFontStyle() ; 
		lblLabel.applyMiscStyle() ; 
	}
}


dfChartAxis.prototype.drawMark = function() {
	var g = df.$f.getGraphics() ; 
}

dfChartAxis.prototype.drawOriin = function() {
	var g = df.$f.getGraphics() ; 
}


/**
 * 좌표축에 표시 될 라벨의 값을 읽어 옵니다. 
 */
dfChartAxis.prototype.getLabelText = function(i) {
	var text = "";
	 
	switch (this.getLabelType(this.label)) {
		case 0 :  // 일반 텍스트
			text = this.label ;
			break ;
		case 1 :  // DataSet에 컬럼이 바인드 된 경우
			text = this.binddataset.getColumn(this.viewmin + i, this.getBindColumn(this.label)) ;
			break ;
		case 2 :  // Expression으로 되어 있는 경우
			text = this.binddataset.getColumn(this.viewmin + i, this.getBindColumn(this.label)) ;
			break;
		default :
			break ;
	}
	
	return text ;
}
/// Style for Chart Legend Overloading
//dfChartAxis.prototype.style = new dfChartAxisStyle() ; 



/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 초기화 관련 Overloading
 * 
 * this.initStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

dfChartAxis.prototype.initBackgroundStyle = function() {
	this.style.background.setColor("white") ;
} ;

dfChartAxis.prototype.initBorderStyle = function() {
	this.style.border.setColor("black") ;
	this.style.border.setColor2("black") ;
	this.style.border.setStyle("solid") ;
	this.style.border.setWidth(0) ;
} ;

dfChartAxis.prototype.initFontStyle = function() {
	this.style.font.setFace("Arial Black") ;
} ;

dfChartAxis.prototype.initMiscStyle = function() {
} ;


/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 스타일 적용 관련 Overloading
 * 
 * applyStyle() ; 에서 각각을 호출하게 됩니다. 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxis.prototype.applyBackgorundStyle = function() {
} ;

dfChartAxis.prototype.applyBorderStyle = function() {
} ;

dfChartAxis.prototype.applyFontStyle = function() {
} ;

dfChartAxis.prototype.applyMiscStyle = function() {
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * Position 적용 관련 Overloading
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
dfChartAxis.prototype.applyPosition = function() {
	dfControl.prototype.applyPosition.call(this) ;
} ;



/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartSeriesStyle Class dfChartStyle에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfChartSeriesStyle = df.classutil.create(dfStyle) ; 

dfChartSeriesStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;

	this.datatextalign = new dfAlign("center", "middle") ;				/// DataText가 Point를 기준으로 출력되는 위치를 지정하는 Property 입니다.
	this.datatextbackground = new dfBackground(true, "white", "", "", new dfPosition("absolute", 0, 0, 0, 0), false) ; 	/// Series의 DataText 영역의 Background를 지정하는 Property 입니다.
	this.datatextborder = new dfBorder("black", "black", "solid", 1) ;	/// Series의 DataText 영역의 Border를 지정하는 Property 입니다.
	this.datatextbordertype = new dfBorderType("normal", 0, false, false, false, false) ;			/// Series의 DataText 영역의 BorderType을 지정하는 Property 입니다.
	this.datatextcolor = "black" ;			/// Series내 Data Text Color를 지정하는 Property 입니다. 
	this.datatextfont = new dfFont("Times New Roman", 10, "normal") ; 	/// Series내 Data Text Font를 지정하는 Property 입니다.
	this.datatextgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ;	/// Series의 DataText 영역의 Background Gradation를 지정하는 Property 입니다.
	this.datatextguideline = new dfLineBorder("black", "black", "solid", 1) ; 
	this.datatextguidesize = 0 ; 										/// Series Data Text의 Guide Line Size를 지정하는 Property 입니다.
	this.datatextguidetype = "straigh" ;								/// Series Data Text의 Guide Line 의 종류를 지정하는 Property 입니다. 
	this.datatextlocation = "point" ;									/// Series Data Text 영역이 출력되는 기준위치를 지정하는 Property 입니다.
	this.datatextmargin = new dfMargin(0, 0, 0, 0) ;					/// DataText 영역의 위치를 보정하는 Property 입니다.
	this.datatextpadding =  new dfPadding(0, 0, 0, 0) ;					/// Series의 DataText와 DataTextBorder와의 간격을 지정하는 Property 입니다.

	this.fillbrush = new dfFillbrush(false, "black", "none") ;				/// Sereis의 각 Item을 출력할 Brush를 지정하는 Property 입니다. 
	this.fillgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ; /// Series fillbrush의 fill style 이 gradation 인경우 사용될 gradation을 지정하는 Property 입니다.
	this.fillhatch = new dfHatch("black", "vertical") ;
	this.miterjoinlimit = 3	;											/// Series strokejoin이 miterjoin으로 설정되어있는 경우에 miterjoin 의 길이를 제한하는 Property 입니다.

	this.pointfillbrush = new dfFillbrush(false, "black", "none") ;			/// Sereis의 각 DataPoint을 출력할 Brush를 지정하는 Property 입니다.
	this.pointfillgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ; /// Series pointfillbrush의 fill style 이 gradation 인경우 사용될 gradation을 지정하는 Property 입니다.
	this.pointfillhatch = new dfHatch("black", "vertical") ;			/// Series DataPoint의 hatch 정보를 설정하는 Property 입니다.
	this.pointmiterjoinlimit = 3 ;										/// Series pointstrokejoin이 miterjoin으로 설정되어있는 경우에 miterjoin 의 길이를 제한하는 Property 입니다.
	this.pointshape = "none" ;											/// Series의 각 DataPoint의 Shape Type을 지정하는 Property 입니다. 'circle' 원형의 Shape를 출력합니다. 
																		/// 	'crossline' 수직선과 수평선을 출력합니다. 
																		/// 	'horzline' 수평선을 출력합니다. 
																		/// 	'none' DataPoint를 출력하지 않습니다.(Default) 
																		/// 	'rectangle' 정사각형의 Shape를 출력합니다. 
																		/// 	'rhombus' 마름모형의 Shape를 출력합니다. 
																		/// 	'triangle' 정삼각형의 Shape를 출력합니다. 
																		/// 	'vertline' 수직선을 출력합니다
	this.pointsize = 10 ;												/// Series의 각 DataPoint의 Size를 지정하는 Property 입니다.
	this.pointstrokecap = "flat" ;										/// pointstroke의 머리 부분 모양을 설정하는 Property 입니다. 
																		/// 	'flat' : 평평한 보통 타입(default값) 
																		///		'round' : 둥근 타입 
																		///		'square' : 각진 타입
	this.pointstrokejoin = "bevel" ;									/// pointstroke의 연결방식을 설정하는 Property 입니다.
																		/// 	'bevel' : 끝이 각진 직사각형 타입 (default값) 
																		///		'miter' : 직사각형 타입
																		///		'round' : 끝이 둥근 타입
	this.pointstrokepen = new dfStrokePen(false, "black", "solid", 1) ;	/// DataPoint Shape의 stroke에 대한 속성을 설정하는 Property 입니다.

	this.selectcolor = "black" ;										/// Select 상태의 Series Text color를 지정하는 Property 입니다.
	this.selectdatatextbackground = new dfBorder("black", "black", "solid", 1) ;/// 선택된 Series Item의 DataText 영역의 Background를 지정하는 Property 입니다
	this.selectdatatextborder = new dfBorder("black", "black", "solid", 1) ;	/// DataText 영역의 Border를 지정하는 Property 입니다.
	this.selectdatatextcolor = "black" ;								/// 선택된 Series Item의 Data Text Color를 지정하는 Property 입니다.
	this.selectdatatextfont = new dfFont("Times New Roman", 10, "normal") ;		/// 선택된 Series Item의 Data Text Font를 지정하는 Property 입니다.
	this.selectdatatextgradation =  new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ; /// 선택된 Series Item의 DataText 영역의 Background Gradation를 지정하는 Property 입니다.
	this.selectdatatextguideline = new dfLineBorder("black", "black", "solid", 1) ; 
	
	this.selectfillbrush = new dfFillbrush(false, "black", "none") ;		/// 선택된 Series Item을 출력할 Brush를 지정하는 Property 입니다
	this.selectfillgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ; /// 선택된 Series Item의 fillbrush의 fill style 이 gradation 인경우 사용될 gradation을 지정하는 Property 입니다
	this.selectfillhatch = new dfHatch("black", "vertical") ;			/// 선택된 Series Item의 hatch 정보를 설정하는 Property 입니다.
	this.selectfont = new dfFont("Times New Roman", 10, "normal") ; 	/// Select 상태의 Series Text font를 지정하는 Property 입니다.
	this.selectindent = 0 ; 											/// 선택된 Series Item의 도출값을 지정하는 Property 입니다.
	this.selectstrokepen = new dfStrokePen(false, "black", "solid", 1) ;	/// 선택된 DataItem의 stroke에 대한 속성을 설정하는 Property 입니다.

	this.selectpoiontsize = 0 ;												/// 선택된 Series Item의 각 DataPoint의 Size를 지정하는 Property 입니다.
	this.selectpointfillbrush = new dfFillbrush(false, "black", "none") ;		/// 선택된 Series Item의 각 DataPoint을 출력할 Brush를 지정하는 Property 입니다.
	this.selectpointfillgradation = new dfGradation("none", "black", 0, 0, "black", 0, 0, "black", 0) ; /// Series selectpointfillbrush의 fill style 이 gradation 인경우 사용될 gradation을 지정하는 Property 입니다
	this.selectpointfillhatch = new dfHatch("black", "vertical") ;			/// 선택된 Series Item의 DataPoint의 hatch 정보를 설정하는 Property 입니다
	this.selectpointstrokepen = new dfStrokePen(false, "black", "solid", 1) ;	/// 선택된 DataPoint Shape의 stroke에 대한 속성을 설정하는 Property 입니다.
	
	this.strokecap = "flat" ;											/// Series Item의 pointstroke의 머리 부분 모양을 설정하는 Property 입니다. 
	this.strokejoin = "bevel" ;											/// pSeries Item의 stroke의 연결방식을 설정하는 Property 입니다.
	this.strokepen = new dfStrokePen(false, "black", "solid", 1) ;		/// DataItem의 stroke에 대한 속성을 설정하는 Property 입니다.
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfChartSeriesStyle 클래스
 * 
 * @param name
 * @param left
 * @param top
 * @param right
 * @param bottom
 * @return
 * 
 * ************************************************************************************************************************************\
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */

var dfChartSeries = df.classutil.create(dfControl) ; 

dfChartSeries.prototype.initialize = function(name, left, top, right, bottom) {
	
	dfControl.prototype.initialize.call(this) ;

	this.init(name, left, top, right, bottom) ;
	
	this.style = new dfChartSeriesStyle() ;								/// Style for Chart Title Overloading

	this.datatext = "" ;												/// Series의 Data Text로 출력할 text를 지정하는 Property 입니다.
	this.datatooltiptext = "" ;
	this.datatooltiptype = "" ;
	this.label = "" ;													/// Series가 Legend에 표시될 Text를 지정하는 Property 입니다.
	this.select = false ;												/// Series가 선택됬는지 여부를 지정하는 Property 입니다.
	this.selectdata = "" ; 												/// Series의 각 item이 선택됬는지 여부를 지정하는 Property 입니다.
	this.text = "" ; 													/// Series 영역에 출력될 text를 지정하는 Property 입니다.
	this.type = "line" ;												/// Series의 Type을 지정하는 Property 입니다.
	this.data = "" ;													/// Series의 xAxis의 data로 사용될 columnid를 지정하는 Property 입니다.
	this.xaxisdata = "" ;												/// Series의 xAxis의 data로 사용될 columnid를 지정하는 Property 입니다.
	this.yaxisdata = "" ;												/// Series의 yAxis의 data로 사용될 columnid를 지정하는 Property 입니다.
	
	this.binddataset = null ; 

	this.min = 0 ;														/// 각 시리즈에 바인딩 된 값 중에서 가장 작은 값
	this.max = 0 ;														/// 각 시리즈에 바인딩 된 값 중에서 가장 큰 값
	
	this.positions = [] ; 												/// 각 시리즈의 그래프 위치 들, 갯수는 binddataset의 row 개수와 동일하다.
} ;

/**
 * 각 시리즈의 그래프 위치들을 초기화 합니다.
 */
dfChartSeries.prototype.clearPositions = function() {
	var count = this.positions.length ;
	
	if(count > 0) {
		while(this.positions.length > 0) {
			delete this.positions.pop() ;
		}	
	}
}

/**
 * 새로운 그래프 위치를 추가한다.
 * 
 * @param {Object} left
 * @param {Object} top
 * @param {Object} right
 * @param {Object} bottom
 */
dfChartSeries.prototype.addPosition = function(left, top, right, bottom) {
	var position = new dfRect(left, top, right, bottom) ; 
	this.positions.push(position) ;
	
	return position ;
}

/**
 *  그래프 위치'들'의 갯수를 반환한다.
 */
dfChartSeries.prototype.getPositionCount = function() {
	return this.positions.length ;
}

/**
 * index에 해당하는 그래프 위치를 반환한다.
 * @param {Object} index
 */
dfChartSeries.prototype.getPosition = function(index) {
	if(index >= 0 && index < this.positions.length) {
		var position = this.positions[index] ;			
	}	
	return position ;
}

/**
 * Bind 돤 Dataset을 설정한다. 
 * 
 * @param {Object} ds
 */
dfChartSeries.prototype.setBindDataSet = function(ds){
	if (ds != undefined && ds != null) {
		this.binddataset = ds ; 
	}
}	


/**
 * 시리즈의 데이터에 대해서 최대값과 최소값을 0으로 초기화 합니다. 
 */
dfChartSeries.prototype.resetMinMax = function(){
	this.min = 0 ;
	this.max = 0 ;
}

/**
 * 시리즈의 데이터에 대해서 최대값과 최소값을 구합니다. 
 */
dfChartSeries.prototype.getMinMax = function(){
	
	if (this.isBindLabel(this.data) || this.isExprLabel(this.data)) {
		
		if(this.binddataset != null) {
			var max = Number.MIN_VALUE;
			var min = Number.MAX_VALUE;
			var value = 0 ; 
			
			var rowCount = this.binddataset.getRowCount();
			var column = this.getBindColumn(this.data) ;  			
			
			for(var i = 0 ; i < rowCount; i++) {
				value = this.binddataset.getColumn(i, column) ;
				if (value > max) {
					max = value ;
				}
				
				if (value < min) {
					min = value ;
				}
			}
			
			this.max = max ;
			this.min = min ;
		}
	}
	else {
		this.min = this.data ;
		this.max = this.data ;
	}
}

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfScrollbarStyle Class 
 * 
 * dfScrollbar에 반영되는 고유의 스타일이다.
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfScrollbarStyle = df.classutil.create(dfStyle) ; 

dfScrollbarStyle.prototype.initialize = function(){
	dfStyle.prototype.initialize.call(this) ;
} ;

/**************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * 
 * dfScrollbar 클래스 
 * 
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 * ************************************************************************************************************************************
 */
var dfScrollbar = df.classutil.create(dfControl) ; 

dfScrollbar.prototype.initialize = function(name, left, top, right, bottom) {
	dfControl.prototype.initialize.call(this) ;

	this.e = df.$c("div") ;
	this.e.id = name ; 
	
	this.style = new dfScrollbarStyle() ;
	
	this.init(name, left, top, right, bottom) ;
} ;