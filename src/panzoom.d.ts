// Type definitions for panzoom 
// Project: https://github.com/anvaka/panzoom
// Definitions by: Mark Morga markmorga.com

/*~ Note that ES6 modules cannot directly export callable functions.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = createPanZoom;

/*~ This example shows how to have multiple overloads for your function */
declare function createPanZoom(domElement: Element, options?: PanZoom.IOptions) : PanZoom.IPanZoom; 

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block. Often you will want to describe the
 *~ shape of the return type of the function; that type should
 *~ be declared in here, as this example shows.
 */
declare namespace PanZoom {
  export interface IOptions {
      autocenter?: boolean;
      controller?: any;
      realPinch?: boolean;
      beforeWheel?: any;
      bounds?: any;
      boundsPadding?: number;
      maxZoom?: number;
      minZoom?: number;
      onTouch?: any;
      smoothScroll?: boolean;
      zoomDoubleClickSpeed?: number;
      zoomSpeed?: number;
  }

  export interface IPanZoom {
    dispose: () => void,
    moveBy: (dx: number, dy: number, smooth: boolean) => void,
    moveTo: (x: number, y: number) => void,
    centerOn: (ui: any) => void,
    zoomTo: (clientX: number, clientY: number, scaleMultiplier: number) => void,
    zoomAbs: (clientX: number, clientY: number, zoomLevel: number) => void,
    getTransform: () => ITransform,
    showRectangle: (rect: IRect) => void,
  }

  export interface IRect {
    bottom: number;
    top: number;
    right: number;
    left: number;
  }

  export interface ITransform {
    x: number;
    y: number;
    scale: number;  
  }
}
