import React from "react";
import { Rating, Skeleton } from "@material-ui/lab";
import {
  makeStyles,
  Box,
  CardMedia,
  withStyles,
  Typography,
  Grid
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import DogBlack from "../../assets/icons/dogBlack.png";
import CatBlack from "../../assets/icons/catBlack.png";

const StyledRating = withStyles({
  sizeSmall: {
    fontSize: "1.2rem"
  }
})(Rating);

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  media: {
    width: 150,
    height: 170,
    borderRadius: "20px"
  },
  score: {
    height: "100%",
    width: 130,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
  key: {
    fontWeight: "bold",
    color: "#00b08b",
    fontSize: "9px"
  },
  value: {
    fontSize: "13px"
  },
  grid: {
    marginTop: "10px",
    padding: "2px"
  },
  targetImg: {
    width: "50px",
    height: "50px"
  }
}));
const FeedBasic = props => {
  // const f_Image =
  const classes = useStyles();
  const { input, isLoading, dataFetch } = useFetchData(
    "/feed/basic/" + props.f_No,
    "feedinfo"
  );
  const { store } = useStore();
  useEffect(() => {
    if(store.url !== ""){
      dataFetch(store.url + "/feed/basic/" + props.f_No, "feedinfo");
    }
  }, [store.url]);

  return (
    <div className={classes.page}>
      {isLoading ? (
        <>
          <Skeleton animation="wave" variant="rect" className={classes.media} />
          <Box display="flex" flexDirection="column" alignItems="center">
            <Skeleton width="50px" />
            <Skeleton width="150px" />
          </Box>
        </>
      ) : (
        <>
          <Grid container alignItems="baseline">
            <Grid item xs={3}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="baseline"
              >
                <Typography variant="subtitle2">For. </Typography>
                <img
                  src={input.f_Species === "고양이" ? CatBlack : DogBlack}
                  alt="feedTarget"
                  className={classes.targetImg}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="center">
                <CardMedia
                  className={classes.media}
                  image={`/images/${props.f_No}.jpg`}
                  title="Feed Image"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <></>
            </Grid>
          </Grid>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption">{input.f_Manufacturer}</Typography>
            <Typography variant="subtitle2" display="block">
              <strong>{input.f_Name}</strong>
            </Typography>
          </Box>
          <Box className={classes.score}>
            <StyledRating
              name="feed-score"
              value={input.f_Rank}
              size="small"
              precision={0.5}
              readOnly
            />
            <Typography variant="subtitle2" component="span">
              {input.f_Rank}
            </Typography>
            <Typography variant="caption" component="span">
              ({input.f_Count})
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
};

export default FeedBasic;
