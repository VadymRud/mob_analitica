import React, { Component } from 'react';
import {baseURL} from "./../conf"

class DatafeedLastDate extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {head: [], body: []}, interval: "1m"};

    this.setDataInterval = this.setDataInterval.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  loadData(){
    let url = window.location.hostname;
    fetch(`http://${url}:10020/ohlcs-last-date?interval=${this.state.interval}`)
      .then(response => response.json())
      .then(data => {console.log(11111111, data); return this.setState({data});});
  }
  setDataInterval(ev){
    this.setState({interval: ev.target.value});
  }

  render() {
    return (
      <div className="Datafeed1">
        <div>
          <input type="text" onChange={this.setDataInterval} value={this.state.interval}></input>
          <input type="button" onClick={this.loadData} value="Load data 1"></input>
        </div>
        
        <table>
          <thead>
            <tr>
              {this.state.data.head.map((item, index) => {
                return <td key = {index}>{item}</td>
              })}
            </tr>
          </thead>

          <tbody>
            {this.state.data.body.map((row, rowIndex) => {
              return <tr key={rowIndex}>
                {row.map((col, colIndex) => {
                  return <td key={colIndex}>{col}</td>
                })}
              </tr>
            })}
          </tbody>

        </table>
      </div>
    );
  }
}

export default DatafeedLastDate;