
// List of icons that will appear once the user has clicked on a hidden card.
// The name of the cards are associated with images in FontAwesome here: http://fontawesome.io/icons/
var icons = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube', 'anchor']

// An array used to store the class name of the cards the user clicks on.
var opened = []

// An array used to store the cards that are matched from the "opened" list.
// Each index number is a pair of matched cards.
var matched = []

// variable used to store the class "deck". This variable was needed globally.
var deck = $('.deck');

// variable used to store the default rating of the matching game. If the user
// matches all of the cards under 30 moves, they get a three star rating.
var stars = 3


// Shuffle function from http://stackoverflow.com/a/2450976
// Used to shuffle the icons array when the user has completed or restarted the game.
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


// prepares the game for the user.
function beginGame() {
  //resets the opened array.
  opened.length = 0;
  //resets the matched array.
  matched.length = 0;
  //shuffles the icons array.
  var cards = shuffle(icons);
  //empty out all elements from the "deck" class.
  $('.deck').empty();
  // sets the move count to zero.
  $('.moves').text('0');
  // loop that creates each card under the "deck" class.
  for (var x=0; x<16; x++) {
    $('.deck').append($('<li class="card"><i class= "fa fa-' + icons[x] + '"' + '></i></li>'))
  }
  //starts the timer.
  timer();
  cardEventListener();
};


// function for when the user clicks on a card.
function cardEventListener() {
  //when a user clicks on card
  $('.card').click(function() {
    // add the class "open" and "show"
    $(this).addClass('open show');
    //stores the class name of card in the clickedClass variable
    var clickedClass = $(this).children('i').attr("class");
    //add class to opened array
    opened.push(clickedClass);
    // init function for tracking star rating
    ratingTracker();
    // changes the HTML content in class "moves"
    $('.moves').text(function(){
      //store the amount of moves in variable
      moves = moveCounter.moves;
      //increment the amount of moves each click
      moveCounter.increment();
      //return the amount.
      return moves;
    })
    //if there's more than one card open,
    //check to see if they are the same
    if (opened.length > 1) {
      matchChecker();
    }
  })
};


//object that stores, resets, and increments
//the amount of moves the user has made
var moveCounter = {
  moves: 0 ,
  increment: function() {
    this.moves++
  },
  reset: function() {
    this.moves = 0;
  }
};


function matchChecker() {
  //if the two cards in the opened array match
  if (opened[0] === opened[1]){
    setTimeout(function() {
      //animate the cards and leave them open
      deck.find('.open').addClass('match animated rubberBand');
      //take the two cards from the opened array and put
      //them in the matched array
      var changeList = opened.splice(0,2);
      matched.push(changeList);
      //if the game is complete, store the amount of moves
      //and time and initialize the complete function
      if ($('.match').length === 16) {
        moves = moveCounter.moves;
        time = $('.timer').text();
        complete(moves, time, stars);
      }
    }, 500);
  }
  else {
    //if the cards do not match, hide them
    setTimeout(function() {
      deck.find('.open').removeClass('open show');
      opened.length = 0;
    }, 500);
  }
};


//when the user has matched all of the cards, this function
//uses the values of the moves, time, and stars to display it
//to the user. They are then given the option to play the game again.
//This rescource is from Sweet Alerts, here: https://limonte.github.io/sweetalert2/
function complete(moves, time, stars) {
  clearInterval(timerstop);
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'You win!',
    text: 'You have matched all of the cards in ' + (moves-1) + ' moves, with a time of ' + time + ' seconds, and a rating of ' + stars + ' stars. Try Again?',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      //stops timer
      clearInterval(timerstop);
      //resets the star rating
      ratingReset();
      //resets moves
      moveCounter.reset();
      //begin game again
      beginGame();
    }
  })
};


//the function derives from this StackOverFlow question: https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
//increments a number by 1 to the content in the "timer" class every 1000 milliseconds
function timer() {
  var start = new Date;
  timerstop = setInterval(function() {
      $('.timer').text(Math.round((new Date - start) / 1000,0));
      if ($('.match').length === 16) {
        //used to exit interval function
        return;
      }
  }, 1000);
};


//when the user clicks on the restart button, there is a
//pop up that asks them if they want to restart the game.
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
      //stops timer
      clearInterval(timerstop);
      //reset rating
      ratingReset();
      //reset amount of moves
      moveCounter.reset();
      //start the game again
      beginGame();
    }
  })
});


//function used for reseting the star rating
//after the game is restarted or completed
function ratingReset() {
  //removes all content from the score panel section
  $('.stars').remove();
  $('.moves').remove();
  $('.Movestext').remove();
  //adds the stars back to the score panel
  $('.score-panel').append($('<ul class="stars"></ul>'));
  starnum = 1;
  for (var x=0; x<3; x++) {
    $('.stars').append($('<li><i id="star' + starnum + '"' + 'class="fa fa-star"></i></li>'))
    starnum++;
  };
  //adds the moves number back to the score panel
  $('.score-panel').append($('<span class="moves">0</span><p class="Movestext">Moves</p>'));
};


//tracks the number of stars based on the amount
//of moves the user has made. Each tier of moves
//changes the class name of the three stars. This
//function also stores the number of stars used in
//the complete function.
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



beginGame();
