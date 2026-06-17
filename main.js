const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    // Cria a janela do navegador
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Fábrica Idle Incremental",
        icon: path.join(__dirname, 'assets', 'logo.png'), // Usa sua logo como ícone da janela
        autoHideMenuBar: true, // Esconde aquele menu superior (Arquivo, Editar, etc)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Permitirá usar o sistema de arquivos (fs) no futuro para os saves locais
        }
    });

    // Carrega o seu arquivo HTML principal
    win.loadFile('index.html');
}

// Quando o Electron estiver pronto, abra a janela
app.whenReady().then(createWindow);

// Fecha o processo quando todas as janelas forem fechadas (padrão de Windows)
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