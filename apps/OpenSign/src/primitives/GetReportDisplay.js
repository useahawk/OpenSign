import React, { useState, useEffect, useMemo, useRef } from "react";
import pad from "../assets/images/pad.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/report.css";
import ModalUi from "./ModalUi";
import AppendFormInForm from "../components/AppendFormInForm";
import QuickSendUi from "./QuickSendUi";
const ReportTable = ({
  ReportName,
  List,
  setList,
  actions,
  heading,
  setIsNextRecord,
  isMoreDocs,
  docPerPage,
  form
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [actLoader, setActLoader] = useState({});
  const [isAlert, setIsAlert] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [isDocErr, setIsDocErr] = useState(false);
  const [isContactform, setIsContactform] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState({});
  const [templateDeatils, setTemplateDetails] = useState({});
  const [isQuickSend, setIsQuickSend] = useState({});
  const [placeholders, setPlaceholders] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const menuRef = useRef(null);
  const startIndex = (currentPage - 1) * docPerPage;

  // For loop is used to calculate page numbers visible below table
  // Initialize pageNumbers using useMemo to avoid unnecessary re-creation
  const pageNumbers = useMemo(() => {
    const calculatedPageNumbers = [];
    for (let i = 1; i <= Math.ceil(List.length / docPerPage); i++) {
      calculatedPageNumbers.push(i);
    }
    return calculatedPageNumbers;
  }, [List, docPerPage]);

  useEffect(() => {
    document.addEventListener("mousedown", Clickout);
    return () => {
      document.removeEventListener("mousedown", Clickout);
    };
  }, []);

  const Clickout = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActLoader({});
    }
  };
  //  below useEffect reset currenpage to 1 if user change route
  useEffect(() => {
    return () => setCurrentPage(1);
  }, []);

  // `formatRow` is used to show data in poper manner like
  // if data is of array type then it will join array items with ","
  // if data is of object type then it Name values will be show in row
  // if no data available it will show hyphen "-"
  const formatRow = (row) => {
    if (Array.isArray(row)) {
      let updateArr = row.map((x) => x.Name);
      return updateArr.join(", ");
    } else if (typeof row === "object" && row !== null) {
      return row?.Name || "-";
    } else {
      return "-";
    }
  };
  // below useEffect is used to render next record if IsMoreDoc is true
  // second last value of pageNumber array is same as currentPage
  useEffect(() => {
    if (isMoreDocs && pageNumbers[pageNumbers.length - 1] === currentPage) {
      setIsNextRecord(true);
    }
  }, [isMoreDocs, pageNumbers, currentPage, setIsNextRecord]);

  // `handlemicroapp` is used to open microapp
  const handlemicroapp = async (item, url, btnLabel) => {
    if (ReportName === "Templates") {
      if (btnLabel === "Edit") {
        navigate(`/asmf/${url}/${item.objectId}`);
      } else {
        setActLoader({ [`${item.objectId}_${btnLabel}`]: true });
        try {
          const params = {
            templateId: item.objectId
          };
          const templateDeatils = await axios.post(
            `${localStorage.getItem("baseUrl")}functions/getTemplate`,
            params,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": localStorage.getItem("parseAppId"),
                sessionToken: localStorage.getItem("accesstoken")
              }
            }
          );

          // console.log("templateDeatils.data ", templateDeatils.data);
          const templateData =
            templateDeatils.data && templateDeatils.data.result;
          if (!templateData.error) {
            const Doc = templateData;

            let signers = [];
            if (Doc.Signers?.length > 0) {
              Doc.Signers?.forEach((x) => {
                if (x.objectId) {
                  const obj = {
                    __type: "Pointer",
                    className: "contracts_Contactbook",
                    objectId: x.objectId
                  };
                  signers.push(obj);
                }
              });
            }

            let placeholdersArr = [];
            if (Doc.Placeholders?.length > 0) {
              placeholdersArr = Doc.Placeholders;
              const data = {
                Name: Doc.Name,
                URL: Doc.URL,
                SignedUrl: Doc.SignedUrl,
                Description: Doc.Description,
                Note: Doc.Note,
                Placeholders: placeholdersArr,
                ExtUserPtr: {
                  __type: "Pointer",
                  className: "contracts_Users",
                  objectId: Doc.ExtUserPtr.objectId
                },
                CreatedBy: {
                  __type: "Pointer",
                  className: "_User",
                  objectId: Doc.CreatedBy.objectId
                },
                Signers: signers.length > 0 ? signers : undefined
              };
              try {
                const res = await axios.post(
                  `${localStorage.getItem(
                    "baseUrl"
                  )}classes/${localStorage.getItem("_appName")}_Document`,
                  data,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "X-Parse-Application-Id":
                        localStorage.getItem("parseAppId"),
                      "X-Parse-Session-Token":
                        localStorage.getItem("accesstoken")
                    }
                  }
                );

                // console.log("Res ", res.data);
                if (res.data && res.data.objectId) {
                  setActLoader({});
                  setIsAlert(true);
                  navigate(`/asmf/${url}/${res.data.objectId}`, {
                    state: { title: "Use Template" }
                  });
                }
              } catch (err) {
                console.log("Err", err);
                setIsAlert(true);
                setIsErr(true);
                setActLoader({});
              }
            } else {
              setIsDocErr(true);
              setActLoader({});
            }
          } else {
            setIsAlert(true);
            setIsErr(true);
            setActLoader({});
          }
        } catch (err) {
          console.log("err", err);
          setIsAlert(true);
          setIsErr(true);
          setActLoader({});
        }
      }
    } else {
      localStorage.removeItem("rowlevel");
      navigate("/rpmf/" + url);
      localStorage.setItem("rowlevel", JSON.stringify(item));
    }
  };
  const handlebtn = async (item) => {
    if (ReportName === "Contactbook") {
      setIsDeleteModal({ [item.objectId]: true });
    } else if (ReportName === "Templates") {
      setIsLoader(true);
      const params = {
        templateId: item.objectId,
        include: ["Placeholders.signerPtr"]
      };
      const templateDeatils = await axios.post(
        `${localStorage.getItem("baseUrl")}functions/getTemplate`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": localStorage.getItem("parseAppId"),
            sessionToken: localStorage.getItem("accesstoken")
          }
        }
      );

      // console.log("templateDeatils.data ", templateDeatils.data);
      const templateData = templateDeatils.data && templateDeatils.data.result;
      if (templateData?.Placeholders?.length > 0) {
        setPlaceholders(templateData?.Placeholders);
        setTemplateDetails(templateData);
        setIsQuickSend({ [`${item.objectId}`]: true });
      } else {
        setIsDocErr(true);
      }
      setIsLoader(false);
    } else {
      setIsDeleteModal({ [item.objectId]: true });
    }
  };

  // Get current list
  const indexOfLastDoc = currentPage * docPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docPerPage;
  // `currentLists` is total record render on current page
  const currentLists = List.slice(indexOfFirstDoc, indexOfLastDoc);

  // Change page
  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const handleContactFormModal = () => {
    setIsContactform(!isContactform);
  };

  const handleUserData = (data) => {
    setList((prevData) => [data, ...prevData]);
  };

  const handleDelete = async (item, label) => {
    if (ReportName === "Contactbook") {
      setIsDeleteModal({});
      setActLoader({ [item.objectId]: true });
      try {
        const url =
          process.env.REACT_APP_SERVERURL + "/classes/contracts_Contactbook/";
        const body = { IsDeleted: true };
        const res = await axios.put(url + item.objectId, body, {
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": localStorage.getItem("AppID12"),
            "X-Parse-Session-Token": localStorage.getItem("accesstoken")
          }
        });
        // console.log("Res ", res.data);
        if (res.data && res.data.updatedAt) {
          const upldatedList = List.filter((x) => x.objectId !== item.objectId);
          setList(upldatedList);
        }
      } catch (err) {
        console.log("err", err);
        setIsErr(true);
      } finally {
        setIsAlert(true);
        setActLoader({});
      }
    } else {
      setIsDeleteModal({});
      setActLoader({ [`${item.objectId}_${label}`]: true });
      try {
        const url =
          process.env.REACT_APP_SERVERURL + "/classes/contracts_Document/";
        const body = { IsArchive: true };
        const res = await axios.put(url + item.objectId, body, {
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": localStorage.getItem("AppID12"),
            "X-Parse-Session-Token": localStorage.getItem("accesstoken")
          }
        });
        // console.log("Res ", res.data);
        if (res.data && res.data.updatedAt) {
          const upldatedList = List.filter((x) => x.objectId !== item.objectId);
          setList(upldatedList);
        }
      } catch (err) {
        console.log("err", err);
        setIsErr(true);
      } finally {
        setIsAlert(true);
        setActLoader({});
      }
    }
  };
  const handleCloseDeleteModal = () => setIsDeleteModal({});

  const handleQuickSendClose = (status, count) => {
    setIsQuickSend({});
    setIsAlert(true);
    if (status === "success") {
      if (count > 1) {
        setAlertMsg(count + " Documents sent successfully!");
      } else {
        setAlertMsg(count + " Document sent successfully!");
      }
    } else {
      setIsAlert(true);
      setIsErr(true);
    }
  };

  return (
    <div className="p-2 overflow-x-scroll w-full bg-white rounded-md">
      {isLoader && (
        <div className="absolute z-[999] min-h-screen w-[96%] flex justify-center items-center">
          <div
            style={{
              fontSize: "45px",
              color: "#3dd3e0"
            }}
            className="loader-37 "
          ></div>
        </div>
      )}
      {isAlert && (
        <div
          className={`alert alert-${isErr ? "danger" : "success"} alertBox`}
          role="alert"
          onAnimationEnd={() => setIsAlert(false)}
        >
          {isErr
            ? "Something went wrong, Please try again later!"
            : alertMsg
            ? alertMsg
            : "Record deleted successfully!"}
        </div>
      )}

      <div className="flex flex-row items-center justify-between my-2 mx-3 text-[20px] md:text-[23px]">
        <div className="font-light">{ReportName}</div>
        {ReportName === "Templates" && (
          <i
            onClick={() => navigate("/form/template")}
            className="fa-solid fa-square-plus text-sky-400 text-[25px]"
          ></i>
        )}
        {form && (
          <div
            className="cursor-pointer"
            onClick={() => handleContactFormModal()}
          >
            <i className="fa-solid fa-square-plus text-sky-400 text-[25px]"></i>
          </div>
        )}
      </div>
      <table className="table-auto w-full border-collapse">
        <thead className="text-[14px]">
          <tr className="border-y-[1px]">
            {heading?.map((item, index) => (
              <React.Fragment key={index}>
                <th className="px-4 py-2 font-thin">{item}</th>
              </React.Fragment>
            ))}
            {actions?.length > 0 && (
              <th className="px-4 py-2 font-thin">Action</th>
            )}
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {List?.length > 0 ? (
            <>
              {currentLists.map((item, index) =>
                ReportName === "Contactbook" ? (
                  <tr className="border-y-[1px]" key={index}>
                    {heading.includes("Sr.No") && (
                      <td className="px-4 py-2">{startIndex + index + 1}</td>
                    )}
                    <td className="px-4 py-2 font-semibold">{item?.Name} </td>
                    <td className="px-4 py-2">{item?.Email || "-"}</td>
                    <td className="px-4 py-2">{item?.Phone || "-"}</td>
                    <td className="px-3 py-2 text-white">
                      {actions?.length > 0 &&
                        actions.map((act, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              act?.redirectUrl
                                ? handlemicroapp(item, act.redirectUrl)
                                : handlebtn(item)
                            }
                            className={`mb-1 flex justify-center items-center gap-1 px-2 py-1 rounded shadow`}
                            style={{
                              backgroundColor: act.btnColor
                                ? act.btnColor
                                : "#3ac9d6",
                              color: act?.textColor ? act?.textColor : "white"
                            }}
                          >
                            <span>
                              {act?.btnIcon && (
                                <i
                                  className={
                                    actLoader[item.objectId]
                                      ? "fa-solid fa-spinner fa-spin-pulse"
                                      : act.btnIcon
                                  }
                                ></i>
                              )}
                            </span>
                            {act?.btnLabel && (
                              <span className="uppercase">
                                {act?.btnLabel ? act.btnLabel : "View"}
                              </span>
                            )}
                          </button>
                        ))}
                      {isDeleteModal[item.objectId] && (
                        <ModalUi
                          isOpen
                          title={"Delete Contact"}
                          handleClose={handleCloseDeleteModal}
                        >
                          <div className="m-[20px]">
                            <div className="text-lg font-normal text-black">
                              Are you sure you want to delete this contact?
                            </div>
                            <hr className="bg-[#ccc] mt-4 " />
                            <div className="flex items-center mt-3 gap-2 text-white">
                              <button
                                onClick={() => handleDelete(item)}
                                className="bg-[#1ab6ce] rounded-sm shadow-md text-[12px] font-semibold uppercase text-white py-1.5 px-3 focus:outline-none"
                              >
                                Yes
                              </button>
                              <button
                                onClick={handleCloseDeleteModal}
                                className="bg-[#188ae2] rounded-sm shadow-md text-[12px] font-semibold uppercase text-white py-1.5 px-3 text-center ml-[2px] focus:outline-none"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </ModalUi>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr className="border-y-[1px]" key={index}>
                    {heading.includes("Sr.No") && (
                      <td className="px-4 py-2">{startIndex + index + 1}</td>
                    )}
                    <td className="px-4 py-2 font-semibold w-56">
                      {item?.Name}{" "}
                    </td>
                    {heading.includes("Note") && (
                      <td className="px-4 py-2 w-44">{item?.Note || "-"}</td>
                    )}
                    {heading.includes("Folder") && (
                      <td className="px-4 py-2">
                        {item?.Folder?.Name || "OpenSignDrive"}
                      </td>
                    )}
                    <td className="px-4 py-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item?.URL}
                        href={item?.URL}
                        download={item?.URL}
                        className="text-[blue] hover:text-[blue] hover:underline"
                      >
                        {item?.URL ? "Download" : "-"}
                      </a>
                    </td>

                    <td className="px-4 py-2">{formatRow(item?.ExtUserPtr)}</td>
                    <td className="px-4 py-2 w-36">
                      {item?.Signers ? formatRow(item?.Signers) : "-"}
                    </td>
                    <td className="px-3 py-2 text-white">
                      <div className="flex flex-row items-center gap-1">
                        {actions?.length > 0 &&
                          actions.map((act, index) =>
                            act?.target === "menu" ? (
                              <div key={index} className="relative">
                                <span
                                  className="cursor-pointer items-center focus:outline-transparent"
                                  onClick={() =>
                                    setActLoader({
                                      [`${item.objectId}_${act.btnLabel}`]:
                                        !actLoader[
                                          `${item.objectId}_${act.btnLabel}`
                                        ]
                                    })
                                  }
                                >
                                  {act?.btnIcon && (
                                    <i
                                      className={act.btnIcon + " ml-1 text-black"}
                                    ></i>
                                  )}
                                </span>
                                {actLoader[
                                  `${item.objectId}_${act.btnLabel}`
                                ] && (
                                  <div
                                    ref={menuRef}
                                    className="absolute z-30 bg-white border border-black rounded min-w-max right-0"
                                  >
                                    {act?.items.map((menuItem, index) => (
                                      <div key={index + "menu"}>
                                        <button
                                          onClick={() =>
                                            menuItem?.redirectUrl
                                              ? handlemicroapp(
                                                  item,
                                                  menuItem.redirectUrl,
                                                  menuItem.btnLabel
                                                )
                                              : handlebtn(item)
                                          }
                                          className={`my-1 text-black flex items-center gap-1 px-2 py-1 hover:bg-gray-200 w-full`}
                                        >
                                          <span>
                                            {menuItem?.btnIcon && (
                                              <i
                                                className={menuItem.btnIcon}
                                              ></i>
                                            )}
                                          </span>
                                          <span className="">
                                            {menuItem?.btnLabel
                                              ? menuItem.btnLabel
                                              : "view"}
                                          </span>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <React.Fragment key={index}>
                                <button
                                  onClick={() =>
                                    act?.redirectUrl
                                      ? handlemicroapp(
                                          item,
                                          act.redirectUrl,
                                          act.btnLabel
                                        )
                                      : handlebtn(item)
                                  }
                                  className={`mb-1 flex justify-center items-center gap-1 px-2 py-1 rounded shadow`}
                                  style={{
                                    backgroundColor: act.btnColor
                                      ? act.btnColor
                                      : "#3ac9d6",
                                    color: act?.textColor
                                      ? act?.textColor
                                      : "white"
                                  }}
                                >
                                  <span>
                                    {act?.btnIcon && (
                                      <i
                                        className={
                                          actLoader[
                                            `${item.objectId}_${act.btnLabel}`
                                          ]
                                            ? "fa-solid fa-spinner fa-spin-pulse"
                                            : act.btnIcon
                                        }
                                      ></i>
                                    )}
                                  </span>
                                  <span className="uppercase">
                                    {act?.btnLabel ? act.btnLabel : "view"}
                                  </span>
                                </button>
                                {isDeleteModal[item.objectId] && (
                                  <ModalUi
                                    isOpen
                                    title={"Delete Document"}
                                    handleClose={handleCloseDeleteModal}
                                  >
                                    <div className="m-[20px]">
                                      <div className="text-lg font-normal text-black">
                                        Are you sure you want to delete this
                                        document?
                                      </div>
                                      <hr className="bg-[#ccc] mt-4 " />
                                      <div className="flex items-center mt-3 gap-2 text-white">
                                        <button
                                          onClick={() =>
                                            handleDelete(item, act.btnLabel)
                                          }
                                          className="bg-[#1ab6ce] rounded-sm shadow-md text-[12px] font-semibold uppercase text-white py-1.5 px-4 focus:outline-none"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={handleCloseDeleteModal}
                                          className="bg-[#ffffff] rounded-sm shadow-md border-[1px] text-[12px] font-semibold uppercase text-black py-1.5 px-4 text-center ml-[2px] focus:outline-none"
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  </ModalUi>
                                )}
                              </React.Fragment>
                            )
                          )}
                      </div>
                      {isQuickSend[`${item.objectId}`] && (
                        <ModalUi
                          isOpen
                          title={"Quick send"}
                          handleClose={() => setIsQuickSend({})}
                        >
                          <QuickSendUi
                            Placeholders={placeholders}
                            item={templateDeatils}
                            handleClose={handleQuickSendClose}
                          />
                        </ModalUi>
                      )}
                    </td>
                  </tr>
                )
              )}
            </>
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-2 p-2 ">
        {List.length > docPerPage && (
          <>
            {currentPage > 1 && (
              <button
                onClick={() => paginateBack()}
                className="bg-blue-400 text-white rounded px-3 py-2 focus:outline-none"
              >
                Prev
              </button>
            )}
          </>
        )}
        {pageNumbers.map((x) => (
          <button
            key={x}
            onClick={() => setCurrentPage(x)}
            className=" bg-sky-400 text-white rounded px-3 py-2 focus:outline-none"
          >
            {x}
          </button>
        ))}
        {isMoreDocs && (
          <button className="text-black rounded px-1 py-2">...</button>
        )}
        {List.length > docPerPage && (
          <>
            {pageNumbers.includes(currentPage + 1) && (
              <button
                onClick={() => paginateFront()}
                className="bg-blue-400 text-white rounded px-3 py-2 focus:outline-none"
              >
                Next
              </button>
            )}
          </>
        )}
      </div>
      {List?.length <= 0 && (
        <div className="flex flex-col items-center justify-center w-full bg-white rounded py-4">
          <div className="w-[60px] h-[60px] overflow-hidden">
            <img className="w-full h-full object-contain" src={pad} alt="img" />
          </div>
          <div className="text-sm font-semibold">No Data Available</div>
        </div>
      )}
      <ModalUi
        title={"Add Contact"}
        isOpen={isContactform}
        handleClose={handleContactFormModal}
      >
        <AppendFormInForm
          handleUserData={handleUserData}
          closePopup={handleContactFormModal}
        />
      </ModalUi>
      <ModalUi
        headColor={"#dc3545"}
        isOpen={isDocErr}
        title={"Receipent required"}
        handleClose={() => setIsDocErr(false)}
      >
        <div style={{ height: "100%", padding: 20 }}>
          <p>Please add receipent in template!</p>
        </div>
      </ModalUi>
    </div>
  );
};

export default ReportTable;
