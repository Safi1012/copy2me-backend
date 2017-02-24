var express = require('express')
var app = express()
var request = require('request');
var firebase = require('firebase-admin');
var API_KEY = 'AAAA6R8joXo:APA91bG7y0eZNmFItOlKu47cpnclWV50NSylKPttKBIle1Mt57rM2RUSLH7AMHTqdRgKAChF_1UhSDs2623es5P-5_y9BwlbQVZtwVuVibYqOa7hY_mqob4jlIyMA13ew5BkDMVNkLSkOjSkR3P4i4ANCMOHBRnGLA';

app.listen(5000, () => {
  console.log('Example app listening on port 5000!')
})

app.get('/', (req, res) => {
  res.send('Hello Arne!')
  listenToChanges();
})

firebase.initializeApp({
  credential: firebase.credential.cert('./firebase_serviceAccountKey.json'),
  databaseURL: 'https://clipme-32a80.firebaseio.com'
});

// listenToChanges();

function listenToChanges() {
  let links = firebase.database().ref().child('links');

  links.on('child_added', data => {
    listenToNewHistoryItems(data.key);
  });
}

function listenToNewHistoryItems(uid) {
  console.log('links/' + uid + '/history');

  firebase.database().ref().child('links/' + uid + '/history/').on('child_added', item => {
    let notificationSent = item.val()['notification-sent'];
    let excludeDeviceAuthFromPush = item.val()['push-auth'];

    if (!notificationSent) {
      sentAuthDataToFCM(uid, excludeDeviceAuthFromPush)
    }
  });
}

function sentAuthDataToFCM(uid, excludeDeviceAuthFromPush) {
  console.log(uid + excludeDeviceAuthFromPush);


  firebase.database().ref().child('links/' + uid + '/push-subscriptions/').once('value', subscriptions => {
    console.log(subscriptions);
    console.log(subscriptions.val());

    for (var key in subscriptions.val()) {
      let auth = subscriptions.val()[key].auth;
      let endpoint = subscriptions.val()[key].endpoint;
      let p256dh = subscriptions.val()[key].p256dh;

      // sent request to FCM
      sendNotificationToUser(auth, endpoint, p256dh);

      // set sentNotification to true -> after sending
    }
  });
}

function sendNotificationToUser(auth, endpoint, p256dh) {
  console.log(API_KEY);
  message = 'Test';
  let registrationID = endpoint;

  if (endpoint.startsWith('https://android.googleapis.com/gcm/send')) {
    let endpointParts = endpoint.split('/');
    registrationID = endpointParts[endpointParts.length - 1];
  }

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
    } else if (response.statusCode >= 400) {
      console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
    }
  });

}
