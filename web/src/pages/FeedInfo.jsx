import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import {
  makeStyles,
  useTheme,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import { useParams } from "react-router";
import FeedBasic from "../components/feedinfo/FeedBasic";
import NutritionInfo from "../components/feedinfo/NutritionInfo";
import Feedreview from "../components/feedinfo/Feedreview";
import IngredientInfo from "../components/feedinfo/IngredientInfo";
import FeedAnalysis from "../components/feedinfo/FeedAnalysis";

const useStyles = makeStyles(theme => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  tab: {
    backgroundColor: theme.palette.background.default,
    top: 48,
    width: "100vw",
    maxWidth: "500px"
  }
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
const FeedInfo = props => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { f_No } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };
  return (
    <div className={classes.page}>
      <Box>{/* <FeedSearch /> */}</Box>

      {/* <AppBar position="sticky" color="default" style={{top: "56px"}}> */}
      <Tabs
        style={{
          position: "fixed",
          width: "100%",
          top: "56px",
          backgroundColor: "#f5f5f5",
          color: "#789cce",
          zIndex: 99
        }}
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        variant="fullWidth"
        aria-label="full width tabs"
        TabIndicatorProps={{
          style: {
            backgroundColor: "#789cce"
          }
        }}
      >
        <Tab label="기본 정보" {...a11yProps(0)} />
        <Tab label="재료 정보" {...a11yProps(1)} />
        <Tab label="리뷰" {...a11yProps(2)} />
      </Tabs>
      <div className={classes.tab}>
        {/* </AppBar> */}
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <FeedBasic f_No={f_No} />
            <NutritionInfo f_No={f_No} />
            <FeedAnalysis f_No={f_No} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <IngredientInfo f_No={f_No} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Feedreview f_No={f_No} />
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
};

export default FeedInfo;
