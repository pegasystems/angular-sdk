// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('create build and delete local override', () => {
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

  }, 20000);

  it('npm run buildComponent override', async () => {
    const fileName = 'auto-complete';

    const script = `npm run buildComponent override field/${fileName} "" N`;
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    //expect(stdout).toContain(`${newFileNameConstellation} schema is valid`);
 //   expect(stdout).toContain('Compiled successfully.');
    // done();
  }, 30000);

  it('npm run delete Local override', async () => {
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
