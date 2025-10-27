const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

// Recent files management
const MAX_RECENT_FILES = 5;
const recentFilesPath = path.join(app.getPath('userData'), 'recent-files.json');

async function getRecentFiles() {
  try {
    const data = await fs.readFile(recentFilesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function addRecentFile(filePath) {
  const recentFiles = await getRecentFiles();

  // Remove if already exists (to move to top)
  const filtered = recentFiles.filter(f => f !== filePath);

  // Add to beginning
  filtered.unshift(filePath);

  // Keep only MAX_RECENT_FILES
  const updated = filtered.slice(0, MAX_RECENT_FILES);

  await fs.writeFile(recentFilesPath, JSON.stringify(updated, null, 2), 'utf-8');

  // Rebuild menu to update recent files
  createMenu();
}

async function clearRecentFiles() {
  await fs.writeFile(recentFilesPath, JSON.stringify([], null, 2), 'utf-8');
  createMenu();
}

// Create application menu
async function createMenu() {
  const recentFiles = await getRecentFiles();

  const isMac = process.platform === 'darwin';

  const template = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-new');
            }
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-open');
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-save');
            }
          }
        },
        {
          label: 'Export to HTML',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-export');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Recently Opened',
          submenu: recentFiles.length > 0
            ? [
                ...recentFiles.map(filePath => ({
                  label: filePath,
                  click: () => {
                    if (mainWindow) {
                      mainWindow.webContents.send('menu-open-recent', filePath);
                    }
                  }
                })),
                { type: 'separator' },
                {
                  label: 'Clear Recently Opened',
                  click: () => clearRecentFiles()
                }
              ]
            : [
                {
                  label: 'No recent files',
                  enabled: false
                }
              ]
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', accelerator: 'CmdOrCtrl+Q' }
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#1e1e1e',
    titleBarStyle: 'hidden',
    frame: false
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await createMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for file operations
ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) {
    return null;
  }

  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, 'utf-8');

  // Add to recent files
  await addRecentFile(filePath);

  return { filePath, content };
});

// IPC Handler for opening a recent file
ipcMain.handle('open-recent-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Add to recent files (moves to top)
    await addRecentFile(filePath);

    return { filePath, content };
  } catch (error) {
    console.error('Error opening recent file:', error);
    return null;
  }
});

ipcMain.handle('save-file', async (event, content, currentFilePath) => {
  let filePath = currentFilePath;

  if (!filePath) {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'Markdown Files', extensions: ['md'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      defaultPath: 'untitled.md'
    });

    if (result.canceled) {
      return null;
    }

    filePath = result.filePath;
  }

  await fs.writeFile(filePath, content, 'utf-8');

  // Add to recent files
  await addRecentFile(filePath);

  return filePath;
});

ipcMain.handle('export-html', async (event, htmlContent) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'HTML Files', extensions: ['html'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    defaultPath: 'markdown-export.html'
  });

  if (result.canceled) {
    return null;
  }

  const filePath = result.filePath;
  await fs.writeFile(filePath, htmlContent, 'utf-8');

  // Return just the filename for the toast notification
  return path.basename(filePath);
});

// IPC Handlers for window controls
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});
