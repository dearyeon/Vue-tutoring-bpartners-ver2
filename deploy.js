const {config} = require('./deploy.config.js')
const { exec } = require("child_process")
const args = process.argv.slice(2)
const env = args[0]
const proj = config.projectId
const user = config.developer
const testHost = config.testHost
const realHost = config.realHost


run();
function run() {
	deploy().catch(errMsg => {
		console.log(errMsg);
	});
}



async function deploy() {
	await upload();
	console.log(`\n>>>>> ${isRelease()?'릴리즈':env+' 배포'} 성공 ~ ~ ~ <<<<<\n`);
}


function upload() {
	const cmd =	`rsync -auz --delete ./dist/ ${user}@${getHost()}:/www/ROOT/`;

	return new Promise((resolve, reject) => {
		console.log(`\n\n>>> 업로드 시작`);
		exec(cmd, (error, stdout, stderr) => {
			if(error) reject(`>>> 업로드 에러: ${error} : ${stderr}`);

			const lines = stdout.split("\n");
			lines.map(line => {
				if(line.startsWith('Uploading')) console.log(line);
			});

			console.log(`>>> 업로드 끝`);

			resolve();
		});
	});
}





function isRelease() {
	return env == 'REAL';
}
function getHost() {
	return isRelease() ? realHost : testHost;
}
