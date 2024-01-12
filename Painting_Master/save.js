// 存檔鍵
// Draw the save button on the canvas
// Draw the save button as a circle on the canvasx: 1160,  // X-coordinate
function create_save_button(button_radius){
    
    $('canvas').drawArc({
        fillStyle: '#0d6efd', // Blue color
        x: 1080, y: 565, // Adjust position as needed
        radius: button_radius, // Radius of the circle
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
}
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
