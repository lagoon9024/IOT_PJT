export const CHANGE_STORE = "store/CHANGE_STORE";
export const RESTORE_STORE = "store/RESTORE_STORE";

export const changeStore = data => ({
  type : CHANGE_STORE,
  payload : data
});
export const restoreStore = data => ({
  type : RESTORE_STORE,
  payload : data
})

//70.12.246.68:3000
//localhost:3000
const initialState = {
  // url: "http://70.12.246.68:3000",
  //url: "http://localhost:3000",
  url:"http://52.78.235.226:3000",
  currentDeviceNo : "",
  u_No : "",
  u_Last : "" ,
};
const store = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_STORE:
      return{
        ...state,
        ...action.payload
      };
    case RESTORE_STORE:
      return{
        ...initialState
      }
    default:
      return {
        ...state
      };
  }
};

export default store;