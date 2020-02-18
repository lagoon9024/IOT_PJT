import React from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { useHistory } from "react-router";
import {useStore} from "../../custom-hooks/custom-hooks"
import { useCookies } from "react-cookie";
const useStyles = makeStyles(theme => ({
  noteList: {
    height: "100%"
  },
  noteListItem: {
    height: 30
  },
  listItemText: {
    fontSize: "0.7rem"
  }
}));
const UserPopOver = ({ setAnchorEl }) => {
  const classes = useStyles();
  const history = useHistory();
  const { onChangeStore} = useStore();
  const [cookies, setCookie, removeCookie]= useCookies(["token"]);
  const onClickLogout = () => {
    setAnchorEl(null);
    removeCookie("Token", {path: '/'})
    onChangeStore("","restore","");
    history.replace("/login");
  };
  const onClickUserInfo = () => {
    setAnchorEl(null);
    history.push("/info")
  };
  const items = [
    {
      key: 1,
      value: "회원정보",
      icon: <PermIdentityIcon fontSize="small" />,
      event: onClickUserInfo
    },
    {
      key: 2,
      value: "로그아웃",
      icon: <PowerSettingsNewIcon fontSize="small" />,
      event: onClickLogout
    }
  ]; // Test data

  return (
    <List className={classes.noteList}>
      {items.map(item => (
        <ListItem
          button
          key={`${item.key}`}
          name={`${item.key}`}
          className={classes.noteListItem}
          onClick={item.event}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={`${item.value}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserPopOver;
