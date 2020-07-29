document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let width=10;
  let height=10;
  let bombCount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  function createBoard() {
    const bombsArray = Array(bombCount).fill('bomb');
    const emptyArray = Array((width*height) - bombCount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    
    // TODO: Improve randomness
    const shuffledArray = gameArray.sort(() => Math.random() -0.5);

    console.log(gameArray);
    console.log("Shuffled:", shuffledArray);
    
    // Create grid of div elements with unique IDs.
    for (let i=0; i < width*height; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i])
      grid.appendChild(square);
      squares.push(square);

      // Left click
      square.addEventListener("click", ()=>{leftClickHandler(square)});
      square.oncontextmenu = function(e) {
        e.preventDefault();
        addFlag(square);
      }
    }

    // Add bomb proximity numbers to each square.
    for (let i=0; i<squares.length; i++) {
      let nearbyBombs = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width-1;
      const isTopEdge = i < width;
      const isBottomEdge = (i > (squares.length - width - 1));

      if (squares[i].classList.contains('valid')) {
        // Look left
        if (!isLeftEdge && squares[i-1].classList.contains('bomb'))
          nearbyBombs++;
        // Look right
        if (!isRightEdge && squares[i+1].classList.contains('bomb'))
          nearbyBombs++;
        // Look up
        if (!isTopEdge && squares[i-width].classList.contains('bomb'))
          nearbyBombs++;
        // Look down
        if (!isBottomEdge && squares[i+width].classList.contains('bomb'))
          nearbyBombs++;
        // Upper left
        if (!isTopEdge && !isLeftEdge && squares[i-width-1].classList.contains('bomb'))
          nearbyBombs++;
        // Upper right
        if (!isTopEdge && !isRightEdge && squares[i-width+1].classList.contains('bomb'))
          nearbyBombs++;
        // Lower left
        if (!isBottomEdge && !isLeftEdge && squares[i+width-1].classList.contains('bomb'))
          nearbyBombs++;
        // Lower right
        if (!isBottomEdge && !isRightEdge && squares[i+width+1].classList.contains('bomb'))
          nearbyBombs++;
        squares[i].setAttribute('data', nearbyBombs);
      }
    }
  }

  createBoard();

  // Left click
  function leftClickHandler(square) {
    let currentId = square.id;
    if (isGameOver)
      return;
    if (square.classList.contains('checked') || square.classList.contains('flag'))
      return;
    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      const bombs = square.getAttribute('data');
      if(bombs != 0) {
        square.innerHTML = square.getAttribute('data');
      } else {
        square.classList.add('clear');
        square.classList.add('checked');
        checkSquare(square, currentId);
      }
      square.classList.add('checked');
    }
  }

  function addFlag(square) {
    console.log(`Flaging ${square.classList.contains('checked') ? 'checked' : 'unchecked'} square.`);
    if (isGameOver)
      return;
    if (!square.classList.contains('checked') && flags < bombCount) {
      square.classList.add('flag');
      square.innerHTML = '🚩';
      flags++;
      console.log("Adding flag. Total:", flags);
    } else {
      square.classList.remove('flag');
      square.innerHTML = '';
      flags--;
      console.log("Removing flag. Total:", flags);
    }
    checkForWin();
  }

  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = (currentId % width === width - 1);
    const isTopEdge = currentId < width;
    const isBottomEdge = (currentId > (squares.length - width - 1));

    // Should this just use a promise instead?
    setTimeout(() => {

      // Look left OK
      if(currentId > 0 && !isLeftEdge) {
        const newId = squares[currentId - 1].id;
        const newSquare = document.getElementById(newId);
        leftClickHandler(newSquare);
      }

      // Upper diagonal?
      // if(!isTopEdge && !isRightEdge) {
      //   const newId = squares[parseInt(currentId) + 1 - width].id;
      //   const newSquare = document.getElementById(newId);
      //   leftClickHandler(newSquare);
      // }

      // Look up OK
      if(!isTopEdge) {
        const newId = squares[currentId - width].id;
        const newSquare = document.getElementById(newId);
        leftClickHandler(newSquare);
      }

      // Look Right OK
      if(currentId < squares.length-1 && !isRightEdge) {
        const newId = squares[parseInt(currentId)+1].id;
        const newSquare = document.getElementById(newId);
        leftClickHandler(newSquare);
      }

      // Look down OK
      if(!isBottomEdge) {
        const newId = squares[parseInt(currentId)+width].id;
        const newSquare = document.getElementById(newId);
        leftClickHandler(newSquare);
      }
    }, 10); // setTimeout
  } // checkSquare

  function gameOver(square) {
    console.log('BOOM! Game over!');
    isGameOver = true;

    // Show all the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
      } // if
    }); // forEach
  } // gameOver()

  function checkForWin() {
    let matches = 0;

    for (let i=0; i<squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === bombCount) {
        console.log ('Winner winner chicken dinner!');
        isGameOver = true;
      } // if
    } // for
  } // checkForWin()
});