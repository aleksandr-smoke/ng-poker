import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Deck } from './models/deck/deck';
import { PokerHand } from './models/poker-hand/poker-hand';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public deck = new Deck();
    public hands: PokerHand[] = [];
    public JSON = JSON;

    public shuffle(): void {
        this.deck.shuffle();
    }

    public saveHands(hands: PokerHand[]): void {
        this.hands = hands;
    }
}
