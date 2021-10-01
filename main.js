const fsPromises = require('fs/promises')

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
                        return subtag.trim();
                    })
                    return `#${subtags.join("/")}`;
                } else {
                    // Convert simple Tag into #Tag
                    return `#${tag}`;
                }
            })
        }
        // Reconstruct and return the tag line
        return `Content: ${tags.join(", ")}`
    },

    // Convert individual files
    async convertIndividualFile(inputFilePath, outputFilePath, tagLine = "Tags: "){
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
    }
    // Convert entire folder (non recursive)
}


