import { CardRank, cardRanksStringified } from './card-rank';
import { CardSuit, cardSuitsStringified } from './card-suit';

export class Card {
    public static readonly ranks: CardRank[] = [
        CardRank.Two,
        CardRank.Three,
        CardRank.Four,
        CardRank.Five,
        CardRank.Six,
        CardRank.Seven,
        CardRank.Eight,
        CardRank.Nine,
        CardRank.Ten,
        CardRank.Jack,
        CardRank.Queen,
        CardRank.King,
        CardRank.Ace,
    ];
    public static readonly suits: CardSuit[] = [
        CardSuit.Clubs,
        CardSuit.Diamonds,
        CardSuit.Hearts,
        CardSuit.Spades,
    ];

    constructor(private rank: CardRank, private suit: CardSuit) {}

    public toString(): string {
        return `${cardRanksStringified[this.rank]}${cardSuitsStringified[this.suit]}`;
    }
}
