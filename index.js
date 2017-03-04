var request = require('request');
var firebase = require('firebase-admin');

var API_KEY = 'AAAA6R8joXo:APA91bG7y0eZNmFItOlKu47cpnclWV50NSylKPttKBIle1Mt57rM2RUSLH7AMHTqdRgKAChF_1UhSDs2623es5P-5_y9BwlbQVZtwVuVibYqOa7hY_mqob4jlIyMA13ew5BkDMVNkLSkOjSkR3P4i4ANCMOHBRnGLA';

firebase.initializeApp({
  credential: firebase.credential.cert('./firebase_serviceAccountKey.json'),
  databaseURL: 'https://clipme-32a80.firebaseio.com'
});

listenToChanges();

function listenToChanges() {
  let links = firebase.database().ref().child('links');

  links.on('child_added', data => {
    listenToNewHistoryItems(data.key);
  });
}

function listenToNewHistoryItems(uid) {
  firebase.database().ref().child('links/' + uid + '/history/').on('child_added', item => {
    let notificationSent = item.val()['notification-sent'];
    let excludedDeviceAuth = item.val()['push-auth'];

    if (!notificationSent) {
      sentAuthDataToFCM(uid, excludedDeviceAuth, item.key)
    }
  });
}

function sentAuthDataToFCM(uid, excludedDeviceAuth, historyKey) {
  firebase.database().ref().child('links/' + uid + '/push-subscriptions/').once('value', subscriptions => {

    if (subscriptions.val() && Object.keys(subscriptions.val()).length >= 2) {
      for (var key in subscriptions.val()) {
        let auth = subscriptions.val()[key].auth;
        let endpoint = subscriptions.val()[key].endpoint;
        let p256dh = subscriptions.val()[key].p256dh;

        if (auth !== excludedDeviceAuth) {
          sendRequestToFCM(auth, endpoint, p256dh).then(() => {
            updateSentNotifcation(uid, historyKey, excludedDeviceAuth);
          });
        }
      }
    } else {
      updateSentNotifcation(uid, historyKey, excludedDeviceAuth);
    }
  });
}

function sendRequestToFCM(auth, endpoint, p256dh) {
  let registrationID = endpoint;

  if (endpoint.startsWith('https://android.googleapis.com/gcm/send')) {
    let endpointParts = endpoint.split('/');
    registrationID = endpointParts[endpointParts.length - 1];
  }

  return new Promise((resolve, reject) => {
    request({
      url: 'https://android.googleapis.com/gcm/send',
      method: 'POST',
      headers: {
        'Content-Type': ' application/json',
        'Authorization': 'key=' + API_KEY,
      },
      body: JSON.stringify({
        'registration_ids': [registrationID]
      })
    }, function(error, response, body) {
      if (error) {
        console.error(error);
        reject();
      } else if (response.statusCode >= 400) {
        console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function updateSentNotifcation(uid, historyKey, excludedDeviceAuth) {
  firebase.database().ref('links/' + uid + '/history/' + historyKey)
    .update({
      'notification-sent': true
    })
    .then(() => {
      console.log('Success');
    })
    .catch(error => {
      console.log('error: ' + error);
    });
}
