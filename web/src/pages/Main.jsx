import React from "react";
import CurTimeTable from "../components/main/CurrentTimeTable";
import DeviceSelect from "../components/main/DeviceSelect";
import FeedRemain from "../components/main/FeedRemain";
const Main =  props => {

  return(  
    <>
      <DeviceSelect/>
      {/* <CurTimeTable /> */}
      {/* <DirectFeedButton/> */}
      <FeedRemain />
    </>
  );
};

export default Main;
