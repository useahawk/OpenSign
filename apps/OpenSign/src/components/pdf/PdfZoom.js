import React from "react";

function PdfZoom(props) {
  const onClickZoomIn = () => {
    props.setScale(props.scale + 0.1 * props.scale);
    props.setZoomPercent(props.zoomPercent + 10);
  };

  const onClickZoomOut = () => {
    if (props.zoomPercent > 0) {
      props.setScale(props.scale - 0.1 * props.scale);
      props.setZoomPercent(props.zoomPercent - 10);
    }
  };
  const handleReset = () => {
    props.setScale(1);
    props.setZoomPercent(0);
  };
  return (
    <span className=" hidden  md:flex flex-col gap-1 mt-5">
      <span
        className="bg-gray-50 px-[4px] cursor-pointer"
        onClick={onClickZoomIn}
        title="Zoom in"
      >
        <i className="fa-solid fa-magnifying-glass-plus text-gray-500"></i>
      </span>
      <span
        className="bg-gray-50 px-[4px] cursor-pointer"
        onClick={handleReset}
        title="Reset"
      >
        <i className="fa-solid fa-arrows-rotate text-gray-500"></i>
      </span>
      <span
        className="bg-gray-50 px-[4px]"
        onClick={onClickZoomOut}
        style={{
          cursor: props.zoomPercent > 0 ? "pointer" : "default"
        }}
        title="Zoom out"
      >
        <i className="fa-solid fa-magnifying-glass-minus text-gray-500"></i>
      </span>
    </span>
  );
}

export default PdfZoom;
