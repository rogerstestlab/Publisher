const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  openRecentFile: (filePath) => ipcRenderer.invoke('open-recent-file', filePath),
  saveFile: (content, filePath) => ipcRenderer.invoke('save-file', content, filePath),
  exportHTML: (htmlContent) => ipcRenderer.invoke('export-html', htmlContent),
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

  // Menu event listeners
  onMenuNew: (callback) => ipcRenderer.on('menu-new', callback),
  onMenuOpen: (callback) => ipcRenderer.on('menu-open', callback),
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onMenuExport: (callback) => ipcRenderer.on('menu-export', callback),
  onMenuOpenRecent: (callback) => ipcRenderer.on('menu-open-recent', (event, filePath) => callback(filePath))
});
