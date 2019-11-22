import  firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAI9t8SesU2vMJi4EfWZUFld2movP5tCSI",
    authDomain: "my-graduation-project-d734c.firebaseapp.com",
    databaseURL: "https://my-graduation-project-d734c.firebaseio.com",
    projectId: "my-graduation-project-d734c",
    storageBucket: "my-graduation-project-d734c..appspot.com",
    messagingSenderId: "1032550654166",
    appId: "1:1032550654166:web:3a9bd348805e962cf7e977"
  };
  const fire=firebase.initializeApp(firebaseConfig);

export default fire;