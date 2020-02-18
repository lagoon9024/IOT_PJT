import React, { useState } from "react";
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
  InputAdornment,
  Tab,
  AppBar,
  Tabs
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import Calculator from "../../assets/icons/calculator.png";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Ingredient from "./amountsetting/IngredientCalculate";
import DirectCalculate from "./amountsetting/DirectCalculate";
import SearchCalculate from "./amountsetting/SearchCalculate";

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const AmountSetting = props => {
  const { setInput } = useFetchData("","");
  const [open, setOpen] = useState(false);
  const { store, onChangeStore } = useStore();
  useEffect(() => {
    setInput();
  }, [store]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = React.useState(0);
  const handleClickOpen = () => {
    if(store.u_Last !== 0){
      setValue(0);
      setOpen(true);
    }
    else{
      alert("기기를 등록 후 사용해주세요")
    }
  };

  const handleClose = async event => {
    onChangeStore({ dayAmount: "", dayCalory: "" });
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChangeStore({ dayAmount: "", dayCalory: "" });
  };
  return (
    <>
      <img
        src={Calculator}
        alt="calculator"
        style={{ width: "50px", height: "50px" }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
      >
        {/* 조단백 조지방 수분 조회분  */}
        <DialogTitle id="form-dialog-title">칼로리 계산기</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              display="inline"
              alignItems="center"
              justifyContent="center"
              padding={2}
              width="100%"
              maxWidth="500px"
            >
              <Box alignItems="center" justifyContent="center">
                <Typography>우선 기기등록을 해야 합니다</Typography>
              </Box>
              <Box>
                <Typography>검색으로 배급할 사료를 찾거나</Typography>
              </Box>
              <Box>
                <Typography>사료의 포장지에 있는 값을 입력해주세요</Typography>
              </Box>
            </Box>
          </DialogContentText>
          <AppBar position="relative">
            <Tabs
              value={value}
              variant="fullWidth"
              onChange={handleChange}
              aria-label="simple tabs example"
              indicatorColor=""
            >
              <Tab label="검색" {...a11yProps(0)} fullWidth />
              <Tab label="성분입력" {...a11yProps(1)} fullWidth />
              <Tab label="직접입력" {...a11yProps(2)} fullWidth />
            </Tabs>
          </AppBar>
          <Box
            border={1}
            borderRadius={16}
            style={{
              backgroundColor: "#edfdf6",
              borderColor: "#FFFFFF"
            }}
          >
            <TabPanel value={value} index={0}>
              <Box minHeight="250px">
                <SearchCalculate/>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Ingredient
                fullScreen={fullScreen}
                d_No={store.u_Last}
              ></Ingredient>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <DirectCalculate
                fullScreen={fullScreen}
                d_No={store.u_Last}
              ></DirectCalculate>
            </TabPanel>
          </Box>
          <Box marginTop={1} display="flex">
            <Box width="50%" display="flex" justifyContent="center">
              <Box width={fullScreen ? "80%" : "90%"}>
                <Typography variant={fullScreen ? "body2" : "body1"}>
                  하루 필요 칼로리
                </Typography>
                <TextField
                  variant="standard"
                  value={store.dayCalory ? store.dayCalory : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        children={
                          <Typography variant={fullScreen ? "body2" : "body1"}>
                            kcal
                          </Typography>
                        }
                      />
                    ),
                    readOnly: true,
                    style: { textAlignLast: "center" }
                  }}
                  margin="normal"
                />
              </Box>
            </Box>
            <Box width="50%" display="flex" justifyContent="center">
              <Box width={fullScreen ? "80%" : "90%"}>
                <Typography variant={fullScreen ? "body2" : "body1"}>
                  1일 권장량
                </Typography>
                <TextField
                  variant="standard"
                  value={store.dayAmount ? store.dayAmount : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        children={
                          <Typography variant={fullScreen ? "body2" : "body1"}>
                            g
                          </Typography>
                        }
                      />
                    ),
                    readOnly: true,
                    style: { textAlignLast: "center" }
                  }}
                  margin="normal"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button name="close" onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AmountSetting;
