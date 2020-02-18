import React from "react"
import { Button, Dialog, DialogActions, Input, DialogTitle, DialogContent, DialogContentText, TextField } from "@material-ui/core";
import axios from "axios";
import { useStore, useFetchData } from "../custom-hooks/custom-hooks";
import { useMemo } from "react";

const CheckPw = props => {
  const {input, setInput, updateField} = useFetchData("","");
  const [open, setOpen] = React.useState(false);
  const {store} = useStore();
  
  useMemo(() => setInput({u_Pw: ""}), [open])
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = async (event) => {
    if(event.currentTarget.name ==="confirm" || event.keyCode===13){
    await axios
      .post(
        store.url + "/user/login",
        { u_Id: props.u_Id, u_Pw: input.u_Pw },
        { headers: store.headers }
      )
      .then(res => {
        if (res.data.validation) {
          alert("확인되었습니다.");
          setOpen(false);
          props.history.push("/pwmodify");
        } else {
          alert("올바르지 않은 비밀번호입니다.");
        }
      })
      .catch(error => {
        console.error(error);
      });
    }else{
      setOpen(false);
    }
  };
  return (
    <>
    <Button
      fullWidth
      variant="contained"
      color="primary"
      className={props.classes.submit}
      onClick={handleClickOpen}
    >
      비밀번호수정
    </Button>
    <Dialog
      open = {open}
      onClose={handleClose}
      aria-labelledby = "form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">비밀번호확인</DialogTitle>
      <DialogContent>
        <DialogContentText >
          현재 비밀번호를 입력해주세요!
        </DialogContentText>
        <TextField 
          variant="outlined"
          name = "u_Pw"
          onChange={updateField}
          label = "비밀번호"
          value = {input.u_Pw? input.u_Pw : ""}
          fullWidth
          margin="normal"
          type="password"
          onKeyDown={e=>{
            if(e.keyCode===13){
              handleClose(e)
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button name="close" onClick={handleClose} color = "secondary">취소</Button>
        <Button name="confirm" onClick={handleClose} color = "primary">확인</Button>
      </DialogActions>
    </Dialog>
    
    </>
  );
};
export default CheckPw;
