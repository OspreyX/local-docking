/**
 * Created by haseebriaz on 03/02/15.
 */

var parentWindow = window.opener;
var undockButton = null;

window.addEventListener("DOMContentLoaded", function(){

    document.getElementById("title").innerText = window.name;
    new Draggable(document.getElementById("dragger")); // pass any element that you want to use as a handle for dragging.
    parentWindow.registerChild(window); // this registers current window as a dockable window
    undockButton = document.getElementById("undockButton");
    undockButton.addEventListener("click", undock);
    enableUndock(false);
});

var onDock = function(){

    enableUndock(true);

}.bind(window);

function undock(){

    parentWindow.undock(window);
    enableUndock(false);
}

function enableUndock(value){

    console.log("enabling undock buton", value);
    document.getElementById("undockButton").style.display = value? "block": "none";
}
