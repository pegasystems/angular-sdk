// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('create rename and delete local', () => {
  it('initial delete/cleanup', async () => {
    const script = `npm run deleteAll Local custom Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
  });

  it('npm run create Local custom', async () => {
    const fileName = 'MyTestText';
    const newFileNameConstellation = `Pega_DXIL_${fileName}`;
    const newFileNameCustom = 'pega-dxil-my-test-text';
    const script = `npm run create Field Text ${fileName} "My Test Text" 0.0.1 DXIL "" "My Test Text Description" Pega`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // want message to contain component name
    expect(stdout).toContain(newFileNameConstellation);
    expect(stdout).toContain(newFileNameCustom);

    // don't want message with already exists
    expect(stdout).not.toContain('already exists');

    // check to see file exists

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    const createConstellationFile = path.resolve(
      path.join(`src/app/_components/custom-constellation/field/${newFileNameConstellation}`, 'index.jsx')
    );
    const doesConstellationExist = fs.existsSync(createConstellationFile);
    expect(doesConstellationExist).toBeTruthy();

    const createCustomFile = path.resolve(
      path.join(`src/app/_components/custom-sdk/field/${newFileNameCustom}`, `${newFileNameCustom}.component.ts`)
    );
    const doesCustomExist = fs.existsSync(createCustomFile);
    expect(doesCustomExist).toBeTruthy();
  }, 10000);

  it('npm run rename', async () => {
    const fileName = 'MyTestText';
    const newName = 'MyBlueText';
    const oldFileName = `Pega_DXIL_${fileName}`;
    const newFileName = `Pega_DXIL_${newName}`;

    const script = `npm run rename field/Pega_DXIL_${fileName} ${newName} "My Blue Text" Pega 0.0.1 DXIL "" "My Blue Text Des"`;
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
    expect(stdout).toContain(`${oldFileName} renamed to ${newFileName}`);
    // done();
  }, 10000);

  it('npm run delete Local custom', async () => {
    const fileName = 'MyBlueText';
    const newFileName = `Pega_DXIL_${fileName}`;
    const script = `npm run delete Local custom field/${newFileName} Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // want message to contain component name
    expect(stdout).toContain(newFileName);

    // message deleted
    expect(stdout).toContain('is deleted');

    // check to see file exists

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    const createFile = path.resolve(path.join(`src/app/_components/custom-sdk/field/${newFileName}`, `${newFileName}.component.ts`));
    const doesExist = fs.existsSync(createFile);
    expect(doesExist).not.toBeTruthy();
  }, 10000);
});
