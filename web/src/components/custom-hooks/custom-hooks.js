import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { changeStore, restoreStore } from "../../modules/store";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

export const useNotes = (initialValue = []) => {
  const [notes, setNotes] = useState(initialValue);
  // useEffect(() => {
  //   axios({
  //     method: "GET",
  //     url: store.url + "/note/" + store.u_No,
  //     headers: store.headers
  //   }).then(res => {
  //     if (res.data.validation) {
  //       setNotes(res.data.data);
  //     }
  //   });
  // }, []);
  return {
    notes,
    addNote: text => {
      if (text !== "") {
        setNotes(
          notes.concat({
            text,
            isRead: false
          })
        );
      }
    },
    checkNote: idx => {
      setNotes(
        notes.map((note, index) => {
          if (idx === index) {
            note.isRead = !note.isRead;
          }
          return note;
        })
      );
    },
    checkAll: () => {
      setNotes(
        notes.map(note => {
          if (!note.isRead) {
            note.isRead = !note.isRead;
          }
          return note;
        })
      );
    },
    removeNote: idx => {
      setNotes(notes.filter((note, index) => idx !== index));
    },
    removeAll: () => {
      setNotes(notes.filter(note => !note.isRead));
    }
  };
};
export const useFetchData = (requestURL, dataType) => {
  const [input, setInput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { store, onChangeStore } = useStore();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const onSubmit = useCallback(async url => {
    const result = await axios.post(url, input, { headers: store.headers });
    return result.data;
  });

  const onValidate = useCallback(async url => {
    const result = await axios({
      url: url,
      method: "get",
      headers: store.headers
    });
    return result.data;
  });

  const updateField = e => {
    let flag = undefined;
    switch (e.target.name) {
      case "u_Pw":
        if (
          input.pwcon === undefined ||
          input.pwcon === "" ||
          e.target.value === input.pwcon
        ) {
          flag = true;
        } else {
          flag = false;
        }
        break;
      case "pwcon":
        if (
          e.target.value === undefined ||
          e.target.value === "" ||
          input.u_Pw === e.target.value
        ) {
          flag = true;
        } else {
          flag = false;
        }
        break;
      default:
        break;
    }
    if (e.target.name === "hour") {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
        s_Time: e.target.value + ":" + input.minute
      });
    } else if (e.target.name === "minute") {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
        s_Time: input.hour + ":" + e.target.value
      });
    } else {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
        pwValidated: flag
      });
    }
  };

  const dataFetch = async (url, type) => {
    setIsLoading(true);
    await axios({
      method: "GET",
      url: url,
      headers: { authorization: cookies.Token }
    })
      .then(result => {
        // console.log(result);
        if(result.data.validation){

        
        switch (type) {
          case "device":
          case "devicelist":
            if (store.d_No === undefined) {
              setInput(result.data.data);
            } else {
              setInput({ ...result.data.data, d_No: store.currentDeviceNo });
            }
            break;
          case "device_select":
            if (result.data.data.length === 0) {
              setInput({ ...input, device: [] });
            } else {
              setInput({
                device: result.data.data.filter(
                  device => device.d_No === store.u_Last
                )[0]
              });
            }
            break;
          case "user":
          case "feedinfo":
          case "chart":
          case "feed_all":
            setInput(result.data.data);
            break;
          default:
            setInput(result.data);
            break;
        }
      }else{
        if(result.data.message == "다시 로그인 해주세요!"){
          history.replace("/login");
        }
      }
        setIsLoading(false);
      })
      .catch(error => {});
  };

  const isLoggedIn = () => {
    if (
      ["/", "/login", "/join", ""].indexOf(history.location.pathname) === -1 &&
      (store.u_No === "" || store.u_No === undefined || cookies.Token === undefined)
    ) {
      return false;
    } else return true;
  };

  const getPrevState = async (requestURL, dataType) => {
    // let url = store.url + requestURL;
    await axios
      .get(store.url + "/user/main/" + cookies.Token)
      .then(async response => {
        if (response.data.validation) {
          onChangeStore({
            ...response.data.data,
            headers: { authorization: cookies.Token }
          });
          if (dataType === "maintable") {
          dataFetch(store.url +"/logdata/"+ response.data.data.u_Last, dataType);
          }
          // history.replace("/main");
        } else {
          if(dataType !=="maintable"){
            alert(response.data.message);
            history.replace("/login");
          }
        }
      })
      .catch(error => {
        console.log(error);
        if(dataType !=="maintable"){
          alert("로그인해주세요");
          history.replace("/login");
        }
      });
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      getPrevState(requestURL, dataType);
    } else {
      let url = store.url + requestURL;
      let flag = true;
      switch (dataType) {
        case "timetable":
        case "chart":
        case "maintable":
          if(store.u_Last === undefined|| store.u_Last === ""){
            flag = false
          }
            url += store.u_Last;
          break;
        case "device":
          if(store.currentDeviceNo === undefined){
            flag = false
          }
          url += store.currentDeviceNo;
          break;
        case "device_select":
          if (store.u_Last === 0) flag = false;
        case "user":
        case "devicelist":
        case "review":
          if(store.u_No === undefined ||store.u_No ===""){
            flag = false
            break;
          }
          url += store.u_No;
          break;
        case "feedinfo":
        case "feed_all":
          break;
        default:
          flag = false;
          break;
      }
      if (flag) {
        dataFetch(url, dataType);
      }
    }
  }, []);
  
  return {
    input,
    isLoading,
    setInput,
    setIsLoading,
    dataFetch,
    updateField,
    onSubmit,
    onValidate
  };
};

export const useStore = () => {
  const store = useSelector(state => state.store, []);
  const dispatch = useDispatch();
  const restore_Store = useCallback(data => dispatch(restoreStore("")), [
    dispatch
  ]);
  const change_Store = useCallback(data => dispatch(changeStore(data)), [
    dispatch
  ]);
  const onChangeStore = useCallback(async (data, type, url) => {
    switch (type) {
      case "select":
        const result = await axios.put(
          store.url + url,
          { u_No: store.u_No, d_No: data.d_No },
          { headers: store.headers }
        );
        if (result.data) {
          await change_Store({ u_Last: data.d_No });
        }
        break;
      case "restore":
        restore_Store("");
        break;
      default:
        await change_Store(data);
        break;
    }
  });
  return {
    store,
    onChangeStore
  };
};
