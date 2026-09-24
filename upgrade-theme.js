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

  // Sidebar specific fixes
  if (file.includes('Sidebar.tsx')) {
    content = content.replace(/bg-indigo-600\/15 text-indigo-300 border border-indigo-500\/30/g, 'bg-[#EEF2FF] text-[#2563EB] border border-[#dbe7f7]');
    content = content.replace(/text-indigo-300/g, 'text-indigo-600');
    content = content.replace(/text-indigo-200/g, 'text-indigo-600');
    content = content.replace(/text-indigo-400/g, 'text-indigo-600');
    content = content.replace(/text-white/g, 'text-[#172554]');
    content = content.replace(/hover:text-white/g, 'hover:text-[#172554]');
    content = content.replace(/bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent/g, 'text-[#172554]');
  }

  // Navbar specific fixes
  if (file.includes('Navbar.tsx')) {
    content = content.replace(/text-white/g, 'text-[#172554]');
    content = content.replace(/hover:text-white/g, 'hover:text-[#172554]');
    content = content.replace(/text-indigo-300/g, 'text-indigo-600');
    content = content.replace(/text-indigo-400/g, 'text-indigo-600');
    content = content.replace(/text-emerald-300/g, 'text-emerald-600');
    content = content.replace(/text-emerald-400/g, 'text-emerald-600');
    content = content.replace(/bg-amber-950\/70/g, 'bg-[#FFFBEB]');
    content = content.replace(/bg-emerald-950\/70/g, 'bg-[#ECFDF5]');
    content = content.replace(/bg-indigo-950\/70/g, 'bg-[#EEF2FF]');
    content = content.replace(/bg-indigo-950\/60/g, 'bg-[#EEF2FF]');
    content = content.replace(/bg-indigo-500\/20/g, 'bg-[#EEF2FF]');
  }

  // Replace primary buttons across the app
  content = content.replace(/bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500/g, 'bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px]');
  content = content.replace(/bg-indigo-600 hover:bg-indigo-500/g, 'bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px]');

  // Clean up old dark texts that might have been missed or broken
  content = content.replace(/text-slate-200/g, 'text-[#475569]');
  content = content.replace(/text-slate-300/g, 'text-[#475569]');
  content = content.replace(/text-slate-400/g, 'text-[#64748b]');
  content = content.replace(/text-slate-500/g, 'text-[#64748b]');

  // Lighten borders
  content = content.replace(/border-slate-[6789]00(\/[0-9]+)?/g, 'border-[#dbe7f7]');
  
  // Convert dark badges to light badges
  content = content.replace(/bg-indigo-900\/[0-9]+/g, 'bg-[#EEF2FF]');
  content = content.replace(/bg-indigo-950(\/[0-9]+)?/g, 'bg-[#EEF2FF]');
  content = content.replace(/bg-emerald-900\/[0-9]+/g, 'bg-[#ECFDF5]');
  content = content.replace(/bg-emerald-950(\/[0-9]+)?/g, 'bg-[#ECFDF5]');
  content = content.replace(/bg-amber-900\/[0-9]+/g, 'bg-[#FFFBEB]');
  content = content.replace(/bg-amber-950(\/[0-9]+)?/g, 'bg-[#FFFBEB]');
  content = content.replace(/bg-rose-900\/[0-9]+/g, 'bg-[#FEF2F2]');
  content = content.replace(/bg-rose-950(\/[0-9]+)?/g, 'bg-[#FEF2F2]');

  content = content.replace(/text-indigo-[34]00/g, 'text-[#4F46E5]');
  content = content.replace(/text-emerald-[34]00/g, 'text-[#10B981]');
  content = content.replace(/text-amber-[34]00/g, 'text-[#F59E0B]');
  content = content.replace(/text-rose-[34]00/g, 'text-[#EF4444]');
  content = content.replace(/text-cyan-[34]00/g, 'text-[#06B6D4]');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Advanced replacements completed.');
