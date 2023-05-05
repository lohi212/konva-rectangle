import React, { createContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import ObjectDraw from "./components/ObjectDraw";
import { imagesList } from "./utils/index";
import "./App.css";

export const ShapeDrawerContext = createContext(null);

export default function App() {
  const [originalDimensions, setOriginalDimensions] = useState({
    defaultWidth: 0,
    defaultHt: 0,
  });
  const [resizedDimensions, setResizedDimensions] = useState({
    // Here 500 is considered as the default width for all the images and height is the calculated value
    width: 500,
    height: 0,
  });
  const [currentImg, setCurrImg] = useState(imagesList[0]);
  const [coOrdinates, setCoordinates] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  useEffect(() => {
    getDefaultDimensions();
  }, [currentImg]);

  const getDefaultDimensions = () => {
    var imageContainer = document.createElement("img");
    imageContainer.src = currentImg.image;

    imageContainer.onload = function () {
      const defaultWidth = imageContainer.naturalWidth;
      const defaultHt = imageContainer.naturalHeight;
      setOriginalDimensions({ defaultWidth, defaultHt });
    };
    imageContainer.onerror = function (e) {
      setOriginalDimensions({ defaultWidth: 0, defaultHt: 0 });
    };
  };

  useEffect(() => {
    handleResize(resizedDimensions.width);
  }, [originalDimensions]);

  const handleNext = () => {
    if (currentImg.id < imagesList.length - 1)
      setCurrImg(imagesList[currentImg.id + 1]);
    else setCurrImg(imagesList[0]);
  };

  const handlePrev = () => {
    if (currentImg.id > 0) setCurrImg(imagesList[currentImg.id - 1]);
    else setCurrImg(imagesList[imagesList.length - 1]);
  };

  function handleResize(width = 0) {
    const { defaultWidth, defaultHt } = originalDimensions;
    const aspectRatio = defaultWidth / defaultHt;
    if (width)
      setResizedDimensions({
        width,
        height: width / aspectRatio,
      });
  }

  const handleSave = () => {
    const { defaultWidth, defaultHt } = originalDimensions;
    const allCoordinates = {
      resized: {
        coOrdinates,
        dimensions: {
          width: resizedDimensions.width,
          height: resizedDimensions.height,
        },
      },
      imageAspectRatio: {
        coOrdinates: {
          x1: (coOrdinates.x1 / resizedDimensions.width) * defaultWidth,
          y1: (coOrdinates.y1 / resizedDimensions.height) * defaultHt,
          x2: (coOrdinates.x2 / resizedDimensions.width) * defaultWidth,
          y2: (coOrdinates.y2 / resizedDimensions.height) * defaultHt,
        }, // needs calculation
        dimensions: {
          width: defaultWidth,
          height: defaultHt,
        },
      },
    };
    console.log({ allCoordinates });
  };

  return (
    <ShapeDrawerContext.Provider
      value={{
        currentImg,
        setCoordinates,
        coOrdinates,
        resizedDimensions,
        setResizedDimensions,
        handleResize,
      }}
    >
      <button onClick={handlePrev}>Prev</button>
      <button onClick={handleNext}>Next</button>
      <button onClick={handleSave}>Save</button>

      <div className="m-10">
        <div>Enter the width to resize the image</div>
        <input
          type="number"
          value={resizedDimensions.width}
          onChange={(e) => handleResize(Number(e.target.value))}
        />
      </div>
      <div className="m-10">
        <ObjectDraw />
      </div>
    </ShapeDrawerContext.Provider>
  );
}
