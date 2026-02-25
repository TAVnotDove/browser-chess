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
const whitePawnPromotions = document.querySelector('.white-pawn-promotions');
const blackPawnPromotions = document.querySelector('.black-pawn-promotions');
const chessboard = document.querySelector('#chessboard');

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
            if (row === 1 && color === 'white' && chessboardMatrix[row + 2][column] === null) {
                moves.push((row + 2) * 8 + column)
            };

            if (row === 6 && color === 'black' && chessboardMatrix[row - 2][column] === null) {
                moves.push((row - 2) * 8 + column)
            };

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
            if (type === 'king' && chessboardMatrix[row][column].dataset.hasMoved === 'false') {
                if (color === 'white') {
                    const rightEmpty = !chessboardMatrix[0][5] && !chessboardMatrix[0][6];
                    const leftEmpty = !chessboardMatrix[0][1] && !chessboardMatrix[0][2] && !chessboardMatrix[0][3];
                    const rightRook = chessboardMatrix[0][7] && chessboardMatrix[0][7].dataset.hasMoved === 'false';
                    const leftRook = chessboardMatrix[0][0] && chessboardMatrix[0][0].dataset.hasMoved === 'false';

                    if (leftEmpty && leftRook) {
                        moves.push(0 * 8 + 2);
                    };
                    if (rightEmpty && rightRook) {
                        moves.push(0 * 8 + 6);
                    };
                } else {
                    const rightEmpty = !chessboardMatrix[7][5] && !chessboardMatrix[7][6];
                    const leftEmpty = !chessboardMatrix[7][1] && !chessboardMatrix[7][2] && !chessboardMatrix[7][3];
                    const rightRook = chessboardMatrix[7][7] && chessboardMatrix[7][7].dataset.hasMoved === 'false';
                    const leftRook = chessboardMatrix[7][0] && chessboardMatrix[7][0].dataset.hasMoved === 'false';

                    if (leftEmpty && leftRook) {
                        moves.push(7 * 8 + 2);
                    };
                    if (rightEmpty && rightRook) {
                        moves.push(7 * 8 + 6);
                    };
                };
            };

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
            if (selectedPiece.dataset.type === 'pawn') {
                if (selectedPiece.dataset.color === 'white' && row === 7) {
                    whitePawnPromotions.style.display = 'flex';
                    whitePawnPromotions.style.bottom = `calc(${row - 3} * 64px)`;
                    whitePawnPromotions.style.left = `calc(${column} * 64px)`;
                    promoteRow = row;
                    promoteCol = column;
                } else if (selectedPiece.dataset.color === 'black' && row === 0) {
                    blackPawnPromotions.style.display = 'flex';
                    blackPawnPromotions.style.bottom = `calc(${row} * 64px)`;
                    blackPawnPromotions.style.left = `calc(${column} * 64px)`;
                    promoteRow = row;
                    promoteCol = column;
                } else {
                    chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
                    chessboardMatrix[row][column] = selectedPiece;
                    selectedPiece.dataset.row = row;
                    selectedPiece.dataset.column = column;
                    selectedPiece.style.bottom = `calc(${row}*64px)`;
                    selectedPiece.style.left = `calc(${column}*64px)`;

                    whiteToMove = !whiteToMove;

                    selectedPiece.classList.toggle('selected');
                    selectedPiece = null;
                    event.currentTarget.remove();
                };
            } else {
                chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
                chessboardMatrix[row][column] = selectedPiece;
                selectedPiece.dataset.row = row;
                selectedPiece.dataset.column = column;
                selectedPiece.style.bottom = `calc(${row}*64px)`;
                selectedPiece.style.left = `calc(${column}*64px)`;

                whiteToMove = !whiteToMove;

                selectedPiece.classList.toggle('selected');
                selectedPiece = null;
                event.currentTarget.remove();
            }
        } else {
            selectedPiece.classList.toggle('selected');
            selectedPiece = null;

            whitePawnPromotions.style.display = 'none';
            blackPawnPromotions.style.display = 'none';
        };
    } else {
        if (
            (whiteToMove && !isWhite) || 
            (!whiteToMove && isWhite)
        ) return;

        selectedPiece = event.currentTarget;
        selectedPiece.classList.toggle('selected');
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

    if (selectedPiece.dataset.type === 'king' && 
        row === 0 && (column === 2 || column === 6) ||
        row === 7 && (column === 2 || column === 6)
    ) {
        chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
        chessboardMatrix[row][column] = selectedPiece;
        selectedPiece.dataset.row = row;
        selectedPiece.dataset.column = column;
        selectedPiece.style.bottom = `calc(${row}*64px)`;
        selectedPiece.style.left = `calc(${column}*64px)`;

        selectedPiece.classList.toggle('selected');
        selectedPiece = null;

        if (row === 0) {
            if (column === 2) {
                const leftRook = chessboardMatrix[0][0];
                leftRook.dataset.row = 0;
                leftRook.dataset.column = 3;
                leftRook.style.bottom = `calc(${0}*64px)`;
                leftRook.style.left = `calc(${3}*64px)`;

                chessboardMatrix[0][0] = null;
                chessboardMatrix[0][3] = leftRook
            } else {
                const rightRook = chessboardMatrix[0][7];
                rightRook.dataset.row = 0;
                rightRook.dataset.column = 5;
                rightRook.style.bottom = `calc(${0}*64px)`;
                rightRook.style.left = `calc(${5}*64px)`;

                chessboardMatrix[0][7] = null;
                chessboardMatrix[0][5] = rightRook
            };
        } else {
            if (column === 2) {
                const leftRook = chessboardMatrix[7][0];
                leftRook.dataset.row = 7;
                leftRook.dataset.column = 3;
                leftRook.style.bottom = `calc(${7}*64px)`;
                leftRook.style.left = `calc(${3}*64px)`;

                chessboardMatrix[7][0] = null;
                chessboardMatrix[7][3] = leftRook
            } else {
                const rightRook = chessboardMatrix[7][7];
                rightRook.dataset.row = 7;
                rightRook.dataset.column = 5;
                rightRook.style.bottom = `calc(${7}*64px)`;
                rightRook.style.left = `calc(${5}*64px)`;

                chessboardMatrix[7][7] = null;
                chessboardMatrix[7][5] = rightRook
            };
        };

        whiteToMove = !whiteToMove;
    } else if (selectedPiece && legalMoves.has(row * 8 + column)) {
        chessboardMatrix[selectedPiece.dataset.row][selectedPiece.dataset.column] = null;
        chessboardMatrix[row][column] = selectedPiece;
        selectedPiece.dataset.row = row;
        selectedPiece.dataset.column = column;
        selectedPiece.style.bottom = `calc(${row}*64px)`;
        selectedPiece.style.left = `calc(${column}*64px)`;

        whiteToMove = !whiteToMove;

        selectedPiece.classList.toggle('selected');
        selectedPiece = null;

        whitePawnPromotions.style.display = 'none';
        blackPawnPromotions.style.display = 'none';
    } else {
        if (selectedPiece) {
            selectedPiece.classList.toggle('selected');
            selectedPiece = null;

            whitePawnPromotions.style.display = 'none';
            blackPawnPromotions.style.display = 'none';
        };
    };
}));

