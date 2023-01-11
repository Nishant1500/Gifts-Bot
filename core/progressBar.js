function emojibar (fullStart, fullBar, fullEnd, emptyStart, emptyBar, emptyEnd, value, maxValue, size) {
	let barArray = [];
        let full = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
        let empty = size - full > 0 ? size - full : 0;
        for (let i = 1; i <= full; i++) barArray.push(fullBar);
        for (let i = 1; i <= empty; i++) barArray.push(emptyBar);
        barArray[0] = barArray[0] == fullBar ? fullStart : emptyStart;
        barArray[barArray.length - 1] = barArray[barArray.length - 1] == fullBar ? fullEnd : emptyEnd;
        return barArray.join(``);
 }
module.exports = emojibar;