// import { exec } from 'child_process';
const path = require('path');
const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

describe('overrideAll list and deleteAll local override', () => {
  it('initial delete/cleanup', async () => {
    const script = `npm run deleteAll Local override Y`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();
  });

  it('npm run overrideAll Local', async () => {
    const script = `npm run overrideAll`;

    const { stdout, stderr } = await exec(script);
    // console.log(stdout);
    expect(stdout).not.toBeNull();
    expect(stderr).not.toBeNull();

    // want message to contain component name
    expect(stdout).toContain('Created auto-complete');

    // don't want message with already exists
    expect(stdout).not.toContain('already exists');

    // check to see file exists

    // pick one
    const newFileName = 'auto-complete';

    // const fileDir = path.resolve(`src/components/${newFileName}`);
    const createFile = path.resolve(path.join(`src/app/_components/override-sdk/field/${newFileName}`, `${newFileName}.component.ts`));
    const doesExist = fs.existsSync(createFile);
    expect(doesExist).toBeTruthy();

    // if (doesExist) {
    //   // remove it
    //   fs.rmdirSync(fileDir, { recursive: true });
    // }
  }, 20000);

  it('npm run list Local override', async () => {
    const script = 'npm run list Local override';
    const { stdout, stderr } = await exec(script);

    expect(stderr).not.toBeNull();

    // just list a few
    expect(stdout).not.toBeNull();
    expect(stdout).toContain('auto-complete');
    expect(stdout).toContain('cancel-alert');
    expect(stdout).toContain('default-form');
    expect(stdout).toContain('details');
    expect(stdout).toContain('two-column');
    expect(stdout).toContain('case-history');
    expect(stdout).toContain('material-utility');
    expect(stdout).toContain('navbar');

    // done();
  }, 10000);

  it('compare created to default', async () => {
    let assetDir;
    let assetTopDir;
    let componentDir;
    let assetFileList;
    let componentFiles;

    const categoryList = ['designSystemExtension', 'field', 'infra', 'template', 'widget'];

    categoryList.forEach(category => {
      assetTopDir = path.resolve(`tests/assets/components/createAll/override-sdk/${category}`);
      assetFileList = fs.readdirSync(assetTopDir);

      assetFileList.forEach(assetFileDir => {
        componentDir = path.resolve(`src/app/_components/override-sdk/${category}/${assetFileDir}`);
        assetDir = path.resolve(`tests/assets/components/createAll/override-sdk/${category}/${assetFileDir}`);

        if (fs.lstatSync(assetDir).isFile()) {
          return;
        }

        // get files of directory
        componentFiles = fs.readdirSync(componentDir);

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
      });
    });
  }, 20000);

  it('npm run deleteAll Local override', async () => {
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
  }, 10000);
});
