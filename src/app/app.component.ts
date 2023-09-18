import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Deck } from './models/deck/deck';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public deck = new Deck();

    public shuffle(): void {
        this.deck.shuffle();
    }
}
