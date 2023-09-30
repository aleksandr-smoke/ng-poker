import { getRandomInt } from 'src/app/helpers/random';
import { Card } from '../card/card';
import { CardRank, allRanksArray } from '../card/card-rank';
import { CardSuit, allSuitsArray } from '../card/card-suit';

export class Deck {
    private cards: Card[] = [];

    constructor() {
        this.fillDeckInOrder();
    }

    private fillDeckInOrder(): void {
        allRanksArray.forEach((rank: CardRank) =>
            allSuitsArray.forEach((suit: CardSuit) => this.cards.push(new Card(rank, suit))),
        );
    }

    public shuffle(): void {
        const currentDeck: Card[] = [...this.cards];
        this.cards = [];

        while (currentDeck.length) {
            const randomIndex: number = getRandomInt(0, currentDeck.length - 1);

            this.cards.push(currentDeck[randomIndex]);
            currentDeck.splice(randomIndex, 1);
        }
    }

    public toString(): string {
        return this.cards.map((card: Card) => card.toString()).join(', ');
    }
}
