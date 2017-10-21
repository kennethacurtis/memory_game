/*
 * Create a list that holds all of your cards
 */
var icons = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube', 'anchor']
var opened = []
var matched = []
var deck = $('.deck')

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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


function beginGame() {
  opened.length = 0;
  matched.length = 0;
  var cards = shuffle(icons);
  $('.deck').empty();
  $('.moves').text('0');
  for (var x=0; x<16; x++) {
    $('.deck').append($('<li class="card"><i class= "fa fa-' + icons[x] + '"' + '></i></li>'))
  }
  cardEventListener();
};


function complete() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'You win!',
    text: 'Give it another try!',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function(isConfirm) {
    if (isConfirm) {
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
        complete();
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
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      beginGame();
    }
  })
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function cardEventListener() {
  $('.card').click(function() {
    $(this).addClass('open show');
    var clickedClass = $(this).children('i').attr("class");
    opened.push(clickedClass);
    if (opened.length > 1) {
      matchChecker();
    }
  })
};



beginGame();
