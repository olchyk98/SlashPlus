const cookieControl =  {
	set: (name, value, daysOut = 32, isObject = false) => {
		let d = new Date();
		d.setTime(d.getTime() + (daysOut * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + ((!isObject) ? value : JSON.stringify(value)) + ";" + expires + ";path=/";
	},
	get: name => {
		const a = new RegExp(name + "=([^;]+)");
	    const b = a.exec(document.cookie);
	    return (b != null) ? unescape(b[1]) : null;
	},
	delete: name => {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	},
	crashCookies: () => {
		const _a = document.cookie.split(";");

		for (var i = 0; i < _a.length; i++) {
			const a = _a[i];
			const b = a.indexOf("=");
			const c = b > -1 ? a.substr(0, b) : a;
			document.a = c + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}
}

export { cookieControl }