const pawnPromotions = ['queen', 'rook', 'bishop', 'knight'];
let promoteRow = 0;
let promoteCol = 0;
whitePawnPromotions.querySelectorAll('img').forEach((img, idx) => img.addEventListener('click', () => {
    promotePawn(whitePawnPromotions, pawnPromotions[idx], 'white')
}));
blackPawnPromotions.querySelectorAll('img').forEach((img, idx) => img.addEventListener('click', () => {
    promotePawn(blackPawnPromotions, pawnPromotions[idx], 'black')
}));

function promotePawn(container, type, color) {
    const newPiece = document.createElement('img');
    newPiece.src = `assets/pieces/${color}-${type}.svg`;
    newPiece.alt = `${color}-${type}`;
    newPiece.draggable = 'false';
    newPiece.dataset.row = promoteRow;
    newPiece.dataset.column = promoteCol;
    newPiece.dataset.color = color;
    newPiece.dataset.type = type;
    newPiece.style.bottom = `calc(${promoteRow} * 64px)`;
    newPiece.style.left = `calc(${promoteCol} * 64px)`;
    newPiece.addEventListener('click', (event) => pieceHandler(event, color === 'white'));
    chessboard.appendChild(newPiece);

    container.style.display = 'none';

    selectedPiece.remove();
    selectedPiece = null;
    
    chessboardMatrix[promoteRow][promoteCol].remove();
    
    chessboardMatrix[promoteRow][promoteCol] = null;
    whiteToMove = !whiteToMove;
};