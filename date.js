module.exports = getDate;

function getDate() {
	const weekday = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const d = new Date();
	let day = weekday[d.getDay()];
	return day;
}
