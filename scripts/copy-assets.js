const fs = require('fs')
const path = require('path')

const projectRoot = path.join(__dirname, '..')
for (const directory of ['views', 'public']) {
	fs.rmSync(path.join(projectRoot, 'dist', directory), { recursive: true, force: true });
	fs.cpSync(
		path.join(projectRoot, 'src', directory),
		path.join(projectRoot, 'dist', directory),
		{ recursive: true },
	)
}
