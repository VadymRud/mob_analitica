const apiDoc = {
  openapi: '3.0.2',
  info: {
    title: 'MagicSquare Platform API',
    version: '0.1',
  },
  paths: {},
  components: {
    schemas: {
      indicator: {
        type: 'object',
        properties: {
          timeframes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                },
                open: {
                  type: 'number',
                },
                high: {
                  type: 'number',
                },
                low: {
                  type: 'number',
                },
                close: {
                  type: 'number',
                },
                indicators: {
                  type: 'array',
                },
              },
            },
          },
        },
      },

      main_chart: {
        type: 'object',
        properties: {
          timeframes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                dateStart: {
                  type: 'string',
                },
                open: {
                  type: 'number',
                },
                high: {
                  type: 'number',
                },
                low: {
                  type: 'number',
                },
                close: {
                  type: 'number',
                },
              },
            },
          },
          line: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date:{
                  type: 'string',
                },
                value: {
                  type: 'number',
                },
                // visible: { !!!
                //   type: 'boolean'
                // }
              },
            },
          },
          trades: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: {
                  type: 'object',
                  properties: {
                    order: {
                      type: 'string',
                      enum: ['buy', 'sell'],
                    },
                    signal: {
                      type: 'string',
                      enum: ['Breakout Entry', 'Breakout Exit', 'Take Profit', 'Gradual Take Profit', 'Stop Loss', 'Trailling Stop', 'Martingale'],
                    },
                    price: {
                      type: 'number',
                    },
                    lineVertex: {
                      type: 'number',
                    },
                    size: {
                      type: 'number',
                    },
                    date:{
                      type: 'string',
                    },
                  },
                },
                end: {
                  type: 'object',
                  properties: {
                    order: {
                      type: 'string',
                      enum: ['buy', 'sell'],
                    },
                    signal: {
                      type: 'string',
                      enum: ['Breakout Entry', 'Breakout Exit', 'Take Profit', 'Gradual Take Profit', 'Stop Loss', 'Trailling Stop', 'Martingale'],
                    },
                    price: {
                      type: 'number',
                    },
                    lineVertex: {
                      type: 'number',
                    },
                    size: {
                      type: 'number',
                    },
                    date:{
                      type: 'string',
                    },
                  },
                },
                leverage:{
                  type: 'number',
                },
                pnl: {
                  type: 'number',
                },
                trade: {
                  type: 'string',
                  enum: ['short', 'long'],
                },
                signalSell: {
                  type: 'string',
                },
                signalBuy: {
                  type: 'string',
                },
                priceBuy: {
                  type: 'number',
                },
                priceSell: {
                  type: 'number',
                },
                timeIn: { // duration   (ms)
                  type: 'number',
                },
                // size: { // use start.size
                //   type: 'number'
                // },
                minichart: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: {
                        type: 'string',
                      },
                      pnl: {
                        type: 'number',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      my_portfolios: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          totalPnL: {
            type: 'number',
          },
          change24h: {
            type: 'number',
          },
          breakouts30d: {
            type: 'object',
            properties: {
              all: {
                type: 'number',
              },
              catched: {
                type: 'number',
              },
            },
          },
          accuracyRate: {
            type: 'number',
          },
          maxDrawdown: {
            type: 'number',
          },
          // sharpRatio: {   ??? is this value required as well as for strategies
          //   type: 'number'
          // },
          msqScore: {
            type: 'number',
          },
          minichart24h: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                },
                pnl: {
                  type: 'number',
                },
              },
            },
          },
          strategies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
                totalPnL: {
                  type: 'number',
                },
                change24h: {
                  type: 'number',
                },
                breakouts30d: {
                  type: 'object',
                  properties: {
                    all: {
                      type: 'number',
                    },
                    catched: {
                      type: 'number',
                    },
                  },
                },
                accuracyRate: {
                  type: 'number',
                },
                maxDrawdown: {
                  type: 'number',
                },
                sharpRatio: {
                  type: 'number',
                },
                msqScore: {
                  type: 'number',
                },
                minichart24h: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: {
                        type: 'string',
                      },
                      pnl: {
                        type: 'number',
                      },
                    },
                  },
                },
                assets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      category: {
                        type: 'string',
                        enum: ['Crypto', 'Stock', 'FX', 'Commodity', 'ETF', 'Bond'],
                      },
                      totalPnL: {
                        type: 'number',
                      },
                      change24h: {
                        type: 'number',
                      },
                      numOfTrades7d: {
                        type: 'number',
                      },
                      breakouts30d: {
                        type: 'object',
                        properties: {
                          all: {
                            type: 'number',
                          },
                          catched: {
                            type: 'number',
                          },
                        },
                      },
                      // sharpRatio: { ??? is this value required as well as for strategies
                      //   type: 'number'
                      // },
                      accuracyRate: {
                        type: 'number',
                      },
                      maxDrawdown: {
                        type: 'number',
                      },
                      minichart24h: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            date: {
                              type: 'string',
                            },
                            pnl: {
                              type: 'number',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      academy: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          views: {
            type: 'string',
          },
          shared: {
            type: 'string',
          },
          likes: {
            type: 'string',
          },
          published: {
            type: 'string',
          },
        },
      },
      zoom_in: {
        type: 'object',
        properties: {
          model: {
            type: 'object',
            properties: {
              accuracyRate: {
                type: 'number',
              },
              breakouts: {
                type: 'object',
                properties: {
                  all: {
                    type: 'number',
                  },
                  catched: {
                    type: 'number',
                  },
                },
              },
              avgLeverage: {
                type: 'number',
              },
              avgRecoveryTime: {
                type: 'number',
              },
              avgTimeInTrade: {
                type: 'number',
              },
              entryAccuracyRate: {
                type: 'number',
              },
              exitAccuracyRate: {
                type: 'number',
              },
            },
          },
          trading: {
            type: 'object',
            properties: {
              profit: {
                type: 'object',
                properties: {
                  value: {
                    type: 'number',
                  },
                  percentage: {
                    type: 'number',
                  },
                },
              },
              tradesNum: {
                type: 'object',
                properties: {
                  all: {
                    type: 'number',
                  },
                  catched: {
                    type: 'number',
                  },
                },
              },
              winLossRatio: {
                type: 'number',
              },
              avgOrderSize: {
                type: 'number',
              },
              avgSlippage: {
                type: 'number',
              },
              shortPnL: {
                type: 'number',
              },
              longPnL: {
                type: 'number',
              },
              maxDrawdown: {
                type: 'number',
              },
              avgMarketDepthRatio: {
                type: 'number',
              },
              avgMarketDepthSize: {
                type: 'number',
              },
              avgBreakout: {
                type: 'object',
                properties: {
                  all: {
                    type: 'number',
                  },
                  catched: {
                    type: 'number',
                  },
                },
              },
              marketSentiment30d:{
                type: 'string',
              },
              peakToValleyRation: {
                type: 'number',
              },
            },
          },
          market: {
            type: 'object',
            properties: {
              volume24h: {
                type: 'number',
              },
              volatility: {
                type: 'object',
                properties: {
                  all: {
                    type: 'number',
                  },
                  catched: {
                    type: 'number',
                  },
                },
              },
              avgSpread: {
                type: 'number',
              },
            },
          },
        },
      },
      my_assets: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          icon: {
            type: 'string',
          },
          category: {
            type: 'string',
            enum: ['Crypto', 'Stock', 'FX', 'Commodity', 'ETF', 'Bond'],
          },
          totalPnL: {
            type: 'number',
          },
          change24h: {
            type: 'number',
          },
          accuracyRate: {
            type: 'number',
          },
          numOfTrades7d: {
            type: 'number',
          },
          breakouts30d: {
            type: 'object',
            properties: {
              all: {
                type: 'number',
              },
              catched: {
                type: 'number',
              },
            },
          },
          minichart24h: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
              },
              pnl: {
                type: 'number',
              },
            },
          },
        },
      },

      // assets_by_score: {
      //   assets: {
      //     type: 'array',
      //     items: {
      //       type: 'string',
      //       minichart24h: {
      //         type: 'array',
      //         items: {
      //           type: 'number',
      //         },
      //       },
      //     },
      //   },  
      // },

      featured_strategies: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          // performanceChart: {
          // },
          followers: {
            type: 'number',
          },
          trades: {
            type: 'number',
          },
          funds: {
            type: 'number',
          },
          return: {
            type: 'number',
          },
          drawdown: {
            type: 'number',
          },
          msqScore: {
            type: 'number',
          },
          listed: {
            type: 'string',
          },
        },
      },

      strategy_risk: {
        type: 'object',
        properties: {
          msqScore: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          riskReward: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          averageLeverage: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          allTimeHigh: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          timeSinceATH: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          biggestWinning: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          biggestLosing: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
          pickToValley: {
            type: 'object',
            properties: {
              max:{
                type: 'number',
              },
              actual:{
                type: 'number',
              },
            },
          },
        },
      },

    },
  },
};

module.exports = apiDoc;
