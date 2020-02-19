import React from "react";
import { makeStyles, TextField, Button, Box } from "@material-ui/core";
import {
  useFetchData,
  useStore
} from "../components/custom-hooks/custom-hooks";
import CheckPw from "../components/info/CheckPw";

const useStyles = makeStyles(theme => ({
  page: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  inputText: {
    width: "90vw",
    maxWidth: "500px",
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(2),
    width: "43vw",
    maxWidth: "240px",
    lineHeight: "2.5rem",
    fontSize: 16
  }
}));
const Info = props => {
  const classes = useStyles();
  const { input, isLoading, dataFetch } = useFetchData("/user/", "user");
  const { store } = useStore();
  React.useMemo(async() => {
      if(input.u_Id ===undefined && store.u_No !== ""){
        await dataFetch(store.url + "/user/" + store.u_No, "user");
      }
  }, [store.u_No]);
  return (
    <div className={classes.page}>
      <h2>내 정보</h2>
      <div className={classes.inputText}>
        <TextField
          id="outlined-read-only-input"
          label="아이디"
          value={isLoading ? "" : input.u_Id ? input.u_Id : ""}
          InputProps={{
            readOnly: true
          }}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="outlined-read-only-input"
          label="이름"
          value={isLoading ? "" : input.u_Name ? input.u_Name : ""}
          InputProps={{
            readOnly: true
          }}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="outlined-read-only-input"
          label="이메일"
          value={isLoading ? "" : input.u_Email ? input.u_Email : ""}
          InputProps={{
            readOnly: true
          }}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <Box display="flex" justifyContent="space-between">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => props.history.push("/infomodify")}
          >
            회원정보수정
          </Button>
          <CheckPw
            classes={classes}
            history={props.history}
            u_Id={input.u_Id}
          ></CheckPw>
        </Box>
      </div>
    </div>
  );
};
export default Info;
