import { BrowserRouter, Route, Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ROUTERS } from "./router";

import "./styles/index.scss";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={window.location.pathname || ""}>
        <div className="app-content">
          <Route exact path="/" component={ROUTERS.component} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
