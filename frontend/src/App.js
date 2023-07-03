import React, { useState, useEffect }  from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session"
import Navigation from "./components/Navigation";
import Home from './components/Home'
import Groups from './components/Groups'

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
        <Route>
        <h1>404 not found</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
