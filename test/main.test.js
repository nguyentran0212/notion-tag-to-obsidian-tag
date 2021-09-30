const chai = require('chai');  
const expect = chai.expect;

const tagConverter = require("../main")

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