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
    }

    // Convert individual files

    // Convert entire folder (non recursive)
}
