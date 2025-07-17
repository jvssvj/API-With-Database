const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");

function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message })
    }

    if (err instanceof ConflictError) {
        return res.status(409).json({ message: err.message })
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message })
    }

    console.error(err)
    return res.status(500).json({ message: "Internal server error" })
}

module.exports = { errorHandler }