import { NextResponse } from 'next/server'

export function success(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function error(message, status = 400, errors = null) {
  const response = {
    success: false,
    error: { message, ...(errors && { details: errors }) },
  }
  return NextResponse.json(response, { status })
}

export function validationError(errors) {
  return error('Validation failed', 400, errors)
}

export function notFound(resource = 'Resource') {
  return error(`${resource} not found`, 404)
}

export function unauthorized(message = 'Unauthorized') {
  return error(message, 401)
}

export function forbidden(message = 'Forbidden') {
  return error(message, 403)
}

export function serverError(message = 'Internal server error') {
  return error(message, 500)
}

export function paginated(data, pagination) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  })
}

export function handleError(err) {
  console.error('API Error:', err)
  if (err.code === 'P2002') return error('A record with this value already exists', 409)
  if (err.code === 'P2025') return notFound()
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.reduce((acc, e) => {
      acc[e.path.join('.')] = e.message
      return acc
    }, {})
    return validationError(formattedErrors)
  }
  return serverError(err.message || 'An unexpected error occurred')
}

