import { CardRank, stringToCardRank } from './card-rank';
import { CardSuit, stringToCardSuit } from './card-suit';

export class Card {
    constructor(private rank: CardRank, private suit: CardSuit) {}

    public static fromString(card: string): Card {
        const rank: CardRank | undefined = stringToCardRank[card[0]];
        const suit: CardSuit | undefined = stringToCardSuit[card[1]];

        if (!(card.length === 2 && rank && suit)) {
            throw new Error(`Invalid card string format: ${card}`);
        }

        return new Card(rank, suit);
    }

    public toString(): string {
        return `${this.rank}${this.suit}`;
    }
}
