import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment
} from "@material-ui/core";
import { useStore } from "../../custom-hooks/custom-hooks";
import axios from "axios";

const initialState = {
  d_No: "",
  f_Fat: "",
  f_Protein: "",
  f_Calucium: "",
  f_Phosphorus: "",
  f_Ash: "",
  f_Moisture: "",
  f_Fiber: ""
};
const Ingredient = props => {
  const fullScreen = props.fullScreen;
  const [input, setInput] = useState({ d_No: props.d_No });
  const { store, onChangeStore } = useStore();
  const changeEvent = event => {
    const {name, value} = event.target
    setInput({...input,[name] : value})
  }
  const resetEvent = event =>{
    setInput({...initialState,d_No : props.d_No});
  }
  
  const computeEvent = async() => {
    await axios({method : "POST" , url : store.url+"/feed/cal/direct" ,headers : store.headers, data : input})
    .then(res => {
      if(res.data.validation){
        onChangeStore({...res.data.data});
        //alert(res.data.message);
      }else{
        alert(res.data.message)
      }
    }).catch(error => {
      console.log(error);
      alert("심각한 통신 장애")
    })
  };
  return (
    <Box minHeight="250px" display="block" justifyContent="center">
      <Typography variant="caption">
        수분값을 모르실 경우 건사료 10 습식사료 70을 사용하세요.
      </Typography>
      <Typography variant="caption">
        조회분값을 모르실 경우 5~8사이의 값을 사용하거나 중간값을 사용하세요.
      </Typography>

      <Box display="flex" justifyContent="center">
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="조단백"
            margin="normal"
            style={{
              width: "90%"
            }}
            type = "number"
            name="f_Protein"
            value={input.f_Protein}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="조지방"
            type = "number"
            margin="normal"
            style={{
              width: "90%"
            }}
            name="f_Fat"
            value={input.f_Fat}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="칼슘"
            type = "number"
            margin="normal"
            style={{
              width: "90%"
            }}
            name="f_Calucium"
            value={input.f_Calucium}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="인"
            margin="normal"
            type = "number"
            style={{
              width: "90%"
            }}
            name="f_Phosphorus"
            value={input.f_Phosphorus}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="조섬유"
            type = "number"
            margin="normal"
            style={{
              width: "90%"
            }}
            name="f_Fiber"
            value={input.f_Fiber}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="조회분"
            margin="normal"
            type = "number"
            style={{
              width: "90%"
            }}
            name="f_Ash"
            value={input.f_Ash}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box width="50%" display="flex" justifyContent="center">
          <TextField
            variant="standard"
            label="수분"
            type = "number"
            margin="normal"
            style={{
              width: "90%"
            }}
            name="f_Moisture"
            value={input.f_Moisture}
            onChange={changeEvent}
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
                      %
                    </Typography>
                  }
                />
              )
            }}
            inputProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: fullScreen ? "13px" : "16px"
              }
            }}
            size="small"
          />
        </Box>
        <Box width="50%" display="flex" justifyContent="flex-end"></Box>
      </Box>
      <Box display="flex" width="100%" justifyContent="flex-end" marginTop={2}>
        <Button
          variant="contained"
          color="secondary"
          style={{
            margin: "2px",
            width: fullScreen ? "85%" : "100%",
            fontSize: fullScreen ? "13px" : "16px"
          }}
          onClick={resetEvent}
        >
          초기화
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: "2px",
            width: fullScreen ? "85%" : "100%",
            fontSize: fullScreen ? "13px" : "16px"
          }}
          onClick={computeEvent}
        >
          계산
        </Button>
      </Box>
    </Box>
  );
};
export default Ingredient;
