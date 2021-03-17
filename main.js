const electron = require('electron')
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem
} = require('electron')

let {
  ipcMain
} = electron;
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock()
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

//const globalShortcut = electron.globalShortcut
let Tray = electron.Tray
const iconPath = path.join(__dirname, 'icon.png')
let tray = null;

let loginMenu = null;
let splashScreen = null;

var child = require('child_process').execFile;
var executablePath = path.join(__dirname, "Zero for Nothing Game Build/Zero for Nothing.exe")


function createWindow() {
  // child(executablePath, function(err, data) {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(data.toString());
  // });
  // Create the browser window.
  splashScreen = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    center: true,
    fullscreenable: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    icon: path.join(__dirname, 'icon.png')
  });
  splashScreen.loadFile('splashScreen.html');
  loginMenu = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: true,
    backgroundColor: '#242424',
    center: true,
    show: false,
    fullscreenable: true,
    icon: path.join(__dirname, 'icon.png')
  });
  loginMenu.loadURL('https://zerofornothing.com')

  //loginMenu.webContents.session.clearStorageData()

  loginMenu.webContents.openDevTools();
  loginMenu.removeMenu()
  // globalShortcut.register('f5', function() {
  //   console.log('f5 is pressed')
  //   loginMenu.reload()
  // })
  // globalShortcut.register('CommandOrControl+R', function() {
  //   console.log('CommandOrControl+R is pressed')
  //   loginMenu.reload()
  // })
  splashScreen.once('ready-to-show', () => {
    splashScreen.show();
    setTimeout(function() {
      if (splashScreen != null)
        splashScreen.destroy();
      loginMenu.show();
    }, 3000);
  });
  splashScreen.on('closed', () => {
    splashScreen = null
  })
  loginMenu.on('closed', () => {
    loginMenu = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (loginMenu) {
      if (loginMenu.isMinimized()) loginMenu.restore()
      loginMenu.focus()
    } else if (splashScreen) {
      if (splashScreen.isMinimized()) splashScreen.restore()
      splashScreen.focus()
    }
  })

  app.on('ready', function() {
    tray = new Tray(iconPath)
    tray.setToolTip('Zero for Nothing')
    createWindow();
  })
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.