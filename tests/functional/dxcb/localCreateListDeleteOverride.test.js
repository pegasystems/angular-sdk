// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('create list and delete local override', () => {
  it('initial delete/cleanup', async () => {
    const script = `npm run deleteAll Local override Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
  });

  it('npm run create Local override', async () => {
    const fileName = 'auto-complete';
    const script = `npm run override Field ${fileName}`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // want message to contain component name
    expect(stdout).toContain(fileName);

    // don't want message with already exists
    expect(stdout).not.toContain('already exists');

    // check to see file exists

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    const createOverrideFile = path.resolve(path.join(`src/app/_components/override-sdk/field/${fileName}`, `${fileName}.component.ts`));
    const doesOverrideExist = fs.existsSync(createOverrideFile);
    expect(doesOverrideExist).toBeTruthy();


    // if (doesExist) {
    //   // remove it
    //   fs.rmdirSync(fileDir, { recursive: true });
    // }
  }, 20000);

  it('npm run list Local override', async () => {
    const fileName = 'auto-complete';

    const script = 'npm run list Local override';
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    expect(stdout).toContain(`${fileName}`);
    // done();
  }, 20000);

 
  it('compare create to default override', async () => {
    const fileName = 'auto-complete';

    const componentDir = path.resolve(`src/app/_components/override-sdk/field/${fileName}`);
    const assetDir = path.resolve(`tests/assets/components/create/override-sdk/field/${fileName}`);

    // get files of directory
    const componentFiles = fs.readdirSync(componentDir);

    // get files of assets
    // const assetFiles = fs.readdirSync(assetDir);

    // compare
    componentFiles.forEach(file => {
      const componentFilePath = path.join(componentDir, file);
      const assetFilePath = path.join(assetDir, file);

      const componentFileData = fs.readFileSync(componentFilePath, { encoding: 'utf8' });
      const assetFileData = fs.readFileSync(assetFilePath, { encoding: 'utf8' });

      expect(componentFileData).toEqual(assetFileData);
    });
  }, 10000);

  it('npm run delete Local', async () => {
    const fileName = 'auto-complete';
    const script = `npm run delete Local override field/${fileName} Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // want message to contain component name
    expect(stdout).toContain(fileName);

    // message deleted
    expect(stdout).toContain('is deleted');

    // check to see file exists

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    const createFile = path.resolve(path.join(`src/app/_components/override-sdk/field/${fileName}`, `${fileName}.component.ts`));
    const doesExist = fs.existsSync(createFile);
    expect(doesExist).not.toBeTruthy();
  }, 10000);
});
