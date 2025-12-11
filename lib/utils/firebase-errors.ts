/**
 * Translates Firebase authentication error codes to user-friendly messages
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred. Please try again."
  }

  const errorMessage = error.message
  const errorCode = errorMessage.match(/\(auth\/([^)]+)\)/)?.[1]

  if (!errorCode) {
    // If it's not a Firebase error, return the original message
    return errorMessage
  }

  const errorMessages: Record<string, string> = {
    "invalid-credential": "Invalid email or password. Please check your credentials and try again.",
    "email-already-in-use": "This email address is already registered. Please sign in instead or use a different email.",
    "user-not-found": "No account found with this email address. Please check your email or sign up.",
    "wrong-password": "Incorrect password. Please try again.",
    "weak-password": "Password is too weak. Please choose a stronger password.",
    "invalid-email": "The email address is invalid. Please enter a valid email address.",
    "user-disabled": "This account has been disabled. Please contact support for assistance.",
    "too-many-requests": "Too many failed attempts. Please try again later.",
    "operation-not-allowed": "This sign-in method is not enabled. Please contact support.",
    "requires-recent-login": "This operation requires recent authentication. Please sign in again.",
    "network-request-failed": "Network error. Please check your internet connection and try again.",
    "internal-error": "An internal error occurred. Please try again later.",
    "missing-email": "Email address is required. Please enter your email address.",
  }

  return errorMessages[errorCode] || errorMessage
}

