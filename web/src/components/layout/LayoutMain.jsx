import React, { Fragment  } from "react";
import Header from "./Header";
import { CssBaseline, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  content: {
    margin: "0 auto"
  },
  container: {
    marginTop: "30px",
    marginBottom: "30px"
  },
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

const Layout = props => {
  const classes = useStyles();
  return (
    <Fragment>
      <CssBaseline />
      <Header />
      <Container className={classes.content} maxWidth="xl">
        <div className={classes.container}>{props.children}</div>
      </Container>
    </Fragment>
  );
};

export default Layout;
