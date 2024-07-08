#!/usr/bin/env node

function updateStaticCDNPath(dirTemp, cndPath){
    const dirStatic = fs.realpathSync(`${dirTemp}/static`);
    const dirSub = fs.readdirSync(dirStatic,{recursive: true});
    dirSub.forEach(dir => {
        const files = fs.readdirSync(`${dirStatic}/${dir}`,{recursive:true});
        files.forEach(file => {
            const file_content = fs.readFileSync(`${dirStatic}/${dir}/${file}`,{encoding:'utf8'});
            const new_file_content = file_content.replace(/static/g, cndPath);
            fs.writeFileSync(`${dirStatic}/${dir}/${file}`,new_file_content,{encoding:'utf8'});
        });
    });
}

console.log("Creating application package.... please wait...");
const currentDir = process.cwd();

console.log(`working directory : ${currentDir} `);
const fs = require('node:fs');


const dirDeploy = `${currentDir}/deploy`
const dirTemp = `${dirDeploy}/temp`;
const dirBuild = `${currentDir}/build`;
try {

    const assetManifest = JSON.parse(fs.readFileSync(`${dirBuild}/asset-manifest.json`));
    const mainJS = assetManifest.files['main.js'];
    const mainCss = assetManifest.files['main.css'];
    const packManifest = JSON.parse(fs.readFileSync(`${currentDir}/config/app-package.json`));
    const appManifest = packManifest.app;
    const sharePoint = packManifest.sharepointHost;
    const staticCDNPath = `/publiccdn.sharepointonline.com/rotarex.${sharePoint}.com/ClientSideApps/${appManifest.id}/static/`

    if (!fs.existsSync(dirDeploy)) {
        fs.mkdirSync(dirDeploy);
    }
    else {
        fs.rmSync(dirDeploy, { recursive: true, force: true });
        fs.mkdirSync(dirDeploy);
        fs.mkdirSync(`${dirDeploy}/temp`);
    }

    //Copy build files
    fs.cpSync(dirBuild, dirTemp, { recursive: true, force: true });
    //console.log('Build files copied to temp.');
    //update static/ path
    updateStaticCDNPath(dirTemp,staticCDNPath);
    //console.log('Updated static cdn path.');
    //copy main.js file
    fs.copyFileSync(fs.realpathSync(`${dirTemp}${mainJS}`),`${dirTemp}/main.js`);
    //copy main.css file
    fs.copyFileSync(fs.realpathSync(`${dirTemp}${mainCss}`),`${dirTemp}/main.css`);
    //Copy app manifest file
    fs.writeFileSync(`${dirTemp}/appManifest.json`, JSON.stringify(appManifest));
    //create app pacakge
    var archiver = require('archiver');
    const outDirPath = fs.realpathSync(dirDeploy);
    var output = fs.createWriteStream(`${outDirPath}/${packManifest.appPackagename}`);
    var archive = archiver('zip');

    output.on('close', function () {
        // console.log(archive.pointer() + ' total bytes');
        fs.rmSync(dirTemp, { recursive: true, force: true });
        console.log(`${packManifest.appPackagename} has been successfully created.`);
    });

    archive.on('error', function (err) {
        console.error(err);
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