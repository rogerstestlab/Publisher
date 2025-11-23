# Publisher - Release Configuration Guide

This document outlines the production release configuration for the Publisher HTML Editor.

## Package Configuration Summary

### Application Details
- **Product Name**: Publisher
- **Version**: 1.0.0
- **App ID**: com.publisher.htmleditor
- **Description**: A professional HTML code editor with live preview, Tailwind CSS support, and 30+ templates
- **License**: MIT

### Build Scripts

```bash
# Build for all platforms
npm run package

# Build for specific platforms
npm run package:win      # Windows (NSIS installer + Portable)
npm run package:mac      # macOS (DMG + ZIP for both Intel & Apple Silicon)
npm run package:linux    # Linux (AppImage, DEB, RPM)
```

## Platform Support

### Windows
- **Installer**: NSIS installer (x64, x86)
- **Portable**: Standalone executable (x64)
- **Features**:
  - Custom installation directory selection
  - Desktop shortcut creation
  - Start menu integration
  - File associations for .html and .htm files
  - Run after finish option

### macOS
- **Formats**: DMG installer + ZIP archive
- **Architectures**: Universal (Intel x64 + Apple Silicon arm64)
- **Features**:
  - Custom DMG background
  - Drag-to-Applications installation
  - Code signing ready (requires certificates)
  - Notarization ready
  - File associations for .html and .htm files

### Linux
- **Formats**:
  - AppImage (portable, works on most distributions)
  - DEB (Debian, Ubuntu, Linux Mint, etc.)
  - RPM (Fedora, RHEL, CentOS, openSUSE, etc.)
- **Architecture**: x64
- **Features**:
  - Desktop integration
  - File associations
  - Application menu entry
  - Categorized under Development tools

## File Associations

The application automatically registers as a handler for:
- `.html` files
- `.htm` files

When users double-click an HTML file, it will open in Publisher (after installation).

## Build Output

All build artifacts are saved to the `release/` directory:

```
release/
├── Publisher-1.0.0-mac-x64.dmg
├── Publisher-1.0.0-mac-arm64.dmg
├── Publisher-1.0.0-mac-x64.zip
├── Publisher-1.0.0-mac-arm64.zip
├── Publisher-1.0.0-win-x64.exe
├── Publisher-1.0.0-win-ia32.exe
├── Publisher-1.0.0-win-x64-portable.exe
├── Publisher-1.0.0-linux-x64.AppImage
├── Publisher-1.0.0-linux-x64.deb
└── Publisher-1.0.0-linux-x64.rpm
```

## Required Assets

Before building for production, you must create application icons:

### Create Icon Files
See `build/README.md` for detailed instructions on creating and placing icon files.

**Required files:**
- `build/icon.icns` - macOS app icon
- `build/icon.ico` - Windows app icon
- `build/icons/*.png` - Linux icon set (multiple sizes)

**Optional files:**
- `build/background.png` - macOS DMG background (540x400px)
- `build/fileIcon.ico` - Windows file association icon

## Code Signing (Optional but Recommended)

### macOS
1. Obtain Apple Developer certificate
2. Configure signing identity in package.json
3. Update entitlements if needed (already configured in `build/entitlements.mac.plist`)
4. Enable notarization for distribution outside App Store

### Windows
1. Obtain code signing certificate
2. Configure signing in package.json:
   ```json
   "win": {
     "certificateFile": "path/to/cert.pfx",
     "certificatePassword": "your-password"
   }
   ```

## Pre-Release Checklist

Before building the final release:

- [ ] Create and add all icon files to `build/` directory
- [ ] Update version number in `package.json`
- [ ] Update author information if needed
- [ ] Test the application thoroughly
- [ ] Run `npm run build` to ensure production build works
- [ ] Test file associations
- [ ] Prepare release notes
- [ ] (Optional) Set up code signing certificates
- [ ] Run `npm run package` to build installers
- [ ] Test installers on each target platform

## Installation Size

Approximate installed size: ~150-200 MB per platform
- Includes Electron runtime
- Monaco Editor
- All dependencies bundled

## System Requirements

### Minimum Requirements
- **Windows**: Windows 10 or later (64-bit or 32-bit)
- **macOS**: macOS 10.13 (High Sierra) or later
- **Linux**: 64-bit distribution with GTK 3

### Recommended
- 4 GB RAM
- 500 MB free disk space
- Display resolution: 1280x720 or higher

## Distribution

After building, you can distribute the installers via:
- GitHub Releases
- Your own website
- App stores (with additional configuration)
- Package managers (Linux)

## Auto-Updates (Future Enhancement)

To enable auto-updates, you'll need to:
1. Set up an update server
2. Configure publish settings in package.json
3. Implement update notifications in the app
4. Code sign all releases

## Support & Documentation

For build issues:
- Check `build/README.md` for icon requirements
- Verify all dependencies are installed: `npm install`
- Review electron-builder documentation: https://www.electron.build/

## Quick Build Test

To test the build process without creating full installers:

```bash
# Build the web assets
npm run build

# Test in Electron
npm run electron
```

This ensures the production build works before creating platform-specific installers.
