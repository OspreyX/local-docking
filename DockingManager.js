/**
 * Created by haseebriaz on 28/01/15.
 */
DockingManager = (function(){

    var instance = null;
    var _windows = [];
    var _snappedWindows = [];
    var _openfinWindows = {};
    var docked = [];

    function DockingManager(){

        if(instance) throw new Error("Only one instance of DockingManager is allowed. Use DockingManager.getInstance() to get the instance.");
        instance = this;
        this._createDelegates();
    }

    DockingManager.getInstance = function(){

        return instance? instance: new DockingManager();
    };

    DockingManager.prototype.range = 50;
    DockingManager.prototype.spacing = 5;

    DockingManager.prototype._createDelegates = function(){

        this._onWindowMove = this._onWindowMove.bind(this);
        this.isSnapable = this.isSnapable.bind(this);
        this._isPointInVerticalZone = this._isPointInVerticalZone.bind(this);
        this._isPointInHorizontalZone = this._isPointInHorizontalZone.bind(this);
        this.dockAllSnappedWindows = this.dockAllSnappedWindows.bind(this);
    };

    DockingManager.prototype.addOpenfinWindow = function(openfinWindow){

        _openfinWindows[openfinWindow.name] = openfinWindow;
    };

    DockingManager.prototype.register = function(window){

        window.onMove = this._onWindowMove;
        window.onMoveComplete = this.dockAllSnappedWindows;
        _windows.push(window);
    };

    DockingManager.prototype._onWindowMove = function(event){

        var _window = null;
        var _currentWindow = event.target.window;
        var position = {x: null, y: null};
        for(var i = _windows.length - 1; i >= 0; i--){

            _window = _windows[i];
            if(_window == _currentWindow ) continue;

            var snappingPosition = this.isSnapable(event.position, _window);
            if(!snappingPosition) snappingPosition = this._reverse(this.isSnapable(_window, event.position));

            if(snappingPosition){

                event.defaultPrevented = true;
                var pos = this.snapToWindow(event, _window, snappingPosition);
                if(!position.x)position.x = pos.x;
                if(!position.y)position.y = pos.y;
                this.addToSnapList(_currentWindow, _window);

            } else {

                this.removeFromSnapList(_currentWindow, _window);
            }
        }

        if(position.x || position.y) {

            position.x = position.x ? position.x : event.position.screenLeft;
            position.y = position.y ? position.y : event.position.screenTop;

            _currentWindow.moveTo(position.x, position.y);
        }
    };

    DockingManager.prototype.isSnapable = function(currentWidow, window){

        var isInVerticalZone = this._isPointInVerticalZone(window.screenTop, window.screenTop + window.outerHeight, currentWidow.screenTop, currentWidow.outerHeight);

        if((currentWidow.screenLeft > window.screenLeft + window.outerWidth && currentWidow.screenLeft < window.screenLeft + window.outerWidth + this.range) && isInVerticalZone){

            return "right";

        } else if((currentWidow.screenLeft + currentWidow.outerWidth > window.screenLeft - this.range && currentWidow.screenLeft + currentWidow.outerWidth < window.screenLeft ) && isInVerticalZone){

            return "left";

        } else {

            var isInHorizontalZone = this._isPointInHorizontalZone(window.screenLeft, window.screenLeft + window.outerWidth, currentWidow.screenLeft, currentWidow.outerWidth);
            if((currentWidow.screenTop > window.screenTop + window.outerHeight && currentWidow.screenTop < window.screenTop + window.outerHeight + this.range) && isInHorizontalZone){

                return "bottom";

            } else if((currentWidow.screenTop + currentWidow.outerHeight > window.screenTop - this.range && currentWidow.screenTop + currentWidow.outerHeight < window.screenTop ) && isInHorizontalZone){

                return "top";
            } else {

                return false;
            }
        }
    };

    DockingManager.prototype._isPointInVerticalZone = function(startY, endY, y, height){

        var bottom = y + height;
        return (y > startY && y < endY || bottom > startY && bottom < endY);
    };

    DockingManager.prototype._isPointInHorizontalZone = function(startX, endX, x, width){

        var rightCorner = x + width;
        return (x > startX && x < endX || rightCorner > startX && rightCorner < endX);
    };

    DockingManager.prototype._reverse = function(value){

        if(!value) return null;

        switch (value){

            case "right": return "left";
            case "left": return "right";
            case "top": return "bottom";
            case "bottom": return "top";
            default:  return null;
        }
    };

    DockingManager.prototype.snapToWindow = function(event, window, position){

        var currentWindow = event.target.window;

        switch(position){

            case "right": return {x: window.screenLeft + window.outerWidth + this.spacing, y: null};
            case "left": return {x: window.screenLeft - currentWindow.outerWidth - this.spacing, y: null};
            case "top":  return {x: null, y: window.screenTop - currentWindow.outerHeight - this.spacing};
            case "bottom": return {x: null, y: window.screenTop + window.outerHeight + this.spacing};
        }
    };

    DockingManager.prototype.addToSnapList= function (){

        var window = null;

        for(var i = arguments.length - 1; i >= 0; i--){

            window = arguments[i];

            if (_snappedWindows.indexOf(window) < 0) {

                _snappedWindows.push(window);
                console.log("added", window.name, " to the list.");
            }
        }
    };

    DockingManager.prototype.removeFromSnapList = function (){

        var window = null;

        for(var i = arguments.length - 1; i >= 0; i--){

            window = arguments[i];
            var index = _snappedWindows.indexOf(window);

            if (index >= 0) {

                _snappedWindows.splice(index, 1);

            }
        }
    }

    DockingManager.prototype.dockAllSnappedWindows = function(event){

        console.log("docking", _snappedWindows.length, "windows");
        var movedWindow = event.target;

        console.log(movedWindow.screenLeft, movedWindow.screenTop);
        this.getOpenfinWindow(movedWindow).moveTo(movedWindow.screenLeft, movedWindow.screenTop);
        var firstWindow = this.getOpenfinWindow(_snappedWindows.shift());
        var currentWindow = null;

        while(_snappedWindows.length){

            currentWindow = _snappedWindows.shift();
            this.getOpenfinWindow(currentWindow).joinGroup(firstWindow, currentWindow.onDock);
        }
    };

    DockingManager.prototype.getOpenfinWindow = function(window){

        return _openfinWindows[window.name];
    };

    DockingManager.prototype.undock = function(window){

        this.getOpenfinWindow(window).leaveGroup();
    }

    return DockingManager;

})();