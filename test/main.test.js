const chai = require('chai');  
const expect = chai.expect;
const tagConverter = require("../main")

const path = require('path');
const fsPromises = require('fs/promises');
const fs = require("fs");

compareFile = async (filePathA, filePathB) => {
    let fileA = await fsPromises.readFile(filePathA, {encoding : "utf8"});
    let fileB = await fsPromises.readFile(filePathB, {encoding : "utf8"});
    return fileA.trim() == fileB.trim();
}

compareDirShallow = async (dirPathA, dirPathB) => {
    // console.log(dirPathA, dirPathB)
    let dirA = await fsPromises.readdir(dirPathA);
    let dirB = await fsPromises.readdir(dirPathB);
    // console.log(dirA)
    // console.log(dirB)
    // Two directories are identical shallowly if they have same number of items, in the same order
    return dirA.length === dirB.length && dirA.every((v, i) => v === dirB[i]);
}

compareDirDeep = async (dirPathA, dirPathB) => {
    let dirA = await fsPromises.readdir(dirPathA);
    let dirB = await fsPromises.readdir(dirPathB);
    // Two directories are identical shallowly if they have same number of items, in the same order
    return dirA.length === dirB.length && dirA.every(async (v, i) => await compareFile(path.join(dirPathA,v), path.join(dirPathB, dirB[i])));
}

describe('Convert Tags line from Notion to Obsidian', () => {
    it('should return Content: #Blockchain', () => {
        expect(tagConverter.convertTagLine("Tags: Blockchain")).to.be.equal("Content: #Blockchain");
    });
    it('should return Content: #Cat/Background', () => {
        expect(tagConverter.convertTagLine("Tags: Cat: Background")).to.be.equal("Content: #Cat/Background");
    });
    it('should return Content: #Blockchain, #Cat/Background, #Index', () => {
        expect(tagConverter.convertTagLine("Tags: Blockchain, Cat: Background, Index")).to.be.equal("Content: #Blockchain, #Cat/Background, #Index");
    });
});

describe('Convert Notion article to Obsidian article with tags', () => {
    beforeEach('Create output folder before each test', async () => {
        let outputDirPath = path.join(__dirname, 'samples', 'output')
        if(!fs.existsSync(outputDirPath)) await fsPromises.mkdir(outputDirPath);
    });
    // afterEach('Delete output folder after each test', async () => {
    //     let outputDirPath = path.join(__dirname, 'samples', 'output')
    //     if(fs.existsSync(outputDirPath)) await fsPromises.rm(outputDirPath, {recursive: true, force: true});
    // });
    it('should return the right article for Formal Definition of EVM', async () => {
        let inputFile = path.join(__dirname, 'samples', 'input', 'Formal Definition of EVM.md')
        let outputFile = path.join(__dirname, 'samples', 'output', 'Formal Definition of EVM.md')
        let expectedOutputFile = path.join(__dirname, 'samples', 'expected_output', 'Formal Definition of EVM.md')
        await tagConverter.convertIndividualFile(inputFile, outputFile);
        expect(fs.existsSync(outputFile)).to.be.true;
        let compareResult = await compareFile(expectedOutputFile, outputFile);
        expect(compareResult).to.be.true;
    });
    it('should return the right article for Intuitive understanding of squares', async () => {
        let inputFile = path.join(__dirname, 'samples', 'input', 'Intuitive understanding of squares.md')
        let outputFile = path.join(__dirname, 'samples', 'output', 'Intuitive understanding of squares.md')
        let expectedOutputFile = path.join(__dirname, 'samples', 'expected_output', 'Intuitive understanding of squares.md')
        await tagConverter.convertIndividualFile(inputFile, outputFile);
        expect(fs.existsSync(outputFile)).to.be.true;
        let compareResult = await compareFile(expectedOutputFile, outputFile);
        expect(compareResult).to.be.true;
    });
    it('should return the right article for Types of research in engineering cycle', async () => {
        let inputFile = path.join(__dirname, 'samples', 'input', 'Types of research in the engineering cycle.md')
        let outputFile = path.join(__dirname, 'samples', 'output', 'Types of research in the engineering cycle.md')
        let expectedOutputFile = path.join(__dirname, 'samples', 'expected_output', 'Types of research in the engineering cycle.md')
        await tagConverter.convertIndividualFile(inputFile, outputFile);
        expect(fs.existsSync(outputFile)).to.be.true;
        let compareResult = await compareFile(expectedOutputFile, outputFile);
        expect(compareResult).to.be.true;
    });
})

describe('Convert entire folder of Notion articles', () => {
    // afterEach('Delete output folder after each test', async () => {
    //     let outputDirPath = path.join(__dirname, 'samples', 'output')
    //     if(fs.existsSync(outputDirPath)) await fsPromises.rm(outputDirPath, {recursive: true, force: true});
    // })
    it('should return a new folder with identical file names', async () => {
        let inputDir = path.join(__dirname, 'samples', 'input');
        let outputDir = path.join(__dirname, 'samples', 'output');
        let expectedOutputDir = path.join(__dirname, 'samples', 'expected_output');
        await tagConverter.convertFolder(inputDir, outputDir);
        expect(await compareDirShallow(outputDir, expectedOutputDir)).to.be.true;
    });
    it('should ensure that every article has been converted properly', async () => {
        let inputDir = path.join(__dirname, 'samples', 'input');
        let outputDir = path.join(__dirname, 'samples', 'output');
        let expectedOutputDir = path.join(__dirname, 'samples', 'expected_output');
        await tagConverter.convertFolder(inputDir, outputDir);
        expect(await compareDirDeep(outputDir, expectedOutputDir)).to.be.true;
    })
})