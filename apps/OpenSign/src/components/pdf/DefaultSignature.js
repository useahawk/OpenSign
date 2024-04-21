import React from "react";
import { themeColor } from "../../constant/const";
function DefaultSignature({ defaultSignImg, xyPostion, setDefaultSignAlert }) {
  const confirmToaddDefaultSign = () => {
    if (xyPostion.length > 0) {
      setDefaultSignAlert({
        isShow: true,
        alertMessage:
          "Are you sure you want to auto sign at requested all locations?"
      });
    } else {
      setDefaultSignAlert({
        isShow: true,
        alertMessage: "please select position!"
      });
    }
  };

  return (
    <div>
      <div
        className="text-[#FFFFFF] p-[5px] mt-[5px] text-[1.3vw]"
        style={{
          background: themeColor
        }}
      >
        Signature
      </div>
      <div className="flex flex-col items-center mt-[10px] font-medium">
        <>
          <p className="text-[1.2vw]">Your Signature</p>
          <div className="defaultSignBox">
            <img
              alt="default img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
              src={defaultSignImg}
            />
          </div>
          <button
            style={{
              background: themeColor,
              color: "white",
              marginTop: "20px",
              cursor: "pointer",
              marginBottom: "10px"
            }}
            type="button"
            className="shadow py-[3px] px-[30px] text-[#FFFFFF] text-[1.3vw] border-none ml-[10px]
            rounded-1
            finishnHover"
            onClick={() => confirmToaddDefaultSign()}
          >
            Auto Sign All
          </button>
        </>
      </div>
    </div>
  );
}

export default DefaultSignature;
