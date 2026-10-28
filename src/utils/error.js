/**
 * Checks if an error message is a safe, user-facing sentence from the backend.
 * Returns false for any code-related errors, Firebase technical errors, HTTP status strings, or stack traces.
 */
export function isSafeUserMessage(msg) {
  if (!msg || typeof msg !== "string") return false
  const trimmed = msg.trim()
  if (trimmed.length > 120 || trimmed.length < 3) return false

  // Reject anything with Firebase internal codes, HTTP status codes, or stack traces
  if (
    /firebase/i.test(trimmed) ||
    /auth\//i.test(trimmed) ||
    /status code \d+/i.test(trimmed) ||
    /axios/i.test(trimmed) ||
    /network error/i.test(trimmed) ||
    /failed to fetch/i.test(trimmed) ||
    /econnrefused/i.test(trimmed) ||
    /syntaxerror|typeerror|referenceerror/i.test(trimmed) ||
    /internal server error/i.test(trimmed) ||
    /undefined|null|object Object/i.test(trimmed) ||
    /prisma|sql|mongo|query/i.test(trimmed) ||
    /at\s+[\w\.\/\\<>-]+\s+\(/i.test(trimmed) || // stack traces
    /[\{\}\[\]\<\>\/\\]/.test(trimmed) // code brackets or paths
  ) {
    return false
  }

  return true
}

/**
 * Safely parse API or runtime errors into user-friendly messages.
 * If backend sends a message (e.g. "Invalid email or password", "User already exists"),
 * it returns that message.
 * If it's a code-level crash, Firebase error, or network error, it returns the fallback.
 */
export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback

  let raw = ""
  if (typeof err === "string") {
    raw = err
  } else if (err?.data?.message && typeof err.data.message === "string") {
    raw = err.data.message
  } else if (err?.data?.detail && typeof err.data.detail === "string") {
    raw = err.data.detail
  } else if (err?.response?.data?.message && typeof err.response.data.message === "string") {
    raw = err.response.data.message
  } else if (err?.message && typeof err.message === "string") {
    raw = err.message
  }

  raw = (raw || "").trim().replace(/^error:\s*/i, "")

  if (isSafeUserMessage(raw)) {
    return raw
  }

  return fallback
}
