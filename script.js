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
    pawn: [[1, 0], [1, -1], [1, 1]],
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

            while (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8) {
                moves.push(nRow * 8 + nCol);

                if (chessboardMatrix[nRow][nCol] !== null ||
                    chessboardMatrix[nRow][nCol] && chessboardMatrix[nRow][nCol].dataset.color === color
                ) break;

                nRow += dRow;
                nCol += dCol;
            };
        };
    } else {
        if (type === 'pawn') {
            for (const [dRow, dCol] of pieceDirections[type]) {
                const nRow = row + dRow * (color === 'black' ? -1 : 1);
                const nCol = column + dCol * (color === 'black' ? -1 : 1);

                if (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8) {
                    if (
                        (column === nCol && chessboardMatrix[nRow][nCol] !== null) ||
                        (column !== nCol &&
                            (chessboardMatrix[nRow][nCol] === null || chessboardMatrix[nRow][nCol].dataset.color === color)
                        )
                    ) continue;

                    moves.push(nRow * 8 + nCol);
                };
            };
        } else {
            for (const [dRow, dCol] of pieceDirections[type]) {
                const nRow = row + dRow;
                const nCol = column + dCol;
                if (nRow >= 0 && nRow < 8 && nCol >= 0 && nCol < 8) {
                    if (
                        chessboardMatrix[nRow][nCol] === null ||
                        chessboardMatrix[nRow][nCol] && chessboardMatrix[nRow][nCol].dataset.color !== color
                    ) {
                        moves.push(nRow * 8 + nCol);
                    };
                };
            };
        };
    };

    return moves;
};

function pieceHandler(event, isWhite) {
    if (selectedPiece) {
        const row = event.currentTarget.dataset.row * 1;
        const column = event.currentTarget.dataset.column * 1;

        if (legalMoves.has(row * 8 + column) && selectedPiece.dataset.color !== event.currentTarget.dataset.color) {
            chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
            chessboardMatrix[row][column] = selectedPiece;
            selectedPiece.dataset.row = row;
            selectedPiece.dataset.column = column;
            selectedPiece.style.bottom = `calc(${row}*64px)`;
            selectedPiece.style.left = `calc(${column}*64px)`;

            whiteToMove = !whiteToMove;

            selectedPiece = null;
            event.currentTarget.remove();
        } else {
            selectedPiece = null;
        };
    } else {
        if (
            (whiteToMove && !isWhite) || 
            (!whiteToMove && isWhite)
        ) return;

        selectedPiece = event.currentTarget;
        legalMoves = new Set(
            getLegalMoves(
                selectedPiece.dataset.row * 1,
                selectedPiece.dataset.column * 1,
                selectedPiece.dataset.color,
                selectedPiece.dataset.type
            )
        );
    };
};

blackPieces.forEach(blackPiece => blackPiece.addEventListener('click', (event) => pieceHandler(event, false)));
whitePieces.forEach(whitePiece => whitePiece.addEventListener('click', (event) => pieceHandler(event, true)));
blackPawns.forEach(blackPawn => blackPawn.addEventListener('click', (event) => pieceHandler(event, false)));
whitePawns.forEach(whitePiece => whitePiece.addEventListener('click', (event) => pieceHandler(event, true)));
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