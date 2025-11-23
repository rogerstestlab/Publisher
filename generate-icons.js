const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];
const iconsDir = path.join(__dirname, 'build', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating icons from icon.svg...');

  const svgBuffer = fs.readFileSync('icon.svg');

  // Generate PNGs for Linux
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Created ${size}x${size}.png`);
  }

  // Generate 1024px PNG for macOS icon conversion
  const iconPngPath = path.join(__dirname, 'build', 'icon-1024.png');
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(iconPngPath);
  console.log('✓ Created icon-1024.png');

  console.log('\nIcons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Convert icon-1024.png to icon.icns for macOS');
  console.log('2. Convert icon-1024.png to icon.ico for Windows');
  console.log('\nYou can use online tools:');
  console.log('- PNG to ICNS: https://cloudconvert.com/png-to-icns');
  console.log('- PNG to ICO: https://convertio.co/png-ico/');
}

generateIcons().catch(console.error);
