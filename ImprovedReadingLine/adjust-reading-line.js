chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("height" in changes) {

        console.log("Old value: " + changes.height.oldValue);
        console.log("New value: " + changes.height.newValue);

        setReadingLineHeight(changes.height.newValue);
    }

    if ("color" in changes) {

        console.log("Old value: " + changes.color.oldValue);
        console.log("New value: " + changes.color.newValue);

        setReadingLineColor(changes.color.newValue);
    }
});

function setReadingLineHeight(height) {
    var readingLine = document.getElementById('ReadingLine');
    
    if (readingLine) {
        readingLine.style.height = height + 'px';
    }
}

function setReadingLineColor(color) {
    var readingLine = document.getElementById('ReadingLine');

    var transparentColor = convertColor(color);
    
    if (readingLine) {
        readingLine.style.background = transparentColor;
    }
}

function convertColor(color) {
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);

    var convertedColor = "rgba(" + red + ", " + green + ", " + blue + ", 0.05)";
    return convertedColor;
}

