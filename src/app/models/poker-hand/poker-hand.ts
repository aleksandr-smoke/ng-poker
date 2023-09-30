import { TuiCurrency } from '@taiga-ui/addon-commerce';
import { Card } from '../card/card';
import { HandActionType } from './hand-action-type';

export interface PokerHand {
    id: string;
    gameType: string;
    smallBlind: number;
    bigBlind: number;
    currency: TuiCurrency;
    startTimestamp: number;
    tableName: string;
    seatsAmount: number;
    buttonSeat: number;
    players: PlayerInitState[];
    actions: HandAction[];
    summary: HandSummary;
}

export interface PlayerInitState {
    seat: number;
    name: string;
    startChips: number;
}

export interface HandAction {
    type: HandActionType;
    playerName?: string;
    cards?: Card[];
    chips?: number;
}

export interface HandSummary {
    pot: number;
    rake: number;
}

export interface HandParams {
    id: string;
    gameType: string;
    smallBlind: number;
    bigBlind: number;
    currency: TuiCurrency;
    startTimestamp: number;
    tableName: string;
    seatsAmount: number;
    buttonSeat: number;
}
