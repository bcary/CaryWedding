// Initialize Firebase
var config = {
    apiKey: "AIzaSyA6CGl-Vc_MCRdEvuA5Rzw_sDWvdTYUwe4",
    authDomain: "carywedding-dcb42.firebaseapp.com",
    databaseURL: "https://carywedding-dcb42.firebaseio.com",
    storageBucket: "carywedding-dcb42.appspot.com",
    messagingSenderId: "916004135114"
};

firebase.initializeApp(config);

firebase.auth().signInWithEmailAndPassword('brian.cary1@gmail.com', 'Bcng4db1').catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
  } else {
    // User is signed out.
  }
});
