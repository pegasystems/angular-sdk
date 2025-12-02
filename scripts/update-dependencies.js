const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

try {
  const angularSdkPath = process.cwd();
  console.log(`angular-sdk path: ${angularSdkPath}`);

  // Create readline interface to ask for angular-sdk-components path
  const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readLineInterface.question('Please enter the absolute path of angular-sdk-components project: ', componentsProjectPathInput => {
    readLineInterface.close();
    const componentsProjectPath = path.resolve(componentsProjectPathInput);
    const distDir = path.join(componentsProjectPath, 'dist', 'angular-sdk-components');

    // Delete existing dist folder before build
    if (fs.existsSync(distDir)) {
      console.log(`---- Removing existing dist folder: ${distDir} ----`);
      fs.rmSync(distDir, { recursive: true, force: true });
    }

    console.log(`---- Building angular-sdk-components at: ${componentsProjectPath} ----`);
    execFileSync('ng', ['build', 'angular-sdk-components'], { cwd: componentsProjectPath, stdio: 'inherit' });

    console.log(`---- Packing npm package in: ${distDir} ----`);
    execFileSync('npm', ['pack'], { cwd: distDir, stdio: 'inherit' });

    // Find the generated .tgz file
    const tgzFile = fs.readdirSync(distDir).find(file => file.endsWith('.tgz'));
    if (!tgzFile) {
      throw new Error('No .tgz file found in dist folder!');
    }

    const tgzPath = path.join(distDir, tgzFile);
    const targetPath = path.join(angularSdkPath, tgzFile);

    // Delete old .tgz file if exists in angular-sdk folder
    const existingTgz = fs.readdirSync(angularSdkPath).find(file => file.endsWith('.tgz'));
    if (existingTgz) {
      console.log(`---- Removing old package: ${existingTgz} ----`);
      fs.unlinkSync(path.join(angularSdkPath, existingTgz));
    }

    console.log(`---- Copying ${tgzFile} to angular-sdk folder: ${angularSdkPath} ----`);
    fs.copyFileSync(tgzPath, targetPath);

    console.log('---- Installing package in angular-sdk ----');
    execFileSync('npm', ['install', `./${tgzFile}`], { cwd: angularSdkPath, stdio: 'inherit' });
    console.log("Done!!! 'angular-sdk' now uses local build of angular-sdk-components.");
  });
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
