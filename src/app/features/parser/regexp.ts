// IMPORTANT: you have to use double \\ in RegExp in strings

// ### RegExp Helpers  ###

// TODO: check format of RUB and other right currency symbols, specify RegExp
export const moneyVar = (varName: string): string => `\\p{Sc}(?<${varName}>[.,\\d]+)`;
export const moneyVarStandalone = (varName: string): RegExp => new RegExp(`${moneyVar(varName)}`, 'u');

// ### Parse hand rows RegExp ###

export const gameParams = new RegExp(
    `Poker Hand #(?<handId>\\w+): (?<gameType>.+) \\(${moneyVar('smallBlind')}\\/${moneyVar('bigBlind')}\\) - (?<startDate>.+)`,
    'u',
);

export const tableParams = /Table '(?<tableName>.+)' (?<seatsAmount>\d)-max Seat #(?<buttonSeat>\d) is the button/;

export const startPlayersState = new RegExp(
    `Seat (?<seatNumber>\\d): (?<playerName>.+) \\(${moneyVar('startChips')} in chips\\)`,
    'u',
);

export const blind = new RegExp(
    `(?<playerName>.+): (?<blindType>(posts the ante|posts small blind|posts big blind|straddle)) ${moneyVar('blindValue')}`,
    'u',
);

export const dealtCards = /Dealt to Hero \[(?<cards>.+)\]/;

export const action = /(?<playerName>.+): (?<actionName>(folds|checks|bets|calls|raises))\s?(?<actionTextValue>.*)/;

export const street = /\*\*\* (?<streetName>(FLOP|TURN|RIVER)) \*\*\* .*\[(?<cards>.+)\]/;

export const uncalledBet = new RegExp(`Uncalled bet \\(${moneyVar('chips')}\\) returned to (?<playerName>.+)`, 'u');

export const showCards = /(?<playerName>.+): shows \[(?<cards>.+)\]/;

export const showdown = new RegExp(`(?<playerName>.+) collected ${moneyVar('chips')} from pot`, 'u');
