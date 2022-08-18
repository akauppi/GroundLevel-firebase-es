// Blocks all access; only used from admin (metrics and logging)

export default {
  "rules": {
    ".read": false,
    ".write": false
  }
}
