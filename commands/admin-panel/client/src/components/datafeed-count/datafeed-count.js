import React, { Component } from 'react';
import './datafeed-count.css';

class DatafeedCount extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {head: [], body: []}, interval: "1m", dateStart: "", dateFinish: ""};

    this.setDataInterval  = this.setDataInterval.bind(this);
    this.setDataStartDate  = this.setDataStartDate.bind(this);
    this.setDataFinishDate = this.setDataFinishDate.bind(this);
    this.loadData          = this.loadData.bind(this);
  }

  loadData(){
    let url = window.location.hostname;
    fetch(`http://${url}:10020/ohlcs-count?interval=${this.state.interval}&dateStart=${this.state.dateStart}&dateFinish=${this.state.dateFinish}`)
    // fetch(`http://127.0.0.1:10020/ohlcs-count?interval=${this.state.interval}&dateStart=${this.state.dateStart}&dateFinish=${this.state.dateFinish}`)
    .then(response => response.json())
    .then(data => {console.log(11111111, data); return this.setState({data});});
  }
  setDataInterval(ev){
    this.setState({interval: ev.target.value});
  }
  setDataStartDate(ev){
    this.setState({dateStart: ev.target.value});
  }
  setDataFinishDate(ev){
    this.setState({dateFinish: ev.target.value});
  }

  render() {
    return (
      <div className="DatafeedCount">
        <div className="label">
          <label>Interval: </label><input type="text" onChange={this.setDataInterval} value={this.state.interval}></input><br />
          <label>From: </label><input type="datetime-local" onChange={this.setDataStartDate} value={this.state.dateStart}></input><br />
          <label>To: </label><input type="datetime-local" onChange={this.setDataFinishDate} value={this.state.dateFinish}></input><br />
          <input type="button" onClick={this.loadData} value="Load counts"></input>
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

export default DatafeedCount;