import React, { useContext, useEffect, useRef } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import { ShapeDrawerContext } from "../App";

const URLImage = (props) => {
  const { currentImg, resizedDimensions } = useContext(ShapeDrawerContext);
  const [image] = useImage(currentImg.image);
  const imageNode = useRef();

  return (
    <Image
      x={props.x}
      y={props.y}
      height={resizedDimensions.height}
      width={resizedDimensions.width}
      onMouseDown={props.handleMouseDown}
      onMouseMove={props.handleMouseMove}
      image={image}
      ref={imageNode}
    />
  );
};

export default URLImage;
