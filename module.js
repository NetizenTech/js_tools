/*
 * Class definition
 * Requires jQuery 3.2 or higher & Materialize.js
 *
*/
/* eslint no-console: ["error", { allow: ["log", ] }] */
/* global M */

function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

//const csrftoken = getCookie('csrftoken');
const csrftoken = getCookie('csrftoken') || $('[name=csrfmiddlewaretoken]').val();

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
	beforeSend: function (xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain && csrftoken != null) {
			xhr.setRequestHeader('X-CSRFToken', csrftoken);
		}
	}
});

class Adapter {
	constructor(key) {
		this.storage = window.sessionStorage;
		this.key = key;
		this.obj = null;
	}
	get_obj() { return new Map(JSON.parse(this.storage.getItem(this.key))); }
	set_obj() { this.storage.setItem(this.key, JSON.stringify(Array.from(this.obj.entries()))); }
}

class API extends Adapter {
	constructor(k, u) {
		super(k);
		this.cookie = k;
		this.url = u;
		this.obj = this.get_obj();
		this.a = $('#a');
		this.b = $('#b');
		this.c = $('#c');
		this.d = $('#d');
		this.e = $('#e');
		this.f = $('#f');
		this.g = $('#g');
		this.h = $('#h');
	}
	setup() {
		let x = this;
		if (this.obj.has('a')) {
			this.a_f(this.obj.get('a'));
		} else {
			this.ajax(`${this.url}a/`);
		}
		this.a.on('change', function () {
			if ($(this).val().length) {
				x.ajax(`${x.url}b/${$(this).val()}/`);
				x.a_v = $(this).val();
			}
		});
		this.b.on('change', function () {
			if ($(this).val().length) {
				x.ajax(`${x.url}c/${x.a_v}/${$(this).val()}/`);
				x.b_v = $(this).val();
			}
		});
		this.c.on('change', function () {
			if ($(this).val().length) {
				x.ajax(`${x.url}d/${$(this).val()}/`);
				x.c_v = $(this).val();
			}
		});
		this.g.on('click', function () {
			x.h.empty();
			let v = x.f.val();
			if (v.length) {
				x.ajax(`${x.url}f/${v}/`);
				x.f_v = v;
			} else {
				x.h.text('Its no valid no.');
			}
		});

		//this.a_m = M.FormSelect.init(this.a, {});
		this.b_m = M.FormSelect.init(this.b, {});
		this.c_m = M.FormSelect.init(this.c, {});

	}
	d_f(v) {
		v.d = `${v.a} ${v.b} ${v.c}`;
		document.cookie = `${this.cookie}=${encodeURIComponent(JSON.stringify(v))}; path=/;`;
		this.d.empty().html(`<p>${v.d}</p>`);
		this.e.empty().html(v.t);
	}
	f_f(v) { this.d_f(v); }
	a_f(o) {
		let x = this;
		//console.log(o);
		$('option', this.a).slice(1).remove();
		$('option, optgroup', this.b).slice(1).remove();
		$('option', this.c).slice(1).remove();
		let a = o.split(',');
		//console.log(a);
		for (let i = 0; i < a.length; i++) {
			let b = a[i].split("\\t");
			//console.log(b);
			x.a.append($('<option>').text(b[3]).attr('value', b[1]));
		}
		this.a_m = M.FormSelect.init(this.a, {});
	}
	b_f(o) {
		let x = this;
		this.b_m[0].destroy();
		this.c_m[0].destroy();
		$('option, optgroup', this.b).slice(1).remove();
		$('option', this.c).slice(1).remove();
		let m = new Map();
		//console.log(o);
		$.each(o, function (i, value) {
			let a = value.split(' ')[0];
			if (!m.has(a)) { m.set(a, [{[i]: value}]); }
			else { m.get(a).push({[i]: value}); }
		});
		//console.log(m);
		m.forEach(function (v, k) {
			let optgroup = $('<optgroup label="' + k + '" />');
			v.forEach(function (val) {
				let y = Object.entries(val)[0];
				optgroup.append($('<option>').text(y[1]).attr('value', y[0]));
			});
			x.b.append(optgroup);
		});

		this.b_m = M.FormSelect.init(this.b, {});
		this.c_m = M.FormSelect.init(this.c, {});
	}
	c_f(o) {
		let x = this;
		this.c_m[0].destroy();
		$('option', this.c).slice(1).remove();
		$.each(o, function (i, value) {
			x.c.append($('<option>').text(value).attr('value', i));
		});
		this.c_m = M.FormSelect.init(this.c, {});
	}
	ajax(url = this.url, data = {}) {
		let x = this;
		$.ajax({
			method: 'POST',
			url: url,
			data: data,
			dataType: 'text',
			statusCode: {
				200: function(data) {
					try {
						if (data.f === 'err') {
							x.h.text('No valid number.');
							return;
						}

						x[`${data.f}_f`](data);

						if (data.f === 'a') {
							x.set_obj(x.obj.set('a', data.data));
						}
					} catch(err) {
						console.log(err);
					}
				}
			}
		}).fail(function (x, s, e) {
			console.log(`${s} - ${e}`);
		});
	}
}

class s {
	constructor() {
		this.api = new API('api_1', 'http://localhost:3333/api/');
	}
}

const Api1 = new s();

$(function () {
	Api1.api.setup();
	M.Collapsible.init($('.collapsible'), {});
});
