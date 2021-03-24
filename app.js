const config = require('./config.json');
spawn = require('child_process').spawn

const today = new Date();
const dd = today.getDate();

const mm = today.getMonth()+1; 
const yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = dd+'-'+mm+'-'+yyyy;

let backupProcess = spawn('mongodump', [
    `-d=${config.database}`,
    `--archive="${config.backupLocation}${config.database}-${today}.archive"`,
    '--gzip',
    `-u="${config.username}"`,
    `-p="${config.password}"`,
    '--authenticationDatabase=admin'
    ]);

backupProcess.on('exit', (code, signal) => {
    if(code) 
        console.log('Backup process exited with code ', code);
    else if (signal)
        console.error('Backup process was killed with signal ', signal);
    else 
        console.log('Successfully backedup the database')
});