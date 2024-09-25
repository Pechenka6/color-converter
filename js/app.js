var rgb = { r: 255, g: 255, b: 255 };
var xyz = rgb_to_xyz(rgb);
var lab = rgb_to_lab(rgb);
  
var rounding_data = false;
var data_rounded = document.getElementById('data-rounded');
  
var first_input = document.getElementById('first_input');
var second_input = document.getElementById('second_input');
var third_input = document.getElementById('third_input');
  
first_input.addEventListener('input', on_input);
second_input.addEventListener('input', on_input);
third_input.addEventListener('input', on_input);
  
var first_hint = document.getElementById('first_hint');
var second_hint = document.getElementById('second_hint');
var third_hint = document.getElementById('third_hint');
  
var first_input_wrong = false;
var second_input_wrong = false;
var third_input_wrong = false;
  
var first_input_title = document.getElementById('first_input__title');
var second_input_title = document.getElementById('second_input__title');
var third_input_title = document.getElementById('third_input__title');
  
var output_rgb = document.getElementById('rgb-output__data');
var output_xyz = document.getElementById('xyz-output__data');
var output_lab = document.getElementById('lab-output__data');
  
output_rgb.addEventListener('DOMSubtreeModified', set_rgb_color);
var output_color_rgb = document.getElementById('color-output__rgb');
  
var color_picker = new iro.ColorPicker('#picker');
  
color_picker.on('input:change', function (color) {
    rgb = color.rgb;
    xyz = rgb_to_xyz(rgb);
    lab = rgb_to_lab(rgb);
    update_fields_by_colorpicker();
});
  
var drop_down = document.getElementById('drop-down');
var selected_color_type = drop_down.value;
  
drop_down.addEventListener("change", function () {
    selected_color_type = drop_down.value;
    change_input_titles();
    change_access_fourth_input();
    change_input_data();
    on_input();
});
  
var swatch_grid = document.getElementById('swatch-grid');
  
swatch_grid.addEventListener('click', function (e) {
    var click_target = e.target;
    if (click_target.dataset.color) {
        color_picker.color.set(click_target.dataset.color);
        rgb = color_picker.color.rgb;
        xyz = rgb_to_xyz(rgb);
        lab = rgb_to_lab(rgb);
        update_fields_by_colorpicker();
    }
});
  
init_data();
  
/* ========== Initialize fields ========== */

function init_data() {
    first_input_title.textContent = 'R:';
    second_input_title.textContent = 'G:';
    third_input_title.textContent = 'B:';
  
    set_inputs([Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)]);
    set_rgb_fields(rgb);
    set_xyz_fields(xyz);
    set_lab_fields(lab);
}
  
/* ========== Update fields ========== */

function update_fields_by_colorpicker() {
    rounding_data = false;
    set_rgb_fields(rgb);
    set_xyz_fields(xyz);
    set_lab_fields(lab);
    switch (selected_color_type) {
        case 'rgb':
            set_inputs([Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)]);
            break;
        case 'xyz':
            set_inputs([xyz.x.toFixed(2), Math.round(xyz.y), xyz.z.toFixed(2)]);
            break;
        case 'lab':
            set_inputs([Math.round(lab.l), Math.round(lab.a), Math.round(lab.b)]);
            break;
    }
    is_valid_input();
    set_hints();
    hide_hints();
}
  
function on_input() {
    if (!is_valid_input()) {
        set_undefined();
        set_hints();
        hide_hints();
  
    } else {
        switch (selected_color_type) {
            case 'rgb': {
                rgb = get_data_from_inputs();
                xyz = rgb_to_xyz(rgb);
                lab = rgb_to_lab(rgb);
                break;
            }
            case 'xyz': {
                xyz = get_data_from_inputs();
                rgb = xyz_to_rgb(xyz);
                lab = rgb_to_lab(rgb);
                break;
            }
            case 'lab': {
                lab = get_data_from_inputs();
                rgb = lab_to_rgb(lab);
                xyz = rgb_to_xyz(rgb);
                break;
            }
        }
        set_rgb_fields(rgb);
        set_xyz_fields(xyz);
        set_lab_fields(lab);
        color_picker.color.rgb = rgb;
        hide_hints();
    }
}
  
