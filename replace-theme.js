const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./app').concat(walk('./components'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace backgrounds
  content = content.replace(/bg-slate-950/g, 'bg-[#f5f8ff]');
  content = content.replace(/bg-slate-900\/[0-9]+/g, 'bg-white');
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/bg-slate-800\/[0-9]+/g, 'bg-[#f8faff]');
  content = content.replace(/bg-slate-800/g, 'bg-[#f8faff]');
  content = content.replace(/bg-slate-700/g, 'bg-white');
  content = content.replace(/bg-gray-950/g, 'bg-[#f5f8ff]');
  content = content.replace(/bg-gray-900/g, 'bg-white');
  content = content.replace(/bg-black/g, 'bg-[#f5f8ff]');
  
  // Replace borders
  content = content.replace(/border-slate-[6789]00(\/[0-9]+)?/g, 'border-[#dbe7f7]');
  
  // Replace text colors carefully, not touching text-white in buttons
  // text-slate-100/200/300/400
  content = content.replace(/text-slate-100/g, 'text-[#172554]');
  content = content.replace(/text-slate-200/g, 'text-[#172554]');
  content = content.replace(/text-slate-300/g, 'text-[#475569]');
  content = content.replace(/text-slate-400/g, 'text-[#64748b]');
  content = content.replace(/text-slate-500/g, 'text-[#64748b]');
  
  // Don't replace text-white blindly as requested, only if it's not in a button.
  // We'll leave text-white alone to be safe unless it's obviously bad, but since user said "Do NOT blindly replace text-white everywhere", it's safer to keep it and manually check.
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Replacements completed.');
