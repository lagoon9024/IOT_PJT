import React, { useEffect } from "react";
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
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useParams } from "react-router-dom";

const AddFeedReview = props => {
  const { input, onSubmit, updateField, setInput } = useFetchData("", "");
  const [open, setOpen] = React.useState(false);
  const { f_No } = useParams();
  const { store, onChangeStore } = useStore();
  useEffect(() => {
    setInput({
      ...input,
      f_No: Number(f_No),
      u_No: store.u_No,
      r_Rank: 0,
      r_Positive: "",
      r_Negative: ""
    });
  }, [open]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async event => {
    if (event.currentTarget.name !== "add") {
      setInput({});
      setOpen(false);
    } else {
      if (input.r_Positive === "" || input.r_Negative === "") {
        alert("정확한 리뷰를 위해 장, 단점 모두 작성해주시기 바랍니다");
      } else {
        if (input.r_Rank > 0) {
          await onSubmit(store.url + "/review")
            .then(res => {
              if (res.validation) {
                alert(res.message);
                setInput({});
                setOpen(false);
                onChangeStore({ render: true });
              } else {
                alert(res.message);
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
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        추가
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">리뷰 등록</DialogTitle>
        <DialogContent>
          <DialogContentText>
            솔직한 리뷰가 반려동물 삶의 질을 결정합니다!
          </DialogContentText>
          <Box width="100%" maxWidth="500px">
            <Rating
              id="simple-controlled"
              name="r_Rank"
              value={input.r_Rank ? input.r_Rank : 0}
              onChange={(event, newValue) => {
                setInput({ ...input, r_Rank: newValue });
              }}
              precision={0.5}
            />
            <Box
              display="flex"
              width="100%"
              maxWidth="500px"
              alignItems="center"
            >
              <Box width="15%" minWidth="45px">
                <Typography color="primary">장점 : </Typography>
              </Box>
              <Box width="85%">
                <TextField
                fullWidth
                  variant="standard"
                  name="r_Positive"
                  value={input.r_Positive}
                  onChange={updateField}
                  InputProps={{
                    style: {
                      textAlignLast: "center"
                    }
                  }}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              width="100%"
              maxWidth="500px"
              alignItems="center"
            >
              <Box width="15%" minWidth="45px">
                <Typography color="secondary">단점 : </Typography>
              </Box>
              <Box width="85%">
                <TextField
                fullWidth
                  variant="standard"
                  name="r_Negative"
                  value={input.r_Negative}
                  onChange={updateField}
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
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AddFeedReview;
