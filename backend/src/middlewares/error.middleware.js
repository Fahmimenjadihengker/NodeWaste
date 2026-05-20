export function errorMiddleware(error, _request, response, _next) {
  const statusCode = error.statusCode || 500
  const isPrismaKnownError = error.code && String(error.code).startsWith('P')

  if (statusCode === 500) {
    console.error(error)
  }

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 && !isPrismaKnownError ? 'Server error' : error.message,
    errors: error.errors || [],
  })
}
