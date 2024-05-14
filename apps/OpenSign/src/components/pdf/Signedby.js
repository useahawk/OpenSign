import React from "react";
import { themeColor } from "../../constant/const";
import "../../styles/signature.css";
function Signedby({ pdfDetails }) {
  const getFirstLetter = (name) => {
    const firstLetter = name.charAt(0);
    return firstLetter;
  };

  return (
    <div className="signerComponent">
      <div
        style={{ background: themeColor }}
        className={` p-[5px] text-[15px] text-white  2xl:text-[30px]`}
      >
        <span>Signed By</span>
      </div>
      <div style={{ marginTop: "2px", background: "white" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "10px",
            background: "#93a3db"
          }}
        >
          <div
            className="  bg-[#abd1d0] w-[15px] h-[15px] 2xl:w-[30px] 2xl:h-[30px] flex rounded-full ring-[1px] ring-offset-1 justify-center items-center
            mr-[0px] mt-[7px] 2xl:mt-[12px]
            "
          >
            <span className="text-[10px] text-center font-medium 2xl:text-[20px] uppercase">
              {getFirstLetter(pdfDetails.ExtUserPtr.Name)}
            </span>
          </div>

          <div className="flex flex-col ml-[10px]">
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-[12px] font-medium text-[#424242] w-[90%]  2xl:text-[28px]">
              {pdfDetails.ExtUserPtr.Name}
            </span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-[12px]  text-[#424242] w-[90%]  2xl:text-[20px]">
              {pdfDetails.ExtUserPtr.Email}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signedby;