function get_data_from_inputs() {
    switch (selected_color_type) {
        case 'rgb':
            return { r: first_input.value, g: second_input.value, b: third_input.value };
        case 'xyz':
            return { x: first_input.value, y: second_input.value, z: third_input.value };
        case 'lab':
            return { l: first_input.value, a: second_input.value, b: third_input.value };
    }
}
  
function set_rgb_color() {
    output_color_rgb.style.backgroundColor = rgb.r + ',' + rgb.g + ',' + rgb.b;
}
  
/* ========== Check input values ========== */

function is_valid_rgb() {
    let rgb = get_data_from_inputs()
  
    if (rgb.r < 0 || rgb.r > 255 || rgb.r == '') {
        first_input_wrong = true;
    } else {
        first_input_wrong = false;
    }
  
    if (rgb.g < 0 || rgb.g > 255 || rgb.g == '') {
        second_input_wrong = true;
    } else {
        second_input_wrong = false;
    }
  
    if (rgb.b < 0 || rgb.b > 255 || rgb.b == '') {
        third_input_wrong = true;
    } else {
        third_input_wrong = false;
    }
  
    fourth_input_wrong = false;
    return !first_input_wrong && !second_input_wrong && !third_input_wrong;
}
  
function is_valid_xyz() {
    let xyz = get_data_from_inputs();
  
    if (xyz.x < 0 || xyz.x > 95.047 || xyz.x == '') {
        first_input_wrong = true;
    } else {
        first_input_wrong = false;
    }
  
    if (xyz.y < 0 || xyz.y > 100 || xyz.y == '') {
        second_input_wrong = true;
    } else {
        second_input_wrong = false;
    }
  
    if (xyz.z < 0 || xyz.z > 108.883 || xyz.z == '') {
        third_input_wrong = true;
    } else {
        third_input_wrong = false;
    }  

    return !first_input_wrong && !second_input_wrong && !third_input_wrong;
}

function is_valid_lab() {
    let lab = get_data_from_inputs();
  
    if (lab.l > 100 || lab.l < 0 || lab.l == '') {
        first_input_wrong = true;
    } else {
        first_input_wrong = false;
    }
  
    if (lab.a > 127 || lab.a < -128 || lab.a == '') {
        second_input_wrong = true;
    } else {
        second_input_wrong = false;
    }
  
    if (lab.b > 127 || lab.b < -128 || lab.b == '') {
        third_input_wrong = true;
    } else {
        third_input_wrong = false;
    }
  
    fourth_input_wrong = false
    return !first_input_wrong && !second_input_wrong && !third_input_wrong;
}
  
function is_valid_input() {
    switch (selected_color_type) {
        case 'rgb':
            return is_valid_rgb();
        case 'xyz':
            return is_valid_xyz();
        case 'lab':
            return is_valid_lab();
    }
}
  
function set_undefined() {
    let undefined = 'не определено';
    output_rgb.textContent = undefined;
    output_xyz.textContent = undefined;
    output_lab.textContent = undefined;
    output_rgb.style.color = "#e85a4f";
    output_xyz.style.color = "#e85a4f";
    output_lab.style.color = "#e85a4f";
}
  
function set_hints() {
    switch (selected_color_type) {
        case 'rgb':
            set_rgb_hints();
            break;
        case 'xyz':
            set_xyz_hints();
            break;
        case 'lab':
            set_lab_hints();
            break;
    }
}
  
function set_rgb_hints() {
    if (first_input_wrong) {
        first_hint.textContent = 'от 0 до 255';
        first_hint.style.visibility = "visible";
        first_hint.style.color = "#e85a4f";
    }
    if (second_input_wrong) {
        second_hint.textContent = 'от 0 до 255';
        second_hint.style.visibility = "visible";
        second_hint.style.color = "#e85a4f";
    }
    if (third_input_wrong) {
        third_hint.textContent = 'от 0 до 255';
        third_hint.style.visibility = "visible";
        third_hint.style.color = "#e85a4f";
    }
}
  
