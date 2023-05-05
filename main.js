const { resolve, basename } = require('path');
const { app, Menu, Tray, dialog, MenuItem } = require('electron');
const Store = require('electron-store');
const { spawn } = require('cross-spawn');

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

    const items = projects.map((project) => {
        return { label: project.name, click: () => spawn.sync('code', [project.path]) }
    });

    const contextMenu = Menu.buildFromTemplate([
        ...items,
        {
            type: 'separator',
        }
    ]);

    contextMenu.insert(0, new MenuItem({
        label: 'Adicionar Projeto ...', click: () => {
            //Seleciona pasta de arquivos
            const path = dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                let path = result.filePaths;
                let name = basename(result.filePaths[0]);

                store.set('projects', JSON.stringify([...projects, {
                    path,
                    name
                }]));

                const item = new MenuItem({ label: name, click: () => spawn.sync('code', [path]) })

                contextMenu.append(item);
            });
        }
    }));

    tray.setToolTip('This is my first application');
    tray.setContextMenu(contextMenu);
})