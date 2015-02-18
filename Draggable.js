/**
 * Created by haseebriaz on 05/02/15.
 */

var Draggable = (function(){

    function Draggable(element){

        this._element = element;
        this._createDelegates();
        this._element.addEventListener("mousedown", this._onMouseDown);
        this._element.style.cursor = "move";
        this.window = window;

        chrome.desktop.getDetails(this._setOpenfinWindow);
    }

    Draggable.prototype._element = null;
    Draggable.prototype._offset = null;
    Draggable.prototype.window = null;
    Draggable.prototype.openfinWindow = null;

    Draggable.prototype._createDelegates = function(event){

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this.moveBy = this.moveBy.bind(this);
        this._setOpenfinWindow = this._setOpenfinWindow.bind(this);
    };

    Draggable.prototype._setOpenfinWindow = function(){

        this.openfinWindow = fin.desktop.Window.wrap(arguments[2], arguments[1]);
    };

    Draggable.prototype._onMouseDown = function(event){

        this._element.removeEventListener("mousedown", this._onMouseDown);
        window.addEventListener("mouseup", this._onMouseUp);
        window.addEventListener("mousemove", this._onMouseMove);

        this._offset = {x: event.clientX - this._element.offsetLeft, y: event.clientY - this._element.offsetTop};

        event.preventDefault();
    };

    Draggable.prototype._onMouseUp = function(event){

        this._element.addEventListener("mousedown", this._onMouseDown);
        window.removeEventListener("mouseup", this._onMouseUp);
        window.removeEventListener("mousemove", this._onMouseMove);
        window.onMoveComplete({target: window, originalEvent:event});
    };

    Draggable.prototype._onMouseMove = function(event){

        this.moveBy(event.clientX - this._element.offsetLeft - this._offset.x, event.clientY - this._element.offsetTop - this._offset.y );
    };

    Draggable.prototype.moveBy = function(x, y) {

        var evnt = {target: this, position:{screenLeft: window.screenLeft + x, screenTop: window.screenTop + y, outerWidth: window.outerWidth, outerHeight: window.outerHeight}, defaultPrevented: false};
        window.onMove(evnt);
        if(evnt.defaultPrevented) return;
        this.window.moveBy(x, y);
    };

    return Draggable;
})();