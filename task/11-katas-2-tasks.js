'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    function transform(str) {
        let result = '';
        let string = str.split('\n').slice(0, -1);
        for (let j = 0; j < string[0].length; j++)
        for (let i = 0; i < string.length; i++) {
            result += string[i][j];
        } 
        return result.match(/.{1,9}/g);
    };
    let digits =  ' _     _  _     _  _  _  _  _ \n' +
                  '| |  | _| _||_||_ |_   ||_||_|\n' +
                  '|_|  ||_  _|  | _||_|  ||_| _|\n';
    let map = new Map(transform(digits).map((e, i) => [e, i]));
return transform(bankAccount).reduce((p, e) => p * 10 + map.get(e), 0);
  
 }


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let string = text.match(new RegExp(`.{1,${columns}}( |$)`, 'g'));
    for (let sym of string) {
    yield sym.trim();
    }
}
/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let lears = '♥♠♦♣';
    let digit = 'A234567891JQK';
    let learsArray = Array.from(lears, ()=>0),
        digitArray = Array.from(digit, ()=>0);
    for (let card of hand) {
        learsArray[lears.indexOf(card.slice(-1))]++;
        digitArray[digit.indexOf(card[0])]++;
    }
    digitArray.push(digitArray[0]); 
    
    let learsString = learsArray.join(''),
        digitString = digitArray.join('');
    
    return (digitString.indexOf('11111') != -1) && 
           (learsString.indexOf('5') != -1) ? PokerRank.StraightFlush :
           (digitString.indexOf('4') != -1) ? PokerRank.FourOfKind :
           (digitString.indexOf('2') != -1) && 
           (digitString.indexOf('3') != -1) ? PokerRank.FullHouse :
           (learsString.indexOf('5') != -1) ? PokerRank.Flush :
           (digitString.indexOf('11111') != -1) ? PokerRank.Straight :
           (digitString.indexOf('3') != -1) ? PokerRank.ThreeOfKind :
           (digitString.match(/2.*2.+/)) ? PokerRank.TwoPairs :
           (digitString.indexOf('2') != -1) ? PokerRank.OnePair :
           PokerRank.HighCard; 
}






module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};