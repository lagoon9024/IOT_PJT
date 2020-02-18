import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Divider } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  deviceSelectForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  deviceInfoBox: {
    display: "flex",
    alignItems: "center",
    marginLeft: "36px"
  },
  dialogTitle: {
    padding: "10px 24px 0"
  }
}));
function DeviceDialog(props) {
  const history = useHistory();
  const classes = useStyles();
  const { onClose, open, devices, selectedValue } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="device-dialog" open={open}>
      <DialogTitle id="device-dialog" className={classes.dialogTitle}>
        <Typography>기기를 선택해주세요</Typography>
      </DialogTitle>
      <List>
        {devices.map(device => (
          <ListItem
            button
            onClick={() => handleListItemClick(device)}
            key={device.d_No}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${device.d_Name}꺼`} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={() => history.push("/regist")}>
          <ListItemText primary={"새 기기 등록하기"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

DeviceDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};

const DeviceSelect = props => {
  const classes = useStyles();
  const { store, onChangeStore } = useStore();
  const { input, isLoading, dataFetch } = useFetchData(
    "/Join/main/",
    "devicelist"
  );
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({});
  React.useMemo(() => {
    if (input.u_Last !== undefined && input.u_Last !== 0) {
      setSelectedValue(
        input.device.filter(device => device.d_No === store.u_Last)[0]
      );
    } else {
      setSelectedValue({});
    }
  }, [input]);
  React.useMemo(() => {
    if (store.u_No !== undefined && store.u_No !== "" && input == 0) {
      setSelectedValue(store.u_Last);
      dataFetch(store.url + "/Join/main/" + store.u_No, "devicelist");
    }
  }, [store.u_No]);
  //input.device === undefined ? {} : input.device.filter(device=>device.d_No === state.u_Last)[0]
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async value => {
    setOpen(false);
    if (store.u_Last !== 0 && value !== "") {
      setSelectedValue(value);
      await onChangeStore(value, "select", "/Join/main");
      onChangeStore({ render: true });
      dataFetch(store.url + "/Join/main/" + store.u_No, "devicelist");
    }
  };
  return (
    <div className={classes.deviceSelectForm}>
      {isLoading ? (
        <div className={classes.deviceInfoBox}>
          <Skeleton animation="pulse" variant="text" height="28px" width="110px" />
          <IconButton onClick={handleClickOpen}>
            <ArrowDropDown />
          </IconButton>
        </div>
      ) : (
        <>
          {input.u_Last === 0 || input.u_Last === undefined ? (
            <div className={classes.deviceInfoBox}>
              <Typography variant="subtitle1" display={"inline"}>
                기기를 선택해주세요.
              </Typography>
              <IconButton onClick={handleClickOpen}>
                <ArrowDropDown />
              </IconButton>
            </div>
          ) : (
            <div className={classes.deviceInfoBox}>
              <Typography variant="subtitle1" display={"inline"}>
                {selectedValue ? selectedValue.d_Name : undefined}'s 밥그릇
              </Typography>
              <IconButton onClick={handleClickOpen}>
                <ArrowDropDown />
              </IconButton>
            </div>
          )}

          <DeviceDialog
            selectedValue={typeof selectedValue === String ? selectedValue : ""}
            open={open}
            onClose={handleClose}
            devices={input.device === undefined ? [] : input.device}
          />
        </>
      )}
    </div>
  );
};
export default DeviceSelect;
