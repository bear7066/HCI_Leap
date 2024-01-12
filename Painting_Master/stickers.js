function create_sticker_button(stickerButtonName){
    var sticker_source = ['../picture/star.png', '../picture/heart.png',
                        '../picture/cake.png', '../picture/light.png'];  // store location of images
    var sticker_size = [70, 100, 100, 70];  // size of images in img_source, respectively
    // DRAW IMAGES
    for(var i = 0; i < stickerButtonName.length; i++){
        $('canvas').drawImage({
            source: sticker_source[i],
            x: 500 + 70 * i,
            y: 30,
            width: sticker_size[i],
            height: sticker_size[i],
            layer: true,
            name: stickerButtonName[i],
            visible: true,
            index: 5,
        });
    }
}

function create_trashCan(){
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
}
//縮放圖片
function resize(sticker, hand) {
    var scaleFactor = hand.pinchStrength;
    
    // 計算新的高度和寬度
    var newWidth = 300 * (1.1 - scaleFactor);
    var newHeight = 300 * (1.1 - scaleFactor);

    // 設置圖片新高度和寬度
    sticker.width = newWidth;
    sticker.height = newHeight;
}

//移動圖片
function move(name, x, y){
    $('canvas').getLayer(name).x = x;
    $('canvas').getLayer(name).y = y;
}

//新增圖片
function add_sticker(sticker_button, newStickers, sticker_count) {
    $('canvas').drawImage({
        source: sticker_button.source,
        x: sticker_button.x,  // X-coordinate
        y: sticker_button.y + 75,  // Y-coordinate
        width: sticker_button.width,  // Image width
        height: sticker_button.height,  // Image height
        layer: true,
        name: `${sticker_button.name}${sticker_count.a}`,
        visible: true,  // Set to true to make the image visible
        index: sticker_count.a+6,
    });

    newStickers.push(`${sticker_button.name}${sticker_count.a}`);
    sticker_count.a++;  
    console.log(sticker_count.a); 
    return true;    
}