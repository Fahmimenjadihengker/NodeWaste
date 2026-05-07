export function errorMiddleware(error, _request, response, _next) {
  const statusCode = error.statusCode || 500

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Server error' : error.message,
    errors: error.errors || [],
  })
}
