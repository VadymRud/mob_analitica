import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
// import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
// import classNames from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { round } from './../../utils'
import { SnackbarProvider, withSnackbar } from 'notistack';
//import { AutoSizer, Column, Table } from 'react-virtualized';
import "./strategy-backtest.css"


import {baseURL} from "../conf"
//import WTable from "./table"

let id        = 'test_vortex';   
let exchange  = 'BITFINEX';      
let base      = 'BTC';
let quote     = 'USD';
let timeframe = '1m';
let body = `{
  "initialBalance": 10000,
  "indicatorsDefinition": {
    "vortex": ["vortex", 13]
  },
  "decisions": [
    {
      "condition": ["cross", ["ind", "vortex", 0], ["ind", "vortex", 1]],
      "action":    "buyStrong"
    },
    {
      "condition": ["cross", ["ind", "vortex", 1], ["ind", "vortex", 0]],
      "action":    "sellStrong"
    }
  ]
}`

/**
 * Get debug description.
 * @param {Object} theme - theme provided by materialUI
 * @re
 */

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    margin: theme.spacing.unit,
  },
  textField: {
    // margin: theme.spacing.unit,
    width: "600px",
    border: "1px solid #aaa"
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

//let url = window.location.hostname;

class StrategyBacktest extends Component {
  constructor(props) {
    super(props);

    this.state             = {data: {columns: [], rows: [], debugId: ""}, id, exchange, base, quote, timeframe, body, modalOpen: false, openAsset: false, assets: [], selectedAsset: {}, modalData: []};
    this.setDataInterval   = this.setDataInterval.bind(this);
    this.loadData          = this.loadData.bind(this);
    this.handleClick       = this.handleClick.bind(this);
    this.handleModalClose  = this.handleModalClose.bind(this);
    this.handleAssetSelect = this.handleAssetSelect.bind(this);
  }

  // handleClick(row){
  //   //console.log(row);
  //   let url = window.location.hostname;
  //   fetch(`http://${url}:10010/v1/strategy/tools/debug?exchange=${this.state.exchange}&base=${this.state.base}&quote=${this.state.quote}&timeframe=${this.state.timeframe}`)
  //     .then(response => response.json())
  //     .then(data => {this.setState({data});});  // console.log(22222222, data); 
  // }

  componentDidMount(){
    fetch(`${baseURL}/v1/strategy/tools/assets`)
      .then(response => response.json())
      .then(data => { this.setState({ assets: data, selectedAsset: data[0] || {} })})
      .catch(err => console.error(err));
  }

  handleClick(row){
    //console.log(row);
    const that = this;
    fetch(`${baseURL}/v1/strategy/tools/debug?debug_id=${this.state.data.debugId}&date=${row.date}`)
      .then(response => {
        if(response.status !== 200) {
          response.text().then(text => {
            that.props.enqueueSnackbar(text, { variant: "error" }) 
          });
          return Promise.reject();
        }
        return response;
      })
      .then(response => response.json())
      //.then(data => {this.setState({data});});  // console.log(22222222, data); 
      .then(data => {console.log(data); this.setState({ modalOpen: true,  modalData: data})})
      .catch(err => console.error(err));
  }

  handleAssetSelect(event){
    const asset = event.target.value;
    this.setState({ selectedAsset:  asset, base: asset.base, quote: asset.quote, exchange: asset.exchange});
    //console.log(event.target.value);
  }

  handleAssetClose(){
    this.setState({ assetOpen: false });
  }

  handleModalClose() {
    this.setState({ modalOpen: false });
  };

  loadData(){
    const that = this;
    try {
      const body = JSON.parse(this.state.body)
      fetch(`${baseURL}/v1/strategy/tools/debug?exchange=${this.state.exchange}&base=${this.state.base}&quote=${this.state.quote}&timeframe=${this.state.timeframe}`, 
        {
        method: 'POST',
        body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then(data => {this.setState({data: data.debug});}).catch((err) => {
          that.props.enqueueSnackbar(String(err), { variant: "error" });
        })
        .catch(err => console.error(err));
    } catch(e) {
        that.props.enqueueSnackbar(String(e), { variant: "error" });
    }
    // Promise.resolve(JSON.parse(this.state.body))
    // .then(() => {

    // })
    // .catch((error) => {
    // })
    //const body = 
  }

  setDataInterval(ev){
    this.setState({interval: ev.target.value});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="StrategyBacktest">
        <div style={{width: "100%", display: "flex"}}>
          <div>
            <TextField
              className={classes.textField}
              placeholder="body"
              multiline={true}
              rows={10}
              onChange={ev => {this.setState({
                body: ev.target.value,
              })}}
              value={this.state.body}
            />
          </div>
          <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="assetSelect">Asset</InputLabel>
              <Select
                open={this.state.assetOpen}
                onClose={this.handleClose}
                // onOpen={this.handleOpen}
                value={this.state.selectedAsset}
                onChange={this.handleAssetSelect}
                inputProps={{
                  name: 'asset',
                  id: 'assetSelect',
                }}
              >
                {
                  this.state.assets.map((asset, index) => (
                    <MenuItem value={asset}>{`${asset.exchange} | ${asset.base} | ${asset.quote}`}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            {/* <br/>
            <Input
              placeholder="interval"
              defaultValue={this.state.timeframe}
              onChange={(ev) => this.setState({timeframe: ev.target.value})}
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
            /> */}
            <br />
            <Button variant="contained" color="primary" onClick={this.loadData} className={classes.button}>
              Run!
            </Button>
          </div>
        </div>
        
        <Paper className={`${classes.root} TableContainer`}>
          {this.state.data && this.state.data.rows && this.state.data.columns &&
          <Table className="BackendTableFixedHead">
            <TableHead>
              <TableRow>
                {/* {this.state.data.columns.map(item => {
                  return <TableCell key={item}>{item}</TableCell>
                })} */}

                <TableCell>N</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>High</TableCell>
                <TableCell>Low</TableCell>
                <TableCell>Close</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Enter Lots</TableCell>
                <TableCell>Action Lots</TableCell>
                <TableCell>Final Lots</TableCell>
                <TableCell>Final Capital</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {this.state.data.rows.map((row, rowIndex) => {
                  return <TableRow 
                            key={rowIndex}
                            onClick={this.handleClick.bind(null, row)} 
                            hover
                          >
                    {/* {this.state.data.columns.map(item => {
                      return <TableCell padding="none" align="left" key={item} className={classes.td}>{row[item]}</TableCell>
                    })} 

                    */}

                    <TableCell padding="none" className={classes.td}>{row.n}</TableCell>
                    <TableCell padding="none" className={classes.td}>{dateFormat(row.date)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.high)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.low)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.close)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{row.action}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.enterLots)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.actionLots)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.finalLots)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{round(row.finalCapital)}</TableCell>
                    <TableCell padding="none" className={classes.td}>{row.details}</TableCell>
                  </TableRow>
                })}
            </TableBody>
          </Table>
        }
        </Paper>
        {/* <Paper style={{ height: "100vh", width: '100%' }} className={classes.root}>
          <WTable
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            onRowClick={event => console.log(event)}
            columns={columns}
          />
        </Paper> */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="subtitle1" id="simple-modal-description">
            <pre>
              <code>
              <Table style={{height: "100%"}}>
                <TableHead>
                  <TableRow>
                      {/* {this.state.data.columns.map(item => {
                        return <TableCell key={item}>{item.toUpperCase()}</TableCell>
                      })} */}
                      <TableCell>N</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Open</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>Close</TableCell>
                      <TableCell>Other</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.modalData.map((row, rowIndex) => {
                      let [n, date, open, high, low, close] = [row.n, row.date, row.open, row.high, row.low, row.close];
                      delete row.n;
                      delete row.date;
                      delete row.open;
                      delete row.high;
                      delete row.low;
                      delete row.close;
                      delete row.zigzag;

                      return <tr 
                                key={rowIndex}
                              >
                        {/* {this.state.data.columns.map(item => {
                          return <TableCell padding="none" align="left" key={item} className={classes.td}>{row[item]}</TableCell>
                        })} */}
                        <td>{n}</td>
                        <td>{dateFormat(date)}</td>
                        <td>{open}</td>
                        <td>{high}</td>
                        <td>{low}</td>
                        <td>{close}</td>
                        <td><div  className='cellbreak'>{JSON.stringify(row).replace(',', ', ')}</div></td>

                      </tr>
                    })}
                </TableBody>
              </Table>
              </code>
            </pre>
            </Typography>
            {/* <SimpleModalWrapped /> */}
          </div>
        </Modal>
      </div>
    );
  }
  // propTypes = {
  //   classes: PropTypes.object.isRequired,
  // };
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    // width: '100%',

    transform: `translate(-${top}%, -${left}%)`,
    width: "calc(100% - 150px)",
    // height: "90vh",
    // overflowY: "scroll",
  };
}

const SnStrategyBacktest = withSnackbar(withStyles(styles)(StrategyBacktest));

function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <SnStrategyBacktest />
    </SnackbarProvider>
  );
}

function dateFormat(dateStr) {
  // console.log((dateStr + " --> "), (dateStr + "").replace('T', ' '));
  return (dateStr + "").replace('T', ' ').replace(/\..*/, '');
}

export default IntegrationNotistack;

export {StrategyBacktest};
