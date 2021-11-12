'use strict';
{
  // HTML領域
  const master = document.getElementById('master');
  const text = document.getElementById('text');
  const enemy = document.getElementById('enemy');
  const enemysCards = document.querySelector('#enemy .cards');
  const showEnemysSum = document.querySelector('#enemy .sum');
  const me = document.getElementById('me');
  const myCards = document.querySelector('#me .cards');
  const showMySum = document.querySelector('#me .sum');
  const start = document.getElementById('start');
  const drawbtn = document.getElementById('draw');
  const notdrawbtn = document.getElementById('notdraw');


  //ルール説明
  const ruleDiv = document.getElementById('rule');
  const rulebtn = document.getElementById('showrule');
  const ruleText = document.querySelectorAll('#rule > .content p');
  const prev = document.getElementById('rulePrev');
  const page = document.getElementById('rulePage');
  const next = document.getElementById('ruleNext');
  const close = document.getElementById('rule-close');
  let pageNumber = 1;
  let allPages = ruleText.length;

  //ルール
  function hideRule() {
    ruleText.forEach(p => {
      if (p.id === 'rule' + pageNumber) {
        p.classList.add('hidden');
      }
    });
  }
  function appearRule() {
    ruleText.forEach(p => {
      if (p.id === 'rule' + pageNumber) {
        p.classList.remove('hidden');
      }
    });
  }


  next.addEventListener('click', () => {
    if (next.classList.contains('disabled')) {
      return;
    }

    hideRule();
    pageNumber++;
    appearRule();

    page.textContent = pageNumber + ' / ' + allPages;
    if (pageNumber === allPages) {
      next.classList.add('disabled');
    }
    prev.classList.remove('disabled');

  });

  prev.addEventListener('click', () => {
    if (prev.classList.contains('disabled')) {
      return;
    }

    hideRule();
    pageNumber--;
    appearRule();

    page.textContent = pageNumber + ' / ' + allPages;
    if (pageNumber === 1) {
      prev.classList.add('disabled');
    }
    next.classList.remove('disabled');
  });

  //ルール画面開く
  rulebtn.addEventListener('click', () => {
    page.textContent = pageNumber + ' / ' + allPages;
    ruleDiv.classList.remove('hidden');
  });
 //ルール画面閉じる(1ページ目に戻す)
  close.addEventListener('click', () => {
    ruleDiv.classList.add('hidden');
    if (pageNumber !== 1) {
      hideRule();
      pageNumber = 1;
      appearRule();
      page.textContent = pageNumber + ' / ' + allPages;
      prev.classList.add('disabled');
      next.classList.remove('disabled');
    }
  });

  //ゲーム進行
  function addText(value) { //textの中(主にゲーム進行のための文)
    text.innerHTML = `${value}`;
  }
  function addValue(parent, value) { //text以外
    const p = document.createElement('p');
    p.innerHTML = `${value}`;
    parent.appendChild(p);
  }


  //ランダム数字リスト
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }

  let started = false;

  const allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let yamafuda = shuffle(allCards);

  let myTefuda = [yamafuda[0], yamafuda[1]];
  let enemysTefuda = [yamafuda[2], yamafuda[3]];
  let mySum = yamafuda[0] + yamafuda[1];
  let enemysSum = yamafuda[2] + yamafuda[3];
  while (yamafuda.length > 7) {
    yamafuda.shift();
  }

  start.addEventListener('click', () => {
    if (started) {
      start.classList.add('hidden');
      drawbtn.classList.remove('hidden');
      notdrawbtn.classList.remove('hidden');
      addText('<p>あなたのターンです！</p>');
      return;
    };

    master.classList.remove('title');
    enemy.classList.remove('hidden');
    me.classList.remove('hidden');

    start.textContent = 'OK';
    started = true;


    showEnemysSum.innerHTML = '? / 21';
    showMySum.innerHTML = mySum + ' / 21';

    myTefuda.forEach(card => {
      addValue(myCards, card);
    });
    enemysTefuda.forEach(card => {
      addValue(enemysCards, card);
    });

    const enemysFirstCard = document.querySelector('#enemy .cards p:first-of-type');
    enemysFirstCard.innerHTML = '?';

    addText('<p>最初の手札が配られました！</p>');

  });

  function total(array) {
    return array.reduce(function (sum, element) {
      return sum + element;
    });
  }

  let standContinues = 0;

  drawbtn.addEventListener('click', () => {
    if (mySum > 21) {
      drawbtn.classList.add('disabled');
      addText('<p>もう引けないよ～</p>');
      return;
    }

    standContinues = 0;
    addValue(myCards, yamafuda[0]);
    myTefuda.push(yamafuda[0]);
    yamafuda.shift();
    mySum = total(myTefuda);
    showMySum.innerHTML = mySum + ' / 21';

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


  function enemysTurn() {
    drawbtn.classList.add('hidden');
    notdrawbtn.classList.add('hidden');

    addText('<p>相手はどうするのかな？？</p><button id="btn">Next</button>');

    document.getElementById('btn').addEventListener('click', () => {
      let randomNumber = Math.ceil(Math.random() * 10);
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

  function actionToYourTurn() {
    addText('<p>あなたのターンです！</p>');
    drawbtn.classList.remove('disabled', 'hidden');
    notdrawbtn.classList.remove('hidden');
  }

  function EnemyDraws() {
    standContinues = 0;

    addValue(enemysCards, yamafuda[0]);
    enemysTefuda.push(yamafuda[0]);
    yamafuda.shift();

    enemysSum = total(enemysTefuda);

    addText('<p>相手はカードを引いた！</p><button id="btn">OK</button>')

    document.getElementById('btn').addEventListener('click', () => {
      actionToYourTurn();
    });
  }

  function EnemyNotDraws() {
    standContinues++;

    addText('<p>相手はカードを引かなかった！</p><button id="btn">OK</button>')

    document.getElementById('btn').addEventListener('click', () => {
      if (standContinues === 2) {
        endGame();
        return;
      }
      actionToYourTurn();
    });
  }

  function endGame() {
    drawbtn.classList.add('hidden');
    notdrawbtn.classList.add('hidden');

    addText('<p>両者のカードが出揃いました！</p><button id="btn">結果へ</button>')
    const btn = document.getElementById('btn');

    btn.addEventListener('click', () => {

      const enemysFirstCard = document.querySelector('#enemy .cards>p:first-of-type');
      enemysFirstCard.innerHTML = enemysTefuda[0];

      showEnemysSum.innerHTML = enemysSum + ' / 21';

      const youWin = '<h2>ゲーム終了</h2><p>あなたの勝ちです！！やったね！</p>';
      const youLose = '<h2>ゲーム終了</h2><p>あなたの負けです！！残念・・・</p>';
      const tie = '<h2>ゲーム終了</h2><p>今回の勝負は引き分け！</p>';
      const blackJack = youWin + '<h5>ブラックジャックで勝利！すごい！</h5>';
      function addReplayBtn() {
        addValue(master, '<a href="" class="replay">Replay</a>');
      }


      if (mySum > 21) {
        if (enemysSum > 21) {
          addText(tie);
          addReplayBtn();
          return;
        }
        addText(youLose);
      } else {
        if (enemysSum > 21) {
          addText(youWin);
          if (mySum === 21) {
            addText(blackJack);
          }
          addReplayBtn();
          return;
        }
        if (mySum > enemysSum) {
          addText(youWin);
          if (mySum === 21) {
            addText(blackJack);
          }
        } else if (mySum === enemysSum) {
          addText(tie);
        } else {
          addText(youLose);
        }
      }
      addReplayBtn();
    });
  }


}