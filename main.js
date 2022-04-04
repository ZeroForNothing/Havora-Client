const electron = require('electron')
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  shell
} = require('electron')
const Positioner = require('electron-positioner')
let {
  ipcMain
} = electron;
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock()
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

const globalShortcut = electron.globalShortcut
let Tray = electron.Tray
const iconPath = path.join(__dirname, 'icon.png')
let tray = null;

let splashScreen = null;
let mainWindow = null;

var child = require('child_process').execFile;
var executablePath = path.join(__dirname, "Zero for Nothing Game Build/Zero for Nothing.exe")

let defaultWidth = 1280;
let defaultHeight = 720;

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
    icon: iconPath
  });
  splashScreen.loadFile('splashScreen.html');
  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: true,
    backgroundColor: '#242424',
    center: true,
    show: false,
    fullscreenable: true,
    icon: iconPath
  });
  mainWindow.loadURL('http://localhost')

  mainWindow.webContents.session.clearStorageData()

  //mainWindow.webContents.openDevTools();
  mainWindow.removeMenu()
  globalShortcut.register('f5', function() {
    console.log('f5 is pressed')
    mainWindow.reload()
  })
  let positioner = new Positioner(mainWindow);
  globalShortcut.register('shift+tab', function() {
    console.log('shift+tab is pressed');
    shell.beep();
    //positioner.move('center');
    if(!mainWindow.isFullScreen()){
      mainWindow.setFullScreen(true);
      mainWindow.setResizable(false);
      mainWindow.setAlwaysOnTop(true, 'screen');
      mainWindow.show();
    }else{
      mainWindow.setFullScreen(false);
      mainWindow.setResizable(true);
      mainWindow.setAlwaysOnTop(false, 'screen');
      mainWindow.setSize(defaultWidth,defaultHeight);
      mainWindow.center();
      mainWindow.show();
    }
  });
  // globalShortcut.register('CommandOrControl+R', function() {
  //   console.log('CommandOrControl+R is pressed')
  //   mainWindow.reload()
  // })
  splashScreen.once('ready-to-show', () => {
    splashScreen.show();
    setTimeout(function() {
      if (splashScreen != null)
        splashScreen.destroy();
        mainWindow.show();
    }, 3000);
  });
  splashScreen.on('closed', () => {
    splashScreen = null
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
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