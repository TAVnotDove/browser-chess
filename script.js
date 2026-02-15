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

blackPieces.forEach(blackPiece => blackPiece.addEventListener('click', logCoordinates));
whitePieces.forEach(whitePiece => whitePiece.addEventListener('click', logCoordinates));
blackPawns.forEach(blackPawn => blackPawn.addEventListener('click', logCoordinates));
whitePawns.forEach(whitePiece => whitePiece.addEventListener('click', logCoordinates));
squares.forEach(square => square.addEventListener('click', logCoordinates));

function logCoordinates(event) {
    console.log(event.currentTarget.dataset.row, event.currentTarget.dataset.column);
};