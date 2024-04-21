import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { themeColor } from "../../constant/const";
import { useSelector } from "react-redux";

function RenderAllPdfPage({
  signPdfUrl,
  allPages,
  setAllPages,
  setPageNumber,
  setSignBtnPosition,
  pageNumber
}) {
  //set all number of pages after load pdf
  function onDocumentLoad({ numPages }) {
    setAllPages(numPages);
  }
  const pageContainer = useRef();
  const isHeader = useSelector((state) => state.showHeader);
  const [pageWidth, setPageWidth] = useState("");

  useEffect(() => {
    if (pageContainer.current) {
      setPageWidth(pageContainer.current.offsetWidth);
    }
  }, [isHeader, pageContainer]);

  return (
    <div
      ref={pageContainer}
      className="hidden min-h-screen w-[20%] bg-[#FFFFFF] md:block"
    >
      <div
        style={{ backgroundColor: themeColor }}
        className={`bg-[${themeColor}] p-[5px] 2xl:p-[15px] text-[15px] text-white  2xl:text-[35px]`}
      >
        <span>Pages</span>
      </div>
      <div
        className={`flex h-[90%] flex-col items-center m-2  
         autoSignScroll max-h-[100vh] `}
      >
        <Document
          loading={"Loading Document.."}
          onLoadSuccess={onDocumentLoad}
          file={signPdfUrl}
        >
          {Array.from(new Array(allPages), (el, index) => (
            <div
              key={index}
              className="border-[2px]  bg-white m-2"
              style={{
                border:
                  pageNumber - 1 === index
                    ? "2px solid red"
                    : "2px solid #878787",
                contain: "content"
              }}
              onClick={() => {
                setPageNumber(index + 1);
                if (setSignBtnPosition) {
                  setSignBtnPosition([]);
                }
              }}
            >
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth - 60}
                scale={1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default RenderAllPdfPage;
