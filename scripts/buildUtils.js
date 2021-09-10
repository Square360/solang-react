const fs = require('fs');

export const getFiles = (
    entry,
    extensions = [],
    excludeExtensions = [],
    excludeFiles = []) => {

    let fileNames = [];
    const dirs = fs.readdirSync(entry);

    dirs.forEach((dir) => {
        const path = `${entry}/${dir}`;

        if (fs.lstatSync(path).isDirectory()) {
            // console.log('excluding', excludeFiles );
            const dirFiles = getFiles(path, extensions, excludeExtensions, excludeFiles);
            const dirFilesFiltered = dirFiles.filter(item => !excludeFiles.includes(item));
            // console.log(dirFilesFiltered);

            fileNames = [
                ...fileNames,
                ...dirFilesFiltered,
            ];

            return;
        }

        if (!excludeExtensions.some((exclude) => dir.endsWith(exclude))
            && extensions.some((ext) => dir.endsWith(ext))
        ) {
            fileNames.push(path);
        }
    });

    return fileNames;
};
