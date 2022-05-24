import fs from 'fs';
import path from 'path';

export default function (req: any, res: any) {
	function getBase64Img(base64Img: any) {
		return base64Img;
	}

	const base64Img = req.body.dataUrl;

	function base64ToImage(base64Img: any, callback: any) {
		let img = new Image();

		img.onload = function () {
			callback(img);
		};

		img.src = base64Img;
	}

	base64ToImage(base64Img, function (img: any) {
		document.getElementById('main')?.appendChild(img);

		let log = 'w=' + img.width + ' h=' + img.height;

		const log_: any = document.getElementById('log');

		if (log_) log_.value = log;

		return log;
	});
}
