    // utils/ExpressError.js
    class ExpressError extends Error {
        constructor(message="Something Went Wrong", statusCode=500, imgPath = "https://img.freepik.com/free-vector/tiny-people-examining-operating-system-error-warning-web-page-isolated-flat-illustration_74855-11104.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740") {
            super(message); // Call the parent Error constructor with the message
            this.statusCode = statusCode; // Add a custom statusCode property
            this.imgPath=imgPath;
        }
    }

    module.exports = ExpressError; // Export the custom error class