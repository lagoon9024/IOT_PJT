import React, { useState,useEffect } from "react";
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
  
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import EditIcon from "@material-ui/icons/Edit";
import { useStore } from "../custom-hooks/custom-hooks";
import axios from "axios";

const ModifyFeedReview = props => {
  const [input, setInput] = useState(props.init);
  const [open, setOpen] = useState(false);
  const { store, onChangeStore } = useStore();
  
  const handleClickOpen = () => {
    setInput(props.init)
    setOpen(true);
  };
  useEffect(()=>{
    if(store.render === undefined || store.render){
      onChangeStore({render : false});
    }
  },[])
  const handleClose = async event => {
    if (event.currentTarget.name !== "add") {
      setInput({});
      setOpen(false);
    } else {
      if (input.r_Positive === "" || input.r_Negative === "") {
        alert("정확한 리뷰를 위해 장, 단점 모두 작성해주시기 바랍니다");
      } else {
        if (input.r_Rank > 0) {
          await axios({
            method: "PUT",
            url: store.url + "/review",
            data: input,
            headers: store.headers
          })
            .then(res => {
              if (res.data.validation) {
                alert(res.data.message);
                setInput({});
                setOpen(false);
                onChangeStore({ render: true });
              } else {
                alert(res.data.message);
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          alert("최저 평점은 0.5점, 최고 평점은 5.0점 입니다.");
        }
      }
    }
  };
  return (
    <>
      <EditIcon fontSize="small" onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">리뷰 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>
            솔직한 리뷰가 반려동물 삶의 질을 결정합니다!
          </DialogContentText>
          <Box width="100%" maxWidth="500px">
            <Rating
              id="simple-controlled"
              name="r_Rank"
              value={input ? input.r_Rank : 0}
              onChange={(event, newValue) => {
                setInput({ ...input, r_Rank: newValue });
              }}
              precision={0.5}
            />
            <Box display="flex" width="100%" alignItems="center">
              <Box width="15%" minWidth="45px">
                <Typography color="primary">장점 : </Typography>
              </Box>
              <Box width="85%">
                <TextField
                  fullWidth
                  variant="standard"
                  name="r_Positive"
                  value={input ? input.r_Positive : ""}
                  onChange={event => {
                    setInput({ ...input, r_Positive: event.target.value });
                  }}
                  InputProps={{
                    style: {
                      textAlignLast: "center"
                    }
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" width="100%" alignItems="center">
              <Box width="15%" minWidth="45px">
                <Typography color="secondary">단점 : </Typography>
              </Box>
              <Box width="85%">
                <TextField
                  fullWidth
                  variant="standard"
                  name="r_Negative"
                  value={input ? input.r_Negative : ""}
                  onChange={event => {
                    setInput({ ...input, r_Negative: event.target.value });
                  }}
                  InputProps={{
                    style: {
                      textAlignLast: "center"
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button name="close" onClick={handleClose} color="primary">
            취소
          </Button>
          <Button name="add" onClick={handleClose} color="primary">
            수정
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ModifyFeedReview;
