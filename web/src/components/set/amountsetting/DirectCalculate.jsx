import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment
} from "@material-ui/core";
import example from "../../../assets/icons/example_cal.jpg";
import { useStore } from "../../custom-hooks/custom-hooks";
import axios from "axios";

const DirectCalculate = props => {
  const fullScreen = props.fullScreen;
  const [input, setInput] = useState({ d_No: props.d_No });
  const { store, onChangeStore } = useStore();
  const changeEvent = event => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };
  const computeEvent = async () => {
    await axios({
      method: "POST",
      url: store.url + "/feed/cal/calory",
      headers: store.headers,
      data: input
    })
      .then(res => {
        if (res.data.validation) {
          onChangeStore({ ...res.data.data });
          setInput({ ...input, ME: "" });
        } else {
          alert(res.data.message);
        }
      })
      .catch(error => {
        alert("심각한 통신 장애");
      });
  };

  return (
    <Box minHeight="100px">
      <Box justifyContent="center" display="flex" marginBottom={3}>
        <Typography variant={fullScreen ? "body2" : "body1"}>
          아래와 같이 사료 포장지의 값을 찾아 입력해주세요
        </Typography>
      </Box>
      <Box justifyContent="center" display="flex" marginBottom={3}>
        <img src={example} alt="example_picture" width="90%" />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <TextField
          name="ME"
          value={input.ME}
          type = "number"
          onChange={changeEvent}
          variant="standard"
          size={fullScreen ? "small" : "medium"}
          style={{
            width: "40%",
            marginRight: fullScreen ? "15px" : "30px"
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                children={
                  <Typography
                    style={{
                      fontSize: fullScreen ? "13px" : "16px",
                      color: "rgba(0, 0, 0, 0.54)"
                    }}
                  >
                    kcal/kg
                  </Typography>
                }
              ></InputAdornment>
            ),
            style: { textAlignLast: "center" }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: "2px",
            width: fullScreen ? "15%" : "20%",
            fontSize: fullScreen ? "13px" : "16px",
            height: "100%"
          }}
          onClick={computeEvent}
        >
          계산
        </Button>
      </Box>
    </Box>
  );
};
export default DirectCalculate;
