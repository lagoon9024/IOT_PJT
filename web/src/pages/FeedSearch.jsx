import React from "react";
import {
  makeStyles,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  withStyles
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import SearchBar from "../components/feedsearch/SearchBar";
import SearchResult from "../components/feedsearch/SearchResult";
import {
  useFetchData,
  useStore
} from "../components/custom-hooks/custom-hooks";
import { useEffect } from "react";
import Slider from "react-slick";
import FeedSlide from "../components/feedsearch/FeedSlide";

const StyledRating = withStyles({
  sizeSmall: {
    fontSize: "0.7rem"
  }
})(Rating);
const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  slider: {
    width: "100%",
    maxWidth: "500px"
  },
})); // #00b08b

const Record = props => {
  const classes = useStyles();
  const { input, dataFetch, isLoading } = useFetchData("/feed", "feed_all");
  const { store } = useStore();
  const randomArray = (length, max) =>
    [...new Array(length)].map(() => Math.round(Math.random() * max));
  useEffect(() => {
    if(store.url !== ""){
      dataFetch(store.url + "/feed", "feed_all");
    }
  }, [store.url]);
  return (
    <div className={classes.page}>
      <SearchBar data={input} />
      {store.options === undefined ? (
        <></>
      ) : store.options.length === 0 ? (
        <>
          <Typography variant="body1">
            사료명 또는 제조사 이름으로 검색하세요!
          </Typography>
          <div className={classes.slider}>
            <Box p={"40px"}>
              <FeedSlide input={input} isLoading={isLoading} randNum={randomArray(20, input.length)}/>
            </Box>
          </div>
        </>
      ) : (
        <SearchResult data={store.options} />
      )}
    </div>
  );
};

export default Record;
