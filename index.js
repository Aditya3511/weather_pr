const fs = require("fs");
const http = require("http");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const cssFile = fs.readFileSync("style.css", "utf-8");

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
    return tempVal; // Return the original template if required data is missing
  }
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Latur&appid=223eaab7fba9a630445a6df4610292b5`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");

        // Write the HTML content to the response
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
        res.end();
      })
      .on("end", (err) => {
        if (err) {
          console.log("Connection closed due to errors:", err);
        }
        res.end();
      });
  } else if (req.url === "/style.css") {
    // Serve the CSS file as a static file
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(cssFile);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("File not found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:3000");
});
