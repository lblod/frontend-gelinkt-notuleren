export function isBlank(str) {
  return !str || /^\s*$/.test(str);
}
