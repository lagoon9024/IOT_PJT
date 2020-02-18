import React from "react";
import {
  makeStyles,
  TextField,
  Button,
} from "@material-ui/core";
import {
  useStore,
  useFetchData
} from "../components/custom-hooks/custom-hooks";
import {
  u_PwCheck
} from "../modules/regCheck";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  page: {
    marginTop: theme.spacing(6),
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
    width: "90vw",
    maxWidth: "500px",
    lineHeight: "2.5rem",
    fontSize: 16
  },
  helperText: {
    color: "red"
  }
}));

const PwModify = props => {
  const classes = useStyles();
  const { input, updateField, onSubmit } = useFetchData(
    "",
    ""
  );
  const { store } = useStore();

  const onClickEvent = async event => {
    if (
      u_PwCheck(input.u_Pw) &&
      input.pwValidated
    ) {
      let result = await axios.put(store.url + "/user/pass", {...input,u_No : store.u_No}, {
        headers: store.headers
      });
      if (result.data.validation) {
        alert("비밀번호가 수정되었습니다.");
        props.history.replace("/info");
      } else {
        alert(result.data.message);
      }
    } else {
      alert("올바른 입력을 해주세요");
    }
  };
  
  

  return (
    <div className={classes.page}>
      <h2>비밀번호 수정</h2>

      <div className={classes.inputText}>
        
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
          onChange={updateField}
          value={input.u_Pw}
          error={
            !(input.u_Pw === undefined || input.u_Pw === "") &&
            !u_PwCheck(input.u_Pw)
          }
          helperText={
            !(input.u_Pw === undefined || input.u_Pw === "") &&
            !u_PwCheck(input.u_Pw)
              ? "패스워드는 첫째자리는 영문자로 시작하고 영문자, 숫자, 특수문자를 포함해야 하며, 3자리 이상 15자리 이하의 길이여야 합니다"
              : ""
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="pwcon"
          label="비밀번호 확인"
          type="password"
          id="pwcon"
          autoComplete="current-password"
          error={input.pwValidated !== undefined && !input.pwValidated}
          onChange={updateField}
          value={input.pwcon}
          helperText={
            input.pwValidated === undefined || input.pwValidated
              ? ""
              : "일치하지 않습니다"
          }
          onKeyDown={e=>{
            if(e.keyCode===13){
              onClickEvent(e)
            }
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onClickEvent}
        >
          변경하기
        </Button>
      </div>
    </div>
  );
};

export default PwModify;
