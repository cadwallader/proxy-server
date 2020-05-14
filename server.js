const http = require('http');
const express = require('express');
const app = express();

app.get('/:id?', (request, response) => {
  const bundle = [];
  let nComponents = 4;
  while (nComponents) {
    bundle.unshift(new Promise((resolve, reject) => {
      http.get('http://localhost:300' + nComponents-- + '/bundle.js', res => {
        const data = [];
        res.on('data', data.push.bind(data));
        res.on('error', reject);
        res.on('end', () => {
          resolve(data.join(''));
        });
      });
    }));
  }
  Promise.all(bundle).then(results => {
    response.end(`
      <!DOCTYPE html>
      <html>
      <head><title>trulia</title></head>
      <body>
        <div id="image-gallery"></div>
        <div id="app"></div>
        <div id="commentSection"></div>
        <div id="mortgage-calculator"></div>
        <script>
          ${results.join('')}
        </script>
      </body>
      </html>
    `);
  });
});

app.get('/mortgageId/:id', (request, response) => {
  http.get('http://localhost:3004/mortgageId/' + request.params.id, res => {
    const data = [];
    res.on('data', data.push.bind(data));
    res.on('end', () => {
      response.end(data.join(''));
    });
  });
});

app.get('/mortgageRate/:zip', (request, response) => {
  http.get('http://localhost:3004/mortgageRate/' + request.params.zip, res => {
    const data = [];
    res.on('data', data.push.bind(data));
    res.on('end', () => {
      response.end(data.join(''));
    });
  });
});

app.listen(3000, () => console.log('listening on port 3000'));
