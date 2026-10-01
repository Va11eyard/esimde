const fs = require('fs');

const content = fs.readFileSync('/Users/zbekxzz/Documents/esimde/Esimde Landing Page Design/src/App.tsx', 'utf-8');

const blocks = content.split(/\/\/\s*───\s*(.*?)\s*─+/g);

// blocks[0] is everything before the first marker
const imports = `import { useState } from "react";
import { C } from "./Tokens";
import { Btn } from "./Btn";
`;

fs.mkdirSync('/Users/zbekxzz/Documents/esimde/frontend/src/components', { recursive: true });
fs.mkdirSync('/Users/zbekxzz/Documents/esimde/frontend/src/pages', { recursive: true });

let tokensCode = '';
let btnCode = '';

const components = [];
let responsiveCss = '';
let landingPageCode = '';

for (let i = 1; i < blocks.length; i += 2) {
  const name = blocks[i].trim();
  const code = blocks[i+1].trim();

  if (name === 'Tokens') {
    tokensCode = `export ` + code;
    fs.writeFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/components/Tokens.ts', tokensCode);
  } else if (name === 'Helpers') {
    btnCode = `import { useState } from "react";\nimport { C } from "./Tokens";\n\nexport ` + code.replace('function Btn', 'function Btn');
    fs.writeFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/components/Btn.tsx', btnCode);
  } else if (name === 'Responsive') {
    responsiveCss = code.substring(0, code.indexOf('export default function App'));
    landingPageCode = code.substring(code.indexOf('export default function App'));
  } else {
    // Normal component
    // We need to add exports
    let compCode = code;
    if (compCode.startsWith('const ')) {
      compCode = `export ` + compCode;
    } else if (compCode.startsWith('function ')) {
      compCode = `export ` + compCode;
    }
    
    // Add export to multiple functions if they exist (e.g. Hero and PhoneMockup)
    compCode = compCode.replace(/^function/gm, 'export function');
    compCode = compCode.replace(/^const/gm, 'export const');

    const cleanName = name.replace(/[^a-zA-Z]/g, '');
    let fileCode = imports + '\n' + compCode;
    fs.writeFileSync(`/Users/zbekxzz/Documents/esimde/frontend/src/components/${cleanName}.tsx`, fileCode);
    components.push(cleanName);
  }
}

// Generate LandingPage.tsx
let lpImports = `import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Threestepphotocards } from "../components/Threestepphotocards";
import { Statsstrip } from "../components/Statsstrip";
import { Problem } from "../components/Problem";
import { Howitworks } from "../components/Howitworks";
import { Whatwecheck } from "../components/Whatwecheck";
import { Resultpreview } from "../components/Resultpreview";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
`;

let lpCode = `
${lpImports}
${responsiveCss}
export function LandingPage() {
  return (
    <>
      <style>{css}</style>
      <Header />
      <div style={{ paddingTop: 64 }}>
        <Hero />
        <Threestepphotocards />
        <Statsstrip />
        <Problem />
        <Howitworks />
        <Whatwecheck />
        <Resultpreview />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
`;

fs.writeFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/pages/LandingPage.tsx', lpCode);

// Overwrite App.tsx
fs.writeFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/App.tsx', `import { LandingPage } from "./pages/LandingPage";\n\nfunction App() {\n  return <LandingPage />;\n}\n\nexport default App;\n`);

console.log("Done splitting!");
