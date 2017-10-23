
var icons = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube', 'anchor']
var opened = []
var matched = []
var deck = $('.deck');
var stars = 3




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


var moveCounter = {
  moves: 0 ,
  increment: function() {
    this.moves++
  },
  reset: function() {
    this.moves = 0;
  }
};

function timer() {
  var start = new Date;
  timerstop = setInterval(function() {
      $('.timer').text(Math.round((new Date - start) / 1000,0));
      if ($('.match').length === 16) {
        return;
      }
  }, 1000);
};

function beginGame() {
  opened.length = 0;
  matched.length = 0;
  var cards = shuffle(icons);
  $('.deck').empty();
  $('.moves').text('0');
  for (var x=0; x<16; x++) {
    $('.deck').append($('<li class="card"><i class= "fa fa-' + icons[x] + '"' + '></i></li>'))
  }
  timer();
  cardEventListener();
};


function complete(moves, time, stars) {
  clearInterval(timerstop);
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'You win!',
    text: 'You have matched all of the cards in ' + moves + ' moves, with a time of ' + time + ' seconds, and a rating of ' + stars + ' stars. Try Again?',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      clearInterval(timerstop);
      ratingReset();
      moveCounter.reset();
      beginGame();
    }
  })
};


function matchChecker() {
  if (opened[0] === opened[1]){
    setTimeout(function() {
      deck.find('.open').addClass('match animated rubberBand');
      var changeList = opened.splice(0,2);
      matched.push(changeList);
      if ($('.match').length === 16) {
        moves = moveCounter.moves;
        time = $('.timer').text();
        complete(moves, time, stars);
      }
    }, 500);
  }
  else {
    setTimeout(function() {
      deck.find('.open').removeClass('open show');
      opened.length = 0;
    }, 500);
  }
};


$('.restart').bind('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game'
  }).then(function(isConfirm) {
    if (isConfirm) {
      clearInterval(timerstop);
      ratingReset();
      moveCounter.reset();
      beginGame();
    }
  })
});



function ratingTracker() {
  if (moveCounter.moves > 30) {
    $("#star3").attr('class', 'fa fa-star-o');
    stars = 2;
  }
  if (moveCounter.moves > 60) {
    $("#star2").attr('class', 'fa fa-star-o');
    stars = 1;
  }
  if (moveCounter.moves > 90) {
    $("#star1").attr('class', 'fa fa-star-o');
    stars = 0;
  }
};


function ratingReset() {
  $('.stars').remove();
  $('.moves').remove();
  $('.Movestext').remove();
  $('.score-panel').append($('<ul class="stars"></ul>'));
  starnum = 1;
  for (var x=0; x<3; x++) {
    $('.stars').append($('<li><i id="star' + starnum + '"' + 'class="fa fa-star"></i></li>'))
    starnum++;
  };
  $('.score-panel').append($('<span class="moves">0</span><p class="Movestext">Moves</p>'));
};


function cardEventListener() {
  $('.card').click(function() {
    $(this).addClass('open show');
    var clickedClass = $(this).children('i').attr("class");
    opened.push(clickedClass);
    ratingTracker();
    $('.moves').text(function(){
      moves = moveCounter.moves;
      moveCounter.increment();
      return moves;
    })
    if (opened.length > 1) {
      matchChecker();
    }
  })
};


beginGame();
