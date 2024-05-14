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
  pageNumber,
  signerPos,
  signerObjectId
}) {
  const [signPageNumber, setSignPageNumber] = useState([]);
  const [bookmarkColor, setBookmarkColor] = useState("");
  //set all number of pages after load pdf
  function onDocumentLoad({ numPages }) {
    setAllPages(numPages);
    //check if signerPos array exist then save page number exist in signerPos array to show bookmark icon
    if (signerPos) {
      const checkUser = signerPos.filter(
        (data) => data.signerObjId === signerObjectId
      );
      setBookmarkColor(checkUser[0]?.blockColor);
      let pageNumberArr = [];
      if (checkUser?.length > 0) {
        checkUser[0]?.placeHolder?.map((data) => {
          pageNumberArr.push(data?.pageNumber);
        });

        setSignPageNumber(pageNumberArr);
      }
    }
  }
  const pageContainer = useRef();
  const isHeader = useSelector((state) => state.showHeader);
  const [pageWidth, setPageWidth] = useState("");

  useEffect(() => {
    if (pageContainer.current) {
      setPageWidth(pageContainer.current.offsetWidth);
    }
  }, [isHeader, pageContainer]);
  //'function `addSignatureBookmark` is used to display the page where the user's signature is located.
  const addSignatureBookmark = (index) => {
    const ispageNumber = signPageNumber.includes(index + 1);
    return (
      ispageNumber && (
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            top: -12,
            right: -7,
            transform: "translate(50% -50%)"
          }}
        >
          <i
            style={{ color: bookmarkColor || "red" }}
            className="fa-solid fa-bookmark"
          ></i>
        </div>
      )
    );
  };

  return (
    <div
      ref={pageContainer}
      className="hidden min-h-screen w-[20%] bg-[#FFFFFF] md:block"
    >
      <div
        style={{ backgroundColor: themeColor }}
        className={` p-[5px] 2xl:p-[15px] text-[15px] text-white  2xl:text-[35px]`}
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
                // padding: "5px",
                margin: "10px",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative"
              }}
              onClick={() => {
                setPageNumber(index + 1);
                if (setSignBtnPosition) {
                  setSignBtnPosition([]);
                }
              }}
            >
              {signerPos && addSignatureBookmark(index)}

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  overflow: "hidden"
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
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default RenderAllPdfPage;
