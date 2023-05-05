# Rectangle Drawer on Image

## Features

### Prev Button

Navigate to previous page

### Next Button

Navigate to next page

### Save Button

Returns the co-ordinates of the rectangle in following format:

```
{
  imageAspectRatio: {
    coOrdinates: {},
    dimensions: {}
  },
  resized: {
    coOrdinates: {},
    dimensions: {}
  }
}
```

Here `imageAspectRatio` object corresponds to the original dimensions of the image wrt to its aspectRatio, whereas `resized` corresponds to the dimensions of the resized image.

Here image can be resized by providing the `width`, where height value is calculated from the `width` passed in the <input /> and the `aspectRatio` of the original image.

### Rectangle

- A rectangle can be drawn on the image.
- Double click the rectangle to select it.
- Drag the anchor strokes to resize the image.
- Delete the rectangle by clicking on `X`.
