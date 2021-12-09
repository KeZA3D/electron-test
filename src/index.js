const { autoUpdater, dialog, app, BrowserWindow } = require('electron')

let win;

const url = 'https://github.com/KeZA3D/electron-test/releases/latest'

autoUpdater.setFeedURL({ url })
setInterval(() => {
    autoUpdater.checkForUpdates()
    win.webContents.send("message", "Checking updates!!!")
}, 10000)

autoUpdater.on("update-available", () => win.webContents.send("message", "Updates available"))
autoUpdater.on("update-not-available", () => win.webContents.send("message", "Updates not available"))

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})

autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
})

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // resizable: false,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadFile(__dirname + "/www/index.html")
}

app.whenReady().then(async () => {
    createWindow()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

