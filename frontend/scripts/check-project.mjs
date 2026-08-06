import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const src = path.join(root, 'src');
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const files = walk(src).filter((file) => /\.(ts|tsx|css)$/.test(file));
const codeFiles = files.filter((file) => /\.(ts|tsx)$/.test(file));

const requiredRoutes = [
  '/', '/demo', '/requirements', '/privacy', '/unsupported', '/style-guide',
  '/patient', 'connect', 'permissions', 'device-setup', 'calibration', 'calibration/result', 'aac', 'aac/:categoryId', 'compose', 'request/:eventId', 'reassurance', 'sos', 'check-required', 'offline',
  '/care/login', '/care/onboarding', '/care/pair', '/care', 'dashboard', 'patient/:patientId', 'communications', 'communications/:eventId', 'alerts', 'alerts/:alertId', 'aac/category/:categoryId', 'aac/item/new', 'aac/item/:itemId/edit', 'presets', 'history', 'analytics', 'settings', 'devices', 'notifications'
];

const routerText = fs.readFileSync(path.join(src, 'app/router.tsx'), 'utf8');
for (const route of requiredRoutes) {
  if (!routerText.includes(`'${route}'`) && !routerText.includes(`\"${route}\"`)) errors.push(`Missing route declaration: ${route}`);
}

for (const file of codeFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/from\s+['\"](@\/[^'\"]+)['\"]/g)) {
    const relative = match[1].slice(2);
    const base = path.join(src, relative);
    const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) errors.push(`Broken alias import in ${path.relative(root, file)}: ${match[1]}`);
  }
  if (/href=['\"]#['\"]|to=['\"]#['\"]/.test(text)) errors.push(`Placeholder navigation in ${path.relative(root, file)}`);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(text)) errors.push(`Emoji or pictograph found in ${path.relative(root, file)}`);
}

const requiredFiles = [
  'src/pages/public/LandingPage.tsx',
  'src/pages/patient/AacCategoriesPage.tsx',
  'src/pages/patient/AacItemsPage.tsx',
  'src/pages/patient/SosPage.tsx',
  'src/pages/care/DashboardPage.tsx',
  'src/pages/care/AacManagerPage.tsx',
  'src/pages/care/AlertsPage.tsx',
  'src/app/providers/CameraProvider.tsx',
  'src/app/providers/ToastProvider.tsx',
  'docs/FRONTEND_SPEC.md',
  'docs/PRIVACY_AND_SAFETY_CHECKLIST.md'
];
for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Missing required file: ${relative}`);
}

if (errors.length) {
  console.error(`OcuSpeak structure check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OcuSpeak structure check passed: ${codeFiles.length} TypeScript files, ${requiredRoutes.length} route declarations checked.`);
