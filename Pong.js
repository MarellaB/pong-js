var canvas = document.getElementById('PONG-JS'),
    ctx = canvas.getContext('2d');

var showDebug = false;
    
var Player = function(right) {
    this.x = 0;
    this.y = 0;
    this.speed = window.innerHeight/128;
    this.width = 30;
    this.height = 80
    this.color = '#006622';
    this.score = 0;
    
    this.init = function() {
        if (right) {
            this.x = canvas.width - (45 + this.width);
        } else {
            this.x = 45;
        }
        this.y = canvas.height/2 - this.height/2;
        return this;
    }
    
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    this.moveUp = function() {
        if (this.y > 0) {
            this.y -= this.speed;
        }
    }
    
    this.moveDown = function() {
        if (this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }
    
    this.checkCollide = function() {
        if (ball.y + ball.rad*2 > this.y && ball.y < this.y + this.height) {
            if (ball.x + ball.rad*2 > this.x && ball.x < this.x + this.width) {
                if (right) {
                    ball.bounce('x', true);
                } else {
                    ball.bounce('x', false)
                }
            }
        }
    }
}

var Ball = function() {
    this.x = 0;
    this.y = 0;
    this.rad = 8;
    this.x_vel = 0;
    this.y_vel = 0;
    this.speedCap = 2;
    this.bounceCount = 0;
    
    this.init = function() {
        this.x = canvas.width/2 - this.rad;
        this.y = canvas.height/2 - this.rad;
        if (Math.random(1) > 0.5) {
            this.x_vel = 1;
        } else {
            this.x_vel = -1;
        }
        if (Math.random(1) > 0.5) {
            this.y_vel = 1;
        } else {
            this.y_vel = -1;
        }
        this.bounceCount = 0;
        this.speedCap = 2;
        return this;
    }
    
    this.bounce = function(plane, neg) {
        switch (plane) {
            case 'x':
                if (neg) {
                    this.x_vel = -Math.floor(Math.random(this.speedCap+1)+this.speedCap);
                } else {
                    this.x_vel = Math.floor(Math.random(this.speedCap+1)+this.speedCap);
                }
                break;
            case 'y':
                if (neg) {
                    this.y_vel = -Math.floor(Math.random(this.speedCap+1)+this.speedCap);
                } else {
                    this.y_vel = Math.floor(Math.random(this.speedCap+1)+this.speedCap);
                }
                break;
        }
        
        this.bounceCount += 1;
    }
    
    this.update = function() {
        this.x += this.x_vel;
        this.y += this.y_vel;
        
        if (this.bounceCount >= 5) {
            this.increaseSpeed();
            this.bounceCount = 0;
        }
        
        if (this.x < playerLeft.x) {
            playerRight.score += 1;
            reset();
        } else if (this.x > playerRight.x + playerRight.width) {
            playerLeft.score += 1;
            reset();
        }
        
        if (this.y < 0) {
            this.bounce('y', false);
        } else if (this.y + this.rad*2-10 > canvas.height) {
            this.bounce('y', true);
        }
    }
    
    this.draw = function() {
        ctx.fillStyle = '#006622';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 360, false);
        ctx.fill();
    }
    
    this.increaseSpeed = function() {
        this.speedCap += 1;
    }
}


function logic() {
    if (Key.isDown(Key.LEFT_UP)) playerLeft.moveUp();
    if (Key.isDown(Key.LEFT_DOWN)) playerLeft.moveDown();
    if (Key.isDown(Key.RIGHT_DOWN)) playerRight.moveDown();
    if (Key.isDown(Key.RIGHT_UP)) playerRight.moveUp();
    
    ball.update();
    playerLeft.checkCollide();
    playerRight.checkCollide();
};

function reset() {
    playerLeft.init();
    playerRight.init();
    ball.init();
}

function resizeCanv(fullscreen, w, h) {
    if (fullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = w;
        canvas.height = h;
    }
}

resizeCanv(true);

var playerLeft = new Player(false).init(),
    playerRight = new Player(true).init(),
    ball = new Ball().init();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    playerLeft.draw();
    playerRight.draw();
    ball.draw();
    ctx.font='50px bold Arial';
    ctx.fillText(playerLeft.score + ' | ' + playerRight.score, canvas.width/2-42, 100, 1000);
    
    if (showDebug) {
        ctx.strokeStyle = '#f00';
        ctx.rect(playerLeft.x, playerLeft.y, playerLeft.width, playerLeft.height);
        ctx.rect(playerRight.x, playerRight.y, playerRight.width, playerRight.height);
        ctx.stroke();
    }
}

var Key = {
    _pressed: {},
    
    LEFT_UP: 87,
    LEFT_DOWN: 83,
    RIGHT_DOWN: 40,
    RIGHT_UP: 38,
    
    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
    
    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

setInterval(loop, 3.333333);
setInterval(logic, 3.33333);


//DEBUG STUFF
function debugDisplay() {
}

setInterval(debugDisplay(), 3.33333);