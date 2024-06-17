function getScript(e, i) {
	var a = document.createElement("script"),
		t = document.getElementsByTagName("script")[0];
	(a.async = 1),
		(a.onload = a.onreadystatechange = function(e, t) {
			(t || !a.readyState || /loaded|complete/.test(a.readyState)) &&
				((a.onload = a.onreadystatechange = null),
				(a = void 0),
				t || (i && i()));
		}),
		(a.src = e),
		t.parentNode.insertBefore(a, t);
}

var is_pageConfig =
	window.pageConfig &&
	0 < Object.keys(window.pageConfig).length &&
	window.pageConfig.constructor === Object;
function getCustomProperty(e) {
	return is_pageConfig &&
		void 0 !== pageConfig.calculator &&
		pageConfig.calculator.hasOwnProperty(e)
		? pageConfig.calculator[e]
		: void 0;
}

var pagePaperType = getCustomProperty("pagePaperType");

getScript(window.$calc_file_path, function() {
	var e = {
		deafault: {
			paperTypesDefault: pagePaperType || 2,
			academicLevelDefault: 2,
			pagesDefault: 1,
			deadlinesDefault: [66537, 66555, 66547, 66565, 66881]
		}
	};
	document.querySelector("[data-calc-mini]") &&
		new Calc({
			ID: "24",
			calculatorType: "DefaultCalculator",
			format: "json",
			options: e
		}),
		document.querySelector("[data-calc-short]") &&
			new Calc({
				ID: "24",
				calculatorType: "ShortCalculator",
				format: "json",
				options: e
			});
}),
	(function() {
		if (!document.querySelector(".pricing-table")) return;
		var i = document.querySelector(".pricing-table__level-select select"),
			a = document.querySelectorAll(".pricing-table__level");
		function e() {
			var e = { current: 0 },
				t = function() {
					(a[e.current].style.display = "none"),
						(a[i.value].style.display = "block"),
						(e.current = i.value);
				};
			window.innerWidth < 768
				? ((i.value = 0), i.addEventListener("change", t))
				: (i.removeEventListener("change", t),
				  Array.from(a).forEach(function(e) {
						e.style.display = "";
				  }));
		}
		e(), window.addEventListener("resize", e);
	})();