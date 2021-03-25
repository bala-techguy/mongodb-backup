const fs = require('fs');
const { spawn } = require('child_process');
const config = require('./config.json');

let today = new Date();
let dd = today.getDate();

let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
if (dd < 10) {
  dd = `0${dd}`;
}

if (mm < 10) {
  mm = `0${mm}`;
}
today = `${dd}-${mm}-${yyyy}`;

const backupProcess = spawn('mongodump', [
  `-d=${config.database}`,
  `--archive="${config.backupLocation}${config.database}-${today}.archive"`,
  '--gzip',
  `-u="${config.username}"`,
  `-p="${config.password}"`,
  '--authenticationDatabase=admin',
]);

const init = async () => {
  try {
    if (fs.existsSync(`${config.backupLocation}${config.database}-${today}.archive"`)) {
      // eslint-disable-next-line no-console
      console.log('The file exists already.');
      await fs.unlinkSync(`${config.backupLocation}${config.database}-${today}.archive"`);
      // eslint-disable-next-line no-console
      console.log('The file has been removed successfully. The backup process will start.');
      backupProcess.on('exit', (code, signal) => {
        // eslint-disable-next-line no-console
        if (code) { console.log('Backup process exited with code ', code); } else if (signal) { console.error('Backup process was killed with signal ', signal); } else { console.log('Successfully backed up the database'); }
      });
    } else {
      backupProcess.on('exit', (code, signal) => {
        // eslint-disable-next-line no-console
        if (code) { console.log('Backup process exited with code ', code); } else if (signal) { console.error('Backup process was killed with signal ', signal); } else { console.log('Successfully backed up the database'); }
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

init();
