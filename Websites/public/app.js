var playerName = '';
var userChoice = null;
var gameStateListener = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.style.display = 'none'; });
  var el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

function showStartScreen() {
  playerName = '';
  userChoice = null;
  showScreen('start-screen');
}

function showNameScreen() {
  showScreen('name-screen');
  document.getElementById('player-name').value = '';
}

function goToBet() {
  var name = (document.getElementById('player-name').value || '').trim();
  if (!name) { alert('Please enter your name'); return; }
  playerName = name;
  userChoice = null;
  document.querySelectorAll('.choice').forEach(function(c) { c.classList.remove('selected'); });
  document.getElementById('confirm-btn').disabled = true;
  showScreen('bet-screen');
}

function selectChoice(n) {
  userChoice = n;
  document.querySelectorAll('.choice').forEach(function(c) {
    c.classList.toggle('selected', parseInt(c.dataset.choice) === n);
  });
  document.getElementById('confirm-btn').disabled = false;
}

function submitBet() {
  if (!userChoice || !playerName || !db) return;
  var docRef = db.collection('gameState').doc('current');
  var newBet = { playerName: playerName, userChoice: userChoice };
  docRef.get().then(function(doc) {
    var data = doc.exists ? doc.data() : {};
    var bets = (data.bets || []).slice();
    if (data.status === 'resolved') bets = [];
    bets.push(newBet);
    return docRef.set({
      status: 'betting',
      bets: bets,
      actualResult: null,
      results: [],
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }).then(function() {
    showScreen('waiting-screen');
    startListening();
  }).catch(function() { alert('Submit failed. Please check your connection and try again.'); });
}

function startListening() {
  if (gameStateListener) return;
  gameStateListener = db.collection('gameState').doc('current').onSnapshot(function(doc) {
    if (!doc.exists) return;
    var data = doc.data();
    var countEl = document.getElementById('waiting-count');
    if (countEl) countEl.textContent = (data.bets || []).length + ' players joined';
    if (data.status === 'resolved' && data.results) {
      if (gameStateListener) { gameStateListener(); gameStateListener = null; }
      showResult(data);
    }
  });
}

function showResult(data) {
  var actual = data.actualResult;
  var results = data.results || [];
  var myResult = results.find(function(r) { return r.playerName === playerName && r.userChoice === userChoice; }) || results.find(function(r) { return r.playerName === playerName; });
  showScreen('result-screen');
  var title = document.getElementById('result-title');
  var content = document.getElementById('result-content');
  title.textContent = 'Path ' + actual + ' was correct!';
  var html = '<p>Result: Path ' + actual + '</p>';
  if (myResult) html += '<p style="margin-top:0.5rem;color:' + (myResult.result === 'win' ? '#2a9d8f' : '#e63946') + '">' + (myResult.result === 'win' ? '🎉 You won!' : 'Better luck next time!') + '</p>';
  html += '<ul style="margin-top:1rem;list-style:none;">';
  results.forEach(function(r) {
    html += '<li style="margin:0.3rem 0;">' + r.playerName + ' → ' + (r.result === 'win' ? '✓' : '✗') + '</li>';
  });
  html += '</ul>';
  content.innerHTML = html;
}

function resetAndStart() {
  showStartScreen();
}

if (typeof db === 'undefined') var db = null;
document.addEventListener('DOMContentLoaded', function() {
  if (!db) console.warn('Firebase not connected. Submit will not work.');
});
