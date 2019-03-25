const apiDoc = {
  openapi: '3.0.2',
  info: {
    title: 'MagicSquare data admin API',
    version: '0.1',
  },
  paths: {},
  
  components: {
    schemas: {
      OHLCsLastDate: {
        type: 'object',
        properties: {
          exchange: {
            description: '',
            type: 'string'
          },
          base: {
            description: '',
            type: 'string'
          },
          quote: {
            description: '',
            type: 'string'
          },
          lastDate: {
            description: '',
            type: 'string'
          },
        },
        required: ['exchange', 'base', 'quote', 'lastDate']
      },
      OHLCs: {
        type: 'object',
        properties: {
          Exchange: {
            description: '',
            type: 'string'
          },
          Base: {
            description: '',
            type: 'string'
          },
          Quote: {
            description: '',
            type: 'string'
          },
          TimeStart: {
            description: '',
            type: 'string'
          },
        },
        required: ['Exchange', 'Base', 'Quote', 'TimeStart']
      },
      countOhlcs: {
        type: 'object',
        properties: {
          exchange: {
            description: '',
            type: 'string'
          },
          base: {
            description: '',
            type: 'string'
          },
          quote: {
            description: '',
            type: 'string'
          },
          dateStart: {
            description: '',
            type: 'string'
          },
          dateFinish: {
            description: '',
            type: 'string'
          },
          count: {
            description: '',
            type: 'string'
          },
        },
        required: ['exchange', 'base', 'quote', 'count', 'dateStart', 'dateFinish']
      },
    }
  }

};
   
module.exports = apiDoc;