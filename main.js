const { resolve } = require('path');
const { app, Menu, Tray, dialog } = require('electron');
const Store = require('electron-store');

const schema = {
    projects: {
        type: 'array'
    }
}

const store = new Store({ schema });

app.on('ready', () => {
    const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Item1', type: 'radio', checked: true, click: () => {
                //Seleciona pasta de arquivos
                const path = dialog.showOpenDialog({
                    properties: ['openDirectory']
                }).then(result => {
                    console.log(result.filePaths)
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    ]);

    tray.setToolTip('This is my first application');
    tray.setContextMenu(contextMenu);
})