import fs from "node:fs/promises";
import path from "node:path";

(async () => {
  console.log(process.cwd());

  const folder = path.resolve(process.cwd(), "generated");
  const REACT_JS_COMPONENT_QUANTITY = 5;

  try {
    await fs.access(folder);
  } catch {
    await fs.mkdir(folder);
  }

  let i = 0;
  let reactJsComponentsImportString = "";
  let reactJsComponentsUseString = "";
  while (i < REACT_JS_COMPONENT_QUANTITY) {
    const fileName = `component_${i}.jsx`;
    const template = `
      import React from 'react'
      export const Component_${i} = () => <div> THis ias Component </div>;
  `;

    reactJsComponentsImportString += `import {Component_${i}} from './${fileName}' \n`;
    reactJsComponentsUseString += `<Component_${i} /> \n`;
    await fs.writeFile(path.resolve(folder, fileName), template);
    i++;
  }

  const indexJS = "index.js";

  const indexTemplate = `
    import React from 'react'
    import { createRoot } from 'react-dom/client';

    ${reactJsComponentsImportString}

    const test = () => <div className="className penis"> AAAAAAA </div>
    test();
    const root = createRoot(document.getElementById('app'));
    root.render(
      <div>
        ${reactJsComponentsUseString}
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
  await fs.writeFile(path.resolve(process.cwd(), indexHtml), htmlRoot);
})();
