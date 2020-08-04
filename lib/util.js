exports.isRegExp = input => input instanceof RegExp;

exports.isString = input => typeof input === "string";

exports.pipe = (...fns) => initialValue =>
	fns.reduce((accumulator, fn) => fn(accumulator), initialValue);

exports.catchErrors = (promise, errorHandler) =>
	promise.then(data => data).catch(errorHandler);

exports.searchFiles = ({ targetDir, searchCriteria, searchTerm }) => {};

exports.outputResults = results => results;
