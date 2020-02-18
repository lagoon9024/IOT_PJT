import React from "react";
import TimeTable from "../components/set/TimeTable";
import DeviceSelect from "../components/main/DeviceSelect";
const Setting = props => {
  return (
    <>
      <DeviceSelect />
      <TimeTable />
    </>
  );
};

export default Setting;
