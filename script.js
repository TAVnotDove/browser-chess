const blackRooks = document.querySelectorAll('img[alt="black-rook"]');
const blackKnights = document.querySelectorAll('img[alt="black-knight"]');
const blackBishops = document.querySelectorAll('img[alt="black-bishop"]');
const blackQueen = document.querySelector('img[alt="black-queen"]');
const blackKing = document.querySelector('img[alt="black-king"]');
const blackPawns = document.querySelectorAll('img[alt="black-pawn"]');
const whiteRooks = document.querySelectorAll('img[alt="white-rook"]');
const whiteKnights = document.querySelectorAll('img[alt="white-knight"]');
const whiteBishops = document.querySelectorAll('img[alt="white-bishop"]');
const whiteQueen = document.querySelector('img[alt="white-queen"]');
const whiteKing = document.querySelector('img[alt="white-king"]');
const whitePawns = document.querySelectorAll('img[alt="white-pawn"]');
const squares = document.querySelectorAll('.square');

const blackPieces = [
    blackRooks[0], blackKnights[0], blackBishops[0], blackQueen, blackKing, blackBishops[1], blackKnights[1], blackRooks[1]
];
const whitePieces = [
    whiteRooks[0], whiteKnights[0], whiteBishops[0], whiteQueen, whiteKing, whiteBishops[1], whiteKnights[1], whiteRooks[1]
];

const chessboardMatrix = Array.from({length: 8}, () => new Array(8).fill(null));
chessboardMatrix[7] = [
    ...blackPieces
];
chessboardMatrix[0] = [
    ...whitePieces
];
chessboardMatrix[6] = Array.from(blackPawns);
chessboardMatrix[1] = Array.from(whitePawns);

const pieceDirections = {
    bishop: [[-1, 1], [1, 1], [1, -1], [-1, -1]],
    knight: [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]],
    pawn: [[1, 0]],
    queen: [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
    rook: [[-1, 0], [0, 1], [1, 0], [0, -1]],
    king: [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
};

let selectedPiece = null;
let legalMoves = new Set();

let whiteToMove = true;

function getLegalMoves(row, column, color, type) {
    const moves = [];

    if (
        type === 'bishop' ||
        type === 'rook' ||
        type === 'queen'
    ) {
        for (const [dRow, dCol] of pieceDirections[type]) {
            let nRow = row + dRow;
            let nCol = column + dCol;

            while (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8 && chessboardMatrix[nRow][nCol] === null) {
                moves.push(nRow * 8 + nCol);
                nRow += dRow;
                nCol += dCol;
            };
        };
    } else {
        if (color === 'black' && type === 'pawn') {
            for (const [dRow, dCol] of pieceDirections[type]) {
                const nRow = row + dRow * -1;
                const nCol = column + dCol * -1;

                if (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8 && chessboardMatrix[nRow][nCol] === null) {
                    moves.push(nRow * 8 + nCol);
                };
            };
        } else {
            for (const [dRow, dCol] of pieceDirections[type]) {
                const nRow = row + dRow;
                const nCol = column + dCol;

                if (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8 && chessboardMatrix[nRow][nCol] === null) {
                    moves.push(nRow * 8 + nCol);
                };
            };
        };
    };

    return moves;
};

blackPieces.forEach(blackPiece => blackPiece.addEventListener('click', (event) => {
    if (whiteToMove) return;

    selectedPiece = event.currentTarget;
    legalMoves = new Set(
        getLegalMoves(
            selectedPiece.dataset.row * 1,
            selectedPiece.dataset.column * 1,
            selectedPiece.dataset.color,
            selectedPiece.dataset.type
        )
    );
}));
whitePieces.forEach(whitePiece => whitePiece.addEventListener('click', (event) => {
    if (!whiteToMove) return;

    selectedPiece = event.currentTarget;
    legalMoves = new Set(
        getLegalMoves(
            selectedPiece.dataset.row * 1,
            selectedPiece.dataset.column * 1,
            selectedPiece.dataset.color,
            selectedPiece.dataset.type
        )
    );
    console.log(legalMoves)
}));
blackPawns.forEach(blackPawn => blackPawn.addEventListener('click', (event) => {
    if (whiteToMove) return;

    selectedPiece = event.currentTarget;
    legalMoves = new Set(
        getLegalMoves(
            selectedPiece.dataset.row * 1,
            selectedPiece.dataset.column * 1,
            selectedPiece.dataset.color,
            selectedPiece.dataset.type
        )
    );
}));
whitePawns.forEach(whitePiece => whitePiece.addEventListener('click', (event) => {
    if (!whiteToMove) return;

    selectedPiece = event.currentTarget;
    legalMoves = new Set(
        getLegalMoves(
            selectedPiece.dataset.row * 1,
            selectedPiece.dataset.column * 1,
            selectedPiece.dataset.color,
            selectedPiece.dataset.type
        )
    );
}));
squares.forEach(square => square.addEventListener('click', (event) => {
    const row = event.currentTarget.dataset.row * 1;
    const column = event.currentTarget.dataset.column * 1;

    if (selectedPiece && legalMoves.has(row * 8 + column)) {
        chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
        chessboardMatrix[row][column] = selectedPiece;
        selectedPiece.dataset.row = row;
        selectedPiece.dataset.column = column;
        selectedPiece.style.bottom = `calc(${row}*64px)`;
        selectedPiece.style.left = `calc(${column}*64px)`;

        whiteToMove = !whiteToMove;

        selectedPiece = null;
    } else {
        selectedPiece = null;
    };
}));