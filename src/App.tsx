import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean
}

interface IProps {}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [],
      showGraph: false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
  const socket = new WebSocket("ws://localhost:8080");

  // Wait until the WebSocket connection is open before sending data
  socket.onopen = () => {
    setInterval(() => {
      socket.send("getData");
    }, 100);
  };

  // Handle incoming messages
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    this.setState({ data: data, showGraph: true });
  };

  // Handle WebSocket errors
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Handle WebSocket closing
  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
}


  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
