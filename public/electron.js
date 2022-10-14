const electron = require("electron");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
const isWindows = process.platform === "win32";
const { menu } = require("./menu");
function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        borderRadius: '10px',
        //transparent: true,
        //autoHideMenuBar: true,
        //frame: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        },
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on(`display-app-menu`, function(e, args) {
    if (isWindows && mainWindow ) {
        menu.popup({
            window: mainWindow,
            x: args.x,
            y: args.y
        });

    }
});

const  mainMenuTemplate = [
    {label: ''},
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' :
                    'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];
