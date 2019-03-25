import './App.css';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import Dashboard from './components/dashboard/Dashboard'
import DatafeedCount from './components/datafeed-count/datafeed-count'
import DatafeedLastDate from './components/datafeed-last-date/datafeed-last-date'
import Menu from './components/menu/Menu'
import StrategyBacktest from './components/strategy-backtest/strategy-backtest'
import StrategyIndicator from './components/strategy-indicator/strategy-indicator'

/**
 * App component.
 */

 class App extends Component {
  /**
   * @return {Component}
   */
  render() {
    return (
      <div className="App">
        <Menu />
        <div className="rt-cnt">
          <Switch>
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/datafeed-last-date' component={DatafeedLastDate} />
            <Route path='/datafeed-count' component={DatafeedCount} />
            <Route path='/strategy-backtest' component={StrategyBacktest} />
            <Route path='/strategy-indicator' component={StrategyIndicator} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
