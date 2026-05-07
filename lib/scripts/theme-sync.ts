export const themeSyncScript = `(function() {
  var cookie = document.cookie.split('; ').find(function(r) { return r.startsWith('preferred-mode=') });
  if (cookie) {
    var mode = cookie.split('=')[1];
    localStorage.setItem('theme', mode);
  }
})();`
