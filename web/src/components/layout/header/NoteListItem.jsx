import React, { memo } from "react";

import { ListItem, ListItemText } from "@material-ui/core";

const NoteListItem = memo(props => (
  <ListItem
    button
    divider={props.divider}
    onClick={props.onListClick}
    disabled={props.isRead}
  >
    <ListItemText primary={props.value} />
  </ListItem>
));

export default NoteListItem;
