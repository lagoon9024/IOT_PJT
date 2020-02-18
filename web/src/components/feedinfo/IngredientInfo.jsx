import React from "react";
import { Rating, Skeleton } from "@material-ui/lab";
import {
  makeStyles,
  Box,
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import { useFetchData, useStore } from "../custom-hooks/custom-hooks";
import { useEffect } from "react";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const StyledRating = withStyles({
  sizeSmall: {
    fontSize: "1.2rem"
  }
})(Rating);

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  media: {
    width: 150,
    height: 170
  },
  score: {
    height: "100%",
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
  key: {
    fontWeight: "bold",
    color: "#00b08b",
    fontSize: "9px"
  },
  value: {
    fontSize: "13px"
  },
  grid: {
    marginTop: "10px",
    padding: "2px"
  },
  ingList: {
    width: "100%",
    maxWidth: "500px"
  }
}));
const Ingredient = props => {
  // const f_Image =
  const classes = useStyles();
  const { input, isLoading, dataFetch } = useFetchData(
    "/feed/ingredient/" + props.f_No,
    "feedinfo"
  );
  const { store } = useStore();
  const [selectIng, setSelectIng] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dataFetch(store.url + "/feed/ingredient/" + props.f_No, "feedinfo");
  }, [store]);

  return (
    <>
      <Box width="99%" maxWidth="500px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography component="span" variant="h6" gutterBottom>
            재료 성분
          </Typography>
          <Typography component="span" variant="caption" gutterBottom>
            (
            <Box color="secondary.main" component="span">
              {" * "}
            </Box>
            알러지 유의 성분 )
          </Typography>
        </Box>
        <Divider />
      </Box>
      {isLoading ? (
        <>
          <Skeleton width="50px" />
          <Skeleton width="150px" />
        </>
      ) : (
        <>
          <List className={classes.ingList}>
            {input.warning ? (
              input.warning.count ? (
                input.warning.data.map((warnIng, idx) => (
                  <ListItem
                    button
                    key={`warning_${idx}`}
                    onClick={() => {
                      setSelectIng(warnIng);
                      handleClickOpen();
                    }}
                  >
                    <ListItemIcon>
                      <WarningIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText>
                      {warnIng.i_Name}
                      {warnIng.isAllergy ? (
                        <Box color="secondary.main" component="span">
                          {" "}
                          *
                        </Box>
                      ) : (
                        ""
                      )}
                    </ListItemText>
                    <IconButton edge="end">
                      <ArrowForwardIosIcon color="primary" fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {input.doubt ? (
              input.doubt.count ? (
                input.doubt.data.map((doubtIng, idx) => (
                  <ListItem
                    button
                    key={`doubt_${idx}`}
                    onClick={() => {
                      setSelectIng(doubtIng);
                      handleClickOpen();
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        color="warning.main"
                        alignItems="center"
                        display="flex"
                      >
                        <ErrorIcon />
                      </Box>
                    </ListItemIcon>
                    <ListItemText>
                      {doubtIng.i_Name}
                      {doubtIng.isAllergy ? (
                        <Box color="secondary.main" component="span">
                          {" "}
                          *
                        </Box>
                      ) : (
                        ""
                      )}
                    </ListItemText>
                    <IconButton edge="end">
                      <ArrowForwardIosIcon color="primary" fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {input.basic ? (
              input.basic.count ? (
                input.basic.data.map((basicIng, idx) => (
                  <ListItem
                    button
                    key={`basic_${idx}`}
                    onClick={() => {
                      setSelectIng(basicIng);
                      handleClickOpen();
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        color="success.main"
                        alignItems="center"
                        display="flex"
                      >
                        <Brightness1Icon />
                      </Box>
                    </ListItemIcon>
                    <ListItemText>
                      {basicIng.i_Name}
                      {basicIng.isAllergy ? (
                        <Box color="secondary.main" component="span">
                          {" "}
                          *
                        </Box>
                      ) : (
                        ""
                      )}
                    </ListItemText>
                    <IconButton edge="end">
                      <ArrowForwardIosIcon color="primary" fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </List>
        </>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{selectIng.i_Name}</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            성분 설명
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectIng.i_Description}
          </Typography>
          {selectIng.i_Doubt ? (
            <Typography variant="subtitle2" gutterBottom>
              <Box component="span" color="warning.main">
                ●{" "}
              </Box>
              주의등급 안내
            </Typography>
          ) : selectIng.i_Warning ? (
            <Typography variant="subtitle2" gutterBottom>
              <Box component="span" color="secondary.main">
                ●{" "}
              </Box>
              위험등급 안내
            </Typography>
          ) : (
            ""
          )}
          {selectIng.i_Doubt ? (
            <Typography variant="body1">{selectIng.i_Doubt}</Typography>
          ) : selectIng.i_Warning ? (
            <Typography variant="body1">{selectIng.i_Warning}</Typography>
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Ingredient;
