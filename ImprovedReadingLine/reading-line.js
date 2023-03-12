var frozen;

var ReadingLine = {
    active: false,
    hidden: false,
    div: null,
    freezePopup: null,
    freezeText: null,
    init: function () {

        frozen = false;

        // Cleanup existing div just in case.
        var div = document.getElementById("ReadingLine");
        if (div) {
            document.body.removeChild(div);
        }

        this.div = document.createElement("div");
        this.div.id = "ReadingLine";
        this.div.style.top = "-100px";

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.shortCut = this.shortCut.bind(this);
        this.checkStatus = this.checkStatus.bind(this);

        document.addEventListener("keydown", this.shortCut, false);

        document.body.onkeyup = function (event) {
            if (event.keyCode == 70 && event.shiftKey)  //shift + f
            {
                ReadingLine.freeze();
            }
            else if (event.keyCode == 40 && event.shiftKey && frozen) {
                ReadingLine.shiftDown();
            }
            else if (event.keyCode == 38 && event.shiftKey && frozen) {
                ReadingLine.shiftUp();
            }
            else if (event.keyCode == 72 && event.shiftKey && frozen) {
                var freezePop = document.getElementById('freezePopup');
                if (freezePop) {
                    document.body.removeChild(freezePop);
                }
            }
        }
        
        this.checkStatus();

        // The interval will make sure the content script will get disabled on
        // extension uninstall.
        setInterval(this.checkStatus, 5000);
    },
    checkStatus: function(){
        try {
            chrome.runtime.sendMessage("ReadingLine-status", function (status) {
                if (status) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            }.bind(this));
        }
        catch (e) {
        }
    },
    enable: function () {
        if (this.active) return;

        document.body.appendChild(this.div);
        document.addEventListener("mousedown", this.mouseMove);
        document.addEventListener("mouseup", this.mouseMove);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseover", this.mouseMove);
        document.addEventListener("mouseout", this.mouseOut);
        this.active = true;
    },
    disable: function () {
        if (!this.active) return;

        var div = document.getElementById("ReadingLine");
        if (div) {
            document.body.removeChild(div);
        }
        document.removeEventListener("mousedown", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseMove);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseover", this.mouseMove);
        document.removeEventListener("mouseout", this.mouseOut);
        this.active = false;
    },
    freeze: function () {
        
        if (!this.active) return;

        if (frozen) {
            var freezePop = document.getElementById('freezePopup');
            if (freezePop) {
                document.body.removeChild(freezePop);
            }
            document.addEventListener("mousedown", this.mouseMove);
            document.addEventListener("mouseup", this.mouseMove);
            document.addEventListener("mousemove", this.mouseMove);
            document.addEventListener("mouseover", this.mouseMove);
            document.addEventListener("mouseout", this.mouseOut);
            frozen = false;
        }
        else {
            this.freezePopup = document.createElement("div");
            this.freezePopup.id = "freezePopup";
            this.freezePopup.style.top = '50px';
            this.freezePopup.style.position = 'fixed';
            this.freezePopup.style.backgroundColor = 'white';
            this.freezePopup.style.zIndex = 1000;
            this.freezePopup.style.height = '120px';
            this.freezePopup.style.width = '250px';
            this.freezePopup.style.fontSize = "12px";
            this.freezePopup.textContent = "                    Freeze: ON \r\n \r\n - Press shift + f to unfreeze\r\n - Press shift + up arrow to shift up\r\n - Press shift + down arrow to shift down\r\n - Press shift + h to hide this panel";
            this.freezePopup.style.whiteSpace = 'pre';
            this.freezePopup.style.color = 'blue';
            document.body.appendChild(this.freezePopup);
            document.removeEventListener("mousedown", this.mouseMove);
            document.removeEventListener("mouseup", this.mouseMove);
            document.removeEventListener("mousemove", this.mouseMove);
            document.removeEventListener("mouseover", this.mouseMove);
            document.removeEventListener("mouseout", this.mouseOut);
            frozen = true;
        }
            
    },
    shiftDown: async function () {

        var shiftAmount = 30;
        var data = await chrome.storage.sync.get('shiftAmount');
        if (data.shiftAmount != undefined) {
            shiftAmount = parseInt(data.shiftAmount, 10);
        }

        var currentTop = parseInt(this.div.style.top, 10);

        this.div.style.top = (currentTop + shiftAmount) + "px";


    },
    shiftUp: async function () {

        var shiftAmount = 30;
        var data = await chrome.storage.sync.get('shiftAmount');
        if (data.shiftAmount != undefined) {
            shiftAmount = parseInt(data.shiftAmount, 10);
        }

        var currentTop = parseInt(this.div.style.top, 10);

        this.div.style.top = (currentTop - shiftAmount) + "px";

    },
    mouseMove: function (e) {
        this.div.className = "active";
        this.div.style.top = (e.clientY) + "px";
        this.hidden = false;
    },
    mouseOut: function (e) {
        if (e.toElement == null && e.relatedTarget == null) {
            this.div.className = "hidden";
            this.hidden = true;
        }
    },
    shortCut: function (e) {
      
        // Ctrl/Cmd + Alt + -
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode === 189) {
            if (!this.active) {
                this.enable();
                chrome.runtime.sendMessage("ReadingLine-enable");
            }
            else {
                this.disable();
                chrome.runtime.sendMessage("ReadingLine-disable");
            }
        }
    }
};

ReadingLine.init();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    switch (msg.action) {
        case "ReadingLine-enable":
            ReadingLine.enable();
            break;
        case "ReadingLine-disable":
            ReadingLine.disable();
            break;
    }
    sendResponse(msg.data, true);
});