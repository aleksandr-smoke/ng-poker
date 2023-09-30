import { Card } from 'src/app/models/card/card';
import { parse } from 'date-fns';
import * as RegEx from './regexp';
import { TuiCurrency } from '@taiga-ui/addon-commerce';
import { HandAction, HandParams, HandSummary, PlayerInitState, PokerHand } from '../../models/poker-hand/poker-hand';
import { HandActionType } from '../../models/poker-hand/hand-action-type';

/**
 * TODO:
 * Poker Hand #HD1411222823: Hold'em No Limit ($0.01/$0.02) - 2023/09/18 00:21:37
 * Error with *** FIRST FLOP ***
 */

export function parseHistory(handsHistory: string): PokerHand[] {
    const hands: string[] = handsHistory
        .trim()
        .split('\n\n')
        .map((row: string) => row.trim());

    return hands.map((hand: string) => parseHand(hand));
}

function parseHand(hand: string): PokerHand {
    const allRows: string[] = hand
        .split('\n')
        .map((hand: string) => hand.trim());

    /**
     * Calculating row indexes
     */
    let holeCardsRowIndex: number | undefined = undefined;
    let showdownRowIndex: number | undefined = undefined;
    let summaryRowIndex: number | undefined = undefined;

    allRows.forEach((row: string, index: number) => {
        if (row.includes('*** HOLE CARDS ***')) {
            holeCardsRowIndex = index;
        }
        if (row.includes('*** SHOWDOWN ***')) {
            showdownRowIndex = index;
        }
        if (row.includes('*** SUMMARY ***')) {
            summaryRowIndex = index;
        }
    });

    if (!(holeCardsRowIndex && showdownRowIndex && summaryRowIndex)) {
        throw new Error(`No *** SECTION DELIMETER *** found`);
    }

    /**
     * Parse hand params
     */
    const handParams: HandParams = parseHandParams(allRows[0], allRows[1]);

    /**
     * Parse players init state
     */
    const playersAmount: number = allRows.slice(2, holeCardsRowIndex)
        .reduce((acc: number, row: string) => acc + Number(row.includes('Seat')), 0);
    const playersInitStateRows: string[] = allRows.slice(2, 2 + playersAmount);
    const playersInitState: PlayerInitState[] = parsePlayersInitState(playersInitStateRows);

    /**
     * Parse blinds
     */
    const blindRows: string[] = allRows.slice(2 + playersAmount, holeCardsRowIndex);
    const blindActions: HandAction[] = parseBlinds(blindRows);

    /**
     * Dealing cards
     */
    const actionRowsStartIndex: number = holeCardsRowIndex + playersInitState.length + 1;
    const dealRows: string[] = allRows.slice(holeCardsRowIndex + 1, actionRowsStartIndex);
    const dealAction: HandAction = parseDealtCards(dealRows);

    /**
     * Actions
     */
    const actionRows: string[] = allRows.slice(actionRowsStartIndex, showdownRowIndex);
    const actions: HandAction[] = actionRows.map((row: string) => {
        if (row.startsWith('***')) {
            return parseStreet(row);
        }

        if (row.startsWith('Uncalled bet')) {
            return parseUncalledBet(row);
        }

        if (row.includes('shows')) {
            return parseShowCards(row);
        }

        return parsePlayerAction(row);
    });

    /**
     * Showdown
     */
    const showdownRows: string[] = allRows.slice(showdownRowIndex + 1, summaryRowIndex);
    const showdownActions: HandAction[] = parseShowdown(showdownRows);

    /**
     * Summary
     */
    const summaryChipsRow: string = allRows[summaryRowIndex + 1];
    const summary: HandSummary = parseHandSummary(summaryChipsRow);

    return {
        ...handParams,
        players: playersInitState,
        actions: [
            ...blindActions,
            dealAction,
            ...actions,
            ...showdownActions,
        ],
        summary,
    };
}

