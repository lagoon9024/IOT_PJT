import React from "react";
import { makeStyles, Box, Typography } from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
    //color : lightBlue[300]
  },
  time : {
    color : "#f5e1a4"
  },
  remain : {
    color : "#b93c3c"
  },
  empty : {
    color : "#00ab84"
  }
}));
const CurrentTimeTable = ({ props }) => {
  const classes = useStyles();
  const { input, isLoading ,dataFetch} = useFetchData("/logdata/", "maintable");
  const { store } = useStore();
  React.useMemo(()=>{
    if(store.u_Last !== undefined && store.u_Last !== "" && input.data !== undefined){
      dataFetch(store.url + "/logdata/"+store.u_Last,"maintable");
    }
  },[store.u_Last])
  return (
    <div className={classes.page}>
        <Box width="100%" maxWidth="500px" marginTop = "20px">
          <Box width="100%" display="flex" justifyContent="space-between" marginBottom = "15px">
                  <Box  display="flex" width = "50%" justifyContent = "center">
                    <Typography variant="h5" >시간</Typography>
                  </Box>
                  <Box  display="flex" justifyContent = "center" width="50%">
                    <Typography variant="h5" >상태</Typography>
                  </Box>
                </Box>
          {isLoading? (<></>): input.data === undefined
            ? ""
            : input.data.map((data,index) => (
                <Box width="100%" display="flex" justifyContent="space-between" marginBottom = "15px" key = {index}>
                  <Box display="flex" width = "50%" justifyContent = "center">
                    <Typography variant="body1" >{data.l_Time.slice(11,19)}</Typography>
                  </Box>
                  <Box  display="flex" justifyContent = "center" width="50%">
                    <Typography  variant="body1" className = {data.l_Remain === 0 ? classes.empty : classes.remain}>
                      {data.l_Remain === 0 ? "다 먹음" : "남김"}
                    </Typography>
                  </Box>
                </Box>
              ))}
        </Box>
    </div>
  );
};

export default CurrentTimeTable;
