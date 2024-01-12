  //color button
  function create_color_button(button_radius, colors){
    var loc = 0;  // y location
    var color_num = 5;  // total number of colors
    var colorFillStyle = ['#00d', '#f00', '#ffd400', '#7fb80e', '#000'];  // the colors of circles, respectively
    var colorButtonName = ['blueButton', 'redButton', 'yellowButton', 'greenButton', 'blackButton'];  // the names of circles
    for(var i = 0; i < color_num; ++i){
        $('canvas').drawArc({
            fillStyle: colorFillStyle[i],
            opacity: 1.0,
            x: 35,
            y: 35 + loc*70,
            radius: button_radius,
            layer: true,
            name: colorButtonName[i],
            visible: true,
        });
        colors.push($('canvas').getLayer(colorButtonName[i]));
        loc++;
    }

    // DRAW THE ERASER BOTTON
    $('canvas').drawArc({
        fillStyle: '#fff', // White
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 1.0,
        x: 35,
        y: 35 + loc*70,
        radius: button_radius,
        layer: true,
        name: 'eraserButton'
    });
    colors.push($('canvas').getLayer('eraserButton'));

    // DRAW TEXT ON ERASER BUTTON
    $('canvas').drawText({
        fillStyle: '000', // Black
        x: 35,
        y: 35 + loc*70,
        width: 50,
        height: 40,
        text: 'Eraser',
        layer: true,
        name: 'eraserText',
        intangible: true
    });
    loc++;

    // DRAW THE PEN BOTTON
    $('canvas').drawArc({
        fillStyle: '#111', // Gray
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 1,
        x: 35,
        y: 35 + loc*70,
        radius: button_radius,
        layer: true,
        visible: false,
        name: 'penButton'
    });
    // DRAW TEXT ON PEN BUTTON
    $('canvas').drawText({
        fillStyle: '#fff', // White
        x: 35,
        y: 35 + loc*70,
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
        y: 35 + loc*70,
        radius: button_radius,
        layer: true,
        visible: true,
        name: 'HLButton'
    });
    // DRAW TEXT ON HIGHLIGHT BUTTON
    $('canvas').drawText({
        fillStyle: '#000', // Black
        x: 35,
        y: 35 + loc*70,
        width: 50,
        height: 40,
        text: 'Highlight',
        layer: true,
        name: 'HLText',
        intangible: true,
        visible: true,
    });
  }
  
// pen thickness button
function create_thickness_button(button_radius, thickButton, strokeSize){
    for(var thickCount = 1; thickCount<=5; ++thickCount){
        $('canvas').drawArc({
            fillStyle: '#fff', // White
            strokeStyle: 'black', // Border color
            strokeWidth: 2, // Border width
            opacity: 1.0,
            x: 1165,
            y: -35 + 70*thickCount,
            radius: button_radius,
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
        thickButton.push($('canvas').getLayer(`Circle_${thickCount}`));
        strokeSize.push($('canvas').getLayer(`Point_${thickCount}`));
    }

}

//paint
function paint(pathSet, pathPoints,pointerOnCanvas,before_pathPoints){
    pathPoints.push([pointerOnCanvas.x, pointerOnCanvas.y]);
    var i = pathPoints.length - before_pathPoints;
    var path_num = pathSet.length - 1;
    pathSet[path_num].strokeStyle = $('canvas').getLayer('leapCursor_pointer').fillStyle;
    pathSet[path_num].strokeWidth = $('canvas').getLayer('leapCursor_pointer').radius;
    pathSet[path_num]['x' + i] = pathPoints[pathPoints.length - 1][0];
    pathSet[path_num]['y' + i] = pathPoints[pathPoints.length - 1][1];
}

function change_pen_type(pen_opacity){
    if( $('canvas').getLayer('HLButton').visible == true ){
        $('canvas').getLayer('HLButton').visible = false;
        $('canvas').getLayer('HLText').visible = false;
        $('canvas').getLayer('penButton').visible = true;
        $('canvas').getLayer('penText').visible = true;
        pen_opacity.a = 0.3;
    }
    else{
        $('canvas').getLayer('HLButton').visible = true;
        $('canvas').getLayer('HLText').visible = true;
        $('canvas').getLayer('penButton').visible = false;
        $('canvas').getLayer('penText').visible = false;
        pen_opacity.a = 1.0;
    }
    return true;
}

function change_pen_thick(thick){
    $('canvas').getLayer('leapCursor_pointer').radius = thick;
}
function change_pointer_color(color){
    $('canvas').getLayer('leapCursor_pointer').fillStyle = color;
}