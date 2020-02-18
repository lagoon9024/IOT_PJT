import React from "react";

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Button
} from "@material-ui/core";
import NoteListItem from "./NoteListItem";
const useStyles = makeStyles(theme => ({
  noteList: {
    width: 300,
    maxHeight: 400
  },
  noteButton: {
    fontSize: "0.7rem"
  },
  noteSubHeader: {
    lineHeight: "30px"
  }
}));

const NotificationList = props => {
  const classes = useStyles();
  const items = () => {
    if (props.notes.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="새로운 알림이 없어요!" />
        </ListItem>
      );
    }
    return props.notes.map((note, idx) => (
      <NoteListItem
        {...note}
        key={`NoteItem.${idx}`}
        divider={idx !== props.notes.length - 1}
        onListClick={() => props.onItemCheck(idx)}
      />
    ));
  };
  return (
    <List className={classes.noteList}>
      <ListSubheader className={classes.noteSubHeader}>{`알림`}</ListSubheader>
      {/* <ListItem> */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "10px"
        }}
      >
        <Button
          className={classes.noteButton}
          color="primary"
          size={"small"}
          onClick={() => props.onCheckAll()}
        >
          모두 읽음으로 표시
        </Button>
        <Button
          className={classes.noteButton}
          color="primary"
          size="small"
          onClick={() => props.onRemoveAll()}
        >
          읽은 알림 삭제
        </Button>
      </div>
      {/* </ListItem> */}
      <Divider />
      {items()}
    </List>
  );
};

export default NotificationList;
