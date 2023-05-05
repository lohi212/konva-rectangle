import React, { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Circle, Text } from "react-konva";
import URLImage from "./Image";
import { ShapeDrawerContext } from "../App";

export default function ObjectDraw() {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { setCoordinates, coOrdinates, resizedDimensions } =
    useContext(ShapeDrawerContext);
  const transformerRef = useRef(null);

  const handleMouseDown = (event) => {
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);

      const newCoordinates = { ...coOrdinates };
      newCoordinates.x1 = x;
      newCoordinates.y1 = y;
      setCoordinates(newCoordinates);
    }
  };

  const handleMouseUp = (event) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);

      const newCoordinates = { ...coOrdinates };
      newCoordinates.x2 = x;
      newCoordinates.y2 = y;
      setCoordinates(newCoordinates);
    }
  };

  const handleMouseMove = (event) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: "0",
        },
      ]);
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];

  const checkDeselect = (e) => {
    if (["Circle", "Text"].includes(e.target.className)) {
      handleDelete(selectedIndex);
    }
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty || e.target.className !== "Rect") {
      setSelectedIndex(null);
    }
  };

  const handleDelete = (index) => {
    const annot = JSON.parse(JSON.stringify(annotations));
    annot.splice(index, 1);
    setAnnotations(annot);
  };

  return (
    <Stage
      width={resizedDimensions.width}
      height={resizedDimensions.height}
      onMouseDown={checkDeselect}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <URLImage
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          onClick={checkDeselect}
          x={0}
        />
        {annotationsToDraw.map((value, index) => {
          return (
            <>
              <Rect
                x={value.x}
                key={index}
                onClick={(e) => {
                  setSelectedIndex(index);
                  transformerRef?.current?.nodes([e.target]);
                  transformerRef?.current?.getLayer().batchDraw();
                }}
                shapeProps={value}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke="red"
                draggable
              />
              {selectedIndex === index && (
                <>
                  <Transformer
                    ref={transformerRef}
                    anchorCornerRadius={5}
                    rotateEnabled={false}
                  ></Transformer>
                  <Circle
                    radius={10}
                    x={value.x + value.width}
                    y={value.y}
                    fill="red"
                    key={index}
                    id={index}
                  />
                  <Text
                    text="X"
                    x={value.x + value.width - 3}
                    y={value.y - 5}
                    fontSize={10}
                    fill="white"
                  />
                </>
              )}
            </>
          );
        })}
      </Layer>
    </Stage>
  );
}
