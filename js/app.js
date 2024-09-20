
function rgb_to_cmyk(rgb) {
	let k = Math.min(1 - Number(rgb.r) / 255, 1 - Number(rgb.g) / 255, 1 - Number(rgb.b) / 255);
	if (k == 1) {
		return { c: 0, m: 0, y: 0, k: 1 };
	}
	let c = (1 - Number(rgb.r) / 255 - k) / (1 - k);
	let m = (1 - Number(rgb.g) / 255 - k) / (1 - k);
	let y = (1 - Number(rgb.b) / 255 - k) / (1 - k);
	return { c: c, m: m, y: y, k: k };
}

function cmyk_to_rgb(cmyk) {
	let r = 255 * (1 - Number(cmyk.c)) * (1 - Number(cmyk.k));
	let g = 255 * (1 - Number(cmyk.m)) * (1 - Number(cmyk.k));
	let b = 255 * (1 - Number(cmyk.y)) * (1 - Number(cmyk.k));
	return { r: r, g: g, b: b };
}

function rgb_to_lab(rgb) {
	let xyz = rgb_to_xyz(rgb);
	return xyz_to_lab(xyz);
}

function lab_to_rgb(lab) {
	let xyz = lab_to_xyz(lab);
	return xyz_to_rgb(xyz);
}

function rgb_to_xyz(rgb) {
	function func(x) {
		if (x >= 0.04045) {
			return Math.pow((x + 0.055) / 1.055, 2.4);
		}
		return x / 12.92;
	}

	let Rn = func(Number(rgb.r) / 255) * 100;
	let Gn = func(Number(rgb.g) / 255) * 100;
	let Bn = func(Number(rgb.b) / 255) * 100;
	let x = 0.412453 * Rn + 0.357580 * Gn + 0.180423 * Bn;
	let y = 0.212671 * Rn + 0.715160 * Gn + 0.072169 * Bn;
	let z = 0.019334 * Rn + 0.119193 * Gn + 0.950227 * Bn;
	return { x: x, y: y, z: z };
}

function xyz_to_rgb(xyz) {
	function func(x) {
		if (x >= 0.0031308) {
			return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
		}
		return 12.92 * x;
	}

	let Rn = 3.2406 * xyz.x / 100 - 1.5372 * xyz.y / 100 - 0.4986 * xyz.z / 100;
	let Gn = -0.9689 * xyz.x / 100 + 1.8758 * xyz.y / 100 + 0.0415 * xyz.z / 100;
	let Bn = 0.0557 * xyz.x / 100 - 0.2040 * xyz.y / 100 + 1.0570 * xyz.z / 100;
	let r = Math.max(0, Math.min(255, func(Rn) * 255));
	let g = Math.max(0, Math.min(255, func(Gn) * 255));
	let b = Math.max(0, Math.min(255, func(Bn) * 255));

	if (func(Rn) * 255 > 255 || func(Rn) * 255 < 0 || func(Gn) * 255 > 255 || func(Gn) * 255 < 0 || func(Bn) * 255 > 255 || func(Bn) * 255 < 0) {
		rounding_data = true;
	} else {
		rounding_data = false;
	}

	return { r: r, g: g, b: b };
}

function xyz_to_lab(xyz) {
	function func(x) {
		if (x >= 0.008856) {
			return Math.pow(x, 1 / 3);
		}
		return 7.787 * x + 16 / 116;
	}

	let Xw = 95.047;
	let Yw = 100;
	let Zw = 108.883;

	let l = 116 * func(xyz.y / Yw) - 16;
	let a = 500 * (func(xyz.x / Xw) - func(xyz.y / Yw));
	let b = 200 * (func(xyz.y / Yw) - func(xyz.z / Zw));
	return { l: l, a: a, b: b };
}

function lab_to_xyz(lab) {
	function func(x) {
		if (Math.pow(x, 3) >= 0.008856) {
			return Math.pow(x, 3);
		}
		return (x - 16 / 116) / 7.787;
	}

	let Xw = 95.047;
	let Yw = 100;
	let Zw = 108.883;

	let x = func(Number(lab.a) / 500 + (Number(lab.l) + 16) / 116) * Xw;
	let y = func((Number(lab.l) + 16) / 116) * Yw;
	let z = func((Number(lab.l) + 16) / 116 - Number(lab.b) / 200) * Zw;
	return { x: x, y: y, z: z };
}