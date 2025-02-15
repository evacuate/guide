import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const srcDir = path.resolve('src');

async function getMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let mdFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const filesInSubDir = await getMarkdownFiles(fullPath);
      mdFiles.push(...filesInSubDir);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      mdFiles.push(fullPath);
    }
  }
  return mdFiles;
}

async function main() {
  try {
    const mdFiles = await getMarkdownFiles(srcDir);
    const docs = [];

    for (const filePath of mdFiles) {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      docs.push({
        title: data.title || '',
        description: data.description || '',
        content: content.trim(),
      });
    }

    const output = { docs };
    await fs.writeFile('docs.json', JSON.stringify(output, null, 2), 'utf-8');
    console.log('docs.json has been generated successfully.');
  } catch (error) {
    console.error('Error generating docs.json:', error);
    process.exit(1);
  }
}

main();
