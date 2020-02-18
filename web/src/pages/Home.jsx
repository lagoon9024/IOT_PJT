import React from "react";
import CatIcon from "../assets/icons/caticon.png";
import DogIcon from "../assets/icons/dogicon.png";
import FeedIcon from "../assets/icons/feedicon.png";
import { Button, makeStyles, Box, Typography } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  home: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30vh"
  },
  icon: {
    width: "125px",
    height: "125px"
  },
  smallIcon: {
    width: "50px",
    height: "50px",
    paddingBottom: "10px"
  }
}));
const Home = props => {
  const classes = useStyle();

  return (
    <div className={classes.home}>
      <Box display="flex" alignItems="flex-end">
        <img src={DogIcon} alt="dogicon" className={classes.icon} />
        <img src={FeedIcon} alt="feedicon" className={classes.smallIcon} />
        <img src={CatIcon} alt="caticon" className={classes.icon} />
      </Box>
      <Typography variant="h5" gutterBottom>
        밥 멍 냥
      </Typography>
      <Typography variant="body1">반려동물 스마트 자동급식기</Typography>
      <Button color="primary" onClick={e => props.history.replace("/login")}>
        시작하기
      </Button>
    </div>
  );
};

export default Home;
