# Copy2me-backend

This Node application enables push notifications for the <a href="https://github.com/Safi1012/copy2me" target="_blank">Copy2me</a> application. 


## Technology Stack
* firebase-admin
* request


<br/>

# Getting started

The following steps explain how Copy2me can be self hosted.


<br/>

#### **Requirements**

First you have to create a free Firebase account in order to use the <a href="https://firebase.google.com/" target="_blank">Firebase</a> Realtime Database. 

Next, you have to create a new Firebase project. A great <a href="https://firebase.google.com/docs/web/setup" target="_blank">introduction</a> can be found in the Firebase docs.




<br/>

#### **SetUp**

After creating an own Firebase project you have to add your Firebase configuration, which can be found under the Firebase project settings (dashboard).


Now you have to navigate to the current Firebase configuration of Copy2me under *src/app/services/firebase/firebase.service.ts* and replace it with your newly generated config.




<br/>

#### **Deploy Copy2me to Firebase**

The moment you replaced the old Firebase configuration of Copy2me with your own, you are ready to deploy Copy2me to the Firebase Hosting service.


Please make sure that you already created the Copy2me production bundle by executing the following command in the Copy2me project root folder.

```bash
$ npm run build:aot
```

&nbsp; 

Next you have to install the Firebase CLI to upload the generated production bundle to Firebase. A great introduction on how to deploy a site to Firebase Hosting can be found <a href="https://firebase.google.com/docs/hosting/deploying" target="_blank">here</a>. After deploying Copy2me to your Firebase instance you should be able to use the application by calling your projects URL: 

```bash
https://Your_Firebase_Project_Name.firebaseapp.com
```


<br/>


#### **Enable Push Notifications**


If you also want to benefit from push notifications you have to deploy this Node application to your own node server. In order to authenticate this Node application with your Firebase instance a Firebase Admin account is needed, which can be created in the 'Service Account' tab in the Firebase control center. From there you simply generate your serviceAccountKey.json and save it to the same directory of this Node application *Copy2me-backend*.


After deploying the Node application *Copy2me-backend* to your Node server, you should be able to receive push notifications after uploading links to your own Copy2me instance. 