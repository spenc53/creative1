let KEYS = {UP:38, DOWN:40, RIGHT:39, LEFT:37}
let STATE = {X:0, Y:0, _X:0, _Y:0, SPEED:2, MODE:1, SCORE:0, LEVEL:1, NEXT:10, ACTUAL_SCORE:0,COLOR:'0xfff'} // MODE: 1=Playing, 0=Lost
let OBJECT_STATE = {RATE:50, SPEED:1, CURRENT:1, PRODUCE:1}
let LEVELS = {
  0:{NEXT:0},
  1:{RATE:50,SPEED:1,PRODUCE:1,NEXT:10,COLOR:'0xfff'},
  2:{RATE:47,SPEED:2,PRODUCE:1,NEXT:40,COLOR:'#0000ff'},
  3:{RATE:44,SPEED:3,PRODUCE:1,NEXT:80,COLOR:'#0c70b2'},
  4:{RATE:40,SPEED:4,PRODUCE:2,NEXT:120,COLOR:'#15bbd8'},
  5:{RATE:36,SPEED:6,PRODUCE:3,NEXT:200,COLOR:'#147c0b'},
  6:{RATE:32,SPEED:8,PRODUCE:3,NEXT:350,COLOR:'#7c7c0b'},
  7:{RATE:28,SPEED:12,PRODUCE:3,NEXT:500,COLOR:'#d88715'},
  8:{RATE:23,SPEED:16,PRODUCE:3,NEXT:800,COLOR:'#ff7200'},
  9:{RATE:15,SPEED:22,PRODUCE:4,NEXT:1500,COLOR:'#ff0000'}
}
let OBJECT_CLASS = 'glyphicon glyphicon-chevron-down'
let INTERVAL = 10;
let STARS = 30;
let CHAR = '#person';


