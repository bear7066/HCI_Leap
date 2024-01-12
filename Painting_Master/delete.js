function create_delete_button(button_radius)
{
    // DRAW RESET BUTTON
    $('canvas').drawArc({
        fillStyle: '#f00', // Red
        x: 550,
        y: 565,
        radius: button_radius,
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
        radius: button_radius,
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
}

function resetAll(allSet, newStickers) {
    for( var i = 0; i < allSet.length; ++i ){
        $('canvas').removeLayer(allSet[i]);
    }
    for( var j = 0; j< newStickers.length; ++j ){    
        $('canvas').removeLayer(newStickers[j]);
    }
}

function undoPath(allSet){
    $('canvas').removeLayer(allSet[allSet.length-1]);
    allSet.pop();
    return true;
}