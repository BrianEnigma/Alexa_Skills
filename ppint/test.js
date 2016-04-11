var ppint = require('./ppint.js');

console.log(ppint.getPuzzledPintForMonth(2016, 1));

console.log();
console.log();

console.log(ppint.getNextPuzzledPint(new Date()));
console.log(ppint.getNextPuzzledPint(new Date(2016, 3, 13, 0, 0, 0, 0)));

console.log();
console.log();

console.log(ppint.getNextPuzzledPintAsString(new Date(2016, 3, 1, 0, 0, 0, 0)));
console.log(ppint.getNextPuzzledPintAsString(new Date(2016, 3, 11, 0, 0, 0, 0)));
console.log(ppint.getNextPuzzledPintAsString(new Date(2016, 3, 12, 0, 0, 0, 0)));
console.log(ppint.getNextPuzzledPintAsString(new Date(2016, 3, 13, 0, 0, 0, 0)));

