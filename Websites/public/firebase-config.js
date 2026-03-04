/**
 * Firebase 配置 - cc-participation-games
 * 项目：The T-Rex Game / Queering Controllers 等参与式游戏
 */
var firebaseConfig = {
  apiKey: "AIzaSyAL9LaXKnOqw-Np07OxJsYzJwnkWeqBV9o",
  authDomain: "cc-participation-games.firebaseapp.com",
  databaseURL: "https://cc-participation-games-default-rtdb.firebaseio.com",
  projectId: "cc-participation-games",
  storageBucket: "cc-participation-games.firebasestorage.app",
  messagingSenderId: "28172198769",
  appId: "1:28172198769:web:652d18207cc16d271a4cd0",
  measurementId: "G-GP0XSJFRGP"
};

if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
} else {
  var db = null;
}
