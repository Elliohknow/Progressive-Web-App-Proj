var deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}
// TODO: Make sure this doesn't over-prompt user to add to home screen
window.addEventListener('beforeinstallprompt', function(event) {
  if (deferredPrompt) {
    console.log('beforeinstallprompt fired, default prevented');
    event.preventDefault();
  } else {
    console.log('beforeinstallprompt fired');
  }
  deferredPrompt = event;
  return false;
});
