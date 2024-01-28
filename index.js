// const fs = require("fs");
// const http = require("http");
// const requests = require("requests");
// const path = require("path");

// const homeFilePath = path.join(__dirname, 'public', 'home.html');
// const homeFile = fs.readFileSync(homeFilePath, 'utf-8');

// const cssFilePath = path.join(__dirname, 'public', 'style.css');
// const cssFile = fs.readFileSync(cssFilePath, 'utf-8');

// const replaceVal = (tempVal, orgVal) => {
//   if (orgVal && orgVal.main && orgVal.main.temp) {
//     let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
//     temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
//     temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
//     temperature = temperature.replace("{%location%}", orgVal.name);
//     temperature = temperature.replace("{%country%}", orgVal.sys.country);
//     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

//     return temperature;
//   } else {
//     return tempVal;
//   }
// };

// const server = http.createServer((req, res) => {
//   if (req.url === '/') {
//     requests(
//       'https://api.openweathermap.org/data/2.5/weather?q=pune&appid=223eaab7fba9a630445a6df4610292b5'
//     )
//       .on('data', (chunk) => {
//         const objdata = JSON.parse(chunk);
//         const arrData = [objdata];
//         const realTimeData = arrData
//           .map((val) => replaceVal(homeFile, val))
//           .join('');

//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write(realTimeData);
//         res.end();
//       })
//       .on('end', (err) => {
//         if (err) {
//           console.log('Connection closed due to errors:', err);
//         }
//         res.end();
//       });
//   } else if (req.url === '/style.css') {
 
//     res.writeHead(200, { 'Content-Type': 'text/css' });
//     res.write(cssFile);
//     res.end();
//   } else if (req.url === '/images/bg_img.jpg') {

//     const imagePath = path.join(__dirname, 'public', 'images', 'bg_img.jpg');
//     const imageStream = fs.createReadStream(imagePath);
//     imageStream.pipe(res);
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/html' });
//     res.end('File not found');
//   }
// });

// server.listen(3000, '127.0.0.1', () => {
//   console.log('Server is running on http://127.0.0.1:3000');
// });
/*
const fs = require("fs");
const http = require("http");
const requests = require("requests");
const path = require("path");

const homeFilePath = path.join(__dirname, 'public', 'home.html');
const homeFile = fs.readFileSync(homeFilePath, 'utf-8');

const cssFilePath = path.join(__dirname, 'public', 'style.css');
const cssFile = fs.readFileSync(cssFilePath, 'utf-8');

const replaceVal = (tempVal, orgVal) => {
  if (orgVal && orgVal.main && orgVal.main.temp) {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
  } else {
    return tempVal;
  }
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    if (req.method === 'POST') {
      let searchQuery = '';

      req.on('data', (chunk) => {
        searchQuery += chunk.toString();
      });
      
      req.on('end', () => {
        
        if (searchQuery == "city=pune") {
          console.log(searchQuery);
          requests(
            'https://api.openweathermap.org/data/2.5/weather?q=pune&appid=223eaab7fba9a630445a6df4610292b5'
          )
            .on('data', (chunk) => {
              try {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                  .map((val) => replaceVal(homeFile, val))
                  .join('');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
                res.end();
              } catch (error) {
                console.error('Error parsing API response:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
              }
            })
            .on('end', (err) => {
              if (err) {
                console.error('Connection closed due to errors:', err);
              }
            });
        } else {
          console.log( searchQuery.substring(5,searchQuery.length));
          requests(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery.substring(5,searchQuery.length))}&appid=223eaab7fba9a630445a6df4610292b5`
          )
            .on('data', (chunk) => {
              try {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                  .map((val) => replaceVal(homeFile, val))
                  .join('');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
                res.end();
              } catch (error) {
                console.error('Error parsing API response:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
              }
            })
            .on('end', (err) => {
              if (err) {
                console.error('Connection closed due to errors:', err);
              }
            });
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(homeFile);
      res.end();
    }
  } else if (req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.write(cssFile);
    res.end();
  } else if (req.url === '/images/bg_img.jpg') {
    const imagePath = path.join(__dirname, 'public', 'images', 'bg_img.jpg');
    const imageStream = fs.createReadStream(imagePath);

    imageStream.on('error', (error) => {
      console.error('Error reading image file:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('Internal Server Error');
    });

    imageStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('File not found');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
*/

const fs = require("fs");
const http = require("http");
const requests = require("requests");
const path = require("path");

const homeFilePath = path.join(__dirname, 'public', 'home.html');
const homeFile = fs.readFileSync(homeFilePath, 'utf-8');

const cssFilePath = path.join(__dirname, 'public', 'style.css');
const cssFile = fs.readFileSync(cssFilePath, 'utf-8');

/*const replaceVal = (tempVal, orgVal) => {
  if (orgVal && orgVal.main && orgVal.main.temp) {
    
   
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
  } else {
    return tempVal;
  }
};*/

const replaceVal = (tempVal, orgVal) => {
  if (orgVal && orgVal.main && orgVal.main.temp) {
    // Convert Kelvin to Celsius
    const celsiusTemp = orgVal.main.temp - 273.15;

    let temperature = tempVal.replace("{%tempval%}", celsiusTemp.toFixed(2)); // Round to 2 decimal places
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
  } else {
    return tempVal;
  }
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    if (req.method === 'GET') {
      // Default city is "pune" for GET requests to '/'
      requests(
        'https://api.openweathermap.org/data/2.5/weather?q=pune&appid=223eaab7fba9a630445a6df4610292b5'
      )
        .on('data', (chunk) => {
          try {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData
              .map((val) => replaceVal(homeFile, val))
              .join('');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(realTimeData);
            res.end();
          } catch (error) {
            console.error('Error parsing API response:', error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Internal Server Error');
          }
        })
        .on('end', (err) => {
          if (err) {
            console.error('Connection closed due to errors:', err);
          }
        });
    } else if (req.method === 'POST') {
      let searchQuery = '';

      req.on('data', (chunk) => {
        searchQuery += chunk.toString();
      });

      req.on('end', () => {
        console.log( searchQuery.substring(5,searchQuery.length));
          requests(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery.substring(5,searchQuery.length))}&appid=223eaab7fba9a630445a6df4610292b5`
          )
            .on('data', (chunk) => {
              try {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                  .map((val) => replaceVal(homeFile, val))
                  .join('');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
                res.end();
              } catch (error) {
                console.error('Error parsing API response:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
              }
            })
            .on('end', (err) => {
              if (err) {
                console.error('Connection closed due to errors:', err);
              }
            });
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('File not found');
    }
  } else if (req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.write(cssFile);
    res.end();
  } else if (req.url === '/images/bg_img.jpg') {
    const imagePath = path.join(__dirname, 'public', 'images', 'bg_img.jpg');
    const imageStream = fs.createReadStream(imagePath);

    imageStream.on('error', (error) => {
      console.error('Error reading image file:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('Internal Server Error');
    });

    imageStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('File not found');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
