var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function() {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}
window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
// // TODO: Make sure this works and doesn't over-prompt user to add to home screen
// window.addEventListener('beforeinstallprompt', function(event) {
//   if (deferredPrompt) {
//     console.log('beforeinstallprompt fired, default prevented');
//     event.preventDefault();
//   } else {
//     console.log('beforeinstallprompt fired');
//   }
//   deferredPrompt = event;
//   return false;
// });

// window.addEventListener('beforeinstallprompt', function (event) {
//   if (!deferredPrompt) {
//     console.log('beforeinstallprompt fired');
//     deferredPrompt = event;
//     return false;
//   } else {
//     console.log('beforeinstallprompt fired, default prevented');
//     event.preventDefault();
//     deferredPrompt = event;
//     return false;
//   }
// });

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'You successfully subscribed to our notification service!',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/pixieparty.jpg',
      dir: 'ltr',
      lang: 'en-US', //BCP 47
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
      ]
    };
    navigator.serviceWorker.ready
      .then(function (swreg) {
        swreg.showNotification('Successfully subscribed!', options);
      });
  }
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  // checks if this servieworker, handled through this browser, has an existing subscription for this device
  var reg;
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        // create a new subscription
        var vapidPublicKey = 'BLjqxgNtt8T87M1yXXKb6L5MSatm9t9O_twUesGYgE8mDct3RXVZHDmpNWLbf3H7AzRdrT4U1uWengFheOuc7mk';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({ // make sure our application server is the only valid source of push messages
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        // we already have a subscription
      }
    })
    .then(function (newSub) {
      // add .json when directly targetting the db interface on firebase
      return fetch('https://pwagram-a3dea.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      }) 
    })
    .then(function (res) {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function (err) {
      console.log(err);
    });                                                                 
}

function askForNotificationPermission() {
  Notification.requestPermission()
    .then(function (permission) {
      console.log('User Choice', permission);
      if (permission !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        console.log('Notification permission granted!');
        configurePushSub();
        // displayConfirmNotification();
        // TODO: code to hide/show notifications toggle
      }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
} else {
  console.log('This \'ere browser don\'t take too kindly to support\'n notifications, fella\'.');
}

// Workbox is now available in two different versions: 2.x  and 3.x

// There have been some major changes from 2.x => 3.x, you find a detailed migration guide here: https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-v2

// For this module, the following breaking change is important:

// Use precacheAndRoute()  instead of precache() in the sw - base.js  file

// You don't have to update to 3.x if you don't want to.In order to get the same version as used in this module, you can simply install version 2:

// npm install--save - dev workbox - cli@^ 2 