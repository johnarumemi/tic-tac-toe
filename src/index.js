import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){

    return (
            <button className="square" onClick={ props.onClick } >
                {props.value}
            </button>
        );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i) }
            />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        // Note that history is an Array of States
        this.state = {
            history: [
                {
                    squares: new Array(9).fill(null),
                }],
            stepNumber: 0,  // step we are currently viewing
            xIsNext: true,
        };

        // bind event handlers to this object when passed to children.
        // this.handleClick = this.handleClick.bind(this);
    }

    // --- Handlers
    handleClick(i){
        // Below ensures that if we go back in time we discard all future states
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        const current = history[history.length - 1];
        const squares = current.squares.slice(); // new array

        if (calculateWinner(squares) || squares[i]){
            // return early by ignoring a click if someone has won the game or if a Square is already filled
            return
        }

        squares[i] = this.state.xIsNext ? 'X':'O' ;  // modify the copied array

        // set state and re-render the Game and all its children and grandchildren (Board & Squares)
        this.setState({
            history: history.concat({squares: squares}),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, // set to true if step is an even number
        })
    }

    // --- Render
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

        let status;
        if (winner){
            status = 'Winner' + winner;
        } else {
            status = 'Next player: ' + ( this.state.xIsNext? 'X' : 'O' );
        }

        // history is a list of objects, hence step=state, move=index within array
        const moves = history.map( (step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";

            return (
                <li key={ move }>
                    <button onClick={ ()=> this.jumpTo(move) }> { desc} </button>
                </li>
            )
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = { current.squares }
                        onClick = { (i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
