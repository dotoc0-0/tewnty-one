'use strict';
{

  const allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // HTML領域
  const result = document.getElementById('result');
  const master = document.getElementById('master');
  const enemy = document.getElementById('enemy');
  const me = document.getElementById('me');
  const text = document.getElementById('text');
  const start = document.getElementById('start');
  const drawbtn = document.getElementById('draw');
  const notdrawbtn = document.getElementById('notdraw');
  const myCards = document.querySelector('#me > .cards');
  const enemysCards = document.querySelector('#enemy > .cards');
  const showMySum = document.querySelector('#me > .sum');
  const showEnemysSum = document.querySelector('#enemy > .sum');



  function addValue(parent, value) {
    const p = document.createElement('p');
    p.innerHTML = `${value}`;
    parent.appendChild(p);
  }

  // addValue(result, 'カード：' + allCards);


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

  let myTefuda = [yamafuda[0], yamafuda[1]];
  let enemysTefuda = [yamafuda[2], yamafuda[3]];
  let mySum = yamafuda[0] + yamafuda[1];
  let enemysSum = yamafuda[2] + yamafuda[3];

  start.addEventListener('click', () => {
    if (started) {
      start.classList.add('hidden');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('hidden');
      addText('あなたのターンです。');
      return;
    };

    enemy.classList.remove('hidden');
    me.classList.remove('hidden');

    start.textContent = 'OK';
    started = true;

    while (yamafuda.length > 7) {
      yamafuda.shift();
    }
    // addValue(result, '〇山札：' + yamafuda);

    showEnemysSum.innerHTML = '? / 21';
    showMySum.innerHTML = mySum + '/ 21';

    myTefuda.forEach(card => {
      addValue(myCards, card);
    });
    enemysTefuda.forEach(card => {
      addValue(enemysCards, card);
    });

    const enemysFirstCard = document.querySelector('#enemy>.cards>p:first-of-type');
    enemysFirstCard.innerHTML = '?';

    addText('最初の手札が配られました！');

  });

  function total(array) {
    return array.reduce(function (sum, element) {
      return sum + element;
    });
  }

  let standContinues = 0;
  // function showContinues() {
  //   if (document.getElementById('continue')) {
  //     document.getElementById('continue').remove();
  //   }
  //   const c = document.createElement('p');
  //   c.textContent = '連続スタンド：' + standContinues;
  //   c.id = 'continue';
  //   result.appendChild(c);
  // }


  drawbtn.addEventListener('click', () => {
    if (mySum > 21) {
      drawbtn.classList.add('disabled');
      addText('もう引けないよ～');
      return;
    }

    standContinues = 0;

    addValue(myCards, yamafuda[0]);
    myTefuda.push(yamafuda[0]);
    yamafuda.shift();

    mySum = total(myTefuda);
    showMySum.innerHTML = mySum + '/ 21';

    enemysTurn();
  });

  notdrawbtn.addEventListener('click', () => {
    standContinues++;
    if (standContinues === 2) {
      endGame();
      return;
    }

    enemysTurn();
  });

  let randomNumber;

  function enemysTurn() {
    drawbtn.classList.add('hidden');
    notdrawbtn.classList.add('hidden');

    addText('<p>相手のターン！<br>相手はどうするのかな？？</p><button id="enemysbtn">Next</button>');

    document.getElementById('enemysbtn').addEventListener('click', () => {
      randomNumber = Math.ceil(Math.random() * 10);
      if (enemysSum <= 13) {
        EnemyDraws();
      } else if (enemysSum <= 15) {
        if (randomNumber <= 5) {
          EnemyDraws();
        } else {
          EnemyNotDraws();
        }
      } else if (enemysSum <= 18) {
        if (randomNumber <= 2) {
          EnemyDraws();
        } else {
          EnemyNotDraws();
        }
      } else {
        EnemyNotDraws();
      }
    });

  }


  function EnemyDraws() {
    standContinues = 0;

    addValue(enemysCards, yamafuda[0]);
    enemysTefuda.push(yamafuda[0]);
    yamafuda.shift();

    enemysSum = total(enemysTefuda);

    addText('<p>相手はカードを引いた！</p><button id="toyourturn">ok</button>')

    const toyourturn = document.getElementById('toyourturn');

    toyourturn.addEventListener('click', () => {
      addText('あなたのターンです。');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('hidden');
    });
  }

  function EnemyNotDraws() {
    standContinues++;

    addText('<p>相手はカードを引かなかった！</p><button id="toyourturn">ok</button>')


    const toyourturn = document.getElementById('toyourturn');

    toyourturn.addEventListener('click', () => {

      if (standContinues === 2) {
        endGame();
        return;
      }

      addText('あなたのターンです。');
      drawbtn.classList.remove('disabled', 'hidden');
      notdrawbtn.classList.remove('hidden');
    });
  }


  function endGame() {
    drawbtn.classList.add('hidden');
    notdrawbtn.classList.add('hidden');

    const enemysFirstCard = document.querySelector('#enemy>.cards>p:first-of-type');
    enemysFirstCard.textContent = enemysTefuda[0];
    showEnemysSum.innerHTML = enemysSum + '/ 21';

    const youWin = '<h2>ゲーム終了</h2><p>あなたの勝ちです！！やったね！</p>';
    const youLose = '<h2>ゲーム終了</h2><p>あなたの負けです！！残念・・・</p>';
    const tie = '<h2>ゲーム終了</h2><p>今回の勝負は引き分け！</p>'

    if (mySum > 21) {
      if (enemysSum > 21) {
        addText(tie);
        addValue(master, '<a href="">Replay</a>');
        return;
      }
      addText(youLose);
    } else {
      if (enemysSum > 21) {
        addText(youWin);
        addValue(master, '<a href="">Replay</a>');
        return;
      }
      if (mySum > enemysSum) {
        addText(youWin);
      } else if (mySum === enemysSum) {
        addText(tie);
      } else {
        addText(youLose);
      }
    }

    addValue(master, '<a href="">Replay</a>');

  }


}