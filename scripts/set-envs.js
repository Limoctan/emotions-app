const { writeFileSync, mkdirSync } = require('fs');


require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const envFileContent = `
export const environment = {
  production: true,
  geminiApiKey: "${process.env.GEMINI_API_KEY}",
};
`;

const envFileContentDev = `
export const environment = {
  production: false,
  geminiApiKey: "${process.env.GEMINI_API_KEY}",
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContentDev);

console.log(`Output generated at ${targetPath}`);
console.log(`Output generated at ${targetPathDev}`);
