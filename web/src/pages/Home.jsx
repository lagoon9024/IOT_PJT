import React from "react";
import CatIcon from "../assets/icons/caticon.png";
import DogIcon from "../assets/icons/dogicon.png";
import FeedIcon from "../assets/icons/feedicon.png";
import LogoIcon from "../assets/icons/bmnLogo2.png";
import { Button, makeStyles, Box, Typography } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  home: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20vh"
  },
  icon: {
    width: "300px",
    height: "300px"
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
        <img src={LogoIcon} alt="dogicon" className={classes.icon} />
      </Box>
      <Typography variant="body1">반려동물 스마트 자동급식기</Typography>
      <Button color="primary" onClick={e => props.history.replace("/login")}>
        시작하기
      </Button>
    </div>
  );
};

export default Home;
