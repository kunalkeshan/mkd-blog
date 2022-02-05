'use strict';

const { marked } = require('marked');
const Turndown = require('turndown');
const {} = require('../config');

const turndown = new Turndown({ headingStyle: 'atx' });
const htmlToMkd = turndown.turndown;

exports.parseData = (data) => {
	JSON.parse(JSON.stringify(data));
};

/**
 * @description If format = html, converts markdown -> "html" || format = markdown, converts html -> "markdown"
 * @param  {string} toConvert The string of what needs to be converted, either markdown or html
 * @param  {object} options {format: "html" || "markdown"}
 * @returns {string} if format is specified - The converted form of the string - else the given string is returned
 */
exports.textFormatConvertor = (toConvert = '', { format }) => {
	let converted = toConvert;
	if (format === 'html') {
		converted = marked(toConvert);
	}
	if (format === 'markdown') {
		converted = htmlToMkd(toConvert);
	}
	return converted;
};
