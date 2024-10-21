import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Deck } from './models/deck/deck';
import { PokerHand } from './models/poker-hand/poker-hand';
import { TuiRoot } from '@taiga-ui/core';
import { ParserModule } from './features/parser/parser.module';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        TuiRoot,
        ParserModule,
    ],
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
