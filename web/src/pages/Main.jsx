import React from "react";
import CurTimeTable from "../components/main/CurrentTimeTable";
import DeviceSelect from "../components/main/DeviceSelect";
const Main =  props => {

  return(  
    <>
      <DeviceSelect/>
      <CurTimeTable />
      {/* <DirectFeedButton/> */}
    </>
  );
};

export default Main;
