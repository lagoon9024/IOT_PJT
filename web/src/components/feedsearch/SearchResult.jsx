import React from "react";
import {
  makeStyles,
  Box,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
} from "@material-ui/core";
import StarRateIcon from "@material-ui/icons/StarRate";
import { useHistory } from "react-router";
import { useStore } from "../custom-hooks/custom-hooks";

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  tab: {
    backgroundColor: theme.palette.background.default,
    width: "100vw",
    maxWidth: "500px"
  },
  media: {
    width: "50px",
    height: "70px",
    borderRadius: "10px"
  }
}));

const SearchResult = props => {
  const classes = useStyles();
  const history = useHistory();
  const { store } = useStore();
  const goFeedInfo = f_id => {
    history.push(`/feedinfo/${f_id}`);
  };
  return (
    <Box className={classes.tab}>
      <List className={classes.root}>
        {false ? (
          <></>
        ) : (
          props.data.map(data => (
            <ListItem
              key={`feedImage${data.f_No}`}
              button
              onClick={() => goFeedInfo(data.f_No)}
            >
              <ListItemAvatar>
                <CardMedia
                  className={classes.media}
                  image={`/images/${data.f_No}.jpg`}
                  title="Feed Image"
                />
              </ListItemAvatar>
              <ListItemText
                primary={data.f_Name}
                secondary={data.f_Manufacturer}
              />
              <Box display="flex" alignItems="flex-end">
                <Box display="flex" alignItems="center">
                  <Box display="flex" color="warning.main" alignItems="center">
                    <StarRateIcon fontSize="small" />
                  </Box>
                  <Typography>{Number.parseFloat(data.f_Rank).toFixed(1)}</Typography>
                </Box>
                <Typography variant="subtitle2">({data.f_Count})</Typography>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};
export default SearchResult;
