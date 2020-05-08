// eslint-disable-next-line import/no-extraneous-dependencies
import shell from 'shelljs';
import * as build from '../build.json';

// Copy Folders
build.copy.folders.forEach((folder) => {
  shell.cp('-R', folder, build.target);
});

// Copy Files
build.copy.files.forEach((file) => {
  shell.cp(file, build.target);
});
