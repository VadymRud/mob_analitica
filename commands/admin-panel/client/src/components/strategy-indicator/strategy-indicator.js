import './strategy-indicator.css';

import React, { Component } from 'react';

import { Line } from 'react-chartjs-2';
import spiner from './831.svg';
import {baseURL} from "./../conf"

const IcolumnsColor = {
  high: '#1cbbb3',
  low: '#f39600',
  close: '#e9079e',
  plus: '#45c23a',
  minus: '#dd4242',
  value: '#0b0fe6'
};
function ShortDat(date) {
  let dat = new Date(date);
  return dat.toLocaleDateString('ru').slice(0, 5);
}
function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ",1)";
}
function Preset(rows, lbls, indcr) {
  let preparD = lbls.map((el, i) => {
    return {
      label: el,
      fill: false,
      borderColor: IcolumnsColor[el] || dynamicColors(),
      // pointColor: dynamicColors(),
      // pointStrokeColor: "#fff",
      // pointHighlightFill: "#fff",
      // pointHighlightStroke: dynamicColors(),
      data: rows.map(it => it[i + 1])
    }
  });
  if (preparD[3].label === "plus" && preparD[4].label === "minus") {
    let reS = {
      maxHig: Math.max(...preparD[0].data.filter(el => el != null)),
      // minLow: Math.min(...preparD[1].data.filter(el=>el != null)),
      maxPl: Math.max(...preparD[3].data.filter(el => el != null)),
      // minMi: Math.min(...preparD[4].data.filter(el=>el != null))
    };
    preparD[3].data = preparD[3]
      .data.map(el => (el != null) ? (el * 1.5 * reS.maxHig / reS.maxPl) : null);
    preparD[4].data = preparD[4]
      .data.map(el => (el != null) ? (el * 1.5 * reS.maxHig / reS.maxPl) : null);
  }
  if (indcr=== 'rsi') {
    let reS = {
      maxHig: Math.max(...preparD[0].data.filter(el => el != null)),
      minLow: Math.min(...preparD[1].data.filter(el=>el != null)),
      maxVal: Math.max(...preparD[3].data.filter(el => el != null)),
      minMi: Math.min(...preparD[3].data.filter(el=>el != null))
    };
    // for (const key in reS) {
    //   if (reS.hasOwnProperty(key)) {
    //     console.log(key, ': ', reS[key]);
    //   }
    // }
    // console.log('reS.maxHig - reS.minLow: ', reS.maxHig - reS.minLow);
    // console.log('reS.maxVal - reS.minMi: ', reS.maxVal - reS.minMi);
    let koefScale = (reS.maxHig-reS.maxVal > 100) ? (reS.maxHig - reS.minLow)/(reS.maxVal - reS.minMi) : 1,
        hoist = (reS.maxHig-reS.maxVal > 100) ? ((reS.maxHig + reS.minLow)/2) - koefScale*(reS.maxVal + reS.minMi)/2 : 0; // (reS.maxHig + reS.minLow + reS.maxVal + reS.minMi)/2
    preparD[3].data = preparD[3]
      .data.map(el => (el != null) ? (el * (~~koefScale) + hoist) : null);
  }
  // 1.5 * maxH / maxI
  return preparD;
};
// const Grdata = {
//   labels: ["18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00"],
//   datasets: [
//     {
//       label: "high",
//       data: [86,114,106,106,107],
//     },
//     {
//       label: "low",
//       data: [85,110,101,100,106],
//     },
//   ],
// };
class StrategyIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      hardSt: {
        exchange: 'BITFINEX',
        base: 'BTC',
        quote: 'USD',
        interval: '1m'
      },
      data: { columns: [], rows: [] }, ind: '',
      listInds: ['', 'hlc', 'vortex', 'bollinger', 'sar', 'rsi', 'stochastic', 'psar', 'obv', 'macd', 'adx', 'cmf', 'kvo'],
      SomData: { labels: [], datasets: [] }
    };
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.setDataTimeframe = this.setDataTimeframe.bind(this);
  }

  handleChange(event) {
    if (event.target.value) {
      this.loadData(event.target.value);
      this.setState({ind: event.target.value});
    } else {
      console.assert(event.target.value, 'Some err: ', this.state);
    }
  }

  loadData(indicator) {
    let basUri = `${baseURL}/v1/strategy/tools/indicator?id=`+indicator;
    const options = this.state.hardSt;
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        basUri += `&${key}=${options[key]}`;
      }
    }
    this.setState({load: true});
    fetch(basUri)
      .then(response => {
        // console.log(response);
        return response.json();
      })
      .then(data => {
        this.setState({
          load: false,
          data,
          SomData: {
            labels: data.rows.map(el => ShortDat(el[0])),
            datasets: [...Preset(data.rows, data.columns.slice(1), indicator)]
          }
        })
      });
  }
  // setDataTimeframe(ev){
  //   this.setState({timeframe: ev.target.value});
  // }

  // <div id="chartContainer" style="height:350px;width:100%;"></div>

  render() {
    if (!(this.state && this.state.data && this.state.data.columns && this.state.data.rows)) {
      return (
        <div className="label">
          <input type="button" onClick={this.loadData} value="Run!"></input>
        </div>
      );
    }
    let inds = this.state.listInds;
    const options = this.state.hardSt;
    let inpData = Object.keys(options).map((item, i) => (
      <div className="grf-input" key={i}>
        <span className="input-label">{item} :</span>
        <span className="input-label">{options[item]}</span>
      </div>
    ));
    return (
      <div className="StrategyIndicator">
        {/* <div className="label">
          <input type="button" onClick={this.loadData} value="Run!"></input>
        </div> */}
        {/* <Line data={Grdata}
          width={60}
          height={20}
          options={{
            maintainAspectRatio: true
          }}
          redraw
        /> */}
        <div className="work-data-inds">
          <form>
            <div className="list-data">
              {inpData}
              <label className="grf-input">
              Pick indicator:
              <select value={this.state.ind} onChange={this.handleChange}>
                {inds.map(item => {
                  return <option key={item} value={item}>{item.toUpperCase()}</option>
                })}
              </select>
              {this.state.load&&<img src={spiner} alt="Load..."/>}
            </label>
            </div>
          </form>
          <Line data={this.state.SomData}
            width={60}
            height={20}
            options={{
              maintainAspectRatio: true
            }}
            redraw
          />
        </div>
        {/* this.state.ind && allInds.default[this.state.ind].
allInds.default[this.state.ind]. */}
        {<table>
          <thead>
            <tr>
              {this.state.data.columns.map(item => {
                return <td key={item}>{item}</td>
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.data.rows.map((row, rowIndex) => {
              return <tr key={rowIndex}>
                {row.map((item, tdi) => {
                  return <td key={tdi}>{item}</td>
                })}
              </tr>
            })}
          </tbody>

        </table>}
      </div>
    );
  }
}

export default StrategyIndicator;
// handleChange(event) {
//   const moks = allInds;
//   if (event.target.value) {
//     let val = event.target.value, indData = {
//       labels: moks[val].rows.map(el => ShortDat(el[0])),
//       datasets: [...Preset(moks[val].rows, moks[val].columns.slice(1))]
//     };
//     this.setState({
//       ind: val,
//       SomData: indData
//     });
//   }
// }
