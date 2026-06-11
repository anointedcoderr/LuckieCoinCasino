// Tiny class name joiner. Filters out falsy values so conditional classes stay clean.
export function cx(...parts) {
  return parts.flat().filter(Boolean).join(' ')
}

export default cx
