document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let width=10;
  let height=10;
  let squares = [];


  function createBoard() {
    for (let i=0; i < width*height; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

});