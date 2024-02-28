import path from 'node:path';

import { distCjs, distEsm, distTsConfig, tempTypes } from '@repo/constants';
import fs from 'fs-extra';
import { glob } from 'glob';
import { Project } from 'ts-morph';

async function normalizeDtsMap(file: string, newFileName: string) {
  const mapContent = await fs.readFile(file, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map = JSON.parse(mapContent);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  map.file = newFileName;

  await fs.writeFile(file, JSON.stringify(map), 'utf8');
}

async function updateSourceMappingURL(file: string, newMapFileName: string) {
  const content = await fs.readFile(file, 'utf8');

  const updatedContent = content.replace(
    /\/\/# sourceMappingURL=.*/,
    `//# sourceMappingURL=${newMapFileName}`
  );

  await fs.writeFile(file, updatedContent, 'utf8');
}

async function normalizeDtsImports(filePath: string, isCjs: boolean) {
  const project = new Project({
    tsConfigFilePath: distTsConfig,
  });
  const sourceFile = project.addSourceFileAtPath(filePath);

  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    let moduleSpecifier = importDeclaration.getModuleSpecifierValue();

    if (moduleSpecifier.startsWith('./') || moduleSpecifier.startsWith('../')) {
      moduleSpecifier += isCjs ? '.cjs' : '.js';
      importDeclaration.setModuleSpecifier(moduleSpecifier);
    }
  });

  await sourceFile.save();
}

export default async function processDtsFiles() {
  await fs.ensureDir(distCjs);
  await fs.ensureDir(distEsm);

  const dtsExt = {
    cjs: '.d.cts',
    esm: '.d.ts',
  };

  const dtsMapExt = {
    cjs: '.d.cts.map',
    esm: '.d.ts.map',
  };

  const dtsFiles = await glob(`${tempTypes}/**/*.{d.ts,d.cts,d.mts}`);
  const mapFiles = await glob(
    `${tempTypes}/**/*.{d.ts.map,d.cts.map,d.mts.map}`
  );

  const getCtx = (filePath: string) => {
    const relativePath = path.relative(tempTypes, filePath);

    return {
      relativePath,
      baseFileName: path
        .basename(filePath)
        .replace(/\.(d\.)?(ts|cts|mts)(\.map)?$/, ''),
      relativeDir: path.dirname(relativePath),
    };
  };

  for (const filePath of dtsFiles) {
    const { baseFileName, relativeDir } = getCtx(filePath);

    const cjsFilePath = path.join(
      distCjs,
      relativeDir,
      `${baseFileName}${dtsExt.cjs}`
    );
    const esmFilePath = path.join(
      distEsm,
      relativeDir,
      `${baseFileName}${dtsExt.esm}`
    );

    // Copy .d.ts file to dist/esm/*.d.ts
    await fs.copy(filePath, esmFilePath);
    await normalizeDtsImports(esmFilePath, false);
    await updateSourceMappingURL(
      esmFilePath,
      `${baseFileName}${dtsMapExt.esm}`
    );

    // Copy .d.ts to dist/cjs/*.d.cts
    await fs.copy(filePath, cjsFilePath);
    await normalizeDtsImports(cjsFilePath, true);
    await updateSourceMappingURL(
      cjsFilePath,
      `${baseFileName}${dtsMapExt.cjs}`
    );
  }

  for (const mapFilePath of mapFiles) {
    const { relativeDir, baseFileName } = getCtx(mapFilePath);

    const cjsDtsFileMapPath = path.join(
      distCjs,
      relativeDir,
      `${baseFileName}${dtsMapExt.cjs}`
    );
    const esmDtsFileMapPath = path.join(
      distEsm,
      relativeDir,
      `${baseFileName}${dtsMapExt.esm}`
    );

    await fs.copy(mapFilePath, cjsDtsFileMapPath);
    await normalizeDtsMap(cjsDtsFileMapPath, `${baseFileName}${dtsExt.cjs}`);

    await fs.copy(mapFilePath, esmDtsFileMapPath);
    await normalizeDtsMap(esmDtsFileMapPath, `${baseFileName}${dtsExt.esm}`);
  }
}
