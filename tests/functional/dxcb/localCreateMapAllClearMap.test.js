// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('create mapAll clearMap custom local', () => {
  it('initial delete/cleanup', async () => {
    const script = `npm run deleteAll Local Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
  });

  it('npm run create Local text custom', async () => {
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

    // if (doesExist) {
    //   // remove it
    //   fs.rmdirSync(fileDir, { recursive: true });
    // }
  }, 10000);

  it('npm run create Local page custom', async () => {
    const fileName = 'MyTestPage';
    const newFileNameConstellation = `Pega_DXIL_${fileName}`;
    const newFileNameCustom = 'pega-dxil-my-test-page';
    const script = `npm run create Widget PAGE ${fileName} "My Test Page" 0.0.1 DXIL "" "My Test Page Description" Pega`;

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
      path.join(`src/app/_components/custom-constellation/widget/${newFileNameConstellation}`, 'index.jsx')
    );
    const doesConstellationExist = fs.existsSync(createConstellationFile);
    expect(doesConstellationExist).toBeTruthy();

    const createCustomFile = path.resolve(
      path.join(`src/app/_components/custom-sdk/widget/${newFileNameCustom}`, `${newFileNameCustom}.component.ts`)
    );
    const doesCustomExist = fs.existsSync(createCustomFile);
    expect(doesCustomExist).toBeTruthy();
  }, 10000);

  it('npm run create Local details custom', async () => {
    const fileName = 'MyTestDetails';
    const newFileNameConstellation = `Pega_DXIL_${fileName}`;
    const newFileNameCustom = 'pega-dxil-my-test-details';
    const script = `npm run create Template DETAILS ${fileName} "My Test Details" 0.0.1 DXIL "" "My Test Details Description" Pega`;

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
      path.join(`src/app/_components/custom-constellation/template/${newFileNameConstellation}`, 'index.jsx')
    );
    const doesConstellationExist = fs.existsSync(createConstellationFile);
    expect(doesConstellationExist).toBeTruthy();

    const createCustomFile = path.resolve(
      path.join(`src/app/_components/custom-sdk/template/${newFileNameCustom}`, `${newFileNameCustom}.component.ts`)
    );
    const doesCustomExist = fs.existsSync(createCustomFile);
    expect(doesCustomExist).toBeTruthy();
  }, 10000);

  it('npm run mapAll verify in map custom', async () => {
    const script = `npm run mapAll custom`;
    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    expect(stdout).toContain('Mapping: Pega_DXIL_MyTestText');
    expect(stdout).toContain('Mapping: Pega_DXIL_MyTestPage');
    expect(stdout).toContain('Mapping: Pega_DXIL_MyTestDetails');

    // verify in map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(), 'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });

    let isInMap = true;

    if (mapDataAng.indexOf('Pega_DXIL_MyTestText') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestText') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestTextComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-text') < 0) {
      isInMap = false;
    }

    if (mapDataAng.indexOf('Pega_DXIL_MyTestPage') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestPage') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestPageComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-page') < 0) {
      isInMap = false;
    }

    if (mapDataAng.indexOf('Pega_DXIL_MyTestDetails') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestDetails') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestDetailsComponent') < 0) {
      isInMap = false;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-details') < 0) {
      isInMap = false;
    }

    expect(isInMap).toBeTruthy();

    // done();
  }, 100000);

  it('npm run clearMap', async () => {
    const script = `npm run clearMap`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    expect(stdout).toContain('Clear component map');

    //  map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(), 'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });

    // blank map
    const blankMap = path.join(path.resolve(), 'node_modules/@pega/angular-sdk-library', 'sdk-local-component-map.ts');
    const blankMapData = fs.readFileSync(blankMap, { encoding: 'utf8' });

    expect(mapDataAng).toEqual(blankMapData);
  }, 10000);

  it('npm run deleteAll Local verify not in map custom', async () => {
    const script = `npm run deleteAll Local custom Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // pick one
    const newFileName = 'pega-dxil-my-test-text';

    // want message to contain component name
    expect(stdout).toContain(newFileName);

    // message deleted
    expect(stdout).toContain('is deleted');

    // check to see file exists

    // verify in not map
    const pegaLocalAngularComponentMapPath = path.join(path.resolve(), 'sdk-local-component-map.ts');
    const mapDataAng = fs.readFileSync(pegaLocalAngularComponentMapPath, { encoding: 'utf8' });

    let isInMap = false;

    if (mapDataAng.indexOf('Pega_DXIL_MyTestText') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestText') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestTextComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-text') >= 0) {
      isInMap = true;
    }

    if (mapDataAng.indexOf('Pega_DXIL_MyTestPage') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestPage') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestPageComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-page') >= 0) {
      isInMap = true;
    }

    if (mapDataAng.indexOf('Pega_DXIL_MyTestDetails') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestDetails') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('PegaDxilMyTestDetailsComponent') >= 0) {
      isInMap = true;
    }
    if (mapDataAng.indexOf('pega-dxil-my-test-details') >= 0) {
      isInMap = true;
    }

    expect(isInMap).not.toBeTruthy();

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    // const createFile = path.resolve(path.join(`src/components/${newFileName}`, 'index.jsx'));
    // const doesExist = fs.existsSync(createFile);
    // expect(doesExist).not.toBeTruthy();
  }, 20000);
});
