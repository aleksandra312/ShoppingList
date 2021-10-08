class ExpressError extends Error {
    constructor(msg, status) {
        super();
        this.message = msg;
        this.status = status;
        console.log(this.stack);
    }
}

module.exports = ExpressError;