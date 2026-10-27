// Errors carry a code instead of a sentence, so the UI can show them in the current language.
export type ErrorCode =
  | 'notLoggedIn'
  | 'bookNotFound'
  | 'needTitle'
  | 'emptyReflection'
  | 'storageFull'
  | 'needName'
  | 'shortPassword'
  | 'emailTaken'
  | 'badCredentials'

export class AppError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode) {
    super(code)
    this.code = code
  }
}
