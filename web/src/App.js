import React from "react";
import Join from "./pages/Join";
import Regist from "./pages/Regist";
import { BrowserRouter, Route  } from "react-router-dom";
import Layout from "./components/layout/LayoutMain";
import Home from "./pages/Home";
import Setting from "./pages/Setting";
import Main from "./pages/Main";
import Record from "./pages/Record";
import "./index.css";
import Info from "./pages/Info";
import Device from "./pages/Device";
import DeviceModify from "./pages/DeviceModify";
import Login from "./pages/Login";
import InfoModify from "./pages/InfoModify";
import FeedInfo from "./pages/FeedInfo";
import FeedSearch from "./pages/FeedSearch";
import PwModify from "./pages/PwModify"
import {CookiesProvider} from "react-cookie"
import Help from "./pages/Help";
const App = () => {
  return (
    <>
      <CookiesProvider>
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/join" component={Join} />   
          <Route path="/regist" component={Regist} />
          <Route path="/set" component={Setting} />
          <Route path="/record" component={Record} />
          <Route path="/main" component={Main} />
          <Route path="/info" component={Info} />
          <Route path="/infomodify" component={InfoModify} />
          <Route path="/device" component={Device} />
          <Route path="/devicemodify" component={DeviceModify} />
          <Route path="/feedinfo/:f_No" component={FeedInfo} />
          <Route path="/feedsearch" component={FeedSearch} />
          <Route path="/pwmodify" component={PwModify} />
          <Route path="/help" component={Help}/>
          {/* <Redirect to="/not-found" /> */}
        </Layout>
      </BrowserRouter>
      </CookiesProvider>
    </>
  );
};

export default App;
