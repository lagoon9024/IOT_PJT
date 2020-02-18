import React, { useEffect } from "react";
import {
  makeStyles,
  TextField,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Box
} from "@material-ui/core";
import clsx from "clsx";
import {
  useStore,
  useFetchData
} from "../components/custom-hooks/custom-hooks";
import CatIcon from "../assets/icons/caticon.png";
import DogIcon from "../assets/icons/dogicon.png";
import CatDisable from "../assets/icons/catDisable.png";
import DogDisable from "../assets/icons/dogDisable.png";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

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
  return (
    <Radio
      checkedIcon={<CheckBoxIcon />}
      icon={<CheckBoxOutlineBlankIcon />}
      {...props}
    />
  );
};
const Regist = props => {
  const classes = useStyles();
  const { input, updateField, onSubmit, setInput, onValidate } = useFetchData(
    "",
    ""
  );
  const { store, onChangeStore } = useStore();
  let checked = false;
  useEffect(() => {
    setInput({ u_No: store.u_No, d_Bday: "" });
  }, [store]);
  const onClickEvent = async event => {
    if (checked) {
      let result = await onSubmit(store.url + "/device");
      if (result.validation) {
        onChangeStore({ ...store, u_Last: result.data.d_No });
        alert("기기등록에 성공했습니다.");
        props.history.goBack();
      } else {
        alert(result.message);
      }
    } else {
      alert("일련번호 확인이 필요합니다.");
    }
  };
  const onCheckEvent = async event => {
    if (input.SerialNo === undefined || input.SerialNo === "") {
      alert("일련번호를 입력해주세요!!");
    } else {
      const result = await onValidate(
        store.url + "/device/check/" + input.SerialNo
      );
      if (result.validation) {
        alert(result.message);
        checked = true;
      } else {
        alert(result.message);
      }
    }
  };
  return (
    <div className={classes.page}>
      <h3>반려동물에 대해 알려주세요</h3>
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
            value={input.d_Species ? input.d_Species : ""}
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
          value={input.d_Name ? input.d_Name : ""}
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
            value={input.d_Age ? input.d_Age : ""}
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
            value={input.d_Weight ? input.d_Weight : ""}
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
            value={input.d_Bday ? input.d_Bday : ""}
            onChange={updateField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Box>

        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <InputLabel htmlFor="outlined-adornment-password" required>
            일련번호 S/N
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={input.SerialNo ? input.SerialNo : ""}
            onChange={updateField} //나중에 혹시 시간이 되면 바꿀 것
            name="SerialNo"
            required={true}
            endAdornment={
              <InputAdornment position="end">
                <Button onClick={onCheckEvent}>확인</Button>
              </InputAdornment>
            }
            labelWidth={104}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onClickEvent}
        >
          등록 하기
        </Button>
      </div>
    </div>
  );
};

export default Regist;
