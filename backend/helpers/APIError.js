const httpStatus = require('http-status');

/**
 * @extends Error
 */

//FACTORY DESIGN
class ExtendableError extends Error {
	constructor(message, status, isPublic) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = isPublic;
		Error.captureStackTrace(this, this.constructor); 
	}
}  // API Error handling 

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
	/**
	 * Creates an API error.
	 * @param {string} message - Error message.
	 * @param {number} status - HTTP status code of error.
	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
	 */
	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
		super(message, status, isPublic);
	} // API error Handling 
}


module.exports = APIError;
