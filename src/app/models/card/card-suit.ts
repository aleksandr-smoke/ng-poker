export enum CardSuit {
    'Clubs',
    'Diamonds',
    'Hearts',
    'Spades',
}

export const cardSuitsStringified: Record<CardSuit, string> = {
    [CardSuit.Clubs]: '♣',
    [CardSuit.Diamonds]: '♦',
    [CardSuit.Hearts]: '♥',
    [CardSuit.Spades]: '♠',
};
