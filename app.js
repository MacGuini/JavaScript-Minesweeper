// Waits for the entire DOM to load before activating. This requires the script tag in the head
// This event will run once the whole document opens.
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false
    let flags = 0

    // Create Board
    function createBoard(){
        flagsLeft.innerHTML = bombAmount

        // get shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = shuffleArray(gameArray)
        // const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++){
            const square = document.createElement('div')
            square.id = i
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // Normal click
            square.addEventListener('click', (e) => {
                click(square)
            })

            // ctrl and left click
            square.addEventListener('contextmenu', (e) => {
                addFlag(square)
            })

        }

        // add numbers to squares
        for (let i = 0; i < squares.length; i++){
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')){
                // Checks left square
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                // Checks upper right square
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                // Checks upper square
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++
                // Checks upper left square
                if (i > 10 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++
                // Checks right square
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                // Checks bottom left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                // Checks bottom right
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                // Checks bottom square
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }
    }

    createBoard()
    // add flag with right click
    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)){
            if (!square.classList.contains("flag")){
                square.classList.add('flag')
                flags++
                square.innerHTML = 'P'
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            }else{
                square.classList.remove('flag')
                flags--
                square.innerHTML = ''
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    // Implementing the Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]]; // swap elements
        }
        return array;
    }
    
    function click(square){
        console.log(square)
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return

        if (square.classList.contains('bomb')){
            gameOver()
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                if (total == 5) square.classList.add('five')
                if (total == 6) square.classList.add('six')
                if (total == 7) square.classList.add('seven')
                if (total == 8) square.classList.add('eight')
                square.innerHTML = total
                return
            }
            checkSquare(square)
        }
        square.classList.add('checked')
    }

    // Check neighboring squares once square is clicked
    function checkSquare(square){
        const currentId = square.id
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(function(){
            if(currentId > 0 && !isLeftEdge){
                const newId = parseInt(currentId) - 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge){
                const newId = parseInt(currentId) + 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9){
                const newId = parseInt(currentId) - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10 && !isLeftEdge){
                const newId = parseInt(currentId) - 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 99 && !isRightEdge){
                const newId = parseInt(currentId) + 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge){
                const newId = parseInt(currentId) - 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89 && !isRightEdge){
                const newId = parseInt(currentId) + 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isRightEdge){
                const newId = parseInt(currentId) + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }
    
    function checkForWin(){
        let matches = 0
        for (let i = 0; i < squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++
            }
            if(matches === bombAmount){
                result.innerHTML = "YOU WIN!"
                isGameOver = true
            }
        }
    }

    function gameOver(){
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        // show all the bombs
        squares.forEach(function(square){
            if(square.classList.contains('bomb')){
                square.innerHTML = 'X'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }
})