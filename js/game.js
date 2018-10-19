/****************************************
 * WHAT DID WE LEARN:
 * - setInterval
 * - Dynamic DOM Generation with JQuery
 * - Game Loop Logic
 * *************************************/

$(document).ready(function () {
    /****************************
     * Variables and constant for
     * the game.
     * *************************/

    const width = 640;
    const height = 640;
    const size = 41;

    let command = null;
    let isGameFinished = false;
    let toBeClearedFields = [];
    let points = 0;

    let snake = {
        history: [{
            x:0,
            y:0
        }]
    };

    let food = {
        x: Math.floor(Math.random() * size),
        y:Math.floor(Math.random() * size)
    };

    /****************************
     * Creates dynamically the
     * fields of the board
     * *************************/
    function createDivElem(size) {
        let boxWidth = width / size;
        let boxHeight = height / size;
        let boxStyle = `
            width:${boxWidth}px;
            height:${boxHeight}px;
        `;
        return $(`<div class="board_tile" style="${boxStyle}"></div>`);
    }
    /****************************
     * Draws the gameboard
     * *************************/
    function drawBoard(size) {
        let gameboard = $("#gameboard");
        for (let i = 0; i < size; i++) {
            let row = $("<div id='" + i + "' class='container'></div>");
            for (let j = 0; j < size; j++) {
                let elem = createDivElem(size);
                elem.attr("id", "r" + i + "c" + j);
                row.append(elem);
            }
            gameboard.append(row);
        }
    }

    /****************************
     * Updates snake movement and
     * state before rendering the scene
     * *************************/
    function updateSnakeMovement() {
        let newPos = {x: snake.history[0].x, y: snake.history[0].y};
        toBeClearedFields.push(snake.history.pop());
        if (command !== null) {
            switch (command) {
                case "LEFT":
                    newPos.x--;
                    break;
                case "UP":
                    newPos.y--;
                    break;
                case "RIGHT":
                    newPos.x++;
                    break;
                case "DOWN":
                    newPos.y++;
                    break;
            }
        }
        snake.history.unshift(newPos);
    }

    /****************************
     * Updates game state before
     * rendering the scene
     * *************************/
    function updateGameFinishedState(){
        if(snake.history[0].x < 0 || snake.history[0].x >= size
            || snake.history[0].y < 0 || snake.history[0].y >= size){
            isGameFinished = true;
        }
    }

    /****************************
     * Updates food and snake states
     * in event of acquiring food
     * before rendering
     * *************************/
    function updateFoodAcquiredState(){
        if(snake.history[0].x === food.x && snake.history[0].y === food.y){
            $("#success").get(0).play();
            points = points + 10;
            $("#points").html(points);
            snake.history.unshift({x:snake.history[0].x,y:snake.history[0].y});
            toBeClearedFields.push(food);
            food.x = Math.floor(Math.random() * size);
            food.y = Math.floor(Math.random() * size);
        }
    }

    /****************************
     * Draws snake onto board
     * *************************/
    function drawSnake(){
        for(let i = 0; i < snake.history.length;i++){
            let id = "r" + snake.history[i].y + "c" + snake.history[i].x;
            if(i === 0){
                $(`#${id}`).css("backgroundColor","green");
            }else{
                $(`#${id}`).css("backgroundColor","black");
            }
        }
    }

    /****************************
     * Draws food onto board
     * *************************/
    function drawFood(){
        let id = "r" + food.y + "c" + food.x;
        $(`#${id}`).css("backgroundColor","red");
    }

    /****************************
     * Instead of refreshing the
     * entire board, we only
     * clean the fields that are
     * no longer used by the snake
     * or by food
     * *************************/
    function clearBoardColoration(){
        if(toBeClearedFields.length === 0) return;
        while(toBeClearedFields.length > 0){
            let field = toBeClearedFields.pop();
            let id = "r" + field.y + "c" + field.x;
            $(`#${id}`).css("backgroundColor","#f2f2f2");
        }
    }


    /****************************
     * Functions that only render
     * once go in here
     * *************************/
    function renderOnce(){
        drawBoard(size);
    }

    /****************************
     * Updates game states before
     * rendering the scene
     * *************************/
    function update(){
        updateSnakeMovement();
        updateGameFinishedState();
        updateFoodAcquiredState();
    }

    /****************************
     * Draws game elements on to
     * board
     * *************************/
    function render(){
        clearBoardColoration();
        drawFood();
        drawSnake();
    }

    function startGameLoop(){
        renderOnce();
        let interval_handler = setInterval(function () {
            update();
            render();
            if(isGameFinished){
                clearInterval(interval_handler);
                let audio = $("#loose").get(0);
                audio.play().then(()=>{
                    alert("You loose");
                });
            }
        }, 50);
    }

    /****************************
     * Game Key listeners
     * *************************/
    $(document).keydown(function(event){
        if(event.which === 27) isGameFinished = true;
        if(event.which === 37) command = "LEFT";
        if(event.which === 38) command = "UP";
        if(event.which === 39) command = "RIGHT";
        if(event.which === 40) command = "DOWN";
    });

    /****************************
     * Restart button listener
     * *************************/
    $("#restartBtn").click(function(event){
        document.location.reload();
    });

    startGameLoop();
});