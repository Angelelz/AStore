import fs from 'fs';
import path from 'path'

fs.cpSync(path.join(__dirname,'..', '..', 'src', "views"), path.join(__dirname, '..', '..', 'dist', 'views'), { recursive: true});