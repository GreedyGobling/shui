import { sendResponse } from '../responses/index.mjs';

export const errorHandler = () => ({
    onError: (handler) => {
        const error = handler.error;
        const statusCode = error.statusCode === 422
            && error.cause?.package === "@middy/http-json-body-parser"
            ? 400
            : error.statusCode || 500;

        console.error("ERROR:", { name: error.name, statusCode });

        handler.response = sendResponse(statusCode, {
            error: statusCode === 500
                ? "Internal Server error"
                : error.message
            
        });
    }
});