import fs from "node:fs/promises";
import path from "node:path";

class OutputAdapter {
  constructor(outputter, DataProvider) {
    this.outputter = outputter;
    this.data = DataProvider.getData();
  }

  async apply() {
    await this.outputter.apply(null, this.data);
  }
}

class FileWriter {
  constructor(path, data) {
    this.path = path;
    this.data = data;
    this.writer = new OutputAdapter(fs.writeFile, this);
  }
  getData() {
    return [this.path, this.data];
  }
  async apply() {
    await this.writer.apply();
  }
}

class ReactJsComponentStringBuilder {
  constructor(postfix, fileName) {
    this.postfix = postfix;
    this.fileName = fileName;
  }

  getTemplate() {
    return `
      import React from 'react'
      export const Component_${this.postfix} = () => <div> This is a Component </div>;
    `;
  }

  getUseString() {
    return `<Component_${this.postfix}/> \n`;
  }

  getImportString() {
    return `import {Component_${this.postfix}} from './${this.getFileName()}' \n`;
  }

  getFileName() {
    return `${this.fileName}_${this.postfix}.jsx`;
  }
}

class TempalateFactory {
  constructor(name, quantity, Builder) {
    this.quantity = quantity;
    this.name = name;
    this.builder = Builder;
    this.importTemplate = "";
    this.useTemplate = "";
    this.fileTemplates = [];
    this.fileNames = [];
    this.generate();
  }

  generate() {
    let i = 0;
    while (i < this.quantity) {
      const stringInstance = new this.builder(i, this.name);
      this.fileNames.push(stringInstance.getFileName());
      this.fileTemplates.push(stringInstance.getTemplate());
      this.useTemplate += stringInstance.getUseString();
      this.importTemplate += stringInstance.getImportString();
      i++;
    }
  }

  getImportsTemplate() {
    return this.importTemplate;
  }
  getUseTemplate() {
    return this.useTemplate;
  }
  getFileTemplates() {
    return this.fileTemplates;
  }
  getFileNames() {
    return this.fileNames;
  }
  getGeneratedQuantity() {
    return this.quantity;
  }
}

(async () => {
  console.log(process.cwd());

  const folder = path.resolve(process.cwd(), "../generated");
  const rootFolder = path.resolve(process.cwd(), "../");
  const REACT_JS_COMPONENT_QUANTITY = 5;

  try {
    await fs.access(folder);
  } catch {
    await fs.mkdir(folder);
  }

  const reactComponents = new TempalateFactory(
    "component",
    10,
    ReactJsComponentStringBuilder
  );

  for (let i = 0; i < reactComponents.getGeneratedQuantity(); i++) {
    (async () => {
      console.log(reactComponents.getFileNames())
      const writer = new FileWriter(
        path.resolve(folder, reactComponents.getFileNames()[i]),
        reactComponents.getFileTemplates()[i]
      );
      await writer.apply();
    })();
  }

  const indexJS = "index.js";

  const indexTemplate = `
    import React from 'react'
    import { createRoot } from 'react-dom/client';

    ${reactComponents.getImportsTemplate()}

    const test = () => <div className="className penis"> AAAAAAA </div>
    test();
    const root = createRoot(document.getElementById('app'));
    root.render(
      <div>
        ${reactComponents.getUseTemplate()}
      </div>
    );

`;

  const indexHtml = "index.html";
  const htmlRoot = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My app</title>
      </head>
      <body>
        <div id="app" />
        <script src="./build/bundle.js"></script>
      </body>
    </html>

`;

  await fs.writeFile(path.resolve(folder, indexJS), indexTemplate);
  await fs.writeFile(path.resolve(rootFolder, indexHtml), htmlRoot);
})();
