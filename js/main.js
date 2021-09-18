'use strict';
{

  const allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  // const allCards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

  // HTML領域
  const result = document.getElementById('result');
  const master = document.getElementById('master');
  const enemy = document.getElementById('enemy');
  const me = document.getElementById('me');
  const text = document.getElementById('text');
  const start = document.getElementById('start');
  const drawbtn = document.getElementById('draw');
  const notdrawbtn = document.getElementById('notdraw');


  function addValue(parent, value) {
    const p = document.createElement('p');
    p.innerHTML = `${value}`;
    parent.appendChild(p);
  }

  addValue(result, 'カード：' + allCards);


  //ランダム数字リスト
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }

  let started = false;

  function addText(value) {
    text.innerHTML = `${value}`;
  }

  let yamafuda = shuffle([...allCards]);

  let myCards = [yamafuda[0], yamafuda[1]];
  let enemysCards = [yamafuda[2], yamafuda[3]];
  let mySum = yamafuda[0] + yamafuda[1];
  let enemysSum = yamafuda[2] + yamafuda[3];


  start.addEventListener('click', () => {
    if (started) {
      start.classList.add('disabled', 'hidden');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('disabled', 'hidden');
      addText('あなたのターンです。');
      return;
    };

    start.textContent = 'OK';
    started = true;

    while (yamafuda.length > 7) {
      yamafuda.shift();
    }
    addValue(result, '〇山札：' + yamafuda);
    addValue(enemy, '相手初期カード：' + enemysCards);
    addValue(enemy, '相手初期計：' + enemysSum);
    addValue(me, '自分初期カード：' + myCards);
    addValue(me, '自分初期計：' + mySum);

    addText('最初の手札が配られました！');

  });

  function total(array) {
    return array.reduce(function (sum, element) {
      return sum + element;
    });
  }

  let standContinues = 0;
  function showContinues() {
    if (document.getElementById('continue')) {
      document.getElementById('continue').remove();
    }
    const c = document.createElement('p');
    c.textContent = '連続スタンド：' + standContinues;
    c.id = 'continue';
    result.appendChild(c);
  }


  drawbtn.addEventListener('click', () => {
    if (mySum > 21) {
      drawbtn.classList.add('disabled');
      addText('もう引けないよ～');
      return;
    }

    standContinues = 0;
    showContinues();

    myCards.push(yamafuda[0]);
    addValue(me, '引いたカード：' + yamafuda[0]);
    yamafuda.shift();
    addValue(result, '〇山札：' + yamafuda);

    addValue(me, '今の手札：' + myCards);
    mySum = total(myCards);
    addValue(me, '今の合計：' + mySum);

    enemysTurn();
  });

  notdrawbtn.addEventListener('click', () => {
    standContinues++;
    showContinues();
    if (standContinues === 2) {
      endGame();
      return;
    }

    enemysTurn();
  });


  function enemysTurn() {
    drawbtn.classList.add('disabled', 'hidden');
    notdrawbtn.classList.add('disabled', 'hidden');

    if (enemysSum <= 15) {
      EnemyDraws();
    } else {
      EnemyNotDraws();
    }

  }

  function EnemyDraws() {
    standContinues = 0;
    showContinues();

    enemysCards.push(yamafuda[0]);
    addValue(enemy, '引いたカード：' + yamafuda[0]);
    yamafuda.shift();
    addValue(result, '〇山札：' + yamafuda);

    addValue(enemy, '今の手札：' + enemysCards);
    enemysSum = total(enemysCards);
    addValue(enemy, '今の合計：' + enemysSum);

    addText('<p>相手はカードを引いた！</p><button id="toyourturn">ok</button>')

    const toyourturn = document.getElementById('toyourturn');

    toyourturn.addEventListener('click', () => {
      addText('あなたのターンです。');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('disabled', 'hidden');
    });
  }

  function EnemyNotDraws() {
    standContinues++;
    showContinues();

    addText('<p>相手はカードを引かなかった！</p><button id="toyourturn">ok</button>')


    const toyourturn = document.getElementById('toyourturn');

    toyourturn.addEventListener('click', () => {

      if (standContinues === 2) {
        endGame();
        return;
      }

      addText('あなたのターンです。');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('disabled', 'hidden');
    });
  }


  function endGame() {
    drawbtn.classList.add('disabled', 'hidden');
    notdrawbtn.classList.add('disabled', 'hidden');

    const youWin = '<h2>ゲーム終了</h2><p>あなたの勝ちです！！やったね！</p>';
    const youLose = '<h2>ゲーム終了</h2><p>あなたの負けです！！残念・・・</p>';
    const tie = '<h2>ゲーム終了</h2><p>今回の勝負は引き分け！</p>'

    if (mySum > 21) {
      if(enemysSum > 21){
        addText(tie);
        addValue(master, '<a href="">Replay</a>');
        return;
      }
      addText(youLose);
    }else{
      if(enemysSum > 21){
        addText(youWin);
        addValue(master, '<a href="">Replay</a>');
        return;
      }
      if(mySum > enemysSum){
        addText(youWin);
      }else if(mySum === enemysSum){
        addText(tie);
      }else{
        addText(youLose);
      }
    }

    addValue(master, '<a href="">Replay</a>');

  }


}