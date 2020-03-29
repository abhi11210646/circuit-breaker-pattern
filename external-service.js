const http = require("http");

/*
This service gives advice when someone request!
Advices are random in order!
*/

function getAdvices() {
    const advices = ["Stay Home!", "Wash Your Hand!", "Keep Social Distance!", "Cough in elbow!"];
    return advices[Math.floor(Math.random() * advices.length)];
}

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const advice = { "advice": getAdvices() };
    console.log("Sending advice from external service... ", advice);
    res.end(JSON.stringify(advice));
}).listen(3001, () => {
    console.log("Server is listening....");
});