import { Diagnostic } from "@codemirror/lint"
import { EditorView } from "@codemirror/view"
import { parse } from "smol-toml"

/**
 * TOML parser linter that checks syntax and reports errors
 * Returns a function that CodeMirror can use for linting
 */
export const tomlParseLinter = () => (view: EditorView): Diagnostic[] => {
  const doc = view.state.doc.toString()

  // Skip empty documents
  if (!doc.trim()) {
    return []
  }

  try {
    // Try to parse the TOML document
    parse(doc)
  } catch (e) {
    if (!(e instanceof Error)) throw e

    // Extract error position from the error message
    const { line } = extractErrorPosition(e.message)

    let lineInfo = {
      from: 0,
      to: 0
    }
    if (line > 0) {
      try {
        lineInfo = view.state.doc.line(line)
      } catch  {
          // pos = 0
      }
    }

    return [{
      from: lineInfo.from,
      message: e.message, // Use original error message
      severity: 'error',
      to: lineInfo.to
    }]
  }
  return []
}

/**
 * Extracts line and column numbers from smol-toml error message
 * Handles multiple error format patterns
 */
function extractErrorPosition(message: string): { line: number, column: number } {
  // Default values
  let line = 0
  let column = 0

  // Try to match smol-toml's error format, example:
  // Invalid TOML document: incomplete key-value: cannot find end of key
  //
  // 4:    EnableWinningPost = true
  // 5:    dass
  //       ^

  // First match the line indicator (e.g. "5:")
  const lineMatch = message.match(/\n(\d+):\s+.*\n\s+\^/s)
  if (lineMatch) {
    line = parseInt(lineMatch[1], 10)

    // Then find the position of the caret (^) to determine column
    const lines = message.split('\n')
    for (const line of lines) {
      if (line.includes('^')) {
        column = line.indexOf('^') + 1 // +1 because columns are 1-based
        break
      }
    }
  }

  // Fallback: try other common formats
  if (line === 0) {
    const altLineMatch = message.match(/at line (\d+)/i) || message.match(/line (\d+)/i)
    if (altLineMatch) {
      line = parseInt(altLineMatch[1], 10)
    }

    const altColumnMatch = message.match(/column (\d+)/i) || message.match(/col (\d+)/i)
    if (altColumnMatch) {
      column = parseInt(altColumnMatch[1], 10)
    }
  }
  return { line, column }
}
