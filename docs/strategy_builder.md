See screenShot.jpg for the mark up


## Portfolio 

* Save to portfolio
* popup with list of existing portfolios in 3 categories, live, paper, signals 
* and create new.


## Strategy

Save Strategy - Strategy Name, Avatar, Description and creation of strategy card

### Strategy Card

    1.	Avatar
    2.	Name
    3.	MsQ Score
    4.	Back Test / Real Mini Chart
    5.	Card Color Based on MsQ Score
        1.	Common - Grey 0 - 70
        2.	Rare - Blue 70 - 80
        3.	Epic - Purple 80 - 90
        4.	Legendary - Orange 90 - 100
    6.	Short Description
    7.	Release Date
    8.	Initial Balance
    9.	Profit (T/R) Theoretical / Real $/%
    10.	Disclaimer
    11.	Social
    12.	Preview / Close Buttons


### TODO: remake Strategies collection 

Add to each document Strategy Passport and Card data. Add indicators sets for Entry and Exit and their respective settings.


### Estimated data structure of Strategy for “Basic” Tier and “Active Trading” mode:
	
-	Id (auto generated)
-	UserId (ref to User)
-	Created : ‘Date’
-	Modified: ‘Date’
-	Name : ‘string’ (required)
-	Portfolio name : ‘string’ (ref to User Portfolio where strategy is assigned. Can be empty)
-	Avatar : ‘string’ (filename or filepath to avatar image)
-	Description: ‘string’
-	Short Description: ‘string’ (can be empty)
-	Disclaimer: ‘string’
-	Release date: ‘date’ (date user publishes strategy)
-	Tags : ‘array’ of ‘strings’ (can be empty)
-	Likes: ‘number’ (TODO: ask about possibility to store array of UserIds who liked)
-	Comments: ‘number’ (TODO: ask about structure of comments - possible array of arrays [UserId, comment ‘string’, postDate ‘date’] - or using a separate collection for comments with ref to strategyId)
-	MsQ Score : ‘number’ (mock the number / TODO: ask about math behind it)
-	Back Test / Real Mini Chart: array of arrays (TODO: ask about math behind it and structure of minichart. Possible use of a separate collection for test results with ref to strategyId)
-	Initial balance: ‘number’
-	Profit: ‘array’ of ‘numbers’ (Real/Theoretical two $ numbers / TODO: ask about math behind it)
-	Market Behaviour: array of strings (names of selected MBs)
-	TradeMode: ‘string’(one of four values Active Trading / Arbitrage / Scalping / Market Neutral)
-	Selected Asset: array (base, quote, exchange, interval)
-	Pinned Assets: array of arrays (for each pinned [base, quote, exchange, interval])
-	Buy/Sell: ‘string’ (type of trade)
-	Entry Condition: array of arrays (up to 3 ‘OR block’ arrays. Each block containing array of ‘AND’ indicatorIds)
-	Exit Condition: array of arrays (up to 3 ‘OR block’ arrays. Each block containing array of ‘AND’ indicatorIds)


## Information

In default state all the tool tips are active and information icon in active state as well. By pressing it user will disable all the tool tips.


##	Settings

1.	New
2.	Open
3.	Edit Passport (passport = strategy card)
4.	Save
5.	Save As
6.	Add To Portfolio
7.	Show Tool Tips
8.	Hide Tool Tips
9.	Publish
10.	Optimize
11.	Radar


##	Tiers - Each tier provide different user experience 

1.	Basic
2.	Pro
3.	Advance


##	Trade Mode
    
1.	Active Trading
2.	Arbitrage
3.	Scalping
4.	Market Neutral


##	Period

1.	1m
2.	3m
3.	6m
4.	1y


## Asset Class
        
1.	All
2.	Stock
3.	ETF
4.	Future
5.	Crypto
6.	Forex
7.	Bond
8.	CFD


##	Exchanges
    
1.	All
2.	Crypto
    1.	Binance
    2.	Bitfinex
    3.	Kraken
    4.	Bitmex


##	Asset Settings

1.	Favorites
2.	Show me 4/10/20
3.	Save as Template


##	Asset Search

1.	Categories
    1.	Asset Class
    2.	Exchange
2.	Fields
    1.	Asset Ticker
    2.	Asset Name
    3.	Score
    4.	Exchange


##	Indicator Settings

1.	Edit (Canvas Pro and Advance Modes)
2.	Save Global
3.	Save As
    1.	Name
    2.	Description
4.	Reset
5.	Delete
6.	Tool Tips

### Indicators collection

