import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  page: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

const DirectFeedButton = props => {
  const classes = useStyles();
  const onClickEvent = async event => {
    const result = await axios.post("http://70.12.247.120:3000/motor", {
      motor: "on",
      rotat: 5
    });
    alert("돌렷당");
  };
  return (
    <div className={classes.page}>
      <Button onClick={onClickEvent}>먹이주기</Button>
    </div>
  );
};

export default DirectFeedButton;
