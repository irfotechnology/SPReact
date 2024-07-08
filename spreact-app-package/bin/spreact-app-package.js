#!/usr/bin/env node

console.log("Creating application package.... please wait...");
const currentDir = process.cwd();

console.log(`working directory : ${currentDir} `);

const fs = require('node:fs');



const dirDeploy = `${currentDir}/deploy`
const dirTemp = `${dirDeploy}/temp`;
const dirBuild = `${currentDir}/build`;

const packManifest = JSON.parse(fs.readFileSync(`${currentDir}/config/app-package.json`));
const appManifest = packManifest.app

try {
    if (!fs.existsSync(dirDeploy)) {
        fs.mkdirSync(dirDeploy);
    }
    else {
        fs.rmSync(dirDeploy, { recursive: true, force: true });
        fs.mkdirSync(dirDeploy);
    }
    const outDirPath = fs.realpathSync(dirDeploy);
    //Copy build files
    fs.cpSync(dirBuild, dirTemp, { recursive: true, force: true });
    //Copy app manifest file
    fs.writeFileSync(`${dirTemp}/appManifest.json`, JSON.stringify(appManifest));
    //create app pacakge
    var archiver = require('archiver');

    var output = fs.createWriteStream(`${outDirPath}/${packManifest.appPackagename}`);
    var archive = archiver('zip');

    output.on('close', function () {
        // console.log(archive.pointer() + ' total bytes');
        fs.rmSync(dirTemp, { recursive: true, force: true });
        console.log(`${packManifest.appPackagename} has been successfully created.`);
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(dirTemp, false);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    //archive.directory('subdir/', 'new-subdir');

    archive.finalize();
} catch (err) {
    console.error(err);
}

require('./index.js');