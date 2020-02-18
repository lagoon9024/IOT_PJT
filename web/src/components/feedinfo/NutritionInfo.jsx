import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { keyframes } from "styled-components";
import { useEffect } from "react";


// const useStyles = makeStyles(theme => ({
//   page: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center"
//   },
//   media: {
//     width: 150,
//     height: 170
//   },
//   score: {
//     height: "100%",
//     width: 150,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-around"
//   }
// }));
// ==== 사료 영양 정보 ==================
const nutMatch = {
  f_Protein: "조단백",
  f_Fat: "조지방",
  f_Calcium: "칼슘",
  f_Phosphorus: "인",
  f_Fiber: "조섬유",
  f_Ash: "조회분",
  f_Moisture: "수분"
};
// ======================================
const NutritionInfo = props => {
  // const classes = useStyles();
  const { input, dataFetch } = useFetchData(
    "/feed/nutrient/" + props.f_No,
    "feedinfo"
  );
  const { store } = useStore();
  useEffect(() => {
    dataFetch(store.url + "/feed/nutrient/" + props.f_No, "feedinfo");
  }, [store]);
  return (
    <>
      <Box width="99%" maxWidth="500px">
        <Typography variant="h6" gutterBottom>
          영양 성분
        </Typography>
        <Divider />
        <Grid container spacing={0} alignItems="center" justify="flex-start">
          {Object.entries(input).map((nutrition,index) =>
            nutMatch === undefined ? (
              <></>
            ) : nutMatch[nutrition[0]] === undefined ? (
              <></>
            ) : (
              <>
                <Grid item xs={3} key={index}>
                  <Typography variant="body2">
                    {nutMatch[nutrition[0]]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="overline">{nutrition[1]}%</Typography>
                </Grid>
              </>
            )
          )}
        </Grid>
        {/* <Grid container spacing={0} alignItems="center" justify="flex-start">
          {testData.others.map(other => (
            <>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {testData.others.indexOf(other) === 0 ? "기타 영양소" : ""}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="overline">
                  {other.ingNm} {other.percent}
                </Typography>
              </Grid>
            </>
          ))}
        </Grid> */}
      </Box>
    </>
  );
};

export default NutritionInfo;
