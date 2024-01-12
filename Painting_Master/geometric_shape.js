function create_geometric_button(button_radius)
{
    //畫直線的按鈕
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 35,
        y: 565,
        radius: button_radius,
        layer: true,
        name: 'lineButton',
	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('lineButton').x,
		y: $('canvas').getLayer('lineButton').y,
		width: 50,
		height: 40,
		text: 'Line',
		layer: true,
		name: 'lineText',
		intangible: true
	});	

	// 畫長方形的按鈕
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 105,
        y: 565,
        radius: button_radius,
        layer: true,
        name: 'rectangleButton',

	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('rectangleButton').x,
		y: $('canvas').getLayer('rectangleButton').y,
		width: 50,
		height: 40,
		text: 'Rectangle',
		fontSize: 11.5,
		layer: true,
		name: 'retangleText',
		intangible: true
	});	


    // 畫圓形的按鈕
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 175,
        y: 565,
        radius: button_radius,
        layer: true,
        name: 'circleButton',
	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('circleButton').x,
		y: $('canvas').getLayer('circleButton').y,
		width: 50,
		height: 40,
		text: 'Circle',
		fontSize: 11.5,
		layer: true,
		name: 'circleText',
		intangible: true
	});	

}

function draw_geo_shape(startX,startY,endX,endY,geo_count, allSet, button){
    // 使用 jQuery-canvas 插件添加線條圖層
    if(button == 'lineButton'){
        $('canvas').addLayer({
            name: `geo${geo_count.a}`,
            type: 'line',
            strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle, // 線條顏色為紅色
            strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,      // 線條寬度為3像素
            x1: startX,              // 起點 x 座標
            y1: startY,              // 起點 y 座標
            x2: endX,             // 終點 x 座標
            y2: endY               // 終點 y 座標
        });
    }
    else if(button == 'rectangleButton'){
        $('canvas').addLayer({
            name: `geo${geo_count.a}`,
            type: 'rectangle',    // 指定形狀類型為矩形
            strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,  // 邊框顏色為藍色
            strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,       // 邊框寬度
            x: startX+(endX-startX)/2, // 矩形左上角 x 座標
            y: startY+(endY-startY)/2, // 矩形左上角 y 座標
            width: endX-startX,// 矩形寬度
            height: endY-startY, // 矩形高度
            fillStyle: 'transparent'  // 填充顏色為透明
        });
    }
    else{
        $('canvas').addLayer({
            name: `geo${geo_count.a}`,
            type: 'arc',               // 圖層類型為圓形
            fillStyle: 'transparent',  // 填充顏色為透明
            strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,       // 圓形邊框顏色為藍色
            strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,            // 圓形邊框寬度
            x: (endX + startX) / 2,     // 圓心 x 座標
            y: (endY + startY) / 2,     // 圓心 y 座標
            radius: (Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2)))/2,  // 半徑取最小值，以確保圓形完全在矩形內
            start: 0,
            end: 360,
        });
    }
    // 繪製圖層
    $('canvas').drawLayers();
    allSet.push(`geo${geo_count.a}`);
    geo_count.a++;
}