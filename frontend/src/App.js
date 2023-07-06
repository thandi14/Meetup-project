import React, { useState, useEffect }  from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session"
import Navigation from "./components/Navigation";
import Home from './components/Home'
import Groups from './components/Groups'
import GroupDetails from "./components/GroupsDetails";
import Events from "./components/Events";
import EventDetails from "./components/EventDetails";
import CreateGroup from "./components/CreateGroup";
import CreateEvent from "./components/CreateEvent";
import UpdateGroup from "./components/UpdateGroup";
import LoadingScreenTwo from "./components/LoadingScreen2";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
   dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path="/">
        <Home />
        </Route>
        <Route exact path='/groups'>
        <Groups />
        </Route>
        <Route exact path="/groups/new">
        <CreateGroup />
        </Route>
        <Route exact path='/groups/:id/events/new'>
          <CreateEvent />
        </Route>
        <Route exact path='/groups/:id/edit'>
          <UpdateGroup />
        </Route>
        <Route exact path='/groups/:id/'>
          <GroupDetails />
        </Route>
        <Route exact path='/events'>
          <Events />
        </Route>
        <Route exact path='/events/:id/'>
          <EventDetails />
        </Route>
        <Route>
        <h1>404 not found</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
