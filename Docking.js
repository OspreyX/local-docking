/**
 * Created by haseebriaz on 28/01/15.
 */


var dockingManager = new DockingManager();


window.addEventListener("DOMContentLoaded", function(){

   dockingManager.addOpenfinWindow(fin.desktop.Window.getCurrent());

   var counter = 0;

   function createChildWindow(){

        var child = new fin.desktop.Window({
            name: "child" + counter++,
            url: "childWindow.html",
            defaultWidth: 150,
            defaultHeight: 100,
            defaultTop: screen.availHeight - 100 ,
            defaultLeft: screen.availWidth - 150,
            frame: false,
            resize: true,
            windowState: "normal",
            autoShow: true
        });

       dockingManager.addOpenfinWindow(child);
        return child;
    }

    document.getElementById("createWindows").onclick = createChildWindow;

    registerChild(window);

});

function registerChild(child){

    dockingManager.register(child);
}

function undock(window){

    dockingManager.undock(window);
}
