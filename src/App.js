import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ProgressSoundPlayer from './components/ProgressSoundPlayer';
import SC from 'node-soundcloud';
import Loading from 'react-loading';

var client_id = "4dc422275bcb05a7172a55cbd0a8d28f";

SC.init({
  id: client_id
});

class App extends Component {
  constructor(props) {
    console.log("we're in the constructor");
    super();

    this.state = {
      query: '',
      hasResults: false,
      searchResults: [],
      isLoading: false
    };
  }

  handleTextChange(event) {
    this.setState({
      query: event.target.value
    });
    if (event.key === 'Enter') {
      this.search.call(this);
    }
  }

  search() {
    this.setState({
      isLoading: true
    });

    SC.get('/tracks', {
      q: this.state.query,
      embeddable_by: 'all'
    }, (err, tracks) => {
      if (!err) {
        this.setState({
          hasResults: true,
          searchResults: tracks,
          isLoading: false
        });
      } else {
        console.log("Oops: " + err);
      }
    });
  }

  render() {
    console.log("rendering...");
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>SoundCloud Player</h2>
        </div>
        <p className="App-intro">
          <input type="search"
            onKeyUp={this.handleTextChange.bind(this)}
            className="search-field"
            placeholder="Enter song name or artist..." />
          <button className="search-button"
                  onClick={this.search.bind(this)}>Search</button>
        </p>
        <div className="center">
          {this.state.isLoading && <Loading type="bars" color="#FFB935" />}
        </div>
        {this.state.hasResults && !this.state.isLoading ?
         this.renderSearchResults.call(this) :
         this.renderNoSearchResults.call(this)}
      </div>
    );
  }

  renderNoSearchResults() {
    return (
      <div id="no-results"></div>
    );
  }

  renderSearchResults() {
    return (
      <div id="search-results">
        {this.state.searchResults.map(this.renderPlayer.bind(this))}
      </div>
    );
  }

  renderPlayer(track) {
    return (
      <ProgressSoundPlayer
        key={track.id}
        clientId={client_id}
        resolveUrl={track.permalink_url} />
    );
  }
}

export default App;
