var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')

// npm binary based on OS
var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

function digForDependencies(folder) {
    fs.readdirSync(folder).forEach(function (mod) {
        var modPath = join(folder, mod)
        // ensure path has package.json
        if (!fs.existsSync(join(modPath, 'package.json'))) return

        // install dependecies
        cp.spawn(npmCmd, ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' })
    });
}

digForDependencies(resolve(__dirname, './commands/'));
digForDependencies(resolve(__dirname, './components/'));