import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Menu.css';
 
class Menu extends Component {
  render() {
    return (
        <div className="Menu">
            <ul>
              <li><Link to='/datafeed-last-date'>Datafeed Control</Link></li>
              <li><Link to='/datafeed-count'>Assets counts for a periof of time</Link></li>
              <li><Link to='/strategy-backtest'>Strategy Backtest</Link></li>
              <li><Link to='/strategy-indicator'>Strategy Indicators</Link></li>
            </ul>
        </div>
    );
  }
}

export default Menu;
