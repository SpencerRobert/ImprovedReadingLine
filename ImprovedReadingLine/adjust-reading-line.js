chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("height" in changes) {

        setReadingLineHeight(changes.height.newValue);
    }

    if ("color" in changes) {

        setReadingLineColor(changes.color.newValue);
    }

    if ("opacity" in changes) {

        setReadingLineOpacity(changes.opacity.newValue);
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

async function setReadingLineOpacity(opacity) {

    var readingLine = document.getElementById('ReadingLine');

    await chrome.storage.sync.get("color", function (data) {
        var newColor = convertColor(data.color, opacity);

        if (readingLine) {
            readingLine.style.background = newColor;
        }
    });

}

function convertColor(color, opacity = 0.15) {
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);

    var convertedColor = "rgba(" + red + ", " + green + ", " + blue + ", " + opacity + ")";
    return convertedColor;
}

