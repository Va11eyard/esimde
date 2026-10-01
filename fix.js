const fs = require('fs');
const path = require('path');

const dir = '/Users/zbekxzz/Documents/esimde/frontend/src/components';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Auto-fix unused imports naively by checking if the word exists elsewhere
    if (content.includes('import { useState }')) {
      if (!content.includes('useState(') && !content.includes('useState<')) {
        content = content.replace('import { useState } from "react";\n', '');
      }
    }
    if (content.includes('import { Btn }')) {
      if (!content.includes('<Btn ') && !content.includes('<Btn/>') && !content.includes('<Btn />')) {
        content = content.replace('import { Btn } from "./Btn";\n', '');
      }
    }
    fs.writeFileSync(path.join(dir, file), content);
  }
}

// Rename mismatched files
const renames = {
  'Threestepphotocards.tsx': 'PhotoCards.tsx',
  'Statsstrip.tsx': 'Stats.tsx',
  'Howitworks.tsx': 'HowItWorks.tsx',
  'Whatwecheck.tsx': 'WhatWeCheck.tsx',
  'Resultpreview.tsx': 'ResultPreview.tsx',
};

for (const [oldName, newName] of Object.entries(renames)) {
  if (fs.existsSync(path.join(dir, oldName))) {
    fs.renameSync(path.join(dir, oldName), path.join(dir, newName));
  }
}

// Update LandingPage.tsx
let lp = fs.readFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/pages/LandingPage.tsx', 'utf-8');
lp = lp.replace(/Threestepphotocards/g, 'PhotoCards');
lp = lp.replace(/Statsstrip/g, 'Stats');
lp = lp.replace(/Howitworks/g, 'HowItWorks');
lp = lp.replace(/Whatwecheck/g, 'WhatWeCheck');
lp = lp.replace(/Resultpreview/g, 'ResultPreview');
fs.writeFileSync('/Users/zbekxzz/Documents/esimde/frontend/src/pages/LandingPage.tsx', lp);

console.log("Fixed!");
