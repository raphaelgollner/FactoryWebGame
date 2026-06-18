const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true, // Esconde a barra de menus do Windows
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});

// Ouve os pedidos do seu game.js para alterar o vídeo
ipcMain.on('toggle-fullscreen', () => {
    const isFull = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFull);
});

ipcMain.on('resize-window', (event, w, h) => {
    if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
    }
    mainWindow.setSize(w, h);
    mainWindow.center();
});

ipcMain.on('exit-game', () => {
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});