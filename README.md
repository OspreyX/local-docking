#Dock / Snap Example by OpenFin

## Dock & Snap Approach
The intention of this repo is to provide developers a general (yet uniform) approach to docking and snapping windows within their apps while utilizing OpenFin. By design, the approach is generic and not intended to solve specific application use cases. Many applications and application developers have varying opinions as to the behavoir of window docking & snapping. Our thought here is to provide a framework for those app developers to have as a guide, but provide the flexibility and optionality to solve for their own unique use cases.   

## Current Features
* Window snapping while dragging closed to other windows
* Docking snapped windows on release. 
   - Still needs live dragging for child windows.
* Group docking, where you can have different group of windows grouped together.

## Roadmap
* Hierarchal docking and undocking of groups. 
   - i.e windows can have parent, child and sibling relations so they can be undocked in the same order as they were docked intuitively. Functionality can be overridden/altered using keyboard hot keys like shift, ctrl, alt etc.
* Live dragging for child windows.
* Upon generic code or framework, create some example projects to demonstrate how to extend or override certain features to achieve app specific requirements.
* Identified behavioral issues or bugs
