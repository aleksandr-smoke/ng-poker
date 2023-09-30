export enum CardSuit {
    'Clubs' = 'c',
    'Diamonds' = 'd',
    'Hearts' = 'h',
    'Spades' = 's',
}

export const stringToCardSuit: Record<string, CardSuit> = {
    'c': CardSuit.Clubs,
    'd': CardSuit.Diamonds,
    'h': CardSuit.Hearts,
    's': CardSuit.Spades,
};

export const allSuitsArray: CardSuit[] = [
    CardSuit.Clubs,
    CardSuit.Diamonds,
    CardSuit.Hearts,
    CardSuit.Spades,
];
