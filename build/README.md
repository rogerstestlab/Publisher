# Build Assets Directory

This directory contains assets needed for building the Publisher application installers.

## Required Icon Files

To build the application for different platforms, you'll need the following icon files:

### macOS
- **icon.icns** - macOS application icon (512x512px recommended)
  - Can be generated from a PNG using: `iconutil -c icns icon.iconset`
  - Or use online tools like: https://cloudconvert.com/png-to-icns

- **background.png** - DMG installer background image (540x400px)
  - Optional: Creates a custom DMG installer appearance
  - Recommended: Light background with drag-and-drop visual guide

### Windows
- **icon.ico** - Windows application icon
  - Should contain multiple sizes: 16x16, 32x32, 48x48, 256x256
  - Can be generated from PNG using tools like ImageMagick or online converters
  - Example: https://convertio.co/png-ico/

- **fileIcon.ico** - Icon for associated .html files
  - Optional: Uses main icon if not provided
  - Recommended size: 256x256px

### Linux
- **icons/** directory - Linux icon set
  - Create PNG icons in standard sizes:
    - 16x16
    - 32x32
    - 48x48
    - 64x64
    - 128x128
    - 256x256
    - 512x512
  - Place them in: `build/icons/[size]x[size].png`
  - Example: `build/icons/512x512.png`

## Icon Design Recommendations

For best results, create your icon with these specifications:

1. **Size**: Start with a 1024x1024px canvas
2. **Format**: PNG with transparency
3. **Style**: Simple, recognizable design that works at small sizes
4. **Colors**: Use brand colors that stand out
5. **Content**: Consider using a code/HTML symbol or "P" for Publisher

## Quick Start

If you don't have icons yet, you can:

1. Create a simple 1024x1024px PNG icon
2. Use online tools to convert to required formats:
   - PNG → ICNS: https://cloudconvert.com/png-to-icns
   - PNG → ICO: https://convertio.co/png-ico/
   - PNG → Multiple sizes: https://www.iloveimg.com/resize-image

3. Place generated files in this directory:
   ```
   build/
   ├── icon.icns (macOS)
   ├── icon.ico (Windows)
   ├── fileIcon.ico (Windows, optional)
   ├── background.png (macOS DMG, optional)
   └── icons/ (Linux)
       ├── 16x16.png
       ├── 32x32.png
       ├── 48x48.png
       ├── 64x64.png
       ├── 128x128.png
       ├── 256x256.png
       └── 512x512.png
   ```

## Building Without Icons

The application will build without icons, but:
- Default Electron icon will be used
- Installers will look less professional
- File associations won't have custom icons

For production releases, **always include proper icons**!

## Current Status

- ✅ Entitlements file created (macOS code signing)
- ⚠️  Icons not yet created (add before building for production)
- ⚠️  DMG background not created (optional)

## Next Steps

1. Design and create application icon (1024x1024px PNG)
2. Convert to platform-specific formats
3. Add files to this directory
4. Test build: `npm run package`
