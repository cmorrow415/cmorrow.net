/*Use the --a flag to build the entire site.
  Otherwise, define an input and output directory.
  (examples: --www --blog --more)*/

const fs = require('fs'); //allows us to access the filesystem

const inDir = './_src'; //look for code in the source folder
const outDir = './_public'; //output built files to public folder

const { execSync } = require('child_process'); //allows us to run commands

if (process.argv.length === 2) {
  console.log('\u001b[0;34mNo arguments defined.');
  console.log('Use the --a flag to build the entire site.');
  console.log('Otherwise, include the name of the directory to build.');
  console.log('Multiple inputs and outputs are supported.');
  console.log('(examples: --www --blog --more)\u001b[0m');
  process.exit(0);
}; //if no flags are passed through, log help info without building site.

if (process.argv.length > 3 && process.argv.includes("--a")) {
  console.error('\u001b[41m Cannot use multiple arguments in conjunction with the --a flag. Exiting process.\u001b[0m');
  process.exit(1);
}; //if the --a flag is used with other flags, don't do anything.

//If only the --a flag is used, build the site
if (process.argv.length === 3 && process.argv[2] === "--a") {
  for (let i = 0; i < fs.readdirSync(inDir).length; i++) {
  //First, we'll check to see if a given file is a directory.
    fs.stat(inDir + "/" + fs.readdirSync(inDir)[i], (err, stats) => {
      //If fs has a problem reading the source, cancel the operation.
      if (err) {
        console.error(err);
        process.exit(1);
      }
      if (stats.isFile()) { //If it's a file, skip and move on
        console.error('\u001b[41m ERROR: ' + fs.readdirSync(inDir)[i] + ' is a file. Item skipped. \u001b[0m');
      } else if (stats.isDirectory()) { //If it's a directory, great! Let's build it!
        console.log("\u001b[46mCheck " + fs.readdirSync(inDir)[i] + " dir OK\u001b[0m");
        let input = inDir + "/" + fs.readdirSync(inDir)[i];
        let output = outDir + "/" + fs.readdirSync(inDir)[i];
        execSync(`npx eleventy --input=${input} --output=${output}`);
        console.log(`\u001b[42mBuilt ${fs.readdirSync(inDir)[i]} ==> output to ${output}\u001b[0m`);
      } else { //If something weird happens, just leave.
        console.error('\u001b[41mRoot directory contains unknown object. Exiting Process.\u001b[0m');
        process.exit(1);
      }
    });
  };
};

//If the --a flag isn't used, build the other directories
if (process.argv.length > 2 && !process.argv.includes("--a")) {
  //Start at 2 to ignore the first 2 arguments, node path and file path
  for (let i = 2; i < process.argv.length; i++) {
    //skip if the argument isn't a flag
    if (!process.argv[i].startsWith("--")) {
      console.error("\u001b[41mSkipping argument: " + process.argv[i] + "\u001b[0m");
      continue;
    };
    //remove the doubledash to get raw dir name and set it as a variable
    let flagDir = process.argv[i].slice(2);
    let input = inDir + "/" + flagDir;
    //check if it even exists
    if (!fs.existsSync(input)){
      console.error('\u001b[41mERROR: ' + input + ' does not exist.\u001b[0m');
      continue;
    };
    //check if it's a file or directory
    if (!fs.statSync(input).isDirectory){
      console.error('\u001b[41mERROR: ' + input + ' is not a directory.\u001b[0m');
      continue;
    };
    console.log("\u001b[46mOK: " + input + " dir is a valid directory.\u001b[0m");
    let output = outDir + "/" + flagDir;
    execSync(`npx eleventy --input=${input} --output=${output}`);
    console.log(`\u001b[42mBuilt ${flagDir} ==> output to ${output}\u001b[0m`);
  };
};