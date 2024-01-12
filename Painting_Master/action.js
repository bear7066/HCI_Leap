function create_pointer()
{
    // CREATE A PURPLE CIRCLE LAYER TO SEE THE FINGER POSITION
    $('canvas').drawArc({
        fillStyle: '#c0f', // Purple
        radius: 3, // default
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
}
//action:draw
function addUserPathLayer(path_num, penOpacity) {
    $('canvas').addLayer({
        name: `userPath${path_num}`,
        type: 'line',
        strokeStyle: '#ddd', // set init color 'White'
        strokeWidth: 4,  // 預設
        opacity: penOpacity.a,
        index: path_num,
    });
}

//axtion:touch
function collisionTest(obj1, obj2) {
    var diffInX = obj2.x - obj1.x;
    var diffInY = obj2.y - obj1.y;
    var vectorMagnitude = Math.sqrt(diffInX * diffInX + diffInY * diffInY);
    //sticker button & stickers default radius = 0
    if( obj1.radius == 0 || obj2.radius == 0 ){
        return vectorMagnitude < 15;
    }
    else{
        var sumOfRadii = obj1.radius + obj2.radius;
        return vectorMagnitude < sumOfRadii;
    }
}


