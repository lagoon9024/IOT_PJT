import React, { useEffect } from "react";
import {
  useFetchData,
  useStore
} from "../components/custom-hooks/custom-hooks";
import {
  makeStyles,
  TextField,
  FormControlLabel,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@material-ui/core";

import CatIcon from "../assets/icons/caticon.png";
import DogIcon from "../assets/icons/dogicon.png";
import CatDisable from "../assets/icons/catDisable.png";
import DogDisable from "../assets/icons/dogDisable.png";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

import clsx from "clsx";
import axios from "axios";
import { useCookies } from "react-cookie";
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
  halfInput: {
    width: "43vw",
    maxWidth: "240px"
  },
  icons: {
    width: "100px",
    height: "100px"
  },
  radioButtons: {
    display: "flex",
    justifyContent: "space-around"
  }
}));
const CatRadio = props => {
  const classes = useStyles();
  return (
    <Radio
      checkedIcon={
        <img src={CatIcon} alt="cat-check" className={classes.icons} />
      }
      icon={
        <img src={CatDisable} alt="cat-uncheck" className={classes.icons} />
      }
      {...props}
    />
  );
};
const DogRadio = props => {
  const classes = useStyles();
  return (
    <Radio
      checkedIcon={
        <img src={DogIcon} alt="dog-check" className={classes.icons} />
      }
      icon={
        <img src={DogDisable} alt="dog-uncheck" className={classes.icons} />
      }
      {...props}
    />
  );
};
const CheckRadio = props => {
  const classes = useStyles();
  return (
    <Radio
      checkedIcon={<CheckBoxIcon />}
      icon={<CheckBoxOutlineBlankIcon />}
      {...props}
    />
  );
};

const DeviceModify = props => {
  const classes = useStyles();
  const { store, onChangeStore } = useStore();
  const [cookies, setCookie, removeCookie] = useCookies(["d_CurNo"]);
  const { input, isLoading, updateField, dataFetch } = useFetchData(
    "/device/get/",
    "device"
  );
  useEffect(() => {
    if (store.url !== "") {
      dataFetch(store.url + "/device/get/" + cookies.d_CurNo, "device");
    }
  }, [store.url]);
  const [open, setOpen] = React.useState(false);
  const onSubmit = async e => {
    await axios
      .put(store.url + "/device", input, {
        headers: store.headers
      })
      .then(res => {
        if (res.data.validation) {
          alert(res.data.message);
          props.history.replace("/device");
        } else {
          alert(res.data.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onDelete = async e => {
    const result = await axios.delete(store.url + "/device/" + input.d_No, {
      headers: store.headers
    });
    if (result.data.validation) {
      alert("삭제했습니다.");
      onChangeStore({ ...store, u_Last: result.data.data.u_Last });
      props.history.replace("/device");
    } else {
      alert("삭제에 실패했습니다.");
    }
    setOpen(false);
  };
  return (
    <>
      <div className={classes.page}>
        <div className={classes.inputText}>
          <FormControl
            component="fieldset"
            fullWidth
            className={classes.inputText}
          >
            <FormLabel component="legend" required>
              종을 선택해주세요
            </FormLabel>
            <RadioGroup
              aria-label="species"
              name="d_Species"
              value={isLoading ? "" : input.d_Species ? input.d_Species : ""}
              onChange={updateField}
              row
              className={classes.radioButtons}
            >
              <FormControlLabel
                value="강아지"
                control={<DogRadio />}
                label="강아지"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="고양이"
                control={<CatRadio />}
                label="고양이"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="d_Name"
            label="이름"
            name="d_Name"
            autoFocus
            onChange={updateField}
            value={isLoading ? "" : input.d_Name ? input.d_Name : ""}
          />
          <FormControl
            component="fieldset"
            fullWidth
            className={classes.inputText}
          >
            <FormLabel component="legend" required>
              생애상태를 알려주세요
            </FormLabel>
            <RadioGroup
              aria-label="lifeState"
              name="d_Age"
              value={isLoading ? "" : input.d_Age ? input.d_Age : ""}
              onChange={updateField}
              row
              className={classes.radioButtons}
            >
              <FormControlLabel
                value="유아기"
                control={<CheckRadio />}
                label="유아기"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="성장기"
                control={<CheckRadio />}
                label="성장기"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="중년기"
                control={<CheckRadio />}
                label="중년기"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="노년기"
                control={<CheckRadio />}
                label="노년기"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
          <Box display="flex" justifyContent="space-between">
            <TextField
              variant="outlined"
              margin="normal"
              className={classes.halfInput}
              type="number"
              inputProps={{
                step: 0.1,
                min: 0,
                max: 100
              }}
              required
              id="d_Weight"
              label="몸무게 (kg)"
              name="d_Weight"
              value={isLoading ? "" : input.d_Weight ? input.d_Weight : ""}
              onChange={updateField}
            />
            <TextField
              variant="outlined"
              margin="normal"
              className={classes.halfInput}
              type="date"
              id="d_Bday"
              label="생일 (선택)"
              inputProps={{
                min: "1900-01-01",
                max: "2100-12-31"
              }}
              name="d_Bday"
              value={isLoading ? "" : input.d_Bday ? input.d_Bday : ""}
              onChange={updateField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Box>
          <TextField
            variant="outlined"
            margin="normal"
            required
            disabled
            fullWidth
            id="SerialNo"
            label="일련번호 S/N"
            name="SerialNo"
            value={isLoading ? "" : input.SerialNo ? input.SerialNo : ""}
            onChange={updateField}
          />
          <Box display="flex" justifyContent="space-between">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={clsx(classes.submit, classes.halfInput)}
              onClick={onSubmit}
            >
              수정하기
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={clsx(classes.submit, classes.halfInput)}
              onClick={handleClickOpen}
            >
              삭제하기
            </Button>
          </Box>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"정말로 삭제하시겠어요?"}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            삭제 후 데이터 복구는 불가능합니다!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDelete} color="secondary">
            확인
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceModify;
