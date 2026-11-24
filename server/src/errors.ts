export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function isDatabaseError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const name = 'name' in error ? String(error.name) : '';
  return (
    name === 'PrismaClientKnownRequestError' ||
    name === 'PrismaClientUnknownRequestError' ||
    name === 'PrismaClientInitializationError' ||
    name === 'PrismaClientRustPanicError'
  );
}
