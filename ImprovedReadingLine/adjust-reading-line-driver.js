
function setReadingLineHeight(height) {
    const readingLine = document.getElementById('ReadingLine');
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

    //Listen for changes to opacity
    document.getElementById('opacity').addEventListener('input', function () {
        chrome.storage.sync.set({ 'opacity': this.value });
    });

    //Listen for changes to shift amount
    document.getElementById('shift').addEventListener('input', function () {

        var currentVal = parseInt(this.value, 10);

        if (currentVal > 100) {
            this.value = 100;
            return;
        }
        else if (currentVal < 0) {
            this.value = 0;
            return;
        }

        chrome.storage.sync.set({ 'shiftAmount': this.value });
    });

});
