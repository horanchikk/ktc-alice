let words = "двадцать один";
let result = [];

let db = [
  {
    word: "десять",
    number: 10,
  },
  {
    word: "одиннадцать",
    number: 11,
  },
  {
    word: "двенадцать",
    number: 12,
  },
  {
    word: "тринадцать",
    number: 13,
  },
  {
    word: "четырнадцать",
    number: 14,
  },
  {
    word: "пятнадцать",
    number: 15,
  },
  {
    word: "шестнадцать",
    number: 16,
  },
  {
    word: "семнадцать",
    number: 17,
  },
  {
    word: "восемнадцать",
    number: 18,
  },
  {
    word: "девятнадцать",
    number: 19,
  },
  {
    word: "двадцать",
    number: 2,
  },
  {
    word: "тридцать",
    number: 3,
  },
  {
    word: "сорок",
    number: 4,
  },
  {
    word: "пятьдесят",
    number: 5,
  },
  {
    word: "шестьдесят",
    number: 6,
  },
  {
    word: "семьдесят",
    number: 7,
  },
  {
    word: "восемьдесят",
    number: 8,
  },
  {
    word: "девяносто",
    number: 9,
  },
  {
    word: "сто",
    number: 10,
  },
  {
    word: "ноль",
    number: 0,
  },
  {
    word: "один",
    number: 1,
  },
  {
    word: "два",
    number: 2,
  },
  {
    word: "три",
    number: 3,
  },
  {
    word: "четыре",
    number: 4,
  },
  {
    word: "пять",
    number: 5,
  },
  {
    word: "шесть",
    number: 6,
  },
  {
    word: "семь",
    number: 7,
  },
  {
    word: "восемь",
    number: 8,
  },
  {
    word: "девять",
    number: 9,
  },
];

function wordToNumber(word) {
  const result = db.find((el) => {
    if (el.word === word) {
      return el;
    } 
  });
  
  return result === undefined ?  word : result.number;
}

module.exports = {wordToNumber}
