import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Popover,
  Icon
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2)
  }
}));

const FeedAnalysis = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { store } = useStore();
  const { input, dataFetch, isLoading } = useFetchData(
    "/feed/analysis/" + store.u_Last + "/" + props.f_No,
    "feedinfo"
  );
  useEffect(() => {
    dataFetch(
      store.url + "/feed/analysis/" + store.u_Last + "/" + props.f_No,
      "feedinfo"
    );
  }, [store]);
  return (
    <>
      <Box width="99%" maxWidth="500px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            영양 성분 분석
          </Typography>
          <IconButton
            color="action"
            aria-describedby={id}
            onClick={handleClick}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <Box width="100%" maxWidth="400px">
            <Box display="flex" alignItems="center" p={"10px 10px 0 10px"}>
              <HelpOutlineIcon color="action" fontSize="small" />
              <Typography className={classes.Typography} variant="subtitle2">
                어떤 기준인가요?
              </Typography>
            </Box>
            <Typography className={classes.typography} variant="body2">
              미국사료협회(AAFCO)에서 제시하는 강아지와 고양이 사료의 영양 성분
              기준에 따른 분석 결과입니다. 해당 수치는 DM(Dry Matter, 수분이
              0%인 건물) 기준입니다.
            </Typography>
          </Box>
        </Popover>
        <Divider />
        <Grid container spacing={0} alignItems="center" justify="center">
          {isLoading ? (
            <div></div>
          ) : input ? (
            <>
              {/* {console.log(input)} */}
              <Grid item xs={4}>
                <Typography variant="body2">조단백</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">{input.f_Protein}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  color={
                    input.re_Protein === "적당"
                      ? "success.main"
                      : input.re_Protein === "과다"
                      ? "secondary.main"
                      : "warning.main"
                  }
                >
                  <Typography variant="overline">{input.re_Protein}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">조지방</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">{input.f_Fat}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  color={
                    input.re_Fat === "적당"
                      ? "success.main"
                      : input.re_Fat === "과다"
                      ? "secondary.main"
                      : "warning.main"
                  }
                >
                  <Typography variant="overline">{input.re_Fat}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">칼슘</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">{input.f_Calcium}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  color={
                    input.re_Calcium === "적당"
                      ? "success.main"
                      : input.re_Calcium === "과다"
                      ? "secondary.main"
                      : "warning.main"
                  }
                >
                  <Typography variant="overline">{input.re_Calcium}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">인</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">
                  {input.f_Phosphorus}%
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  color={
                    input.re_Phosphorus === "적당"
                      ? "success.main"
                      : input.re_Phosphorus === "과다"
                      ? "secondary.main"
                      : "warning.main"
                  }
                >
                  <Typography variant="overline">
                    {input.re_Phosphorus}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">조회분</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">{input.f_Ash}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  color={
                    input.re_Ash === "적당"
                      ? "success.main"
                      : input.re_Ash === "과다"
                      ? "secondary.main"
                      : "warning.main"
                  }
                >
                  <Typography variant="overline">{input.re_Ash}</Typography>
                </Box>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default FeedAnalysis;
