const https = require('https');

const url = 'https://dummyjson.com/products';

module.exports = function getData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const products = JSON.parse(data);
            resolve(products);
          } catch (error) {
            reject(error);
          }
        });

        res.on('error', (error) => {
          reject(error);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
