import React from "react";
import {
  makeStyles,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  withStyles,
  Grid
} from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import Slider from "react-slick";
import { useEffect } from "react";
import { useStore } from "../custom-hooks/custom-hooks";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeedSlide.css"
import { useHistory } from "react-router";
const StyledRating = withStyles({
  sizeSmall: {
    fontSize: "0.7rem"
  }
})(Rating);
const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  slider: {
    width: "100%",
    maxWidth: "500px"
  },
  media: {
    height: "70px",
    width: "50px",
    borderRadius: "10px"
  },
  score: {
    height: "100%",
    // width: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
})); // #00b08b

const FeedSlide = ({ input, isLoading, randNum }) => {
  const classes = useStyles();
  const history = useHistory();
  const settings = {
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: true
  };
  return (
    <>
      <Typography gutterBottom>이 사료들은 어떠세요?</Typography>
      <Slider {...settings}>
        {isLoading ? (
          [1, 2, 3].map(num => (
            <div key={`sk_${num}`}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Skeleton
                  animation="wave"
                  variant="rect"
                  className={classes.media}
                />
                <Skeleton width="100px" />
                <Skeleton width="100px" />
                <Skeleton width="100px" />
              </Box>
            </div>
          ))
        ) : input ? (
          randNum.map(num => (
            <div
              key={`feed_${num}`}
              onClick={() => history.push(`/feedinfo/${num}`)}
            >
              {input[num] ? (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <CardMedia
                      className={classes.media}
                      image={`/images/${input[num].f_No}.jpg`}
                      title="Feed Image"
                    />
                    <Grid item xs>
                      <Typography variant="body2" noWrap>
                        {input[num].f_Manufacturer}
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle2" noWrap>
                        <strong>{input[num].f_Name}</strong>
                      </Typography>
                    </Grid>
                  </Box>
                  <Box
                    className={classes.score}
                    display="flex"
                    justifyContent="center"
                  >
                    <StyledRating
                      name="input[num]-score"
                      value={input[num].f_Rank}
                      size="small"
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="subtitle2" component="span">
                      {input[num].f_Rank}
                    </Typography>
                    <Typography variant="caption" component="span">
                      ({input[num].f_Count})
                    </Typography>
                  </Box>
                </>
              ) : (
                "--"
              )}
            </div>
          ))
        ) : (
          <></>
        )}
      </Slider>
    </>
  );
};
export default FeedSlide;
