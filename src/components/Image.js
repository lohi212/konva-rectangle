import Konva from "konva";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

const ImageContainer = ({
  imageData,
  setCoordinates,
  coOrdinates,
  defaultCoordinates,
}) => {
  const [resizedCoordinates, setResizedCoordinates] = useState({
    // Here 700 is considered as the default width for all the images and height is the calculated value
    width: 700,
    height: 0,
  });

  var s1 = null;
  var r2 = null;
  var r1 = null;
  var layer1 = null;
  var posStart;
  var posNow;
  var mode = "";
  const newCoordinates = { ...coOrdinates };

  useEffect(() => {
    handleResize(700);
  }, [defaultCoordinates]);

  useEffect(() => {
    drawObject();
  }, [resizedCoordinates]);

  const drawObject = () => {
    s1 = new Konva.Stage({
      container: "container1",
      width: resizedCoordinates.width,
      height: resizedCoordinates.height,
    });
    layer1 = new Konva.Layer({ draggable: false });
    s1.add(layer1);

    // draw an image to catch events.
    var imageObj = new Image();
    imageObj.src = imageData.image;
    r1 = new Konva.Image({
      x: 0,
      y: 0,
      width: resizedCoordinates.width,
      height: resizedCoordinates.height,
      image: imageObj,
    });
    layer1.add(r1);

    r2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: "red",
      dash: [2, 2],
    });
    r2.listening(false); // stop r2 catching our mouse events.
    layer1.add(r2);

    s1.draw(); // First draw of canvas.

    mouseEvents();
  };

  function mouseEvents() {
    //   start the rubber drawing on mouse down.
    r1.on("mousedown", function (e) {
      mode = "drawing";
      startDrag({ x: e.evt.layerX, y: e.evt.layerY });
    });

    // update the rubber rect on mouse move - note use of 'mode' var to avoid drawing after mouse released.
    r1.on("mousemove", function (e) {
      if (mode === "drawing") {
        updateDrag({ x: e.evt.layerX, y: e.evt.layerY });
      }
    });

    // here we create the new rect using the location and dimensions of the drawing rect.
    r1.on("mouseup", function (e) {
      mode = "";
      r2.visible(false);
      var newRect = new Konva.Rect({
        x: r2.x(),
        y: r2.y(),
        width: r2.width(),
        height: r2.height(),
        stroke: "red",
        listening: false,
      });
      layer1.add(newRect);
      s1.draw();

      newCoordinates.x2 = r2.x() + r2.height();
      newCoordinates.y2 = r2.y() + r2.width();
      setCoordinates(newCoordinates);
    });
  }
  function startDrag(posIn) {
    posStart = { x: posIn.x, y: posIn.y };
    posNow = { x: posIn.x, y: posIn.y };
    newCoordinates.x1 = posIn.x;
    newCoordinates.y1 = posIn.y;
    setCoordinates(newCoordinates);
  }

  function updateDrag(posIn) {
    // update rubber rect position
    posNow = { x: posIn.x, y: posIn.y };
    var posRect = reverse(posStart, posNow);
    r2.x(posRect.x1);
    r2.y(posRect.y1);
    r2.width(posRect.x2 - posRect.x1);
    r2.height(posRect.y2 - posRect.y1);
    r2.visible(true);

    s1.draw(); // redraw any changes.
  }

  // reverse co-ords if user drags left / up
  function reverse(r1, r2) {
    var r1x = r1.x,
      r1y = r1.y,
      r2x = r2.x,
      r2y = r2.y,
      d;
    if (r1x > r2x) {
      d = Math.abs(r1x - r2x);
      r1x = r2x;
      r2x = r1x + d;
    }
    if (r1y > r2y) {
      d = Math.abs(r1y - r2y);
      r1y = r2y;
      r2y = r1y + d;
    }
    return { x1: r1x, y1: r1y, x2: r2x, y2: r2y }; // return the corrected rect.
  }

  function handleResize(width = 0) {
    const { defaultWidth, defaultHt } = defaultCoordinates;
    const aspectRatio = defaultWidth / defaultHt;
    if (width)
      setResizedCoordinates({
        width,
        height: width / aspectRatio,
      });
  }

  return (
    <div>
      <div>Enter the width to resize the image</div>
      <input
        type="number"
        value={resizedCoordinates.width}
        onChange={(e) => handleResize(Number(e.target.value))}
      />

      <div id="container1" className="m-20"></div>
    </div>
  );
};

export default ImageContainer;
