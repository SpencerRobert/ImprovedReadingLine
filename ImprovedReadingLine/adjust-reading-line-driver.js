function setReadingLineHeight(height) {
    const readingLine = document.getElementById('ReadingLine');
    //console.log("HEIGHT: " + readingLine.style.height);
    if (readingLine) {
        readingLine.style.height = height + 'px';
    }
}

document.addEventListener('DOMContentLoaded', function () {


    //Listen for changes to height
    document.getElementById('heightSlider').addEventListener('input', function () {
        chrome.storage.sync.set({ 'height': this.value });
    });

    //Listen for changes to color
    document.getElementById('colorPicker').addEventListener('input', function () {
        chrome.storage.sync.set({ 'color': this.value });
    });

    const getButton = document.getElementById("getButton");
    getButton.onclick = async function () {
        await chrome.storage.sync.get('height', function (data) { alert(data.height); });
    }


});