function validateMatchArray(array: RegExpMatchArray | null, paramNames: string[], errorText: string): void {
    if (!array) {
        throw new Error(`${errorText} | MatchArray is null`);
    }
    if (!array.groups) {
        throw new Error(`${errorText} | MatchArray groups is undefined`);
    }
    paramNames.forEach((param: string) => {
        if (!Object.prototype.hasOwnProperty.call(array.groups, param)) {
            throw new Error(`${errorText} | No param '${param}' in MatchArray groups`);
        }
    });
}

function parseCardsString(cards: string): Card[] {
    return cards.trim().split(' ').map((card: string) => Card.fromString(card));
}

function parseHandParams(row1: string, row2: string): HandParams {
    const gameParamsMatch: RegExpMatchArray | null = row1.match(RegEx.gameParams);
    validateMatchArray(
        gameParamsMatch,
        ['handId', 'gameType', 'smallBlind', 'bigBlind', 'startDate'],
        `Parse Error for line: ${row1}`,
    );
    const tableParamsMatch: RegExpMatchArray | null = row2.match(RegEx.tableParams);
    validateMatchArray(
        tableParamsMatch,
        ['tableName', 'seatsAmount', 'buttonSeat'],
        `Parse Error for line: ${row2}`,
    );
    const { handId, gameType, smallBlind, bigBlind, startDate } = gameParamsMatch!.groups!;
    const { tableName, seatsAmount, buttonSeat } = tableParamsMatch!.groups!;

    const startTimestamp: number = parse(startDate, 'yyyy/MM/dd HH:mm:ss', new Date()).getTime();

    return {
        id: handId,
        gameType,
        smallBlind: Number(smallBlind),
        bigBlind: Number(bigBlind),
        currency: TuiCurrency.Dollar,
        startTimestamp,
        tableName,
        seatsAmount: Number(seatsAmount),
        buttonSeat: Number(buttonSeat),
    };
}

function parsePlayersInitState(rows: string[]): PlayerInitState[] {
    return rows.map((row: string) => {
        const initStateMatch: RegExpMatchArray | null = row.match(RegEx.startPlayersState);
        validateMatchArray(
            initStateMatch,
            ['seatNumber', 'playerName', 'startChips'],
            `Parse Error for line: ${row}`,
        );

        const { seatNumber, playerName, startChips } = initStateMatch!.groups!;

        return {
            seat: Number(seatNumber),
            name: playerName,
            startChips: Number(startChips),
        };
    });
}

function parseBlinds(rows: string[]): HandAction[] {
    return rows.map((row: string) => {
        const blindMatch: RegExpMatchArray | null = row.match(RegEx.blind);
        validateMatchArray(
            blindMatch,
            ['playerName', 'blindType', 'blindValue'],
            `Parse Error for line: ${row}`,
        );

        const { playerName, blindType, blindValue } = blindMatch!.groups!;
        const blindTextToTypeMap: Record<string, HandActionType> = {
            'posts the ante': HandActionType.Ante,
            'posts small blind': HandActionType.SmallBlind,
            'posts big blind': HandActionType.BigBlind,
            'straddle': HandActionType.Straddle,
        };

        return {
            type: blindTextToTypeMap[blindType],
            playerName: playerName,
            chips: Number(blindValue),
        };
    });
}

function parseDealtCards(rows: string[]): HandAction {
    const heroDealRow: string = rows.find((row: string) => row.includes('Hero')) || '';
    const heroCardsMatch: RegExpMatchArray | null = heroDealRow.match(RegEx.dealtCards);
    validateMatchArray(heroCardsMatch, ['cards'], `Parse Error for line: ${heroDealRow}`);
    const { cards } = heroCardsMatch!.groups!;
    const heroCards: Card[] = parseCardsString(cards);

    return {
        type: HandActionType.DealCards,
        cards: heroCards,
    };
}

