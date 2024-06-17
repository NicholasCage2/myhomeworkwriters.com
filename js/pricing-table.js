
// Get html for pricing page
var getHTML = function(url, callback) {
	if (!window.XMLHttpRequest) return;
	var xhr = new XMLHttpRequest();

	xhr.onload = function() {
		if (callback && typeof callback === "function") {
			callback(this.responseXML);
		}
	};

	xhr.open("GET", url);
	xhr.responseType = "document";
	xhr.send();
};

var pricingContainer = document.querySelector("[data-pricing-table]");
if (pricingContainer) {
	var siteId = pricingContainer.getAttribute("data-pricing-table");

	getHTML(
		"/api/get_pricing_block/?siteId=" + siteId + "&format=html",
		function(response) {
			pricingContainer.innerHTML = response.documentElement.innerHTML;


			$(".deadline_cell_header").prepend("<th>&nbsp;</th>");

			var e = $(document).width();
			e > 640 &&
				($(".price_table_default tbody td:not(:first-child)")
					.mouseenter(function() {
						var e = $(this).parent(".price_table_default tbody tr"),
							t = e.find("td").index(this),
							d = e.find("th");
						d.addClass("th-hover"),
							$(
								$(".deadline_cell_header")
									.first()
									.find("th")[t + 1]
							).addClass("th-hover"),
							$(".price_table_default tbody tr")
								.find("td:eq(" + t + ")")
								.addClass("hover"),
							$(this).addClass("hover-cell");
					})
					.mouseleave(function() {
						$(".price_table_default tbody td").removeClass(
							"hover-cell hover"
						),
							$(".price_table_default tbody th").removeClass(
								"th-hover"
							);
					}),
				$(".price_table_default tbody th:not(:first-child)")
					.mouseenter(function() {
						var e = $(this).parent(".price_table_default tbody tr"),
							t = e.find("th").index(this) - 1;
						$(".price_table_default tbody tr")
							.find("td:eq(" + t + ")")
							.addClass("hover"),
							$(this).addClass("th-hover");
					})
					.mouseleave(function() {
						$(".price_table_default tbody th").removeClass(
							"th-hover"
						),
							$(".price_table_default tbody td").removeClass(
								"hover"
							);
					}));

			setTimeout(function() {
				var i = 0,
					intr = setInterval(function() {
						i > 0 &&
							($(".deadline_cell_header")
								.first()
								.find("th:eq(" + i + ")")
								.removeClass("th-hover"),
							$(".price_table_default tbody tr")
								.find("td:eq(" + (i - 1) + ")")
								.removeClass("hover")),
							$(".deadline_cell_header")
								.first()
								.find("th:eq(" + (i + 1) + ")")
								.addClass("th-hover"),
							$(".price_table_default tbody tr")
								.find("td:eq(" + i + ")")
								.addClass("hover"),
							6 == ++i && clearInterval(intr);
					}, 150);
			}, 2000);
		}
	);
}

// end pricing
