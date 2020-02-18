import React from "react";
import {
  Box,
  makeStyles,
  Typography,
  Avatar,
  Input
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SendIcon from '@material-ui/icons/Send';


const dummy = [
  {
    u_Name: "루루미미",

    c_Comment: "고양이는 야옹야옹한다.",
    c_Date: "2일 전"
  },
  {
    u_Name: "바나맘",

    c_Comment: "냥아치....",
    c_Date: "3시간 전"
  }
];

const useStyles = makeStyles(theme => ({
  icon: {
    width: "15px",
    height: "15px"
  },
  report: {
    fontSize: "12px"
  },
  weight: {
    fontWeight: "bold"
  },
  inputfield: {
    backgroundColor: ""
  },
  inputbutton: {
    color : "#74d1ea"
  }
}));
const FeedComments = ({ r_No }) => {
  const classes = useStyles();
  return (
    <Box
      paddingTop={1}
      borderTop={1}
      marginTop={1}
      marginBottom={2}
      width="100%"
      maxWidth="500px"
    >
      {dummy.map((data, i) => {
        return (
          <Box width="100%" maxWidth="500px">
            <Box display="flex" alignItems="center">
              <Avatar className={classes.icon}>
                <AccountCircle />
              </Avatar>
              <Typography variant="body2" className={classes.weight}>
                &nbsp;&nbsp;&nbsp;{data.u_Name}
              </Typography>
              <Box
                display={data.u_Name === "바나맘" ? "flex" : "none"}
                alignItems="center"
                marginLeft = "10px"
              >
                <EditIcon className={classes.icon} />
                <DeleteIcon className={classes.icon} />
              </Box>
            </Box>
            <Typography variant="body2">{data.c_Comment}</Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" color="textSecondary">
                {data.c_Date}
              </Typography>
              <Box
                m={1}
                display="flex"
                alignItems="center"
              >
                <Typography color="secondary" variant="caption">
                  신고
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Box display="flex" alignItems="center">
        <Input
          placeholder="댓글 입력"
          inputProps={{ "aria-label": "description" }}
          fullWidth
        />
        <SendIcon fontSize="small" color="primary"/>
      </Box>
    </Box>
  );
};

export default FeedComments;