function parseStreet(row: string): HandAction {
    const streetMatch: RegExpMatchArray | null = row.match(RegEx.street);
    validateMatchArray(streetMatch, ['streetName', 'cards'], `Parse Error for line: ${row}`);
    const { streetName, cards } = streetMatch!.groups!;
    const streetNameToTypeMap: Record<string, HandActionType> = {
        'FLOP': HandActionType.Flop,
        'TURN': HandActionType.Turn,
        'RIVER': HandActionType.River,
    };
    const streetCards: Card[] = parseCardsString(cards);

    return {
        type: streetNameToTypeMap[streetName],
        cards: streetCards,
    };
}

function parseUncalledBet(row: string): HandAction {
    const uncalledBetMatch: RegExpMatchArray | null = row.match(RegEx.uncalledBet);
    validateMatchArray(uncalledBetMatch, ['playerName', 'chips'], `Parse Error for line: ${row}`);
    const { playerName, chips } = uncalledBetMatch!.groups!;

    return {
        type: HandActionType.UncalledBet,
        playerName,
        chips: Number(chips),
    };
}

function parseShowCards(row: string): HandAction {
    const showCardsMatch: RegExpMatchArray | null = row.match(RegEx.showCards);
    validateMatchArray(showCardsMatch, ['playerName', 'cards'], `Parse Error for line: ${row}`);
    const { playerName, cards } = showCardsMatch!.groups!;
    const showCards: Card[] = parseCardsString(cards);

    return {
        type: HandActionType.ShowCards,
        playerName,
        cards: showCards,
    };
}

function parsePlayerAction(row: string): HandAction {
    const actionMatch: RegExpMatchArray | null = row.match(RegEx.action);
    validateMatchArray(actionMatch, ['playerName', 'actionName', 'actionTextValue'], `Parse Error for line: ${row}`);
    const { playerName, actionName, actionTextValue } = actionMatch!.groups!;
    const actionTextToTypeMap: Record<string, HandActionType> = {
        'folds': HandActionType.Fold,
        'checks': HandActionType.Check,
        'bets': HandActionType.Bet,
        'calls': HandActionType.Call,
        'raises': HandActionType.Raise,
    };
    const type: HandActionType = actionTextToTypeMap[actionName];
    let chips: string | undefined;

    if ([HandActionType.Bet, HandActionType.Call, HandActionType.Raise].includes(type)) {
        const actionValueMatch: RegExpMatchArray | null = actionTextValue
            .split(' ')[0]
            .trim()
            .match(RegEx.moneyVarStandalone('chips'));
        validateMatchArray(actionValueMatch, ['chips'], `Parse Error for line: ${row}`);
        chips = actionValueMatch!.groups!['chips'];
    }

    return {
        type: actionTextToTypeMap[actionName],
        playerName,
        ...(chips ? { chips: Number(chips) } : {}),
    };
}

function parseShowdown(rows: string[]): HandAction[] {
    return rows.map((row: string) => {
        const actionMatch: RegExpMatchArray | null = row.match(RegEx.showdown);
        validateMatchArray(actionMatch, ['playerName', 'chips'], `Parse Error for line: ${row}`);
        const { playerName, chips } = actionMatch!.groups!;

        return {
            type: HandActionType.Showdown,
            playerName,
            chips: Number(chips),
        };
    });
}

function parseHandSummary(row: string): HandSummary {
    const groups: string[] = row.split(' | ');
    const summaryChips: number[] = groups.map((group: string) => {
        const money: string = group.split(' ').slice(-1)[0];
        const moneyMatch: RegExpMatchArray | null = money.match(RegEx.moneyVarStandalone('chips'));
        validateMatchArray(moneyMatch, ['chips'], `Parse Error for string: ${group}`);
        const { chips } = moneyMatch!.groups!;

        return Number(chips);
    });

    return {
        pot: summaryChips[0],
        rake: summaryChips.slice(1).reduce((acc: number, item: number) => acc + item, 0),
    };
}