Indicators are items and will be sold in marketplace. Users can like and comment on indicators. TODO: create collection for indicators containing default settings and user created settings:

Estimated data structure:
-	indicatorId (auto generated)
-	UserId (ref to User who created or ‘default’ if system predefined settings/values)
-	baseName: ‘string’ (reference to parental indicator containing default settings / math logic)
-	userSpecifiedName: ‘string’ (default same as baseName. Changes if user uses “Save As” option)
-	Description: ‘string’
-	Tooltips: array of strings (tooltips for the specific indicator)
-	Settings: object (default or user created settings relevant to current indicator type)
-	Conditions:  object (user saved conditions for specific strategy)
-	Likes: ‘number’ (TODO: ask about possibility to store array of UserIds who liked)
-	Comments: ‘number’ (TODO: ask about structure of comments - possible array of arrays [UserId, comment ‘string’, postDate ‘date’] - or using a separate collection for comments with ref to indicatorId)


##	Indicator/Parameter Settings

1.	Change Min/Max
2.	Reset
3.	Lock / Unlock


##	Indicator/Condition Settings

1.	Change Max / Min
2.	Change
3.	Reset
4.	Lock / Unlock


##	Indicator/Condition/State

1.	Change


##	Chart / Interval

1.	1m
2.	5m
3.	15m
4.	30m
5.	1h
6.	2h
7.	4h
8.	8h
9.	12h
10.	1d
11.	1w
12.	1m


##	Chart Types

1.	Bar
2.	Line
3.	Candle Sticks


##	Compare

1.	Asset Search Functionality


##	Tools

1.	Trades
2.	Trades P&L
3.	Volume
4.	Volatility


##	Chart Settings

1.	Style
2.	Scales
3.	Background


##	Full Screen Mode

##	Multi Screen 

1.	One
2.	Two
3.	Three
4.	Four
5.	Five
6.	Six
7.	Custom


##	Overview

1.	Entry
    1.	Accuracy Long
    2.	Success Long
    3.	Accuracy Short
    4.	Success Short
    5.	Histogram (Big Box)
2.	Exit
    1.	Accuracy Long
    2.	Accuracy Short
    3.	In/Out Rate Short
    4.	In/Out Rate Long
    5.	Histogram (Big Box)
3.	Strategy
    1.	Accuracy Long
    2.	Success Long
    3.	Accuracy Short
    4.	Success Short
    5.	Histogram (Big Box)


##	Performance

1.	Profit
2.	Trades
3.	Win/Loss
4.	Max Drawdown
5.	Time in Trade


##	Report

1.	Description “Generated Automatically by MsQ”
2.	Statistics Summary
    1.	P&L Total
    2.	Avg Anual P&L
    3.	Max Drawdown
    4.	Risk/Reward Ratio
    5.	Biggest Loss
    6.	Avg Win
    7.	Avg Loss
    8.	Winning Month
    9.	Losing Month
    10.	Number of Trades
    11.	Number of Winning Trades
    12.	Time in Trade
3.	Chart
4.	Monthly P&L Table
5.	Model
    1.	Entry /  Exit  /  Strategy
6.	Signals
    1.	Date
    2.	Time
    3.	Asset
    4.	Direction (Buy/Sell)
    5.	Type (Entry/Exit)
    6.	Price
    7.	Profit
    8.	Balance


##	Chart Indicator Settings
1.	Visual Settings
    1.	Color
    2.	Width
    3.	Line Style


##	Entry


##	Exit


##	Strategy


##	Zoom In

1.	As Appears in MsQ Page


##	Optimize

1.	Goal Function
    1.	Total P&L
    2.	Risk/Reward Ratio
    3.	MsQ Score
    4.	Constraints
        1.	Num of Trades 200
        2.	Max Drawdown 10
        3.	Rolling 12 months Minimum P&L 18
        4.	Maximum Loss per Trade 1000$
        5.	Maximum Recovery Rate Time  1d
2.	Save Template
    1.	Name
    2.	Description
3.	Load
4.	Reset
5.	Run
6.	Report


##	Radar - Find Asset That Fits your Strategy

1.	Load Optimization Template
2.	Radar Settings 
    1.	Asset Class
    2.	Exchange
    3.	Market Cap Range
    4.	Volume Range
    5.	MsQ Volatility Range
    6.	Sentiment Range
    7.	MsQ Score 
3.	Save Template
    1.	Name
    2.	Description
4.	Load
5.	Run
6.	Report


##	Asset Analytics

1.	Mockup Attached



