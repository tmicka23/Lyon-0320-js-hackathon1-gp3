import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultsIds: null,
      results: null,
      search: "",
      onSearch: false,
    };
  }

  searchIds = async () => {
    const resultsIds = await Axios.get(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${this.state.search}`
    ).then((response) => response.data.objectIDs);
    this.setState({ resultsIds, onSearch: true });
  };

  getResults = async () => {
    const lastID = Math.floor(Math.random() * this.state.resultsIds.length);
    const firstID = lastID - 10;
    if (this.state.resultsIds === null) {
      this.setState({ onSearch: false });
    } else {
      const results = await Promise.all(
        this.state.resultsIds
          .slice(this.state.resultsIds.length > 10 ? firstID : 0, this.state.resultsIds.length > 10 ? lastID : this.state.resultsIds.length)
          .map((id) =>
            Axios.get(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            ).then((response) => response.data)
          )
      );
      this.setState({ results });
    }
  };

  handleChange = (event) => {
    const search = event.target.value;
    this.setState({ search, onSearch: false });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Home
                {...this.state}
                onLoad={this.getResults}
                onClick={this.searchIds}
                handleChange={this.handleChange}
              />
            </Route>
            <Route
              exact
              path="/details/:id"
              render={(routeProps) => <Details {...routeProps} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
