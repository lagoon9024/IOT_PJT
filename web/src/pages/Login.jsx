import React, { useState, useEffect } from "react";
import {
  makeStyles,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box
} from "@material-ui/core";
import {
  useFetchData,
  useStore
} from "../components/custom-hooks/custom-hooks";
import CatIcon from "../assets/icons/caticon.png";
import DogIcon from "../assets/icons/dogicon.png";
import { useCookies } from "react-cookie";

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(1, 0, 1)
  },
  page: {
    marginTop: theme.spacing(15),
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
  border: {
    borderColor: "#00b08b",
    //border :"1px 1px 1px 1px"
    backgroundColor: "#00b08b"
  },
  icon: {
    width: "40px",
    height: "40px"
  }
}));

const Login = props => {
  const classes = useStyles();
  const { input, updateField, onSubmit, setInput } = useFetchData("", "");
  const [remember, setRemember] = useState(
    localStorage.getItem("item") ? true : false
  );
  const { store, onChangeStore } = useStore();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  useEffect(() => {
    setInput({});
    if (localStorage.getItem("u_id")) {
      setInput({ u_Id: localStorage.getItem("u_id") });
    }
  }, [setInput]);
  const onLoginClick = async event => {
    let result = await onSubmit(store.url + "/user/login");
    setInput({ ...input, u_Pw: "" });
    if (result.validation) {
      onChangeStore(
        { ...result.data, headers: { authorization: result.data.Token } },
        "",
        ""
      );
      setCookie("Token", result.data.Token);
      if (remember) {
        localStorage.setItem("u_id", input.u_Id);
      } else {
        localStorage.removeItem("u_id");
      }
      props.history.replace("/main");
    } else {
      alert("로그인에 실패했습니다.");
    }
  };
  return (
    <div className={classes.page}>
      <Box display="flex" alignItems="center">
        <img src={DogIcon} alt="dogicon" className={classes.icon} />
        <h2>로그인</h2>
        <img src={CatIcon} alt="caticon" className={classes.icon} />
      </Box>

      <div className={classes.inputText}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="u_Id"
          label="아이디"
          name="u_Id"
          autoFocus
          value={input.u_Id ? input.u_Id : ""}
          onChange={updateField}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="u_Pw"
          label="비밀번호 "
          type="password"
          id="u_Pw"
          autoComplete="current-password"
          value={input.u_Pw ? input.u_Pw : ""}
          onChange={updateField}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              onLoginClick();
            }
          }}
          // InputLabelProps={{
          //   classes: {
          //     //focused: classes.border,
          //     root: {
          //       colorSecondary : classes.border
          //     },
          //   },
          //   color : classes.border,

          // }}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="remember"
              color="primary"
              onChange={(e, c) => setRemember(c)}
              checked={remember ? remember : false}
            />
          }
          label="아이디 저장"
          className={classes.label}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onLoginClick}
        >
          <strong>로 그 인</strong>
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={e => props.history.push("/join")}
        >
          <strong>회원가입</strong>
        </Button>
      </div>
    </div>
  );
};

export default Login;
