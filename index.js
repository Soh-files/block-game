let gameFL = 0;

const $back = document.getElementById('bk');
const $text = document.getElementById('txt');
const $button = document.getElementById('btn');
const $home = document.getElementById('home');
const $touchswitch = document.getElementById('toucharea');
const $leftswitch = document.getElementById('left');
const $rightswitch = document.getElementById('right');

let blockTotal = 0;
let blockCount = 0;

// キャンバスの作成
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// 要素の作成
const ball = {
    x: null,
    y: null,
    width: canvas.width / 100,
    height: canvas.height / 100,
    speed: 1.3,
    dx: null,
    dy: null,

    update: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        this.x += this.dx;
        this.y += this.dy;

        if (this.x > canvas.width || this.x < 0 ) {
            this.dx *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.dy *= -1;
        }
    }
}

const paddle = {
    x: null,
    y: null,
    width: canvas.width / 7,
    height: canvas.height / 50,
    speed: 0,

    update: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        this.x += this.speed;
        if (this.x < 0) {
            this.x = 0;
        } 
        if (this.x > canvas.width - this.width ) {
            this.x = canvas.width - this.width;
        }
    }
}

const block = {
    width: null,
    height: canvas.height / 25,
    data: [],

    update: function () {
        this.data.forEach(brick => {
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            ctx.stroke();
        })
    }
}

const level = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
]


// 関数
// 初期画面に戻る処理
const initScreen = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = '#FFF';
    $text.style.display = 'none';
    $button.style.display = 'block';
    $button.textContent = 'START';
    $home.style.display = 'none';
}

// ゲーム開始処理
const startGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $text.style.display = 'none';
    $button.style.display = 'none';
    $home.style.display = 'none';
    gameFL = 1;
    blockGame();
}

// 初期化処理
const init = () => {

    canvas.setAttribute('style', 'background-color: #CCEBED');
    $leftswitch.style.display = 'block';
    $rightswitch.style.display = 'block';

    // パドルの初期位置を指定
    paddle.x = ( canvas.width / 2 - paddle.width / 2 ) + 0.5;
    paddle.y = ( canvas.height - 10 ) + 0.5;

    // ボールの初期位置、スピードを指定
    ball.x = canvas.width / 2 + 0.5;
    ball.y = canvas.height / 2 + 0.5;
    ball.dx = ball.speed;
    ball.dy = ball.speed;

    // ブロックの位置を指定
    block.width = canvas.width / level[0].length - 0.05;
    for (let i=0; i < level.length; i++) {
        for (let j=0; j < level[i].length; j++) {
            if ( level[i][j] ) {
                block.data.push( {
                    x: block.width * j + 0.5,
                    y: block.height * i + 0.5,
                    width: block.width,
                    height: block.height
                })
                blockTotal += 1;
            }
        }
    }
}

// ループ処理
const loop = () => {

    if (gameFL === 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        paddle.update();
        ball.update();
        block.update();
    
        if (collide(paddle, ball)) {
            ball.dy *= -1;
            ball.y = paddle.y - ball.height;
        }
    
        
        block.data.forEach( (brick, index) => {
            if (collide(ball, brick)) {
                blockCount += 1;
                block.data.splice(index, 1);
                ball.dy *= -1;
            }
        })
        finishGame();
    
        window.requestAnimationFrame(loop);
    }
}

// ゲームオーバー or クリア判定
const finishGame = () => {
    if (collide(ball, block)) {
        blockCount += 1;
        console.log('hit!');
    }
    if ( blockCount === blockTotal ) {
        clearGame();
    }

    if (ball.y > canvas.height) {
        overGame();
    }
}

// あたり判定
const collide = (obj1, obj2) => {
    return obj1.x < obj2.x + obj2.width &&
           obj2.x < obj1.x + obj1.width &&
           obj1.y < obj2.y + obj2.height &&
           obj2.y < obj1.y + obj1.height;
}

// ゲームオーバー時の処理
const overGame = () => {
    gameFL = 0;
    blockTotal = 0;
    blockCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    block.data.length = 0;
    canvas.style.backgroundColor = '#000';
    $text.style.display = 'block';
    $text.textContent = 'GAME OVER';
    $text.style.color = '#F00';
    $button.style.display = 'block';
    $button.textContent = 'RETRY';
    $home.style.display = 'block';
    $leftswitch.style.display = 'none';
    $rightswitch.style.display = 'none';
}

// ゲームクリア時の処理
const clearGame = () => {
    gameFL = 0;
    blockTotal = 0;
    blockCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    block.data.length = 0;
    canvas.style.backgroundColor = '#F2D027';
    $text.style.display = 'block';
    $text.textContent = 'CLEAR!';
    $button.style.display = 'block';
    $button.textContent = 'RETRY';
    $home.style.display = 'block';
    $leftswitch.style.display = 'none';
    $rightswitch.style.display = 'none';
}

const blockGame = () => {
    // ゲーム実行処理
    if ( gameFL === 1 ) {
        init();
        loop();
    }
}

// プレイヤーの操作
// キーボードを操作したときの処理
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { 
        paddle.speed = -5;
    }
    if (e.key === 'ArrowRight') {
        paddle.speed = 5;
    }
} );

document.addEventListener('keyup', () => {
    paddle.speed = 0;
} );

// クリックしたときの処理
// ゲームスタート、リスタート処理
$button.addEventListener('click', () => {
    startGame();
});

$home.addEventListener('click', () => {
    initScreen();
});

// canvas下のスイッチでのパドル操作用
$leftswitch.addEventListener('mousedown', () => {
    paddle.speed = -5;
});
$leftswitch.addEventListener('mouseup', () => {
    paddle.speed = 0;
});

$rightswitch.addEventListener('mousedown', () => {
    paddle.speed = 5;
})
$rightswitch.addEventListener('mouseup', () => {
    paddle.speed = 0;
})

// タッチデバイスでのパドル操作用
$leftswitch.addEventListener('touchstart', () => {
    paddle.speed = -5;
});
$leftswitch.addEventListener('touchend', () => {
    paddle.speed = 0;
});

$rightswitch.addEventListener('touchstart', () => {
    paddle.speed = 5;
})
$rightswitch.addEventListener('touchend', () => {
    paddle.speed = 0;
})
