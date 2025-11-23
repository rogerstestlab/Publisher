const { default: pngToIco } = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateIco() {
  const pngFiles = [
    'build/icons/16x16.png',
    'build/icons/32x32.png',
    'build/icons/48x48.png',
    'build/icons/256x256.png'
  ];

  try {
    console.log('Generating icon.ico...');
    const icoBuffer = await pngToIco(pngFiles);
    fs.writeFileSync(path.join(__dirname, 'build', 'icon.ico'), icoBuffer);
    console.log('✓ Created icon.ico');
  } catch (error) {
    console.error('Error generating .ico:', error);
    process.exit(1);
  }
}

generateIco();
