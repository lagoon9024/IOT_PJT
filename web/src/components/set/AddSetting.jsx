import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { hour, minute } from "./Time";
import { useEffect } from "react";
import { s_AmountCheck } from "../../modules/regCheck";

const AddSetting = props => {
  const { input, onSubmit, updateField, setInput } = useFetchData("", "");
  const [open, setOpen] = React.useState(false);
  const { store, onChangeStore } = useStore();
  useEffect(() => {
    setInput({
      ...input,
      d_No: store.u_Last,
      s_Time: "00:00",
      hour: "00",
      minute: "00",
      s_Amount:""
    });
  }, [open]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async event => {
    if (event.currentTarget.name !== "add") {
      setOpen(false);
    } else {
      if (s_AmountCheck(input.s_Amount)) {
        await onSubmit(store.url + "/setting")
          .then(res => {
            if (res.validation) {
              alert(res.message);
              onChangeStore({ render: true });
              setOpen(false);
            } else {
              alert(res.message);
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        alert("1~999사이의 값을 입력해주세요");
      }
    }
  };
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        추가
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">시간추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            배식 시간과 먹이량을 입력해주세요!
          </DialogContentText>
          <Box
            display="flex"
            alignItems="center"
            padding={2}
            width="100%"
            maxWidth="500px"
            justifyContent="flex-start"
          >
            <TextField
              id="hour-text"
              select
              variant="standard"
              name="hour"
              value={input.hour}
              onChange={updateField}
              SelectProps={{
                native: true
              }}
              inputProps={{
                style: {
                  padding: "6px 26px 7px 12px"
                }
              }}
              InputProps={{
                style: {
                  width: "58px"
                }
              }}
            >
              {hour.map((data,index) => (
                <option value={data} key = {index} >{data}</option>
              ))}
            </TextField>

            <Typography variant="body1">시</Typography>
            <TextField
              id="minute-text"
              select
              variant="standard"
              name="minute"
              value={input.minute}
              onChange={updateField}
              SelectProps={{
                native: true
              }}
              inputProps={{
                style: {
                  padding: "6px 26px 7px 12px"
                }
              }}
              InputProps={{
                style: {
                  width: "58px"
                  //textAlignLast : "center"
                }
              }}
            >
              {minute.map((data,index) => (
                <option value={data} key = {index}>{data}</option>
              ))}
            </TextField>
            <Typography variant="body1">분</Typography>

            <TextField
              variant="standard"
              name="s_Amount"
              value={input.s_Amount}
              onChange={event => {
                let value = event.target.value;
                if (isNaN(value)) {
                  value = 0;
                }
                if (Number(value) > 999) {
                  value = 999;
                }
                setInput({ ...input, s_Amount: Number(value) });
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                style: {
                  width: "65px",
                  textAlignLast: "center"
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button name="close" onClick={handleClose} color="primary">
            취소
          </Button>
          <Button name="add" onClick={handleClose} color="primary">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AddSetting;
