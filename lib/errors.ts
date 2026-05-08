import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message)
  }
}

export const handleError = (error: unknown) => {
  console.error(error)
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 422 })
  }
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export const ok = (data: unknown, status = 200) => NextResponse.json(data, { status })
