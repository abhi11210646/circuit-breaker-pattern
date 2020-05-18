const axios = require("axios");
class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = 3;
        this.nextTry = 30;
        this.cooldownPeriod = 30; // sec :: wait this time to make next request
    }
    async callService(reqOptions, callback) {
        // Unique endpoint
        const endpoint = `${reqOptions.method}:${reqOptions.url}`;
        // Check if request can go through
        if (!this.canRequest(endpoint)) return callback();
        // Finally pass request
        try {
            console.log("[CircuitBreaker] Making request....");
            const response = await axios(reqOptions);
            // Everything is good so keep state CLOSED
            this.onSuccess(endpoint);
            return response.data;
        } catch (err) {
            console.log("[CircuitBreaker] Error in callService", err.message);
            this.onFailure(endpoint); // oh no!
            // return callback();
        }
    }
    canRequest(endpoint) {
        if (!this.states[endpoint]) this.initCircuit(endpoint);
        const state = this.states[endpoint];
        if (state.circuit === 'CLOSED') return true;
        if (state.nextTry <= this.nowDate) {
            state.circuit = 'HALF';
            console.log(`[CircuitBreaker]  Circuit state: ${state.circuit} for ${endpoint}`);
            return true;
        }
        return false;
    }
    initCircuit(endpoint) {
        this.states[endpoint] = { failure: 0, circuit: 'CLOSED' };
    }
    onSuccess(endpoint) {
        this.initCircuit(endpoint);
    }
    onFailure(endpoint) {
        const state = this.states[endpoint];
        state.failure += 1;
        if (state.failure >= this.failureThreshold) {
            state.circuit = 'OPEN';
            console.log(`[CircuitBreaker]  Circuit state: ${state.circuit} for ${endpoint}`);
            state.nextTry = this.nowDate + this.cooldownPeriod;
        }
    }
    get nowDate() {
        return ((new Date()) / 1000)
    }
}

module.exports = CircuitBreaker;