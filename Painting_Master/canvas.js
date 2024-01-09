// canvas.js
$(document).ready(function() {

    var allSet = [];

    var pathPoints = []; // Stores the path of the mouse
    var pathSet = [];  // stores the userPath(s)
    var isPainting = false;
    var colorRadius = 30;
    var before_pathPoints = 0;

    var colors = [];  // Array to store all colors (circle), and eraser
    var thickCircles = [];  // Array to store all thickness (circle)
    var thickPoints = [];  // Array to store all thickness (point)
    var penOpacity = 1.0;  // Set the opacity of pen

    var objCount = 0;
    var flag_copy = [false,false,false,false,false];
    var newObj = [];

    var isLine= false;
	var isRectangle=false;
    var isCircle= false;

    // DRAW THE COLOR CIRCLE
    var color_count = 0;  // colors counter
    var color_num = 5;  // total number of colors
    var color_fillStyle = ['#00d', '#f00', '#ffd400', '#7fb80e', '#000'];  // the colors of circles, respectively
    var color_name = ['blueCircle', 'redCircle', 'yellowCircle', 'greenCircle', 'blackCircle'];  // the names of circles
    for(color_count = 0; color_count < color_num; ++color_count){
        $('canvas').drawArc({
            fillStyle: color_fillStyle[color_count],
            opacity: 1.0,
            x: 35,
            y: 35 + color_count*70,
            radius: colorRadius,
            layer: true,
            name: color_name[color_count],
            visible: true,
        });
        colors.push($('canvas').getLayer(color_name[color_count]));
    }

    // DRAW THE ERASER BOTTON
    $('canvas').drawArc({
        fillStyle: '#fff', // White
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 1.0,
        x: 35,
        y: 385,
        radius: colorRadius,
        layer: true,
        name: 'eraserButton'
    });
    colors.push($('canvas').getLayer('eraserButton'));
    // DRAW TEXT ON ERASER BUTTON
    $('canvas').drawText({
        fillStyle: '000', // Black
        x: 35,
        y: 35 + color_count*70,
        width: 50,
        height: 40,
        text: 'Eraser',
        layer: true,
        name: 'eraserText',
        intangible: true
    });

    // DRAW THE PEN BOTTON
    $('canvas').drawArc({
        fillStyle: '#111', // Gray
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 1,
        x: 35,
        y: 35 + + 70 + color_count*70,
        radius: colorRadius,
        layer: true,
        visible: false,
        name: 'penButton'
    });
    // DRAW TEXT ON PEN BUTTON
    $('canvas').drawText({
        fillStyle: '#fff', // White
        x: 35,
        y: 35 + 70 + color_count*70,
        width: 50,
        height: 40,
        text: 'Pen',
        layer: true,
        name: 'penText',
        intangible: true,
        visible: false,
    });

    // DRAW THE HIGHLIGHT BOTTON
    $('canvas').drawArc({
        fillStyle: '#ff0', // Yellow
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 0.3,
        x: 35,
        y: 35 + + 70 + color_count*70,
        radius: colorRadius,
        layer: true,
        visible: true,
        name: 'HLButton'
    });
    // DRAW TEXT ON HIGHLIGHT BUTTON
    $('canvas').drawText({
        fillStyle: '#000', // Black
        x: 35,
        y: 35 + 70 + color_count*70,
        width: 50,
        height: 40,
        text: 'Highlight',
        layer: true,
        name: 'HLText',
        intangible: true,
        visible: true,
    });

    var changePen_flag = 0;
    function changePen(){
        changePen_flag = 1;
        if( $('canvas').getLayer('HLButton').visible == true ){
            $('canvas').getLayer('HLButton').visible = false;
            $('canvas').getLayer('HLText').visible = false;
            $('canvas').getLayer('penButton').visible = true;
            $('canvas').getLayer('penText').visible = true;
            penOpacity = 0.3;
        }
        else{
            $('canvas').getLayer('HLButton').visible = true;
            $('canvas').getLayer('HLText').visible = true;
            $('canvas').getLayer('penButton').visible = false;
            $('canvas').getLayer('penText').visible = false;
            penOpacity = 1.0;
        }
    }

    // DRAW RESET BUTTON
    $('canvas').drawArc({
        fillStyle: '#f00', // Red
        x: 550,
        y: 565,
        radius: 30,
        layer: true,
        name: 'resetButton',
    });
    // DRAW TEXT ON RESET BUTTON
    $('canvas').drawText({
        fillStyle: '#fff', // White
        x: $('canvas').getLayer('resetButton').x,
        y: $('canvas').getLayer('resetButton').y,
        width: 50,
        height: 40,
        text: 'Reset',
        layer: true,
        name: 'resetText',
        intangible: true
    });

    // DRAW UNDO BUTTON
    $('canvas').drawArc({
        fillStyle: '#f0f', // Red
        x: 650,
        y: 565,
        radius: 30,
        layer: true,
        name: 'undoButton',
    });
    // DRAW TEXT ON UNDO BUTTON
    $('canvas').drawText({
        fillStyle: '#fff', // White
        x: $('canvas').getLayer('undoButton').x,
        y: $('canvas').getLayer('undoButton').y,
        width: 50,
        height: 40,
        text: 'Undo',
        layer: true,
        name: 'undoText',
        intangible: true
    });

    // 存檔鍵
    // Draw the save button on the canvas
    // Draw the save button as a circle on the canvasx: 1160,  // X-coordinate
    $('canvas').drawArc({
        fillStyle: '#0d6efd', // Blue color
        x: 1080, y: 565, // Adjust position as needed
        radius: 30, // Radius of the circle
        layer: true,
        name: 'saveButton'
    });

    $('canvas').drawText({
        fillStyle: '#fff', // White text
        x: 1080, y: 565,
        fontSize: 15,
        fontFamily: 'Verdana, sans-serif',
        text: 'Save',
        layer: true,
        name: 'saveButtonText',
        intangible: true
    });
    
    function saveCanvas(targetWidth, targetHeight) {
        // 獲取原始畫布和其上下文
        var originalCanvas = $('canvas')[0];
        var originalContext = originalCanvas.getContext('2d');
    
        // 創建一個新的臨時畫布和其上下文
        var tempCanvas = document.createElement('canvas');
        var tempContext = tempCanvas.getContext('2d');
    
        // 設置臨時畫布的大小
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
    
        // 計算裁剪後的位置
        var cropX = (originalCanvas.width - targetWidth) / 2;
        var cropY = (originalCanvas.height - targetHeight) / 2;
    
        // 清空臨時畫布
        tempContext.clearRect(0, 0, targetWidth, targetHeight);
    
        // 將原始畫布的內容裁剪後繪製到臨時畫布上
        tempContext.drawImage(originalCanvas, cropX, cropY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    
        // 將臨時畫布的內容導出為圖像
        var image = tempCanvas.toDataURL('image/png');
        
        // 創建下載連結
        var link = document.createElement('a');
        link.download = 'my-painting.png';
        link.href = image;
    
        // 模擬點擊下載連結
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    

    // DRAW DIFFERENT THICKNESS CIRCLR
    for(var thickCount = 1; thickCount<=5; ++thickCount){
        $('canvas').drawArc({
            fillStyle: '#fff', // White
            strokeStyle: 'black', // Border color
            strokeWidth: 2, // Border width
            opacity: 1.0,
            x: 1165,
            y: -35 + 70*thickCount,
            radius: colorRadius,
            layer: true,
            name: `Circle_${thickCount}`
        });
        $('canvas').drawArc({
            fillStyle: '#000', // Black
            opacity: 1.0,
            x: 1165,
            y: -35 + 70*thickCount,
            radius: thickCount*2,
            layer: true,
            name: `Point_${thickCount}`
        });
        thickCircles.push($('canvas').getLayer(`Circle_${thickCount}`));
        thickPoints.push($('canvas').getLayer(`Point_${thickCount}`));
    }

    // DRAW IMAGES
    var img_num = 4;  // total image number
    var img_source = ['../picture/star.png', '../picture/heart.png',
                        '../picture/cake.png', '../picture/light.png'];  // store location of images
    var img_name = ['star', 'heart', 'cake', 'light'];  // name of images in img_source, respectively
    var img_size = [70, 100 ,100 ,70];  // size of images in img_source, respectively

    for(var img_count = 0; img_count < img_num; img_count++){
        $('canvas').drawImage({
            source: img_source[img_count],
            x: 500 + 70*img_count,
            y: 30,
            width: img_size[img_count],
            height: img_size[img_count],
            layer: true,
            name: img_name[img_count],
            visible: true,
            index: 5,
        });
    }

    // DRAW TRASHCAN
    $('canvas').drawImage({
        source: '../picture/trashCan.png',
        x: 1160,  // X-coordinate
        y: 560,  // Y-coordinate
        width: 100,  // Image width
        height: 100,  // Image height
        layer: true,
        name: 'trashCan',
        visible: true,  // Set to true to make the image visible
        index: 5,
    });

    //畫直線
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 35,
        y: 565,
        radius: 30,
        layer: true,
        name: 'Line',
	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('Line').x,
		y: $('canvas').getLayer('Line').y,
		width: 50,
		height: 40,
		text: 'Line',
		layer: true,
		name: 'Guide_line',
		intangible: true
	});	

	// 畫長方形
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 105,
        y: 565,
        radius: 30,
        layer: true,
        name: 'Rectangle',

	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('Rectangle').x,
		y: $('canvas').getLayer('Rectangle').y,
		width: 50,
		height: 40,
		text: 'Rectangle',
		fontSize: 11.5,
		layer: true,
		name: 'Guide_retangle',
		intangible: true
	});	


    // 畫圓形
	$('canvas').drawArc({
        fillStyle: '#aa00ff',
        x: 175,
        y: 565,
        radius: 30,
        layer: true,
        name: 'Circle',
	

	});

	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('Circle').x,
		y: $('canvas').getLayer('Circle').y,
		width: 50,
		height: 40,
		text: 'Circle',
		fontSize: 11.5,
		layer: true,
		name: 'Guide_circle',
		intangible: true
	});	


    // LEAP MOTION TEXT POSITION
    $('canvas').drawText({
        fillStyle: '#000', // Black
        x: 100,
        y: 590,
        fontSize: 14,
        fontFamily: 'Verdana, sans-serif',
        text: "Leap",
        layer: true,
        name: 'leapxy',
        visible: false  // if need to find position, set visible 'true'
    });

    // CREATE A PURPLE CIRCLE LAYER TO SEE THE FINGER POSITION
    $('canvas').drawArc({
        fillStyle: '#c0f', // Purple
        radius: 3, // 預設
        layer: true,
        name: 'leapCursor_pointer',
        visible: false,
    });
    $('canvas').drawArc({
        fillStyle: '#fff', // White
        opacity: 0.5,
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        radius: 10,
        layer: true,
        name: 'leapCursor',
        visible: false,
    });
    
    function addUserPathLayer() {
        $('canvas').addLayer({
            name: `userPath${pathSet.length}`,
            type: 'line',
            strokeStyle: '#ddd', // set init color 'White'
            strokeWidth: 4,  // 預設
            opacity: penOpacity,
            index: pathSet.length,
        });
    }


    function resetALL() {
        for( var i = 0; i < pathSet.length; ++i ){
            $('canvas').removeLayer(`userPath${i}`);
        }
        pathSet = [];
        for( var j = 0; j< newObj.length; ++j ){    
            $('canvas').removeLayer(newObj[j]);
        }
        newObj = [];
        $('canvas').removeLayer(`dot_l`);// 我加的
        $('canvas').removeLayer(`dot_r`);// 我加的
        $('canvas').removeLayer(`dot_c`);// 我加的    
		// 一開始預設最多100個畫線和矩型
		for (let i = 0; i <= 100; i++) {
			var count=i.toString();
			$('canvas').removeLayer(`line${count}`);// 我加的
			$('canvas').removeLayer(`rectangle${count}`);// 我加的
            $('canvas').removeLayer(`circle${count}`);// 我加的
            
		}
    }

    var undoFlag = 0;
    function undoPath(){
        $('canvas').removeLayer(allSet[allSet.length-1]);
        //$('canvas').removeLayer(`line${101 - allSet.length}`);
        //$('canvas').removeLayer(`rectangle${101 - allSet.length}`);
        //$('canvas').removeLayer(`circle${101 - allSet.length}`);
        undoFlag = 1;
        allSet.pop();
    }

    var startxy=0, startxy_r=0,startxy_c=0;
    var startX, startY, endX, endY;
    // 生成包含 100 個數字字串的陣列，畫線和畫矩型有100個
	var counts = [];
	for (let iii = 0; iii <= 100; iii++) {
		counts.push(iii.toString());
	}

    // SETUP AND OBTAIN DATA FROM LEAP MOTION
    Leap.loop({}, function(frame) {
        if (frame.pointables.length > 0) {

            console.log(allSet);

            var leapCursorLayer = $('canvas').getLayer('leapCursor');
            var leapCursorPointer = $('canvas').getLayer('leapCursor_pointer');
            var saveButtonLayer = $('canvas').getLayer('saveButton');
            leapCursorLayer.visible = true;
            leapCursorPointer.visible = true;

            var pointable = frame.pointables[1];

            //食指的位置
            var pointerOnCanvas = {
                x: (frame.pointables[1].tipPosition[0]+200) * 3,
                y: (frame.pointables[1].tipPosition[2]+100) * 3
            };        

            var hand = frame.hands[0];

            // start
            var collision_l=collisionTest(leapCursorLayer, $('canvas').getLayer('Line'));
            var collision_r=collisionTest(leapCursorLayer, $('canvas').getLayer('Rectangle'));
            var collision_c=collisionTest(leapCursorLayer, $('canvas').getLayer('Circle'));
            //畫直線
            var leapCursorLayer = $('canvas').getLayer('leapCursor');

             // 存檔判斷
             if (collisionTest(leapCursorLayer, saveButtonLayer)) {
                if (!saveButtonLayer.hoverStartTime) {
                    saveButtonLayer.hoverStartTime = new Date().getTime();
                } else if (new Date().getTime() - saveButtonLayer.hoverStartTime > 2000) {
                    saveCanvas(880, 470); // Call the save function
                    saveButtonLayer.hoverStartTime = null; // Reset the timer
                }
            } else {
                saveButtonLayer.hoverStartTime = null;
            }

            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Line')) && hand.grabStrength==1 ) {
                isLine= 1;// 控制要不要畫直線
                isCircle=0;
                isRectangle=0;
                $('canvas').getLayer('Line').fillStyle='#000';
                $('canvas').getLayer('Circle').fillStyle='#aa00ff';
                $('canvas').getLayer('Rectangle').fillStyle='#aa00ff';


            }

            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Line')) && hand.grabStrength===0 ) {
                isLine= 0;// 控制要不要畫直線
                $('canvas').getLayer('Line').fillStyle='#aa00ff';

            }

            if (hand.grabStrength === 0 && startxy==0 && isLine==1 && (! collision_c) && (! collision_r)) { //手張開，起點
                startX=pointerOnCanvas.x;
                startY=pointerOnCanvas.y;
                startxy=1;// 控制只更新一次開始位置
                // dot_count_c=counts.pop();
                $('canvas').drawArc({
                    fillStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,
                    x: startX,
                    y: startY,
                    radius: 5,
                    layer: true,
                    name: 'dot_l',
                
                });

            }

            if (hand.grabStrength === 1 && startxy==1 && isLine==1) { // 手握拳，終點，並劃出直線
                endX=pointerOnCanvas.x;
                endY=pointerOnCanvas.y;
                draw_line(startX,startY,endX,endY, counts.pop());
                startxy=0;
                $('canvas').removeLayer('dot_l');

            }


            //畫矩型
            var leapCursorLayer = $('canvas').getLayer('leapCursor');
            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Rectangle')) && hand.grabStrength==1 ) {
                isRectangle= 1;// 控制要不要畫直線
                isCircle=0;
                isLine= 0;

                $('canvas').getLayer('Rectangle').fillStyle='#000';
                $('canvas').getLayer('Circle').fillStyle='#aa00ff';
                $('canvas').getLayer('Line').fillStyle='#aa00ff';

            }

            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Rectangle')) && hand.grabStrength===0 ) {
                isRectangle= 0;// 控制要不要畫直線
                $('canvas').getLayer('Rectangle').fillStyle='#aa00ff';

            }



            if (hand.grabStrength === 0 && startxy_r==0 && isRectangle==1 && (! collision_c) && (! collision_l)) { //手張開，起點
                startX=pointerOnCanvas.x;
                startY=pointerOnCanvas.y;
                startxy_r=1;// 控制只更新一次開始位置
                // dot_count_c=counts.pop();
                $('canvas').drawArc({
                    fillStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,
                    x: startX,
                    y: startY,
                    radius: 5,
                    layer: true,
                    name: 'dot_r',
                
                });
            }

            if (hand.grabStrength === 1 && startxy_r==1 && isRectangle==1) { // 手握拳，終點，並劃出直線
                endX=pointerOnCanvas.x;
                endY=pointerOnCanvas.y;
                draw_rectangle(startX,startY,endX,endY, counts.pop());
                startxy_r=0;
                $('canvas').removeLayer('dot_r');
            }




            
            //畫圓形
            var leapCursorLayer = $('canvas').getLayer('leapCursor');
            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Circle')) && hand.grabStrength==1 ) {
                isCircle= 1;// 控制要不要畫直線
                isRectangle =0;
                isLine=0;
                $('canvas').getLayer('Circle').fillStyle='#000';
                $('canvas').getLayer('Line').fillStyle='#aa00ff';
                $('canvas').getLayer('Rectangle').fillStyle='#aa00ff';

            }

            if ( collisionTest(leapCursorLayer, $('canvas').getLayer('Circle')) && hand.grabStrength===0 ) {
                isCircle= 0;// 控制要不要畫直線
                $('canvas').getLayer('Circle').fillStyle='#aa00ff';
            }

            if (hand.grabStrength === 0 && startxy_c==0 && isCircle==1 && (! collision_r) && (! collision_l)) { //手張開，起點
                startX=pointerOnCanvas.x;
                startY=pointerOnCanvas.y;
                startxy_c=1;// 控制只更新一次開始位置
                // dot_count_c=counts.pop();
                $('canvas').drawArc({
                    fillStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,
                    x: startX,
                    y: startY,
                    radius: 5,
                    layer: true,
                    name: 'dot_c',
                
                });
            }

            if (hand.grabStrength === 1 && startxy_c==1 && isCircle==1) { // 手握拳，終點，並劃出直線
                endX=pointerOnCanvas.x;
                endY=pointerOnCanvas.y;
                draw_circle(startX,startY,endX,endY, counts.pop());
                startxy_c=0;
                $('canvas').removeLayer('dot_c');
            }
            // end

            // undo path
            if(collisionTest(leapCursorLayer, $('canvas').getLayer('undoButton')) ){
                if( hand.grabStrength === 1.0 && undoFlag == 0 )
                    undoPath();
            }else{
                undoFlag = 0;
            }
            // reset path
            if(hand.grabStrength === 1.0 && collisionTest(leapCursorLayer, $('canvas').getLayer('resetButton')))
                resetALL();
            // HL / pen
            if(collisionTest(leapCursorLayer, $('canvas').getLayer('HLButton')) ){
                if( hand.grabStrength === 1.0 && changePen_flag == 0 )
                    changePen();
            }else{
                changePen_flag = 0;
            }
            
            
            pointerColor(hand);  //  在調色盤上握拳 -> pointer變成該顏色
            penThick(hand);  //  在粗細選擇上握拳 -> pointer及畫筆變成該粗細

            //  只伸出食指 -> 畫畫
            if (hand.indexFinger.extended && !hand.thumb.extended && !hand.middleFinger.extended 
                && !hand.ringFinger.extended && !hand.pinky.extended){
                if(isPainting == false){
                    isPainting = true;
                    addUserPathLayer();
                    pathSet.push($('canvas').getLayer(`userPath${pathSet.length}`));
                    allSet.push(`userPath${pathSet.length-1}`);
                }
                paint(pathPoints, pointerOnCanvas, before_pathPoints);
            }else if (isPainting == true) {
                before_pathPoints = pathPoints.length;
                isPainting = false;
            }
            //console.log(pathSet.length);

            for(let i = 0; i < img_name.length; ++i){
                var layer = $('canvas').getLayer(img_name[i]);
                if(collisionTest(layer, leapCursorLayer) && !flag_copy[i]) 
                    copy(layer, i);
                if(!collisionTest(layer, leapCursorLayer))
                    flag_copy[i] = false;
            } 
            for(let i = 0; i < newObj.length; ++i){
                //console.log(newObj[i]);
                if (collisionTest(leapCursorLayer, $('canvas').getLayer(newObj[i])) ) {
                    if (hand.pinchStrength > 0.9){  // 捏(拇指與任何一指接觸)
                        move(newObj[i], leapCursorLayer.x, leapCursorLayer.y);
                        break;
                    }else{
                        resize( $('canvas').getLayer(newObj[i]), hand );
                    }
                }
            }
            for(let i = 0; i < newObj.length; ++i){
                if(collisionTest($('canvas').getLayer(newObj[i]), $('canvas').getLayer('trashCan'))){
                    deletion(newObj[i]);
                    newObj.splice(i, 1);
                    break;    
                }       
            }

            $('canvas').setLayer('leapxy', { text: '(' + pointerOnCanvas.x.toFixed() + ', ' + pointerOnCanvas.y.toFixed() + ')' });
            leapCursorLayer.x = pointerOnCanvas.x;
            leapCursorLayer.y = pointerOnCanvas.y;
            leapCursorPointer.x = pointerOnCanvas.x;
            leapCursorPointer.y = pointerOnCanvas.y;

            $('canvas').drawLayers();
        } else {
            $('canvas').setLayer('leapxy', { text: 'No Finger!' });
            $('canvas').setLayer('leapCursor', { visible: false }).drawLayers();
        }
    });

    function collisionTest(obj1, obj2) {
        var diffInX = obj2.x - obj1.x;
        var diffInY = obj2.y - obj1.y;
        var vectorMagnitude = Math.sqrt(diffInX * diffInX + diffInY * diffInY);
        if( obj2.name == 'trashCan' || obj2.name == 'cake' || obj2.name == 'star' 
            || obj2.name == 'heart' || obj2.name == 'light' ){
            return vectorMagnitude < 15;
        }
        else{
            var sumOfRadii = obj1.radius + obj2.radius;
            return vectorMagnitude < sumOfRadii;
        }
    }

    function pointerColor(hand){
        for ( var i=0 ; i<colors.length ; ++i ){
            if (hand.grabStrength === 1.0 && collisionTest($('canvas').getLayer('leapCursor_pointer'),colors[i]))
                $('canvas').getLayer('leapCursor_pointer').fillStyle = colors[i].fillStyle;
        }
    }

    function penThick(hand){
        for ( var i=0 ; i<thickCircles.length ; ++i ){
            if (hand.grabStrength === 1.0 && collisionTest($('canvas').getLayer('leapCursor_pointer'),thickCircles[i]))
                $('canvas').getLayer('leapCursor_pointer').radius = thickPoints[i].radius;
        }
    }

    function paint(pathPoints,pointerOnCanvas,before_pathPoints){
        pathPoints.push([pointerOnCanvas.x, pointerOnCanvas.y]);
        var i = pathPoints.length - before_pathPoints;
        var path_num = pathSet.length - 1;
        pathSet[path_num].strokeStyle = $('canvas').getLayer('leapCursor_pointer').fillStyle;
        pathSet[path_num].strokeWidth = $('canvas').getLayer('leapCursor_pointer').radius;
        pathSet[path_num]['x' + i] = pathPoints[pathPoints.length - 1][0];
        pathSet[path_num]['y' + i] = pathPoints[pathPoints.length - 1][1];
    }

    function move(name, x, y){
        $('canvas').getLayer(name).x = x;
        $('canvas').getLayer(name).y = y;
    }

    function copy(img, order) {
        $('canvas').drawImage({
            source: img.source,
            x: img.x,  // X-coordinate
            y: img.y + 75,  // Y-coordinate
            width: img.width,  // Image width
            height: img.height,  // Image height
            layer: true,
            name: `${img.name}${objCount}`,
            visible: true,  // Set to true to make the image visible
            index: objCount+6,
        });
        flag_copy[order] = true;
        //console.log(`${objCount}`);

        newObj.push(`${img.name}${objCount}`);
        objCount++;
        
    }

    function deletion(name){
        $('canvas').removeLayer(name);       
    }

    function resize(img, hand) {
        // 要縮放的圖片
        var scaleFactor = hand.pinchStrength;
        
        // 計算新的高度和寬度
        var newWidth = 300 * (1.1 - scaleFactor);
        var newHeight = 300 * (1.1 - scaleFactor);

        // 設置圖片新高度和寬度
        img.width = newWidth;
        img.height = newHeight;
    }

    //畫直線
	function draw_line(startX,startY,endX,endY,count){
		var canvas = document.getElementById("tracerCanvas");

		// 確認 canvas 和 getContext 存在
		if (canvas && canvas.getContext) {
			// 使用 jQuery-canvas 插件添加線條圖層

			$('canvas').addLayer({
				name: `line${count}`,
				type: 'line',
				strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle, // 線條顏色為紅色
				strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,      // 線條寬度為3像素
				x1: startX,              // 起點 x 座標
				y1: startY,              // 起點 y 座標
				x2: endX,             // 終點 x 座標
				y2: endY               // 終點 y 座標
			});
			// 繪製圖層
			$('canvas').drawLayers();
            allSet.push(`line${count}`);
		}
	}

    // 畫矩形
	function draw_rectangle(x1,y1, x2, y2, count){
		// 獲取 canvas 元素
		var canvas = document.getElementById("tracerCanvas");

		// 確認 canvas 和 getContext 存在
		if (canvas && canvas.getContext) {
			// 使用 jQuery-canvas 插件添加矩形圖層
			$('canvas').addLayer({
				name: `rectangle${count}`,
				type: 'rectangle',    // 指定形狀類型為矩形
				strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,  // 邊框顏色為藍色
				strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,       // 邊框寬度
				x: x1+(x2-x1)/2, // 矩形左上角 x 座標
				y: y1+(y2-y1)/2, // 矩形左上角 y 座標
				width: x2-x1,// 矩形寬度
				height: y2-y1, // 矩形高度
				fillStyle: 'transparent'  // 填充顏色為透明
			});
		
			// 繪製圖層
			$('canvas').drawLayers();
            allSet.push(`rectangle${count}`);
		}
	}

    
	//畫圓
	function draw_circle(x1,y1, x2, y2, count){

		$('canvas').addLayer({
			name: `circle${count}`,
			type: 'arc',               // 圖層類型為圓形
			fillStyle: 'transparent',  // 填充顏色為透明
			strokeStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,       // 圓形邊框顏色為藍色
			strokeWidth: $('canvas').getLayer('leapCursor_pointer').radius,            // 圓形邊框寬度
			x: (x2 + x1) / 2,     // 圓心 x 座標
			y: (y2 + y1) / 2,     // 圓心 y 座標
			radius: (Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)))/2,  // 半徑取最小值，以確保圓形完全在矩形內
			start: 0,
			end: 360,
		});
		$('canvas').drawLayers();
        allSet.push(`circle${count}`);
	}

});
