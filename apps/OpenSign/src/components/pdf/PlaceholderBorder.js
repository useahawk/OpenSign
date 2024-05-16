import React from "react";
import { themeColor } from "../../constant/const";
import {
  defaultWidthHeight,
  isMobile,
  radioButtonWidget,
  resizeBorderExtraWidth,
  textWidget
} from "../../constant/Utils";
function PlaceholderBorder(props) {
  const getResizeBorderExtraWidth = resizeBorderExtraWidth();
  const defaultWidth = defaultWidthHeight(props.pos.type).width;
  const defaultHeight = defaultWidthHeight(props.pos.type).height;

  const width = () => {
    const getWidth = props.pos.Width || defaultWidth;

    // if (props.pos.zoomScale === props.scale) {
    //   return (
    //     getWidth * props.scale * props.containerScale +
    //     getResizeBorderExtraWidth
    //   );
    //    // return (getWidth * props.scale) + getResizeBorderExtraWidth;
    // } else {
    // return getWidth * props.scale + getResizeBorderExtraWidth;
    return (
      getWidth * props.scale * props.containerScale + getResizeBorderExtraWidth
    );
    // }
  };
  const height = () => {
    const getHeight = props.pos.Height || defaultHeight;
    // if (props.pos.zoomScale === props.scale) {
    //   // return (
    //   //   getHeight * props.scale * props.containerScale +
    //   //   getResizeBorderExtraWidth
    //   // );
    //    return (getHeight * props.scale) + getResizeBorderExtraWidth;
    // } else {
    //  return getHeight * props.scale + getResizeBorderExtraWidth;
    return (
      getHeight * props.scale * props.containerScale + getResizeBorderExtraWidth
    );
    // }
  };

  const handleMinWidth = () => {
    if (props.pos.type === "checkbox" || props.pos.type === radioButtonWidget) {
      return props.getCheckboxRenderWidth.width + getResizeBorderExtraWidth;
    } else {
      return width();
    }
  };
  const handleMinHeight = () => {
    if (props.pos.type === "checkbox" || props.pos.type === radioButtonWidget) {
      return props.getCheckboxRenderWidth.height + getResizeBorderExtraWidth;
    } else {
      return height();
    }
  };
  return (
    <div
      onMouseEnter={() => !isMobile && props?.setDraggingEnabled(true)}
      onTouchEnd={() =>
        props.pos.type === textWidget && props?.setDraggingEnabled(true)
      }
      className="borderResize"
      style={{
        borderColor: themeColor,
        borderStyle: "dashed",
        minWidth: handleMinWidth(),
        minHeight: handleMinHeight(),
        borderWidth: "0.2px",
        overflow: "hidden"
      }}
    ></div>
  );
}

export default PlaceholderBorder;