function set_xyz_hints() {
    if (first_input_wrong) {
        first_hint.textContent = 'от 0 до 95.047';
        first_hint.style.visibility = "visible";
        first_hint.style.color = "#e85a4f";
    }
    if (second_input_wrong) {
        second_hint.textContent = 'от 0 до 100';
        second_hint.style.visibility = "visible";
        second_hint.style.color = "#e85a4f";
    }
    if (third_input_wrong) {
        third_hint.textContent = 'от 0 до 108.883';
        third_hint.style.visibility = "visible";
        third_hint.style.color = "#e85a4f";
    }
}
  
function set_lab_hints() {
    if (first_input_wrong) {
        first_hint.textContent = 'от 0 до 100';
        first_hint.style.visibility = "visible";
        first_hint.style.color = "#e85a4f";
    }
    if (second_input_wrong) {
        second_hint.textContent = 'от -128 до 127';
        second_hint.style.visibility = "visible";
        second_hint.style.color = "#e85a4f";
    }
    if (third_input_wrong) {
        third_hint.textContent = 'от -128 до 127';
        third_hint.style.visibility = "visible";
        third_hint.style.color = "#e85a4f";
    }
}
  
function hide_hints() {
    if (!first_input_wrong) {
        first_hint.style.visibility = "hidden";
    }
    if (!second_input_wrong) {
        second_hint.style.visibility = "hidden";
    }
    if (!third_input_wrong) {
        third_hint.style.visibility = "hidden";
    }
}

/* ========== Functions to set all converted data to fields ========== */

function set_inputs(values) {
    first_input.value = values[0];
    second_input.value = values[1];
    third_input.value = values[2];
}
  
function set_rgb_fields(rgb) {
    output_rgb.style.color = "#17252a";
    output_rgb.textContent = Math.round(rgb.r) + ', ' + Math.round(rgb.g) + ', ' + Math.round(rgb.b);
  
    if (selected_color_type == 'lab' && rounding_data) {
        data_rounded.style.visibility = "visible";
    } else {
        data_rounded.style.visibility = "hidden";
    }
}
  
function set_xyz_fields(xyz) {
    output_xyz.style.color = "#17252a";
    output_xyz.textContent = Number(xyz.x).toFixed(2) + ', ' + Math.round(xyz.y) + ', ' + Number(xyz.z).toFixed(2);
}
  
function set_lab_fields(lab) {
    output_lab.style.color = "#17252a";
    output_lab.textContent = Math.round(lab.l) + ', ' + Math.round(lab.a) + ', ' + Math.round(lab.b);
}

/* ========== Functions to change inputs on drop-down change ========== */
function change_input_data() {
    switch (selected_color_type) {
        case 'rgb':
            first_input.value = Math.round(rgb.r);
            second_input.value = Math.round(rgb.g);
            third_input.value = Math.round(rgb.b);
            break;
        case 'xyz':
            first_input.value = xyz.x.toFixed(2);
            second_input.value = Math.round(xyz.y);
            third_input.value = xyz.z.toFixed(2);
            break;
        case 'lab':
            first_input.value = Math.round(lab.l);
            second_input.value = Math.round(lab.a);
            third_input.value = Math.round(lab.b);
            break;
    }
}

function change_input_titles() {
    switch (selected_color_type) {
        case 'rgb':
            first_input_title.textContent = 'R:';
            second_input_title.textContent = 'G:';
            third_input_title.textContent = 'B:';
            break;
        case 'xyz':
            first_input_title.textContent = 'X:';
            second_input_title.textContent = 'Y:';
            third_input_title.textContent = 'Z:';
            break;
        case 'lab':
            first_input_title.textContent = 'L:';
            second_input_title.textContent = 'A:';
            third_input_title.textContent = 'B:';
            break;
    }
}

/* ========== Color conversion functions ========== */

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