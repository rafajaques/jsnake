/**
 * jsnake.js
 * @author Rafael Jaques (@rafajaques)
 *
 * This is not intended to be the best JS on earth.
 * Just to be a proof of concept! :)
 * 
 * Enjoy!
 */

// Config
var _board_x = 20; // From 1 to 25
var _board_y = 20; // From 1 to 25
var _speed = 100; // In miliseconds. The lowest, the fastest
var _debug = true; // Display debug info

// Game variables

	/* x and y arrays indicating where the snake is */
	var _x = [7, 6, 5, 4, 3];
	var _y = [2, 2, 2, 2, 2];

	/* is the objective on the screen? */
	var _objectiveOnScreen = false;
	var _objective_x = null;
	var _objective_y = null;

	/* direction */
	var _dir = null;
	
	/* does the snake have to grow? */
	var _grow = false;
	
	/* pause and game over behavior */
	var _pause = false;
	var _gameover = false;
	
	/* color pallete */
	var _color = {
		board: "#fff",
		sh: "#00a" /* snake head */,
		sb: "#00f" /* snake body */,
		obj: "#f00" /* objective */
	}
	
	/* starting score */
	var _score = 0;
	

$(document).keydown(function(e){

	// LEFT    
	if (e.keyCode == 37) {
		if (_dir != "R")
			_dir = "L"
		return false;
	}
	// UP    
	else if (e.keyCode == 38) { 
		if (_dir != "D")
			_dir = "U"
		return false;
	}
	// RIGHT
	else if (e.keyCode == 39) {
		if (_dir != "L")
			_dir = "R"
		return false;
	}
	// DOWN   
	else if (e.keyCode == 40) { 
		if (_dir != "U")
			_dir = "D"
		return false;
	}
	
});

// Runs the game! :)

$(function() {
	createBoard();

	runGame();
});

function runGame() {
	drawSnake();
	
	if (_dir)
		step();
	
	placeObjective();
	
	if (detectCollision()) {
		alert("You lose!");
		return false;
	}
	
	// Next step
	setTimeout(function() { runGame() }, _speed);
}

function drawSnake() {
	// Clear board
	clearBoard();
	
	// For each of snake blocks...
	for (i = 0; i < _x.length; i++) {
		// Draws snake
		$("#" + _y[i] + "-" + _x[i]).css("backgroundColor", _color[(!i ? "sh" : "sb")]);
	}
}

function clearBoard() {
	$("td").css("backgroundColor", _color["board"]);
}

function detectCollision() {
	died = false;

	// I did separated for the sake of readability
	if (_x[0] == 0 || _y[0] == 0)
		died = true;

	else if (_x[0] == _board_x + 1 || _y[0] == _board_y + 1)
		died = true;

	else
	// Verifies if snake's head collided with the body
		for (i = 1; i < _x.length; i++)
			if (_x[0] == _x[i] && _y[0] == _y[i])
				died = true;

	return died;
}

function step() {
	// Place debug info on screen
	if (_debug)
		debug("score: " + _score  + " x: " + _x[0] + " y: " + _y[0] + " objective-x: " + _objective_x + " objective-y: " + _objective_y + " speed: " + _speed)
	
	// Gets snake size
	snake_size = _x.length
	
	// Saves last position in case of grow
	last_x = _x[snake_size - 1]
	last_y = _y[snake_size - 1]
	
	// Verifies if body exists and then moves
	// Moves backwards to avoid overwriting positions
	if (snake_size > 1 && _dir) {
		for (i = snake_size - 1; i > 0; i--) {
			_x[i] = _x[i - 1];
			_y[i] = _y[i - 1];
		}
	}
	
	// Grow up?
	if (_grow) {
		_x.push(last_x);
		_y.push(last_y);
		_grow = false;
		_score++;
	}

	// Do the movement
	if (_dir == "U")
		_y[0] -= 1;
	else if (_dir == "R")
		_x[0] += 1;
	else if (_dir == "D")
		_y[0] += 1;
	else if (_dir == "L")
		_x[0] -= 1;
		
	// Collision test with the objective
	if (_x[0] == _objective_x && _y[0] == _objective_y) {
		_grow = true;
		_objectiveOnScreen = false;
	}
}

function placeObjective() {
	if (!_objectiveOnScreen) {
		// Test if will not place objective inside snake
		inside = true;
		while (inside) {
			inside = false;
			
			_objective_x = Math.floor(Math.random() * _board_x) + 1;
			_objective_y = Math.floor(Math.random() * _board_y) + 1;
		
			for (i = 0; i < _x.length; i++) {
				if (_objective_x == _x[i] && _objective_y == _y[i]) {
					inside = true;
					continue;
				}
			}
		}
		
		_objectiveOnScreen = true;
	}
	$("#" + _objective_y + "-" + _objective_x).css("backgroundColor", _color["obj"]);
}


function createBoard() {
	var board = "";
	for (i = 1; i <= _board_x; i++) {
		board += "<tr>";
		
		for (j = 1; j <= _board_y; j++) {
			board += "<td id=\"" + i + "-" + j + "\" style=\"background-color:"
					 + _color["board"] + "\">&nbsp;</td>";
		}
		
		board += "</tr>";
	}
	
	$("#board").html(board);
}

function debug(msg) {
	$("#debug").html(msg);
}


