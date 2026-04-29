let dataMode = "mongo";

export function setDataMode(mode) {
  dataMode = mode === "local" ? "local" : "mongo";
}

export function isLocalMode() {
  return dataMode === "local";
}

export function hasUsableMongoUri(uri) {
  if (!uri) return false;
  const value = uri.trim();
  if (!value) return false;
  return !/mongodb\+srv:\/\/user:password@cluster\.mongodb\.net/i.test(value);
}
