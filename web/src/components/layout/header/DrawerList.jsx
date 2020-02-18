import React from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Container,
  SvgIcon
} from "@material-ui/core";
import { useHistory } from "react-router";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import StorageIcon from "@material-ui/icons/Storage";
import { useFetchData } from "../../custom-hooks/custom-hooks";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DogBlack from "../../../assets/icons/dogBlack.png";
import CatBlack from "../../../assets/icons/catBlack.png";

const useStyles = makeStyles(theme => ({
  drawerList: {
    width: 250,
    backgroundColor: theme.palette.background.paper
  },
  icons: {
    height: "24px"
  },
  iconContainer: {
    textAlign: "center"
  }
}));

const DrawerList = ({ setOpen }) => {
  const classes = useStyles();
  const history = useHistory();
  const { input, isLoading } = useFetchData("/device/", "device_select");
  const calcAge = birth => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let monthDay = month + day;
    birth = birth.replace("-", "").replace("-", "");
    let birthdayy = birth.substr(0, 4);
    let birthdaymd = birth.substr(4, 4);
    let age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
    if (age < 1) {
      let monthAge = monthDay.substr(0, 2) - birthdaymd.substr(0, 2);
      return monthAge === 0
        ? "1개월 미만"
        : (monthAge < 0 ? 12 + monthAge : monthAge) + "개월";
    }
    return age + "살";
  };
  return (
    <List className={classes.drawerList}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            {isLoading ? (
              <ErrorOutlineIcon />
            ) : input.device !== undefined ? (
              input.device.d_Species === "강아지" ? (
                <img src={DogBlack} alt="dog" className={classes.icons} />
              ) : (
                <img src={CatBlack} alt="cat" className={classes.icons} />
              )
            ) : (
              <ErrorOutlineIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        {isLoading ? (
          <ListItemText primary="기기를 등록해주세요" />
        ) : input.device === undefined ? (
          <ListItemText primary="기기를 등록해주세요" onClick={()=>{
            history.push('/regist')
            setOpen(false)
          }} />
        ) : (
          <ListItemText
            primary={input.device.d_Name}
            secondary={input.device.d_Bday ? calcAge(input.device.d_Bday) : "-"}
          />
        )}
      </ListItem>
      <Divider />
      <Container>
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/main");
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="홈" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/info");
          }}
        >
          {/* {console.log(input)} */}
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="내 정보" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/set");
          }}
        >
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="급여 설정" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/device");
          }}
        >
          <ListItemIcon>
            <SvgIcon
              color="inherit"
              fontSize="default"
              viewBox="0 -79 512.00003 512"
            >
              {/* <circle cx="4.5" cy="9.5" r="2.5" />
              <circle cx="9" cy="5.5" r="2.5" />
              <circle cx="15" cy="5.5" r="2.5" />
              <circle cx="19.5" cy="9.5" r="2.5" />
              <path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z" />
              <path d="M0 0h24v24H0z" fill="none" /> */}
              <path d="m511.394531 329.8125-29.792969-119.167969c-6.171874-24.679687-24.847656-43.5-48.273437-50.417969v-15.464843c0-33.386719-20.929687-62.941407-51.308594-74.625-16.546875-51.960938-75.371093-77.269531-124.1875-53.929688-48.6875-36.933593-120.035156-7.261719-127.601562 53.84375-30.761719 11.710938-51.554688 41.304688-51.554688 74.714844v15.460937c-23.429687 6.921876-42.105469 25.738282-48.277343 50.417969l-29.792969 119.167969c-3.164063 12.660156 6.445312 24.851562 19.402343 24.851562h471.984376c12.992187-.003906 22.558593-12.226562 19.402343-24.851562zm-358.621093-224.546875c10.527343-1.539063 18.003906-11.050781 17.019531-21.640625-3.601563-38.875 45.1875-58.972656 70.125-29.625 6.8125 8.015625 18.667969 9.382812 27.125 3.132812 29.695312-21.945312 72.617187-4.214843 78.535156 32.113282 1.335937 8.210937 7.617187 14.738281 15.769531 16.386718 18.53125 3.75 31.980469 20.207032 31.980469 39.128907v12.574219h-274.65625v-12.574219c0-19.671875 14.660156-36.652344 34.101563-39.496094zm-107.148438 209.398437 23.582031-94.320312c3.386719-13.546875 15.503907-23.007812 29.46875-23.007812h314.652344c13.964844 0 26.082031 9.460937 29.46875 23.007812l23.582031 94.320312zm0 0" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="기기 목록" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/record");
          }}
        >
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary="급식 기록" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            history.push("/feedsearch");
          }}
        >
          <ListItemIcon>
            <SvgIcon color="inherit" fontSize="default" viewBox="-56 0 512 512">
              <path d="m367.402344 55.167969c0-30.421875-24.75-55.167969-55.167969-55.167969h-224.933594c-30.417969 0-55.167969 24.746094-55.167969 55.167969v25.167969h335.269532zm0 0" />
              <path d="m398.957031 203.679688-26.671875-93.34375h-345.039062l-26.667969 93.34375c-.382813 1.339843-.578125 2.726562-.578125 4.121093v249.035157c0 30.417968 24.746094 55.164062 55.164062 55.164062h289.203126c30.417968 0 55.164062-24.746094 55.164062-55.164062v-249.035157c.003906-1.394531-.191406-2.78125-.574219-4.121093zm-199.191406 236.019531c-79.144531 0-143.53125-64.386719-143.53125-143.53125s64.386719-143.535157 143.53125-143.535157 143.535156 64.390626 143.535156 143.535157-64.390625 143.53125-143.535156 143.53125zm0 0" />
              <path d="m199.765625 270.492188c-38.023437 0-68.957031 30.933593-68.957031 68.957031 0 7.015625 2.03125 13.824219 5.867187 19.683593 6.675781 10.207032 17.9375 16.300782 30.117188 16.300782 8.546875 0 15.3125-2.003906 20.746093-3.613282 4.488282-1.332031 8.03125-2.382812 12.226563-2.382812s7.738281 1.050781 12.226563 2.382812c5.4375 1.609376 12.203124 3.613282 20.746093 3.613282 12.183594 0 23.441407-6.09375 30.121094-16.296875 3.835937-5.863281 5.863281-12.671875 5.863281-19.6875 0-38.023438-30.933594-68.957031-68.957031-68.957031zm0 0" />
              <path d="m146.210938 265.464844c3.949218 0 7.816406-1.601563 10.609374-4.390625 2.789063-2.792969 4.390626-6.660157 4.390626-10.609375 0-3.949219-1.601563-7.8125-4.390626-10.609375-2.792968-2.792969-6.660156-4.390625-10.609374-4.390625-3.949219 0-7.8125 1.597656-10.609376 4.390625-2.789062 2.796875-4.390624 6.660156-4.390624 10.609375 0 3.949218 1.597656 7.816406 4.390624 10.609375 2.800782 2.789062 6.660157 4.390625 10.609376 4.390625zm0 0" />
              <path d="m181.199219 246.902344c3.953125 0 7.8125-1.597656 10.601562-4.390625 2.800781-2.796875 4.398438-6.667969 4.398438-10.609375 0-3.949219-1.597657-7.820313-4.398438-10.609375-2.789062-2.789063-6.648437-4.390625-10.601562-4.390625-3.949219 0-7.816407 1.601562-10.609375 4.390625-2.789063 2.789062-4.390625 6.660156-4.390625 10.609375 0 3.941406 1.601562 7.8125 4.390625 10.609375 2.789062 2.792969 6.660156 4.390625 10.609375 4.390625zm0 0" />
              <path d="m218.328125 246.902344c3.949219 0 7.820313-1.597656 10.609375-4.390625 2.792969-2.796875 4.390625-6.667969 4.390625-10.609375 0-3.949219-1.597656-7.820313-4.390625-10.609375-2.789062-2.789063-6.660156-4.390625-10.609375-4.390625s-7.808594 1.601562-10.609375 4.390625c-2.789062 2.789062-4.390625 6.660156-4.390625 10.609375 0 3.941406 1.601563 7.8125 4.390625 10.609375 2.800781 2.792969 6.660156 4.390625 10.609375 4.390625zm0 0" />
              <path d="m253.320312 265.464844c3.949219 0 7.8125-1.601563 10.609376-4.390625 2.789062-2.792969 4.390624-6.660157 4.390624-10.609375 0-3.949219-1.601562-7.8125-4.390624-10.609375-2.800782-2.792969-6.660157-4.390625-10.609376-4.390625-3.949218 0-7.808593 1.597656-10.609374 4.390625-2.789063 2.796875-4.390626 6.660156-4.390626 10.609375 0 3.949218 1.601563 7.816406 4.390626 10.609375 2.800781 2.789062 6.660156 4.390625 10.609374 4.390625zm0 0" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="사료 정보" />
        </ListItem>
      </Container>
    </List>
  );
};

export default DrawerList;
