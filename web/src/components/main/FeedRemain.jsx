import React from "react";
import {
  makeStyles,
  Box,
  Typography,
  Grid,
  SvgIcon,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { Doughnut, Chart } from "react-chartjs-2";
import { PacmanLoader } from "react-spinners";
import { css } from "styled-components";
import axios from "axios";

var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function() {
    originalDoughnutDraw.apply(this, arguments);

    var chart = this.chart.chart;
    var ctx = chart.ctx;
    var width = chart.width;
    var height = chart.height;

    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em Verdana";
    ctx.textBaseline = "middle";

    var text = chart.config.data.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2) + 2,
      textY = height / 2 + 3;
    var textColor = chart.config.data.color;

    ctx.fillStyle = textColor;
    ctx.fillText(text, textX, textY);
  }
});

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
    //color : lightBlue[300]
  },
  feedBowl: {
    position: "absolute",
    marginTop: "15px"
  },
  feedBowlText: {
    position: "absolute",
    marginTop: "15px"
  },
  feedBowlImg: {
    width: "100%",
    maxWidth: "200px",
    height: "100%"
  }
}));
const FeedRemain = ({ props }) => {
  const classes = useStyles();
  const { input, dataFetch, isLoading, setIsLoading } = useFetchData(
    "/logdata/",
    "maintable"
  );
  const { store } = useStore();
  const theme = useTheme();
  const underSm = useMediaQuery(theme.breakpoints.down("xs"));
  const calcTime = recentSync => {
    if (recentSync == 0) return ""
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    let monthDay = month + day;
    let hourmin = hour + minute;
    recentSync = recentSync
      .replace("-", "")
      .replace("-", "")
      .replace(" ", "")
      .replace(":", "")
      .replace(":", "");
    let syncdayy = recentSync.substr(0, 4);
    let syncdaymd = recentSync.substr(4, 4);
    let syncdayhm = recentSync.substr(8, 4);
    let recent = monthDay < syncdaymd ? year - syncdayy - 1 : year - syncdayy;
    let monthAge = monthDay.substr(0, 2) - syncdaymd.substr(0, 2);
    if (recent < 1) {
      if (monthAge >= 1) {
        return monthAge + "개월 전";
      } else {
        let daydiff = day - syncdaymd.substr(2, 2);
        let hourdiff = hour - syncdayhm.substr(0, 2);
        if (daydiff > 1) {
          return daydiff + "일 전";
        } else if (daydiff === 1) {
          return hourdiff >= 0 ? "1일 전" : 24 + hourdiff + "시간 전";
        } else {
          let mindiff = minute - syncdayhm.substr(2, 2);
          if (hourdiff > 1) {
            return hourdiff + "시간 전";
          } else if (hourdiff === 1) {
            return mindiff >= 0 ? "1시간 전" : 60 + mindiff + "분 전";
          } else {
            if (mindiff > 1) {
              return mindiff + "분 전";
            } else if (mindiff === 1) {
              let secdiff = second - recentSync.substr(12, 2)
              return secdiff >= 0 ? "1분 전" : "몇초 전";
            } else {
              return "몇초 전";
            }
          }
        }
      }
    } else if (recent === 1) {
      return monthAge >= 0 ? "1년 전" : monthAge + 12 + "개월 전";
    }
    return recent + "년 전";
  };
  const onClickEvent = async (event, val) => {
    let isVal = calcTime(val);
    if (isVal === "몇초 전" || isVal === "1분 전") {
      alert("최근에 갱신되었어요! 잠시 후 다시 시도해주세요.");
    } else {
      setIsLoading(true);
      await axios({
        method: "GET",
        headers: store.headers,
        url: store.url + "/logdata/new/" + store.u_Last
      }).then(async res => {
        if (res.data.validation) {
          await dataFetch(store.url + "/logdata/" + store.u_Last, "maintable");
        } else {
          alert(res.data.message);
        }
      });
      setIsLoading(false);
    }
  };
  React.useMemo(() => {
    if (
      store.u_Last !== undefined &&
      store.u_Last !== "" &&
      input.data !== undefined
    ) {
      dataFetch(store.url + "/logdata/" + store.u_Last, "maintable");
    }
  }, [store.u_Last]);
  return (
    <div className={classes.page}>
      <Grid container alignItems="center">
        <Grid item xs={5}></Grid>
        <Grid item xs={2}>
          <div className={classes.page}>
            <Typography>사료통</Typography>
          </div>
        </Grid>
        <Grid item xs={5}>
          {isLoading ? (
            <>
              <Box height="34px">
                <div style={{ padding: "5px" }}>
                  <PacmanLoader
                    color="gray"
                    size="15px"
                    css={css`
                      /* margin-top: 20px; */
                    `}
                  />
                </div>
              </Box>
            </>
          ) : (
            <>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={e =>
                    onClickEvent(e, input.data ? input.data.l_Time2 : 0)
                  }
                  style={{ padding: "5px" }}
                >
                  <SyncIcon />
                </IconButton>
                <div style={{ display: underSm ? "" : "none" }}>
                  <Tooltip
                    title={
                      <Typography>
                        {input.data ? input.data.l_Time2 : ""}
                      </Typography>
                    }
                    interactive
                  >
                    <Typography style={{ fontSize: "12px" }} component="span">
                      {input.data ? calcTime(input.data.l_Time2) : ""} 갱신
                    </Typography>
                  </Tooltip>
                </div>
              </Box>
              <div
                style={{ position: "absolute", display: underSm ? "none" : "" }}
              >
                <Tooltip
                  title={
                    <Typography>
                      {input.data ? input.data.l_Time2 : ""}
                    </Typography>
                  }
                  interactive
                >
                  <Typography variant="caption">
                    최근 업데이트 :{" "}
                    {input.data ? calcTime(input.data.l_Time2) : ""}
                  </Typography>
                </Tooltip>
              </div>
            </>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={1} sm={3} md={4}></Grid>
        <Grid item xs={10} sm={6} md={4}>
          <Doughnut
            data={{
              labels: ["Remain", "Empty"],
              datasets: [
                {
                  data: input.data
                    ? [input.data.l_Empty, 100 - input.data.l_Empty]
                    : [0, 0],
                  backgroundColor: [
                    input.data
                      ? input.data.l_Empty >= 75
                        ? "rgba(67, 176, 42, 0.2)"
                        : input.data.l_Empty >= 50
                        ? "rgba(54, 90, 189, 0.2)"
                        : input.data.l_Empty >= 25
                        ? "rgba(255, 215, 0, 0.2)"
                        : "rgba(249, 56, 34, 0.2)"
                      : "rgba(249, 56, 34, 0.2)",
                    "rgba(170, 172, 176, 0.2)"
                  ],
                  borderColor: [
                    input.data
                      ? input.data.l_Empty >= 75
                        ? "rgba(67, 176, 42, 1)"
                        : input.data.l_Empty >= 50
                        ? "rgba(54, 90, 189, 1)"
                        : input.data.l_Empty >= 25
                        ? "rgba(255, 215, 0, 1)"
                        : "rgba(249, 56, 34, 1)"
                      : "rgba(249, 56, 34, 0.2)",
                    "rgba(170, 172, 176, 1)"
                  ],
                  borderWidth: 1
                }
              ],
              text: input.data ? input.data.l_Empty + "%" : 0,
              color: input.data
                ? input.data.l_Empty >= 75
                  ? "rgba(67, 176, 42, 1)"
                  : input.data.l_Empty >= 50
                  ? "rgba(54, 90, 189, 1)"
                  : input.data.l_Empty >= 25
                  ? "rgba(255, 215, 0, 1)"
                  : "rgba(249, 56, 34, 1)"
                : "rgba(249, 56, 34, 0.2)"
            }}
            options={{
              legend: {
                display: false
              },
              tooltips: {
                enabled: false
              }
            }}
          />
        </Grid>
        <Grid item xs={1} sm={3} md={4}></Grid>
      </Grid>
      <div className={classes.page}>
        <div className={classes.feedBowlText}>
          <Typography>밥그릇</Typography>
        </div>
        <Box
          width="100%"
          maxWidth="500px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className={classes.feedBowl}>
            <Typography variant="h5">
              {input.data ? input.data.l_Remain : ""}g
            </Typography>
          </div>
          <SvgIcon
            viewBox="0 0 200.25 200.25"
            className={classes.feedBowlImg}
            color="primary"
          >
            <path
              d="M197.193,113.321c-2.431-6.069-7.471-18.658-17.388-44.284c-0.188-0.648-0.474-1.274-0.845-1.865
	            c-5.714-10.285-32.107-20.859-78.836-20.859c-47.76,0-74.276,11.046-79.183,21.54c-0.093,0.187-0.181,0.375-0.257,0.566
              c-0.007,0.019-0.017,0.037-0.024,0.055C10.6,94.484,5.505,107.207,3.057,113.321C0.173,120.525,0,120.956,0,123.281
              c0,10.395,10.732,18.131,32.811,23.65c18.072,4.518,41.978,7.006,67.314,7.006s49.242-2.488,67.314-7.006
              c22.078-5.519,32.811-13.255,32.811-23.65C200.25,120.956,200.077,120.525,197.193,113.321z M159.091,70.309
              c-10.01,4.596-28.991,10.74-58.966,10.74c-29.978,0-48.956-6.145-58.965-10.74c8.954-4.016,27.149-8.996,58.965-8.996
              C131.941,61.313,150.137,66.293,159.091,70.309z M160.414,133.183c-16.497,3.711-37.908,5.755-60.289,5.755
              s-43.792-2.044-60.289-5.755c-18.305-4.118-23.392-8.546-24.587-9.926c0.374-0.964,0.972-2.458,1.733-4.359
              c2.18-5.444,6.451-16.114,14.425-36.642c10.969,5.66,32.946,13.794,68.718,13.794c35.773,0,57.749-8.135,68.717-13.794
              c7.974,20.528,12.246,31.198,14.426,36.642c0.762,1.902,1.359,3.396,1.733,4.359C183.807,124.637,178.719,129.065,160.414,133.183z"
            />
          </SvgIcon>
        </Box>
      </div>
    </div>
  );
};

export default FeedRemain;
