const { resolve, basename } = require('path');
const { app, Menu, Tray, dialog } = require('electron');
const Store = require('electron-store');

const schema = {
    projects: {
        type: 'string'
    }
}

const store = new Store({ schema });

app.on('ready', () => {
    const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
    const storedProjects = store.get('projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];

    console.log(projects);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Item1', type: 'radio', checked: true, click: () => {
                //Seleciona pasta de arquivos
                const path = dialog.showOpenDialog({
                    properties: ['openDirectory']
                }).then(result => {
                    let path = result.filePaths;

                    store.set('projects', JSON.stringify([...projects, {
                        path,
                        name: basename(result.filePaths[0])
                    }]))
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    ]);

    tray.setToolTip('This is my first application');
    tray.setContextMenu(contextMenu);
})