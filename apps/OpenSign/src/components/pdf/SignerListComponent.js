import React from "react";
import { getFirstLetter } from "../../constant/Utils";

function SignerListComponent(props) {
  return (
    <div
      className="flex flex-row items-center py-[10px]"
      style={{
        background: props.checkSignerBackColor(props.obj)
      }}
    >
      <div
        className={`${
          props.isMenu && "md:hidden lg:inline-block"
        } bg-[#abd1d0] w-[30px] h-[30px] flex rounded-[15px] justify-center items-center mr-[10px] ml-[5px]`}
      >
        <span className="text-[12px] text-center font-medium text-black uppercase">
          {getFirstLetter(props.obj.Name)}
        </span>
      </div>
      <div className="flex flex-col ml-[2px]">
        <span className="userName">{props.obj.Name}</span>
        <span className="useEmail">{props.obj.Email}</span>
      </div>
    </div>
  );
}

export default SignerListComponent;
