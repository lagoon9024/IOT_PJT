import React from "react";
import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  IconButton,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from "@material-ui/core";
import Caticon from "../../assets/icons/caticon2.png";
import Dogicon from "../../assets/icons/dogicon.png";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  gridContainer: {
    width: "90vw",
    maxWidth: "500px"
  },
  paper: {
    padding: theme.spacing(1)
  },
  media: {
    height: "100px"
  }
}));

const DeviceListTable = ({ props }) => {
  const classes = useStyles();
  const { onChangeStore, store } = useStore();
  const [cookies, setCookies, removeCookies] = useCookies(["d_CurNo"]);
  const { input, isLoading, dataFetch } = useFetchData(
    "/device/",
    "devicelist"
  );
  const history = useHistory()
  const calcAge = birth => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let monthDay = month + day;
    birth = birth.replace("-", "").replace("-", "");
    let birthdayy = birth.substr(0, 4);
    let birthdaymd = birth.substr(4, 4);
    let age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
    if (age < 1) {
      let monthAge = monthDay.substr(0, 2) - birthdaymd.substr(0, 2);
      return monthAge === 0
        ? "1개월 미만"
        : (monthAge < 0 ? 12 + monthAge : monthAge) + "개월";
    }
    return age + "살";
  };
  useEffect(() => {
    removeCookies("d_CurNo", { path: "/" });
    if(store.u_No !== ""){
      dataFetch(store.url + "/device/" + store.u_No, "devicelist");
    }
  }, [store.u_No]);
  return (
    <div className={classes.page}>
      <div className={classes.gridContainer}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h6">밥그릇</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingBottom="10px"
        >
          <IconButton
            style={{ padding: "0px" }}
            aria-label="add"
            color="primary"
            onClick={e => history.push("regist")}
          >
            <AddCircleOutlineIcon />
            <Typography>기기 등록</Typography>
          </IconButton>
        </Box>
        <Grid container spacing={2} alignItems="center" justify="flex-start">
          {isLoading ? (
            <></>
          ) : (
            input.map(device =>
              device === undefined ? (
                <></>
              ) : (
                <Grid item xs={6} sm={4} key={`d_${device.d_No}`}>
                  <Card
                    onClick={e => {
                      setCookies("d_CurNo", device.d_No, { path: "/" });
                      onChangeStore({ currentDeviceNo: device.d_No }, "", "");
                      history.push("/devicemodify");
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        // className={classes.media}
                        image={
                          device.d_Species === "고양이" ? Caticon : Dogicon
                        }
                        height="100%"
                      >
                        {/* <img className={classes.media} src={device.d_Species === "고양이" ? Caticon: Dogicon} alt=""/> */}
                      </CardMedia>
                      <CardContent>
                        <Typography component="p" variant="body1">
                          {device.d_Name}
                        </Typography>
                        <Typography component="p" variant="caption">
                          {device.d_Species}
                        </Typography>
                        <Typography component="p" variant="caption">
                          나이:{" "}
                          {device.d_Bday ? calcAge(device.d_Bday) : "   -"}
                        </Typography>
                        <Typography component="p" variant="caption">
                          몸무게: {device.d_Weight} kg
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            )
          )}
        </Grid>
      </div>
    </div>
  );
};
export default DeviceListTable;
