const fetch = require('node-fetch')
const fs = require('fs')
const yaml = require('js-yaml')

const CRYPTOCOMPARE_MIN_ADDRESS = 'https://min-api.cryptocompare.com/data/';

async function fetchPrices(symbol, tsyms) {
  return easyGet(
    CRYPTOCOMPARE_MIN_ADDRESS + 'pricemulti?fsyms=' + symbol + '&tsyms=' + tsyms
  )
}
async function fetchHistorical(symbol) {
  return await easyGet(
    CRYPTOCOMPARE_MIN_ADDRESS +
      'histoday?fsym=' +
      symbol +
      '&tsym=' +
      'USD' +
      '&limit=31'
  );

}

const easyGet = async (url) => {
  return fetch(url)
    .then(res => {
      return res.json()
    });    
}

const main = async () => {
  fetchData().then((outputData) => {
    const data = outputData
    fs.writeFile('./data.yaml', yaml.safeDump(data), 'utf8', function(err, out) {
      if(err) console.log(err)
      console.log('Finished successfully')
    })
  }).catch(err => {
    console.log('err', err)
  })
}

async function fetchData () {
  var fsyms = ['ETH', 'BAT', 'AURA', 'AUTO', 'AVA', 'AVT', 'AXPR']; /// THIS IS FROM
  var tsyms = ['USD', 'ETH'];
  var tsyms2 = ['EUR', 'CNY'];
  var tsyms3 = ['GBP'];
  // use a map, map over fsyms, and write it as a Promise (array of promises)
  return await Promise.all(
    fsyms.map(async fsym => {
        try {
          return await Promise.all(
            [fetchPrices(fsym, tsyms), fetchPrices(fsym, tsyms2), fetchPrices(fsym, tsyms3), fetchHistorical(fsym)]
          ).then(([first, second, third, fourth]) => {
              return ({
                token: fsym,
                success: true,
                first,
                second,
                third,
                fourth
              })
          })
        } catch (err) {
          return ({
            token: fsym,
            success: false,
            errorMessage: err
          })
        }
    })
  )
}

main();


  /*    
      let percent_change = {};
      if (Object.values(price)[0] === 'Error') {
        percent_change = { Error: 'Possibly dead token.' };
      } else {
        percent_change = {
          '24hChange':
            ((Object.values(price)[0].USD - historical.Data[1]['close']) /
              historical.Data[1]['close']) *
            100,
          '1wChange':
            (Object.values(price)[0].USD - historical.Data[7]['close']) /
            historical.Data[7]['close'],
          '1mChange':
            (Object.values(price)[0].USD - historical.Data[31]['close']) /
            historical.Data[31]['close']
        };
      }
      //console.log('percent change ', percent_change['24hChange']);
      if (Object.values(price)[0] === 'Error') {
        price = ['No price available.'];
        price2 = ['No price available.'];
        price3 = ['No price available.'];
      }
      let monolith_object = {
        USD: Object.values(price)[0].USD,
        ETH: Object.values(price)[0].ETH,
        EUR: Object.values(price2)[0].EUR,
        CNY: Object.values(price2)[0].CNY,
        GBP: Object.values(price3)[0].GBP,
        '1DayAgo': historical.Data[1],
        '1WeekAgo': historical.Data[7],
        '1MonthAgo': historical.Data[31],
        '24hChange': percent_change['24hChange'],
        '1wChange': percent_change['1wChange'],
        '1mChange': percent_change['1mChange']
      };
      console.log('Last one to break:', fsym);
      console.log(monolith_object);

      if (token_descriptions.hasOwnProperty(fsym)) {
        let description = {};
        arrayIsoInfo[fsym] = {
          test: [
            monolith_object,
            (description = { description: token_descriptions[fsym] })
          ]
        };
      } else {
        arrayIsoInfo[fsym] = {
          fsym: [monolith_object]
        };
      }

      console.log(arrayIsoInfo);
      return arrayIsoInfo;
    })
  ).then(data)
  Promise.all(results).then(data => {
    console.log(data);
    res.status(200).send(results);
  });*/