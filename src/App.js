import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = (searchTerm) => (item) =>
!searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onDismiss(id) {
    const updatedList = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: { ...this.state.result, hits: updatedList }
    });
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="App">
        <div className="page">
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}>Search</Search>
          </div>
          {
            result &&
            <Table
              list={result.hits}
              onDismiss={this.onDismiss} />
          }
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => 
  <form onSubmit={onSubmit}>
      <input
      type="text"
      value={value}
      onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>;

  const Table = ({ list, onDismiss }) => {
    return (
      <div className="table">
        { list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>
          {item.author}
          </span>
          <span style={{ width: '10%' }}>
          {item.num_comments}
          </span>
          <span style={{ width: '10%' }}>
          {item.points}
          </span>
          <span style={{ width: '10%' }}>
            <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
        )}
      </div>
    );
  }


const Button = ({
  onClick,
  className = '',
  children,
}) => {
  
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
      >
      {children}
    </button>
  );
}

export default App;
