const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') {
        if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
          filelist.push(dirFile);
        }
      }
    }
  });
  return filelist;
};

const appDir = path.join(__dirname, 'app');
const files = walkSync(appDir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.split('\n').map(line => {
    // Check if line has text-white
    if (!line.includes('text-white')) return line;

    // Skip if line has a dark background class
    const darkBgClasses = [
      'bg-indigo-600',
      'bg-emerald-600',
      'bg-blue-600',
      'bg-purple-600',
      'from-[#4F46E5]',
      'from-emerald-950',
      'bg-gradient-to-br',
      'bg-gradient-to-r',
      'bg-slate-900',
      'hover:bg-indigo-600'
    ];

    if (darkBgClasses.some(c => line.includes(c))) {
      return line; // keep text-white
    }

    // Skip if it is part of a ternary that gives it a dark background
    // e.g., isActive ? 'bg-indigo-600 text-white' : '...'
    if (line.match(/bg-[a-z]+-[5-9]00.*text-white/)) {
      return line;
    }

    // Replace text-white with text-[#172554] on light backgrounds
    return line.replace(/text-white/g, 'text-[#172554]');
  }).join('\n');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Updated ${changedFiles} files.`);