$(document).ready(() => {
  let SCREEN_WIDTH = document.getElementById('game-screen').clientWidth;
  let SCREEN_HEIGHT = document.getElementById('game-screen').clientHeight;
  let tid = setInterval(loop, INTERVAL);
  let x = Math.floor(Math.random()*(SCREEN_WIDTH-100)+50)
  let y = SCREEN_HEIGHT-70;
  STATE.X = x;
  STATE.Y = y;
  $(CHAR).css({
    'top': y + 'px',
    'left': x + 'px'
  });

  $(document).keydown( e => {
    let key = e.which;
    if(key == KEYS.UP) STATE._Y = -1;
    else if(key == KEYS.DOWN) STATE._Y = 1;
    else if(key == KEYS.LEFT)STATE._X = -1;
    else if(key == KEYS.RIGHT)STATE._X = 1;
    if(key == 50)STATE.MODE = 1;
    if(key == 49)STATE.MODE = 0;
  })

  $(document).keyup( e => {
    let key = e.which;
    if(key == KEYS.UP) STATE._Y = 0;
    else if(key == KEYS.DOWN) STATE._Y = 0;
    else if(key == KEYS.LEFT)STATE._X = 0;
    else if(key == KEYS.RIGHT)STATE._X = 0;
  })

  function loop() {
    if(STATE.MODE != 1)return;
    $('#level').text('Level  ' + STATE.LEVEL);
    $('#score').text('Score: ' + STATE.ACTUAL_SCORE);
    if((STATE._X>0 && STATE.X+60 < SCREEN_WIDTH) || (STATE._X<0 && STATE.X > 10)) {
      STATE.X += STATE._X * STATE.SPEED;
      $(CHAR).css('left',STATE.X + 'px');
    }
    if((STATE._Y>0 && STATE.Y+60 < SCREEN_HEIGHT) || (STATE._Y<0 && STATE.Y > 10)) {
      STATE.Y += STATE._Y * STATE.SPEED;
      $(CHAR).css('top',STATE.Y + 'px');
    }
    if(--OBJECT_STATE.CURRENT == 0 ) {
      let CREATE = Math.floor(OBJECT_STATE.SPEED/5)+1;
      if(CREATE > 2) CREATE = 2;
      for(let i = 0;i<CREATE;i++) {
        OBJECT_STATE.CURRENT = OBJECT_STATE.RATE;
        let x = Math.floor(Math.random()*(SCREEN_WIDTH-100)+50);
        let obj = '<span class="active object ' + OBJECT_CLASS + '" style="color:' + STATE.COLOR + '"></span>';
        $('body').prepend(obj);
        $('.active').css({left:x}).removeClass('active');
      }
    }
    if(--STARS == 0) {
      STARS = 10;
      let x = Math.floor(Math.random()*(SCREEN_WIDTH-100)+50);
      let obj = '<span class="active dot" style="color:black"></span>';
      $('body').prepend(obj);
      $('.active').css({left:x}).removeClass('active');
    }
    $('.dot').each((index,element) => {
      let y = $(element).css('top');
      y = parseInt(y.substring(0,y.length-2));
      y += 3;
      $(element).css('top',y + 'px');
      if(y+7 >= SCREEN_HEIGHT) {
        $(element).hide();
        $(element).remove();
      }
    })

    $('.object').each((index, element) => {
      let y = $(element).css('top');
      let x = $(element).css('left');
      y = parseInt(y.substring(0,y.length-2));
      x = parseInt(x.substring(0,x.length-2));
      y += OBJECT_STATE.SPEED;
      $(element).css('top',y + 'px');
      if(y+7 >= SCREEN_HEIGHT) {
        $(element).hide();
        $(element).remove();
        STATE.ACTUAL_SCORE += Math.ceil(STATE.LEVEL/((STATE.Y+100)/SCREEN_HEIGHT));
        if(++STATE.SCORE >= STATE.NEXT) {
          OBJECT_STATE.SPEED = LEVELS[++STATE.LEVEL].SPEED;
          OBJECT_STATE.RATE = LEVELS[STATE.LEVEL].RATE;
          OBJECT_STATE.PRODUCE = LEVELS[STATE.LEVEL].PRODUCE;
          STATE.NEXT = LEVELS[STATE.LEVEL].NEXT;
          STATE.COLOR = LEVELS[STATE.LEVEL].COLOR;
          OBJECT_STATE.CURRENT = 2;
          $(CHAR).css('border-color',STATE.COLOR);
          $('#progress-bar').css('border-color',STATE.COLOR);
        }
      }
      if (y+7>STATE.Y && y+7<STATE.Y+50 && x+7>STATE.X && x+7<STATE.X+50) {
        gameover();
        STATE.MODE = 0;
      }
    })
    let percent = Math.floor((STATE.SCORE - LEVELS[STATE.LEVEL-1].NEXT+1)/(STATE.NEXT-LEVELS[STATE.LEVEL-1].NEXT)*100);
    $('#progress-bar').css('width',percent + '%');
  }

  function gameover() {
    $('#final-score').text('FINAL SCORE: ' + STATE.ACTUAL_SCORE);
    if(STATE.LEVEL+1 in LEVELS)
      $('#gameover').css({'border-color':LEVELS[STATE.LEVEL+1].COLOR})
    $('#gameover').css({
      top:(SCREEN_HEIGHT/2-$('#gameover').outerHeight()/2),
      left:(SCREEN_WIDTH/2-$('#gameover').outerWidth()/2),
      visibility:'visible'
    }).show();
  }

  $('#yes').click( () => {
    if(!$('#gameover').is(':visible'))return;
    $('#gameover').hide();
    STATE = {X:0, Y:0, _X:0, _Y:0, SPEED:2, MODE:1, SCORE:0, LEVEL:1, NEXT:10, ACTUAL_SCORE:0,COLOR:'0xfff'} // MODE: 1=Playing, 0=Lost
    OBJECT_STATE = {RATE:50, SPEED:1, CURRENT:1, PRODUCE:1}
    $('.object').each((i,e) => {e.remove()});
    let x = Math.floor(Math.random()*(SCREEN_WIDTH-100)+50)
    let y =SCREEN_HEIGHT-70;
    STATE.X = x;
    STATE.Y = y;
    $(CHAR).css({
      'top': y + 'px',
      'left': x + 'px'
    });
    $(CHAR).css('border-color',STATE.COLOR);
    $('#progress-bar').css('border-color',STATE.COLOR);
  })
});
