document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let width=10;
  let height=10;
  let bombCount = 20;
  let squares = [];

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
      square.innerHTML = i; // TODO: Replace square number with bomb #
      grid.appendChild(square);
      squares.push(square);
    }

    // Add bomb proximity numbers to each square.
    for (let i=0; i<squares.length; i++) {
      let nearbyBombs = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width-1;
      const isTopEdge = i < width;
      const isBottomEdge = (i > (squares.length - width - 1));
      // console.log(`${i}: squares.length=${squares.length}, width=${width}, isBottomEdge= ${isBottomEdge}`);
      // if (isBottomEdge) console.log(`Bottom (${i})`);

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
        
        document.getElementById(i).innerHTML = nearbyBombs;
      }
    }



  }
  createBoard();

});