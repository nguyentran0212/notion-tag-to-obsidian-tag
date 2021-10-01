const fsPromises = require('fs/promises')
const fs = require('fs');
const path = require('path');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');

module.exports = {
    // Convert tagline Tags: Blockchain, Cat: Background, Index into Content: #Blockchain, #Cat/Background, #Index
    convertTagLine(tagLine){
        // Extract the tags from the Tags: ... line
        let tagsStr = "";
        let tags = [];
        if(tagLine.indexOf("Tags: ") == -1){
            throw "Tagline must start with Tags: "
        } else {
            // Extract tags string from the tagline
            tagsStr = tagLine.slice(6);
            // Extract, clean up, and store tags in an array
            tags = tagsStr.split(",");
            tags = tags.map(tag => {
                tag = tag.trim();
                if(tag.indexOf(":") != -1){
                    // Convert complex tag Cat: Background into #Cat/Background
                    let subtags = tag.split(":");
                    subtags = subtags.map(subtag => {
                        subtag = subtag.trim();
                        subtag = subtag.replace(/ /g, "-")
                        return subtag;
                    })
                    return `#${subtags.join("/")}`;
                } else {
                    // Convert simple Tag into #Tag
                    tag = tag.replace(/ /g, "-");
                    return `#${tag}`;
                }
            })
        }
        // Reconstruct and return the tag line
        return `Content: ${tags.join(", ")}`
    },

    // Convert individual files
    async convertIndividualFile(inputFilePath, outputFilePath, tagLine = "Tags: "){
        // Skip given path if it is not a file. 
        if(!fs.lstatSync(inputFilePath).isFile()) return;
        // Read the whole input file into memory
        let inputFile = await fsPromises.readFile(inputFilePath, {encoding : "utf8"});
        // Split the input file into lines and search for the tagline
        let inputDataArray = (inputFile).split('\n');
        let tagLineIndex = -1
        for (let i = 0; i < inputDataArray.length; i++){
            if(inputDataArray[i].indexOf(tagLine) == 0){
                tagLineIndex = i;
                break;
            }
        }
        if(tagLineIndex == -1) {
            // Output the file as is if tagline cannot be found
            await fsPromises.writeFile(outputFilePath, inputFile);
            return
        } else {
            // Convert the tagline
            let convertedTagLine = this.convertTagLine(inputDataArray[tagLineIndex]);
            // Remove the previous tagline
            inputDataArray.splice(tagLineIndex,1);
            inputDataArray = [convertedTagLine].concat(inputDataArray);
            // Write the output file
            let outputFile = inputDataArray.join('\n');
            await fsPromises.writeFile(outputFilePath, outputFile);
            return
        }
    },
    // Convert entire folder (non recursive)
    async convertFolder(inputDirPath, outputDirPath, tagLine = "Tags: "){
        console.log(inputDirPath, outputDirPath);
        // Get an array of file names in the input directory
        let inputDir = await fsPromises.readdir(inputDirPath);
        // Create the output directory
        if(!fs.existsSync(outputDirPath)) await fsPromises.mkdir(outputDirPath);
        
        // Convert and write files from the input directory to the output directory
        inputDir.forEach(async inputFileName => {
            let outputFilePath = path.join(outputDirPath, inputFileName);
            let inputFilePath = path.join(inputDirPath, inputFileName);
            await this.convertIndividualFile(inputFilePath, outputFilePath, tagLine);
        });
    }
}

run = async () => {
    let inputDir = path.join(__dirname, "Ideas");
    let outputDir = path.join(__dirname, "New_Ideas");
    await module.exports.convertFolder(inputDir, outputDir)
}

run();