import React, { useEffect, useState } from "react";
import { imagesList } from "../utils";
import Image from "./Image";

const ObjectDraw = () => {
  const [defaultCoordinates, setDefaultCoordinates] = useState({
    defaultWidth: 0,
    defaultHt: 0,
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
      setDefaultCoordinates({ defaultWidth, defaultHt });
    };
    imageContainer.onerror = function (e) {
      setDefaultCoordinates({ defaultWidth: 0, defaultHt: 0 });
    };
  };

  const handleNext = () => {
    if (currentImg.id < imagesList.length - 1)
      setCurrImg(imagesList[currentImg.id + 1]);
    else setCurrImg(imagesList[0]);
  };

  const handlePrev = () => {
    if (currentImg.id > 0) setCurrImg(imagesList[currentImg.id - 1]);
    else setCurrImg(imagesList[imagesList.length - 1]);
  };

  const handleSave = () => {
    const { defaultWidth, defaultHt } = defaultCoordinates;
    const allCoordinates = {
      old: {
        coOrdinates,
        dimensions: {
          width: 400,
          height: 400,
        },
      },
      new: {
        coOrdinates: {
          x1: (coOrdinates.x1 / 400) * defaultWidth,
          y1: (coOrdinates.y1 / 400) * defaultHt,
          x2: (coOrdinates.x2 / 400) * defaultWidth,
          y2: (coOrdinates.y2 / 400) * defaultHt,
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
    <div>
      <button onClick={handlePrev}>Prev</button>
      <button onClick={handleNext}>Next</button>
      <button onClick={handleSave}>Save</button>
      <Image
        imageData={currentImg}
        setCoordinates={setCoordinates}
        coOrdinates={coOrdinates}
        defaultCoordinates={defaultCoordinates}
      />
    </div>
  );
};

export default ObjectDraw;
