const http = require("http");

const CircuitBreaker = require("./../circuit-breaker");
const circuitBreaker = new CircuitBreaker();

http.createServer(async (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });

    let get_advice = await circuitBreaker.callService({ method: 'GET', url: "http://localhost:3001/" }, defaultAdvice);

    const advice = { "server_advice": get_advice.advice };

    console.log("Sending advice from server... ", advice);

    return res.end(JSON.stringify(advice));

}).listen(3000, () => {
    console.log("Server is listening....", 3000);
});

function defaultAdvice() {
    console.log("External service is down so sending.. default state.");
    return { advice: "Default Advice!!" };
}