// canvas.js
$(document).ready(function() {

    var button_radius = 30;
    var stickerButtonName = ['star', 'heart', 'cake', 'light'];  // name of images in img_source, respectively
    var thickButton = [];  // Array to store all thickness (circle)
    var strokeSize = [];
    var geoButtonName = ['lineButton', 'rectangleButton', 'circleButton'];

    var change_flag = false;
    var undo_flag = false;
    var start_flag = false;
    var addStickerFlag = [false,false,false,false,false];

    var sticker_count = {a:0};
    var geo_count = {a:0};
    
    var allSet = [];
    var colors = [];  // Array to store all colors (circle), and eraser
    var newStickers = [];

    var pathPoints = []; // Stores the path of the mouse
    var pathSet = [];  // stores the userPath(s)
    var isPainting = false;
    var before_pathPoints = 0;
<<<<<<< HEAD
 
    var pen_opacity = {a:1.0}; // Set the opacity of pen
    var geo_button = 'none';
   
=======

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

    // DRAW THE COLOR CIRCLE BUTTON
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
>>>>>>> f651116b30c0fe318e4050027f23eb97f602779f
    
    var startX, startY, endX, endY;
    
    create_tool(button_radius, stickerButtonName, colors, thickButton,strokeSize);
    create_pointer();

    // SETUP AND OBTAIN DATA FROM LEAP MOTION
    Leap.loop({}, function(frame) {
        if (frame.pointables.length > 0) {
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
            leapCursorLayer.x = pointerOnCanvas.x;
            leapCursorLayer.y = pointerOnCanvas.y;
            leapCursorPointer.x = pointerOnCanvas.x;
            leapCursorPointer.y = pointerOnCanvas.y;

            var hand = frame.hands[0];

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

            //add
            for(var i = 0; i < geoButtonName.length; ++i){
                if (collisionTest(leapCursorLayer, $('canvas').getLayer(geoButtonName[i])) && hand.grabStrength == 1 && $('canvas').getLayer(geoButtonName[i]).fillStyle == '#aa00ff')
                    geo_button = geoButtonName[i]
                $('canvas').getLayer(geoButtonName[i]).fillStyle='#aa00ff';
            }
            //把碰到的按鈕變黑色
            for(var i = 0; i < geoButtonName.length; ++i){
                if(geoButtonName[i] == geo_button)
                    $('canvas').getLayer(geoButtonName[i]).fillStyle='#000';
            }

            //把按鈕關掉
            for(var i = 0; i < geoButtonName.length; ++i){
                var button = $('canvas').getLayer(geoButtonName[i]);
                if (collisionTest(leapCursorLayer, button) && hand.grabStrength === 0 && button.fillStyle == '#000') {
                    geo_button = 'none';
                    button.fillStyle='#aa00ff';
                }
            }

            for(var i = 0; i < geoButtonName.length; ++i){
                if (hand.grabStrength === 0 && start_flag == false && geo_button != 'none') { //手張開，起點
                    startX=pointerOnCanvas.x;
                    startY=pointerOnCanvas.y;
                    start_flag = true;// 控制只更新一次開始位置
                    $('canvas').drawArc({
                        fillStyle: $('canvas').getLayer('leapCursor_pointer').fillStyle,
                        x: startX,
                        y: startY,
                        radius: 5,
                        layer: true,
                        name: 'dot',
                    });   
                }   
            }
            //draw geo shape
            for(var i = 0; i < geoButtonName.length; ++i){
                if (hand.grabStrength === 1 && start_flag == true && geo_button == geoButtonName[i] && !collisionTest(leapCursorLayer, $('canvas').getLayer('lineButton')) 
                && !collisionTest(leapCursorLayer, $('canvas').getLayer('rectangleButton')) && !collisionTest(leapCursorLayer, $('canvas').getLayer('circleButton'))) { // 手握拳，終點，並劃出直線
                    endX=pointerOnCanvas.x;
                    endY=pointerOnCanvas.y;
                    draw_geo_shape(startX,startY,endX,endY, geo_count, allSet, geoButtonName[i]);
                    start_flag = false;
                    $('canvas').removeLayer('dot');
                }
            }
            //end
            
         
            // undo path
            if(collisionTest(leapCursorLayer, $('canvas').getLayer('undoButton')) ){
                if( hand.grabStrength === 1.0 && undo_flag == 0 )
                    undo_flag = undoPath(allSet);
            }else{
                undo_flag = 0;
            }
            // reset all
            if(hand.grabStrength === 1.0 && collisionTest(leapCursorLayer, $('canvas').getLayer('resetButton'))){
                resetAll(allSet, newStickers);
                allset = [];
                newStickers = [];
            }
            // HL / pen
            if(collisionTest(leapCursorLayer, $('canvas').getLayer('HLButton')) ){
                if( hand.grabStrength === 1.0 && change_flag == 0 )
                    change_flag = change_pen_type(pen_opacity);
            }else{
                change_flag = false;
            }

            for (var i=0 ; i<colors.length ; ++i){
                if (hand.grabStrength === 1.0 && collisionTest($('canvas').getLayer('leapCursor_pointer'),colors[i]))
                    change_pointer_color(colors[i].fillStyle);  //  在調色盤上握拳 -> pointer變成該顏色       
            }
            
            for (var i=0 ; i<thickButton.length ; ++i){
                if (hand.grabStrength === 1.0 && collisionTest($('canvas').getLayer('leapCursor_pointer'),thickButton[i]))
                    change_pen_thick(strokeSize[i].radius);        
            }
            //  只伸出食指 -> 畫畫
            if (hand.indexFinger.extended && !hand.thumb.extended && !hand.middleFinger.extended 
                && !hand.ringFinger.extended && !hand.pinky.extended){
                if(isPainting == false){
                    isPainting = true;
                    addUserPathLayer(pathSet.length, pen_opacity);
                    pathSet.push($('canvas').getLayer(`userPath${pathSet.length}`));
                    allSet.push(`userPath${pathSet.length-1}`);
                }
                paint(pathSet, pathPoints, pointerOnCanvas, before_pathPoints);
            }else if (isPainting == true) {
                before_pathPoints = pathPoints.length;
                isPainting = false;
            }

            for(var i = 0; i < stickerButtonName.length; ++i){
                var sticker_button = $('canvas').getLayer(stickerButtonName[i]);
                if(collisionTest(leapCursorLayer, sticker_button) && !addStickerFlag[i]) 
                    addStickerFlag[i] = add_sticker(sticker_button, newStickers, sticker_count);
                if(!collisionTest(leapCursorLayer, sticker_button))
                    addStickerFlag[i] = false;
            } 

            for(var i = 0; i < newStickers.length; ++i){
                if (collisionTest(leapCursorLayer, $('canvas').getLayer(newStickers[i])) ) {
                    if (hand.pinchStrength > 0.9){  // 捏(拇指與任何一指接觸)
                        move(newStickers[i], leapCursorLayer.x, leapCursorLayer.y);
                        break;
                    }else{
                        resize($('canvas').getLayer(newStickers[i]), hand);
                    }
                }
            }
            for(var i = 0; i < newStickers.length; ++i){
                if(collisionTest($('canvas').getLayer(newStickers[i]), $('canvas').getLayer('trashCan'))){
                    $('canvas').removeLayer(newStickers[i]);  
                    newStickers.splice(i, 1);
                    break;    
                }       
            }
            $('canvas').setLayer('leapxy', { text: '(' + pointerOnCanvas.x.toFixed() + ', ' + pointerOnCanvas.y.toFixed() + ')' });
            $('canvas').drawLayers();
        } else {
            $('canvas').setLayer('leapxy', { text: 'No Finger!' });
            $('canvas').setLayer('leapCursor', { visible: false }).drawLayers();
        }
    }); 
});


function create_tool(button_radius, stickerButtonName, colors, thickButton, strokeSize){
    create_sticker_button(stickerButtonName);
    create_geometric_button(button_radius);
    create_save_button(button_radius);
    create_delete_button(button_radius);
    create_thickness_button(button_radius, thickButton, strokeSize);
    create_color_button(button_radius, colors);
    create_trashCan();
}


