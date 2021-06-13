'strict mode';
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const prettier = require('prettier');

const processFile = filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.match(/PACKAGE_NAME/)) {
    return false;
  }

  const [pkgName] = content.match(/export const (.*)_PACKAGE_NAME(.*)/);
  const [protobufPkg] = content.match(/export const protobufPackage(.*)/);

  content = content.replace(/export const (.*)_PACKAGE_NAME (.*)/, '');
  content = content.replace(/export const protobufPackage = (.*)/, '');

  prettier.resolveConfigFile().then(cnfPath => {
    prettier.resolveConfig(cnfPath).then(config => {
      config.parser = 'typescript';
      fs.writeFileSync(filePath, prettier.format(content, config));
    });
  });
  return [pkgName, protobufPkg];
};

const processImports = (relativePath, directories, files) => {
  let extraImports = [];
  let imports = files.map(file => {
    const name = path.parse(file).name;
    const determisticPkgName = processFile(path.join(relativePath, file));
    if (determisticPkgName) {
      extraImports = determisticPkgName;
    }
    return `export * from './${name}';`;
  });

  if (extraImports.length > 0) {
    imports = imports.concat(extraImports.map(i => `\n${i}`));
  }

  if (directories.length > 0) {
    imports = imports.concat(
      directories.map(directory => {
        return `import * as ${directory} from './${directory}';`;
      }),
    );
    imports.push('\nexport {');
    imports = imports.concat(
      directories.map(impo => `${path.parse(impo).name},`),
    );
    imports.push('};');
  }

  return imports.join('\n');
};

const processDirectory = parent => dir => {
  dir = path.resolve(__dirname, '..', 'src', parent, dir);

  if (fs.lstatSync(dir).isFile()) {
    return true;
  }

  try {
    let directories = fs.readdirSync(dir);
    directories = directories.filter(f => f !== 'index.ts');
    const files = directories.filter(processDirectory(dir));

    directories = directories.filter(directory =>
      fs.lstatSync(`${dir}/${directory}`).isDirectory(),
    );

    fs.writeFileSync(
      `${dir}/index.ts`,
      processImports(dir, directories, files),
    );
  } catch (e) {
    console.error(e);
  }
  return false;
};

(async () => {
  const dir = path.resolve(__dirname, '../src');
  exec(`rm ${dir}/**/index.ts`, () => {
    const startDirectory = fs.readdirSync(dir);
    const files = startDirectory.filter(processDirectory(''));
    const directories = startDirectory.filter(directory =>
      fs.lstatSync(`${dir}/${directory}`).isDirectory(),
    );

    // fs.writeFileSync(
    //   `${dir}/index.ts`,
    //   processImports(dir, directories, files)
    // );
  });
})();
