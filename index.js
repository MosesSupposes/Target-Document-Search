/**
 * IMPORTS
 */
const readline = require("readline");
const utils = require("./lib/util");

/**
 * MAIN
 */

const prompter = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

main(prompter);

/**
 * DEFINTITONS
 */

async function main(prompter) {
	const { searchFiles, outputResults } = utils;
	let targetDir, searchCriteria, searchTerm;

	targetDir = await determineTargetDirectory(prompter);
	searchTerm = await determineSearchTerm(prompter);
	/*/ In the following try/catch we're sanatizing the input for the search criteria. 
        There are only two valid options: '1' or '2'. We keep prompting the user for a 
        response until they provide us with one of those two options.
	 */
	try {
		searchCriteria = await determineSearchCriteria(prompter);
		prompter.close();
		console.log(`Searching files for '${searchTerm}'...\n\n\n`);
	} catch (error) {
		(async function promptForSearchCriteriaUntilValidResponse(errorMsg) {
			console.error(errorMsg);
			try {
				searchCriteria = await determineSearchCriteria(prompter);
				prompter.close();
				console.log(`Searching files for '${searchTerm}'...\n\n\n`);
			} catch (error) {
				promptForSearchCriteriaUntilValidResponse(error);
			}
		})(error);
	}

	utils.pipe(
		searchFiles,
		outputResults
	)({ targetDir, searchCriteria, searchTerm });
}

function determineTargetDirectory(prompter) {
	return new Promise((resolve, reject) => {
		prompter.question(
			"Which directory would you like to search? (Defaults to the current directory.)\n",
			resolve
		);
	});
}

function determineSearchTerm(prompter) {
	return new Promise((resolve, reject) => {
		// resolve with the specified search term
		prompter.question("Enter the search term:\n", resolve);
	});
}

function determineSearchCriteria(prompter) {
	return new Promise((resolve, reject) => {
		prompter.question(
			"What is your search criteria? (Input a number.)\n 1) String Match \n 2) Regular Expression\n",
			answer => {
				switch (answer.trim()) {
					case "1":
						resolve("STRING MATCH");
						break;
					case "2":
						resolve("REGULAR EXPRESSION");
						break;
					default:
						reject("That is not a valid selection. Please select '1' or '2'.");
				}
			}
		);
	});
}
