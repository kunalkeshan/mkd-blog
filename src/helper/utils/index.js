/**
 * App Utilities
 */

'use strict';

// Dependencies
const { marked } = require('marked');
const Turndown = require('turndown');

const turndown = new Turndown({ headingStyle: 'atx' });
const htmlToMkd = turndown.turndown;

// App Utilities container
const appUtilities = {};

appUtilities.parseData = (data) => {
	JSON.parse(JSON.stringify(data));
};

/**
 * @description If format = html, converts markdown -> "html" || format = markdown, converts html -> "markdown"
 * @param  {string} toConvert The string of what needs to be converted, either markdown or html
 * @param  {object} options {format: "html" || "markdown"}
 * @returns {string} if format is specified - The converted form of the string - else the given string is returned
 */
appUtilities.textFormatConvertor = (toConvert, { format }) => {
	let converted = toConvert;
	if (format === 'html') {
		converted = marked(toConvert, {
			headerIds: false,
			gfm: true,
			breaks: true,
			xhtml: true,
		});
	}
	if (format === 'markdown') {
		converted = htmlToMkd(toConvert);
	}
	return converted;
};

// Exporting App utilities
module.exports = appUtilities;