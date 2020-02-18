import React from "react";
import { makeStyles, TextField, Button } from "@material-ui/core";
import {
  useStore,
  useFetchData
} from "../components/custom-hooks/custom-hooks";
import { useEffect } from "react";
import {
  u_IdCheck,
  u_EmailCheck,
  u_NameCheck,
  u_PwCheck
} from "../modules/regCheck";

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    lineHeight: "2.5rem",
    fontSize: 16
  },
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  inputText: {
    width: "90vw",
    maxWidth: "500px",
    marginTop: theme.spacing(1)
  },
  helperText: {
    color: "red"
  }
}));

const Join = props => {
  const classes = useStyles();
  const { input, updateField, onSubmit, onValidate, setInput } = useFetchData(
    "",
    ""
  );
  const { store } = useStore();

  const onClickEvent = async event => {
    if (
      u_IdCheck(input.u_Id) &&
      u_PwCheck(input.u_Pw) &&
      u_NameCheck(input.u_Name) &&
      u_EmailCheck(input.u_Email) &&
      input.idValidated &&
      (input.pwValidated === undefined || input.pwValidated)
    ) {
      let result = await onSubmit(store.url + "/user");
      if (result.validation === true) {
        alert("환영합니다. " + input.u_Name + "님");
        props.history.replace("/login");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } else {
      alert("올바른 입력을 해주세요");
    }
  };
  const onBlurEvent = async event => {
    if (event.target.value === undefined || event.target.value === "") {
      setInput({ ...input, idValidated: true });
    } else {
      const result = await onValidate(
        store.url + "/user/idCheck/" + event.target.value
      );
      setInput({ ...input, idValidated: result.validation });
    }
  };
  useEffect(() => {}, [updateField]);

  return (
    <div className={classes.page}>
      <h2>회원가입</h2>

      <div className={classes.inputText}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="u_Id"
          label="아이디"
          id="u_Id"
          error={
            // input.u_Id가 비었으면 error false
            // idvalidate false 면 error true
            //u_Idcheck가 false 면 error true
            !(input.u_Id === undefined || input.u_Id === "") &&
            ((input.idValidated !== undefined && !input.idValidated) ||
              (input.u_Id !== undefined && !u_IdCheck(input.u_Id)))
          }
          onChange={updateField}
          onBlur={onBlurEvent}
          value={input.u_Id}
          helperText={
            input.idValidated === undefined || input.idValidated
              ? !(input.u_Id === "" || input.u_Id === undefined) &&
                !u_IdCheck(input.u_Id)
                ? "ID는 첫째자리는 영문소문자로 시작하고 영문소문자와 숫자를 사용할 수 있으며, 3자리 이상 15자리 이하의 길이여야 합니다"
                : ""
              : "이미 존재하는 아이디입니다."
          }
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
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="u_Name"
          label="이름"
          name="u_Name"
          onChange={updateField}
          value={input.u_Name}
          error={
            !(input.u_Name === undefined || input.u_Name === "") &&
            !u_NameCheck(input.u_Name)
          }
          helperText={
            !(input.u_Name === undefined || input.u_Name === "") &&
            !u_NameCheck(input.u_Name)
              ? "이름은 한글 2자리 이상 4자리 이하 또는 영문자 2자리 이상 15자리 이하의 길이여야 합니다"
              : ""
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="u_Email"
          label="이메일"
          name="u_Email"
          autoComplete="email"
          onChange={updateField}
          value={input.u_Email}
          error={
            !(input.u_Email === undefined || input.u_Email === "") &&
            !u_EmailCheck(input.u_Email)
          }
          helperText={
            !(input.u_Email === undefined || input.u_Email === "") &&
            !u_EmailCheck(input.u_Email)
              ? "올바른 이메일 형식에 맞게 입력해주세요"
              : ""
          }
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onClickEvent}
        >
          가입하기
        </Button>
      </div>
    </div>
  );
};

export default Join;
