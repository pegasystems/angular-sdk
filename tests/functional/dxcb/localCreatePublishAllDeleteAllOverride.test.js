// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('override publish and deleteAll local override', () => {
  it('initial delete/cleanup', async () => {
    const script = `npm run deleteAll Local override Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
  });

  it('npm run override auto complete override', async () => {
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

  it('npm run override details override', async () => {
    const fileName = 'details';
    const script = `npm run override Template ${fileName}`;

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
    const createOverrideFile = path.resolve(path.join(`src/app/_components/override-sdk/template/${fileName}`, `${fileName}.component.ts`));
    const doesOverrideExist = fs.existsSync(createOverrideFile);
    expect(doesOverrideExist).toBeTruthy();
  }, 20000);

  it('npm run override navbar override', async () => {
    const fileName = 'todo';
    const script = `npm run override Widget ${fileName}`;

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
    const createOverrideFile = path.resolve(path.join(`src/app/_components/override-sdk/widget/${fileName}`, `${fileName}.component.ts`));
    const doesOverrideExist = fs.existsSync(createOverrideFile);
    expect(doesOverrideExist).toBeTruthy();
  }, 20000);

  it('npm run publishAll (no fetch) custom verify in map', async () => {
    const script = `npm run publishAll override LoanV2 01-01-01 N noFetch`;
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    //    expect(stdout).toContain('Compiled successfully.');
    //    expect(stdout).not.toContain('Compiled with warnings.');
    //    expect(stdout).not.toContain('error');
    //    expect(stdout).not.toContain('Error');

    expect(stdout).toContain('auto-complete');
    expect(stdout).toContain('details');
    expect(stdout).toContain('todo');
    // done();

    // verify in map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(), 'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });
    let isInMap = true;

    if (mapDataAng.indexOf('AutoComplete') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('AutoCompleteComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('auto-complete') < 0) {
      isInMap = false;
    }

    if (mapDataAng.indexOf('Details') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('DetailsComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('details') < 0) {
      isInMap = false;
    }

    if (mapDataAng.indexOf('Todo') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('TodoComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('todo') < 0) {
      isInMap = false;
    }

    expect(isInMap).toBeTruthy();
  }, 100000);

  it('npm run deleteAll Local override verify removed from map', async () => {
    const script = `npm run deleteAll Local override Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // pick one
    const newFileName = 'auto-complete';

    // want message to contain component name
    expect(stdout).toContain(newFileName);

    // message deleted
    expect(stdout).toContain('is deleted');

    // check to see file exists

    // I think run through a map of them here

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    // const createFile = path.resolve(path.join(`src/components/${newFileName}`, 'index.jsx'));
    // const doesExist = fs.existsSync(createFile);
    // expect(doesExist).not.toBeTruthy();

    // verify removed from map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(), 'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });
    let isInMap = false;

    if (mapDataAng.indexOf('AutoComplete') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('AutoCompleteComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('auto-complete') >= 0) {
      isInMap = true;
    }

    if (mapDataAng.indexOf('Details') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('DetialsComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('details') >= 0) {
      isInMap = true;
    }

    if (mapDataAng.indexOf('Todo') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('TodoComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('todo') >= 0) {
      isInMap = true;
    }

    expect(isInMap).not.toBeTruthy();
  }, 20000);
});
