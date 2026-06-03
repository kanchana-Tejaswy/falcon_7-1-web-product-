const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../hero/chocolate_blast_effect_000');
const outputDir = inputDir; // Save in the same directory

if (!fs.existsSync(inputDir)) {
  console.error(`Input directory not found: ${inputDir}`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));

if (files.length === 0) {
  console.log('No JPG files found to convert.');
  process.exit(0);
}

console.log(`Starting conversion of ${files.length} images to WebP...`);

async function convertImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));
    
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
  console.log('Conversion complete.');
}

convertImages();
