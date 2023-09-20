// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('create publish and delete local override', () => {
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

  it('npm run publish override (no fetch) verify in map', async () => {
    const fileName = 'auto-complete';

    const script = `npm run publish override field/${fileName} LoanV2 01-01-01 N noFetch`;
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    
    expect(stderr).not.toBeNull();

    expect(stdout).toContain('auto-complete');
    //expect(stdout).toContain('Compiled successfully.');

    // verify in map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(),  'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });
    let isInMap = true;

    if (mapDataAng.indexOf("AutoComplete") < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf("AutoCompleteComponent") < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf("auto-complete") < 0) {
      isInMap = false;
    }

    expect(isInMap).toBeTruthy();

  }, 30000);

  it('npm run delete Local override verify removed from map', async () => {
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


    // verify removed from map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(),  'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });
    let isInMap = false;

    if (mapDataAng.indexOf("AutoComplete") >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf("AutoCompleteComponent") >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf("auto-complete") >= 0) {
      isInMap = true;
    }

    expect(isInMap).not.toBeTruthy();

  }, 10000);
});
