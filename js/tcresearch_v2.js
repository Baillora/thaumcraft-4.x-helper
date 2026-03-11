'use strict';

var tcresearch = {

	version: "4.2.2.0",
	addonAspects: null,
	combinations: {},
	aspects: [],
	graph: {},

	c: {
		$from: $('#fromSel'),
		$to: $('#toSel'),
		$steps: $('#steps'),
		$avail: $('#avail'),
		$addons: $('#addons'),
		$version: $('#version'),
		$search: $('#search-container'),
		$searchResults: $('#search-results'),
		$resultsWrapper: $('#search-results-wrapper'),
		$combBox: $('#combination-box'),
		$combBoxL: $('#combination-box #left'),
		$combBoxR: $('#combination-box #right'),
		$combBoxE: $('#combination-box #equals'),

		$nodeAspectSel: $('#nodeAspectSel'),
		$nodeAspectAmount: $('#nodeAspectAmount'),
		$addNodeAspect: $('#add_node_aspect'),
		$nodeAspectsList: $('#node-aspects-list'),
		$nodeModifiers: $('.node-modifier-btn')
	},

	nodeAspects: {},
	nodeModifier: 1.0,
	html: {
		searchResult: '<div class="search-result">'
			+ '<a href="#" class="close-result"><i class="fa fa-trash-o"></i></a>'
			+ '<h2><span class="from"></span> &gt; <span class="to"></span></h2>'
			+ '</div>',
		aspectsList: '<ul class="aspect-list">'
			+ '</ul>',
		searchAspect: '<li class="aspect">'
			+ '<img />'
			+ '<div class="aspect-name"></div>'
			+ '</li>',
		searchInfo: '<div class="search-info">'
			+ '<p>Total steps: <span class="total-steps"></span></p>'
			+ '<ul class="used-aspects"><li>Used aspects:</li></ul>'
			+ '</div>',
		usedAspect: '<li class="used-aspect">'
			+ '<img />'
			+ '<span></span>'
			+ '</li>',
		toggleAddon: '<label class="btn btn-default"><input type="checkbox" class="addon_toggle" /><span></span></label>'
	},

	addConnection: function (from, to) {
		if (!(from in this.graph))
			this.graph[from] = [];
		this.graph[from].push(to);
	},

	connect: function (aspect1, aspect2) {
		this.addConnection(aspect1, aspect2);
		this.addConnection(aspect2, aspect1);
	},

	find: function (from, to, steps) {
		var self = this;
		var useTierWeight = $('#search-cheapest').hasClass('active');
		var visited = {},
			queue = new buckets.PriorityQueue(function (a, b) {
				if (useTierWeight) return b.length - a.length;
				return b.length - a.length;
			});
		queue.enqueue({
			'path': [from],
			'length': 0
		});
		return this.search(queue, to, visited, steps, useTierWeight);
	},

	search: function (queue, to, visited, steps, useTierWeight) {
		var self = this;
		while (!queue.isEmpty()) {

			var element = queue.dequeue(),
				node = element.path.pop();

			if (!(node in visited) || visited[node].indexOf(element.path.length) < 0) {
				element.path.push(node);

				if (node == to && element.path.length > steps + 1)
					return element.path;

				if (self.graph[node]) {
					self.graph[node].forEach(function (entry) {
						var newpath = element.path.slice();
						newpath.push(entry);
						var weight = useTierWeight ? (self.getTier(entry) || 1) : 1;
						queue.enqueue({
							'path': newpath,
							'length': element.length + weight
						});
					});
				}

				if (!(node in visited))
					visited[node] = [];

				visited[node].push(element.path.length - 1);

			};
		}
		return null;
	},

	pushAddons: function (aspects, combinations) {

		var self = this,
			addonArray = addon_dictionary;
		self.addonAspects = [],

			$.each(addon_dictionary, function (key, addonInfo) {

				var $addon = $(self.html.toggleAddon);
				$addon
					.find('input')
					.attr('id', key)
					.next()
					.text(addonInfo['name'])
					.parent()
					.appendTo(self.c.$addons);

				$.each(addonInfo['combinations'], function (name, comb) {
					self.combinations[name] = comb;
				});

				$.each(addonInfo['aspects'], function (number, aspect) {
					self.addonAspects.push(aspect);
				});

			});

		self.addonAspects = self.addonAspects.sort(aspectSort);

		$.each(self.addonAspects, function (number, aspect) {
			aspects.push(aspect);
		});
	},

	enableAspect: function (aspect) {
		$(aspect)
			.removeClass('unavail')
			.find('img')
			.attr('src', function (i, orig) {
				return orig.replace(/mono/, 'color');
			});
	},

	disableAspect: function (aspect) {
		$(aspect)
			.addClass('unavail')
			.find('img')
			.attr('src', function (i, orig) {
				return orig.replace(/color/, 'mono');
			});
	},

	toggle: function (aspect) {
		if ($(aspect).hasClass('unavail'))
			this.enableAspect(aspect);
		else
			this.disableAspect(aspect);
	},

	toggleAddons: function (list) {
		var self = this;
		list.forEach(function (aspect) {
			self.disableAspect('#avail #' + aspect);
		});
		this.saveStates();
	},

	saveStates: function () {
		var disabled = [];
		$('#avail .aspect.unavail').each(function () {
			disabled.push($(this).attr('id'));
		});
		try {
			localStorage.setItem('tc4_disabled_aspects', JSON.stringify(disabled));
		} catch (e) { }
	},

	loadStates: function () {
		try {
			var saved = localStorage.getItem('tc4_disabled_aspects');
			if (saved) {
				var disabled = JSON.parse(saved);
				var self = this;
				disabled.forEach(function (aspect) {
					self.disableAspect('#avail #' + aspect);
				});
			}
		} catch (e) { }
	},

	run: function () {
		var self = this,
			from = this.c.$from.val(),
			to = this.c.$to.val(),
			steps = +this.c.$steps.val(),
			id = from + 'to' + to,
			path = this.find(from, to, steps),
			stepCount = 0,
			loopCount = 0,
			aspectCount = {};

		var $searchResult = $(self.html.searchResult),
			$aspectsList = $(self.html.aspectsList),
			$searchInfo = $(self.html.searchInfo);

		if (!path) {
			var notFoundMsg = (typeof lang_dictionary !== 'undefined' && currentLang && lang_dictionary[currentLang])
				? (lang_dictionary[currentLang]['not_found'] || 'Combination not found')
				: 'Combination not found';
			$searchResult.find('h2').html('<span style="color:#ef5350;">' + notFoundMsg + '</span>');
			self.c.$searchResults.append($searchResult);
			$searchResult.animate({ 'margin-top': 0, opacity: 1 });
			$('#close_results').css('display', 'flex');
			self.loadStates();
			return;
		}

		path.forEach(function (aspect) {
			loopCount++;

			if (loopCount != 1 && loopCount < path.length) {
				typeof aspectCount[aspect] == 'undefined' && (aspectCount[aspect] = 0);
				aspectCount[aspect]++;
				stepCount++;
			};

			$(self.html.searchAspect)
				.attr('id', aspect)
				.find('img')
				.attr('src', 'aspects/color/' + translate[aspect] + '.png')
				.next()
				.text(translate[aspect])
				.parent()
				.appendTo($aspectsList);
		});

		$.each(aspectCount, function (aspect, value) {

			if (!value)
				return;

			$(self.html.usedAspect)
				.find('img')
				.attr('src', 'aspects/color/' + translate[aspect] + '.png')
				.next()
				.text(value)
				.parent()
				.appendTo($searchInfo.find('ul'));

		});

		$searchResult
			.find('.from')
			.text((translate[from] || from).toUpperCase())
			.next()
			.text((translate[to] || to).toUpperCase())
			.parent()
			.after($aspectsList);

		$searchInfo
			.find('.total-steps')
			.text(stepCount);

		$aspectsList
			.after($searchInfo);

		self.c.$searchResults.append($searchResult);
		$searchResult.animate({
			'margin-top': 0,
			opacity: 1
		});

		$('#research-tab').addClass('has-results');

		self.loadStates();
	},

	resetAspects: function () {

		this.aspects = $.extend(
			[],
			version_dictionary[this.version]['base_aspects']
		);
		this.combinations = $.extend(true,
			{},
			version_dictionary[this.version]['combinations']
		);

		this.c.$from.select2('destroy');
		this.c.$to.select2('destroy');
		this.c.$addons.empty();
		this.c.$avail.empty();

		var tierAspects = [];
		$.each(this.combinations, function (aspect, value) {
			tierAspects.push(aspect);
		});
		tierAspects = tierAspects.sort(aspectSort);
		this.aspects = this.aspects.concat(tierAspects);

		this.pushAddons(this.aspects, this.combinations)

		this.createAspectsList();

		this.toggleAddons(this.addonAspects);

		var ddData = [];
		this.aspects.forEach(function (aspect) {
			ddData.push({ text: aspect, id: aspect });
		});
		ddData.sort(ddDataSort);

		this.initSelect2(this.c.$from, ddData, 'air');
		this.initSelect2(this.c.$to, ddData, 'air');

		this.initSelect2(this.c.$nodeAspectSel, ddData, 'air');

		this.createCombinations();
	},

	createAspectsList: function () {
		var self = this;
		this.aspects.forEach(function (aspect) {

			var $aspect = $('<li class="aspect"><img><div class="aspect-text"><h4></h4><div class="desc"></div></div></li>');

			$aspect.
				attr('id', aspect)
				.find('img')
				.attr('src', 'aspects/color/' + translate[aspect] + '.png')
				.next()
				.find('h4')
				.text(translate[aspect])
				.next()
				.text(aspect);

			$aspect.appendTo(self.c.$avail);
		});
		self.loadStates();
	},

	initSelect2: function (element, data, value) {

		function formatAspect(aspect) {
			var tcId = translate[aspect.id] || aspect.id;
			var translatedName = getAspectName(aspect.id);
			var tier = tcresearch.getTier(aspect.id);
			var badge = '<span class="tier-badge tier-' + tier + '">T' + tier + '</span>';
			return '<div class="aspect" title="' + translatedName + '">' +
				'<img src="aspects/color/' + tcId + '.png" alt="' + tcId + '" />' +
				'<div class="aspect-name">' + badge + ' ' + tcId + ' <span class="aspect-desc">' + translatedName + '</span></div>' +
				'</div>';
		}

		$(element).select2({
			formatResult: formatAspect,
			formatSelection: formatAspect,
			allowClear: false,
			placeholder: 'Search by name...',
			query: function (q) {
				var results = [];
				var term = q.term ? q.term.toUpperCase() : "";

				$.each(data, function (i, opt) {
					if ($('#avail #' + opt.id).hasClass('unavail')) return;

					if (term !== "") {
						var tcId = translate[opt.id] || opt.id;
						var translatedName = getAspectName(opt.id);
						if (!(opt.text.toUpperCase().indexOf(term) >= 0 ||
							tcId.toUpperCase().indexOf(term) >= 0 ||
							translatedName.toUpperCase().indexOf(term) >= 0)) {
							return;
						}
					}
					results.push(opt);
				});

				results.sort(function (a, b) {
					return translate[a.id].localeCompare(translate[b.id]);
				});

				q.callback({ results: results });
			},
			initSelection: function (element, callback) {
				var id = $(element).val();
				if (id !== "") {
					var match = null;
					$.each(data, function (i, opt) {
						if (opt.id === id) match = opt;
					});
					if (match) callback(match);
				}
			}
		});

		$(element).select2('val', value);
	},

	createCombinations: function () {
		this.graph = {};

		for (var compound in this.combinations) {
			this.connect(compound, this.combinations[compound][0]);
			this.connect(compound, this.combinations[compound][1]);
		}
	},

	setVersions: function () {
		var self = this;
		$.each(version_dictionary, function (key, version) {
			$('<option />')
				.val(key)
				.text(key)
				.appendTo(self.c.$version);
		});
		self.c.$version.val(self.version);
	},

	whatchForViewChanges: function () {
		var self = this;

		$('#find_connection').on('click', function (e) {
			e.preventDefault();

			if (!self.c.$searchResults.children().length) {
				self.c.$search.removeClass('col-lg-offset-4 col-md-offset-4 col-sm-offset-3');
				self.c.$resultsWrapper.fadeIn();
				$('#close_results').fadeIn();

				setTimeout(function () {
					self.run();
				}, 700);
			} else
				self.run();
		});

		$('#searchModeGroup').on('click', '.node-modifier-btn', function () {
			$('#searchModeGroup .node-modifier-btn').removeClass('active');
			$(this).addClass('active');
		});

		$(document).on('input', '#lexicon-search', function () {
			var term = $(this).val().toLowerCase();
			$('#lexicon-grid .lexicon-card').each(function () {
				var name = $(this).data('name').toLowerCase();
				$(this).toggle(name.includes(term));
			});
		});

		$('#hungryNodeModifiers').on('click', '.node-modifier-btn', function () {
			$('#hungryNodeModifiers .node-modifier-btn').removeClass('active');
			$(this).addClass('active');
		});

		$('#calculate_hungry').on('click', function (e) {
			e.preventDefault();
			self.calculateHungryNode();
		});

		$('[data-target="lexicon-tab"]').one('click', function () {
			self.populateLexicon();
		});

		$('.info-btn').on('click', function (e) {
			e.preventDefault();
			var infoKey = $(this).data('info');
			var titleKey = 'info_title_' + infoKey;
			var bodyKey = 'info_body_' + infoKey;

			$('#info-modal-title').html(lang_dictionary[currentLang][titleKey] || titleKey);
			$('#info-modal-body').html(lang_dictionary[currentLang][bodyKey] || bodyKey);
			$('#info-modal-overlay').css('display', 'flex');
		});

		$('#info-modal-close').on('click', function (e) {
			e.preventDefault();
			$('#info-modal-overlay').hide();
		});

		$('#info-modal-overlay').on('click', function (e) {
			if (e.target === this) {
				$(this).hide();
			}
		});

		self.c.$addons.on('change', '.addon_toggle', function () {
			var $this = $(this),
				addon = $this.attr('id');
			if ($this.is(':checked')) {
				addon_dictionary[addon]['aspects'].forEach(function (aspect) {
					self.enableAspect('#' + aspect);
				});
				$this.parent().addClass('active');
			} else {
				addon_dictionary[addon]['aspects'].forEach(function (aspect) {
					self.disableAspect('#' + aspect);
				});
				$this.parent().removeClass('active');
			}
			self.saveStates();
		});

		$('#sel_all').on('click', function (e) {
			e.preventDefault();

			self.aspects.forEach(function (aspect) {
				self.enableAspect('#avail #' + aspect);
			});
			$('.addon_toggle').each(function (idx, el) {
				$(el).attr('checked', true).trigger('change');
			});
			self.saveStates();
		});

		$('#desel_all').on('click', function (e) {
			e.preventDefault();

			self.aspects.forEach(function (aspect) {
				self.disableAspect('#avail #' + aspect);
			});
			$('.addon_toggle').each(function (idx, el) {
				$(el).attr('checked', false).trigger('change');
			});
			self.saveStates();
		});

		$('#version').on('change', function () {
			var $this = $(this);
			self.version = $this.val();
			self.resetAspects();
		});

		$('#increment').click(function (e) {
			e.preventDefault();

			var val = self.c.$steps.val();
			val = +val + 1;
			self.c.$steps.val(val);
		});

		$('#decrement').click(function (e) {
			e.preventDefault();

			var val = self.c.$steps.val();
			val = (val > 1) ? +val - 1 : 1;
			self.c.$steps.val(val);
		});

		$('body').on('click', 'a.close-result', function (e) {
			e.preventDefault();

			$(this)
				.parent()
				.slideUp(400, function () {
					this.remove();

					if (!self.c.$searchResults.children().length) {
						$('#research-tab').removeClass('has-results');
					}
				});

		});

		$('#show-config').on('click', function (e) {
			e.preventDefault();

			$('#config').slideToggle();
			$(this).toggleClass('active');
		});

		$('#close_results').on('click', function (e) {
			e.preventDefault();

			$('.search-result').slideUp('400', function () {
				$(this).remove();

				if (!self.c.$searchResults.children().length) {
					$('#research-tab').removeClass('has-results');
				}
			});
		});

		var primaryAspects = { 'fire': 1, 'water': 1, 'order': 1, 'air': 1, 'entropy': 1, 'earth': 1 };
		$('body').on('mouseenter', '#avail .aspect, #search-results .aspect', function () {

			var aspect = $(this).attr('id');

			if (aspect in primaryAspects) {
				self.c.$combBox.hide();
				return;
			}

			var combo = self.combinations[aspect];
			var left = combo[0];
			var right = combo[1];

			self.c.$combBoxL
				.find('img')
				.attr('src', 'aspects/color/' + translate[left] + '.png')
				.next().text(translate[left])
				.next().text(left);
			self.c.$combBoxR
				.find('img')
				.attr('src', 'aspects/color/' + translate[right] + '.png')
				.next().text(translate[right])
				.next().text(right);
			self.c.$combBoxE
				.find('img')
				.attr('src', 'aspects/color/' + translate[aspect] + '.png')
				.next().text(translate[aspect])
				.next().text(aspect);
			self.c.$combBox.css('display', 'inline-block');
		});

		$('body').on('mousemove', '#avail .aspect, #search-results .aspect', function (e) {
			var $wrapper = self.c.$combBox.parent();
			var boxWidth = $wrapper.outerWidth();
			var boxHeight = $wrapper.outerHeight();
			var leftPos = e.pageX + 15;
			var topPos = e.pageY + 15;

			if (leftPos + boxWidth > $(window).width()) {
				leftPos = e.pageX - boxWidth - 15;
			}

			$wrapper.css({
				'left': leftPos + 'px',
				'top': topPos + 'px'
			});
		});

		$('body').on('mouseleave', '#avail .aspect, #search-results .aspect', function () {
			self.c.$combBox.hide();
		});

		$('body').on('click', '#search-results .aspect', function () {
			var $this = $(this),
				aspect = $this.attr('id'),
				$h2 = $this.parent().prev(),
				from = $h2.find('.from').text(),
				to = $h2.find('.to').text();
			console.log(from, to, $h2);

			self.c.$from.select2('val', from);
			self.c.$to.select2('val', to);
			self.disableAspect('#' + aspect);
			self.disableAspect('#avail #' + aspect);
			self.run();
			self.enableAspect('#avail #' + aspect);
		});


		self.c.$avail.on('click', '.aspect', function () {
			self.toggle(this);
			self.saveStates();
		});

		$('.tab-btn').on('click', function () {
			if ($(this).hasClass('active')) return;

			$('.tab-btn').removeClass('active');
			$(this).addClass('active');
			$('.tab-content').removeClass('active');
			$('#' + $(this).data('target')).addClass('active');
		});

		this.c.$addNodeAspect.on('click', function (e) {
			e.preventDefault();
			var aspect = self.c.$nodeAspectSel.val();
			var amount = parseInt(self.c.$nodeAspectAmount.val());
			if (!aspect || isNaN(amount) || amount <= 0) return;

			if (self.nodeAspects[aspect]) {
				self.nodeAspects[aspect] += amount;
			} else {
				self.nodeAspects[aspect] = amount;
			}
			self.c.$nodeAspectAmount.val(1);
			self.updateNodeUI();
		});

		this.c.$nodeAspectsList.on('click', '.remove-btn', function () {
			var aspect = $(this).data('aspect');
			delete self.nodeAspects[aspect];
			self.updateNodeUI();
		});

		this.c.$nodeModifiers.on('click', function () {
			self.c.$nodeModifiers.removeClass('active');
			$(this).addClass('active');

			var mod = $(this).data('mod');
			if (mod === 'bright') self.nodeModifier = 1.2;
			else if (mod === 'pale') self.nodeModifier = 0.8;
			else if (mod === 'fading') self.nodeModifier = 0.5;
			else self.nodeModifier = 1.0;

			self.updateNodeUI();
		});

		$('#reverseNodeModifiers').on('click', '.node-modifier-btn', function () {
			$('#reverseNodeModifiers .node-modifier-btn').removeClass('active');
			$(this).addClass('active');
		});

		$('#calculate_reverse').on('click', function (e) {
			e.preventDefault();
			self.calculateReverse();
		});
	},

	updateNodeUI: function () {
		var self = this;
		self.c.$nodeAspectsList.empty();

		$.each(self.nodeAspects, function (aspect, amount) {
			var tcId = translate[aspect] || aspect;
			var translatedName = getAspectName(aspect);
			var html = '<div class="node-aspect-item" data-tooltip="' + self.getTooltipText(aspect).replace(/"/g, '&quot;') + '" style="display:none;">' +
				'<img src="aspects/color/' + tcId + '.png" alt="' + tcId + '">' +
				'<span>' + translatedName + ' (' + amount + ')</span>' +
				'<span class="remove-btn" data-aspect="' + aspect + '"><i class="fa fa-times"></i></span>' +
				'</div>';
			var $item = $(html);
			self.c.$nodeAspectsList.append($item);
			$item.fadeIn(300);
		});

		try {
			localStorage.setItem('tc4_node_aspects', JSON.stringify(self.nodeAspects));
			localStorage.setItem('tc4_node_modifier', self.nodeModifier);
		} catch (e) { }

		var modClass = 'mod-normal';
		if (self.nodeModifier === 1.2) modClass = 'mod-bright';
		else if (self.nodeModifier === 0.8) modClass = 'mod-pale';
		else if (self.nodeModifier === 0.5) modClass = 'mod-fading';
		$('#node-visualizer').removeClass('mod-normal mod-bright mod-pale mod-fading').addClass(modClass);

		self.calculateNodeCV();
	},

	getTier: function (aspect) {
		if (!aspect) return 1;
		if (this.tierCache && this.tierCache[aspect]) return this.tierCache[aspect];
		this.tierCache = this.tierCache || {};
		var primals = version_dictionary[this.version]['base_aspects'];
		if (primals.indexOf(aspect) !== -1) {
			this.tierCache[aspect] = 1;
			return 1;
		}
		var combo = this.combinations[aspect];
		if (!combo) {
			this.tierCache[aspect] = 1;
			return 1;
		}
		var tier = 1 + Math.max(this.getTier(combo[0]), this.getTier(combo[1]));
		this.tierCache[aspect] = tier;
		return tier;
	},

	getTooltipText: function (aspect) {
		var tcId = translate[aspect] || aspect;
		var name = getAspectName(aspect);
		var primals = version_dictionary[this.version]['base_aspects'];
		var tier = this.getTier(aspect);
		var str = name + " (" + tcId + ")\nTier T" + tier;

		var combo = this.combinations[aspect];
		if (combo) {
			str += "\n\n" + getAspectName(combo[0]) + " + " + getAspectName(combo[1]);
		} else if (primals.indexOf(aspect) !== -1) {
			str += "\n\nPrimal";
		}
		return str;
	},

	refreshDropdowns: function () {
		var self = this;
		if (!self.aspects || !self.aspects.length) return;

		var ddData = [];
		self.aspects.forEach(function (aspect) {
			ddData.push({ text: aspect, id: aspect });
		});
		ddData.sort(function (a, b) { return translate[a.id].localeCompare(translate[b.id]); });

		if (self.c.$from && self.c.$from.length) {
			var fromVal = self.c.$from.val() || 'air';
			self.initSelect2(self.c.$from, ddData, fromVal);
		}
		if (self.c.$to && self.c.$to.length) {
			var toVal = self.c.$to.val() || 'air';
			self.initSelect2(self.c.$to, ddData, toVal);
		}
		if (self.c.$nodeAspectSel && self.c.$nodeAspectSel.length) {
			var nodeVal = self.c.$nodeAspectSel.val() || 'air';
			self.initSelect2(self.c.$nodeAspectSel, ddData, nodeVal);
		}
	},

	getPrimals: function (aspect) {
		aspect = aspect.toLowerCase();
		var primals = version_dictionary[this.version]['base_aspects'];

		if (primals.indexOf(aspect) !== -1) {
			var res = {};
			res[aspect] = true;
			return res;
		}

		var result = {};
		var combo = this.combinations[aspect];
		if (combo) {
			var p1 = this.getPrimals(combo[0]);
			var p2 = this.getPrimals(combo[1]);
			$.extend(result, p1, p2);
		}
		return result;
	},

	calculateNodeCV: function () {
		var self = this;
		var primals = version_dictionary[this.version]['base_aspects'];
		var primalMax = {};
		$.each(primals, function (index, p) {
			primalMax[p] = 0;
		});

		$.each(self.nodeAspects, function (aspect, amount) {
			aspect = aspect.toLowerCase();
			var aspectPrimals = self.getPrimals(aspect);
			$.each(aspectPrimals, function (p) {
				if (amount > primalMax[p]) {
					primalMax[p] = amount;
				}
			});
		});

		var uiMap = {
			'air': 'aer',
			'earth': 'terra',
			'fire': 'ignis',
			'water': 'aqua',
			'order': 'ordo',
			'entropy': 'perditio'
		};

		var maxCV = 0;
		var dominantPrimal = null;
		var activePrimals = [];
		var totalCV = 0;

		$.each(primals, function (index, p) {
			var cap = primalMax[p] * self.nodeModifier;
			var cv = Math.floor(Math.sqrt(cap));
			var $el = $('#cv-' + uiMap[p]);
			var currentCv = parseInt($el.text()) || 0;
			if (currentCv !== cv) {
				$el.prop('Counter', currentCv).animate({ Counter: cv }, {
					duration: 500,
					easing: 'swing',
					step: function (now) { $el.text(Math.ceil(now)); }
				});
			} else {
				$el.text(cv);
			}

			if (cv > 0) {
				activePrimals.push({ primal: p, cv: cv });
				totalCV += cv;
			}
			if (cv > maxCV) {
				maxCV = cv;
				dominantPrimal = p;
			}
		});

		var orbColors = {
			'air': 'rgba(255, 255, 0, 0.8)',
			'earth': 'rgba(0, 255, 0, 0.8)',
			'fire': 'rgba(255, 0, 0, 0.8)',
			'water': 'rgba(0, 150, 255, 0.8)',
			'order': 'rgba(255, 255, 255, 0.8)',
			'entropy': 'rgba(100, 100, 100, 0.8)'
		};

		if (maxCV > 0 && dominantPrimal) {
			var bgColor = orbColors[dominantPrimal].replace('0.8', '0.2');
			var shadows = ['inset 0 0 15px rgba(255, 255, 255, 0.8)'];

			activePrimals.sort(function (a, b) { return b.cv - a.cv; });

			$.each(activePrimals, function (i, item) {
				var color = orbColors[item.primal].replace('0.8', '0.6');
				var blur = 20 + item.cv * 1.5;
				var spread = item.cv * 0.5;
				shadows.push('0 0 ' + blur + 'px ' + spread + 'px ' + color);
			});

			var baseSize = 60;
			var addedSize = Math.min(totalCV * 0.4, 60);
			var newSize = baseSize + addedSize;

			$('#node-visualizer').css({
				'background': bgColor,
				'box-shadow': shadows.join(', '),
				'width': newSize + 'px',
				'height': newSize + 'px'
			});
		} else {
			$('#node-visualizer').css({
				'background': 'rgba(255, 255, 255, 0.1)',
				'box-shadow': '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.5)',
				'width': '60px',
				'height': '60px'
			});
		}
	},

	calculateReverse: function () {
		var self = this;
		var primals = version_dictionary[self.version]['base_aspects'];
		var uiMap = { 'air': 'aer', 'earth': 'terra', 'fire': 'ignis', 'water': 'aqua', 'order': 'ordo', 'entropy': 'perditio' };

		var mod = 1.0;
		if ($('#reverseNodeModifiers .active').data('mod') === 'bright') mod = 1.2;
		else if ($('#reverseNodeModifiers .active').data('mod') === 'pale') mod = 0.8;
		else if ($('#reverseNodeModifiers .active').data('mod') === 'fading') mod = 0.5;

		var res_greedy = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_greedy"]) ? lang_dictionary[currentLang]["reverse_greedy"] : "Greedy Combo";
		var res_greedy_desc = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_greedy_desc"]) ? lang_dictionary[currentLang]["reverse_greedy_desc"] : "";
		var res_single = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_single"]) ? lang_dictionary[currentLang]["reverse_single"] : "Best Single Aspect Solutions";
		var res_single_desc = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_single_desc"]) ? lang_dictionary[currentLang]["reverse_single_desc"] : "";
		var res_none = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_none"]) ? lang_dictionary[currentLang]["reverse_none"] : "No single aspect can provide all target primals.";
		var res_error_zero = (typeof lang_dictionary !== 'undefined' && lang_dictionary[currentLang] && lang_dictionary[currentLang]["reverse_error_zero"]) ? lang_dictionary[currentLang]["reverse_error_zero"] : "Please enter at least one target CV > 0.";

		var req = {};
		var hasReq = false;
		$.each(primals, function (i, p) {
			var cv = parseInt($('#target-' + uiMap[p]).val()) || 0;
			if (cv > 0) {
				req[p] = Math.ceil((cv * cv) / mod);
				hasReq = true;
			}
		});

		if (!hasReq) {
			$('#reverse-results').html('<p style="color:#f06292;">' + res_error_zero + '</p>');
			return;
		}

		var allAspects = self.aspects.filter(function (a) { return !$('#avail #' + a).hasClass('unavail'); });

		var cachedPrimals = {};
		allAspects.forEach(function (a) {
			cachedPrimals[a] = self.getPrimals(a);
		});

		var singleMatches = [];
		allAspects.forEach(function (a) {
			var aPrimals = cachedPrimals[a];
			var coversAll = true;
			var maxReq = 0;

			for (var p in req) {
				if (!aPrimals[p]) { coversAll = false; break; }
				if (req[p] > maxReq) maxReq = req[p];
			}
			if (coversAll) {
				singleMatches.push({ aspect: a, amount: maxReq, tier: self.getTier(a) });
			}
		});

		singleMatches.sort(function (a, b) {
			if (a.amount !== b.amount) return a.amount - b.amount;
			return a.tier - b.tier;
		});

		var combo = [];
		var remainingReq = $.extend({}, req);
		var safety = 0;
		while (Object.keys(remainingReq).length > 0 && safety < 10) {
			safety++;
			var bestAspect = null;
			var bestCoverCount = -1;
			var bestMaxReq = Infinity;

			allAspects.forEach(function (a) {
				var aPrimals = cachedPrimals[a];
				var coverCount = 0;
				var maxReqForA = 0;
				for (var p in remainingReq) {
					if (aPrimals[p]) {
						coverCount++;
						if (remainingReq[p] > maxReqForA) maxReqForA = remainingReq[p];
					}
				}
				if (coverCount > bestCoverCount || (coverCount === bestCoverCount && maxReqForA < bestMaxReq)) {
					bestAspect = a;
					bestCoverCount = coverCount;
					bestMaxReq = maxReqForA;
				}
			});

			if (bestCoverCount > 0 && bestAspect) {
				combo.push({ aspect: bestAspect, amount: bestMaxReq });
				var covered = cachedPrimals[bestAspect];
				for (var p in covered) {
					delete remainingReq[p];
				}
			} else {
				break;
			}
		}

		var html = '';
		if (combo.length > 0) {
			html += '<h3 style="color:#4fc3f7; font-size:1.4rem;">' + res_greedy + '</h3>';
			if (res_greedy_desc) html += '<p style="color:#aaa; font-size:1rem; margin-top:-5px; margin-bottom:15px;">' + res_greedy_desc + '</p>';
			html += '<div style="display:flex; justify-content:center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">';
			combo.forEach(function (item) {
				var tcId = translate[item.aspect] || item.aspect;
				html += '<div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">' +
					'<img src="aspects/color/' + tcId + '.png" alt="' + tcId + '" style="width: 32px;"><br>' +
					'<span>' + getAspectName(item.aspect) + ' x' + item.amount + '</span></div>';
			});
			html += '</div>';
		}

		if (singleMatches.length > 0) {
			html += '<h3 style="color:#4fc3f7; font-size:1.4rem;">' + res_single + '</h3>';
			if (res_single_desc) html += '<p style="color:#aaa; font-size:1rem; margin-top:-5px; margin-bottom:15px;">' + res_single_desc + '</p>';
			html += '<div style="display:flex; flex-wrap: wrap; justify-content:center; gap: 10px;">';
			for (var i = 0; i < Math.min(6, singleMatches.length); i++) {
				var item = singleMatches[i];
				var tcId = translate[item.aspect] || item.aspect;
				html += '<div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; border: 1px solid rgba(255,105,180,0.3);">' +
					'<img src="aspects/color/' + tcId + '.png" alt="' + tcId + '" style="width: 32px;"><br>' +
					'<span>' + getAspectName(item.aspect) + ' x' + item.amount + '</span></div>';
			}
			html += '</div>';
		} else {
			html += '<p style="color:#aaa;">' + res_none + '</p>';
		}

		$('#reverse-results').html(html);
	},

	populateLexicon: function () {
		var self = this;
		var $grid = $('#lexicon-grid');
		$grid.empty();

		var usedIn = {};
		$.each(self.combinations, function (compound, parts) {
			parts.forEach(function (part) {
				if (!usedIn[part]) usedIn[part] = [];
				usedIn[part].push(compound);
			});
		});

		self.aspects.forEach(function (aspect) {
			var tcId = translate[aspect] || aspect;
			var displayName = getAspectName(aspect);
			var card = '<div class="lexicon-card" data-name="' + tcId + ' ' + displayName + ' ' + aspect + '" data-aspect="' + aspect + '" style="cursor:pointer; text-align:center; width:80px; padding:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:6px; transition:all 0.2s;">' +
				'<img src="aspects/color/' + tcId + '.png" style="width:36px; height:36px;"><br>' +
				'<small style="color:#bbb; font-size:0.85rem;">' + tcId + '</small>' +
				'</div>';
			$grid.append(card);
		});

		$grid.on('click', '.lexicon-card', function () {
			var aspect = $(this).data('aspect');
			var tcId = translate[aspect] || aspect;
			var displayName = getAspectName(aspect);
			var combo = self.combinations[aspect];
			var primals = self.getPrimals(aspect);
			var primalsHtml = Object.keys(primals).map(function (p) {
				var ptcId = translate[p] || p;
				var pName = getAspectName(p);
				return '<div class="lexicon-goto" data-goto="' + p + '" data-tooltip="' + self.getTooltipText(p).replace(/"/g, '&quot;') + '" style="cursor:pointer; display:inline-block; text-align:center; margin:4px 8px; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"><img src="aspects/color/' + ptcId + '.png" style="width:36px; height:36px; display:block; margin:0 auto;"><span style="font-size:1.1rem; color:#bbb;">' + ptcId + '</span></div>';
			}).join('');

			var recipeHtml = '';
			if (combo) {
				var l = translate[combo[0]] || combo[0];
				var r = translate[combo[1]] || combo[1];
				var lName = getAspectName(combo[0]);
				var rName = getAspectName(combo[1]);
				recipeHtml = '<div style="display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;">' +
					'<div class="lexicon-goto" data-goto="' + combo[0] + '" data-tooltip="' + self.getTooltipText(combo[0]).replace(/"/g, '&quot;') + '" style="cursor:pointer; text-align:center; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"><img src="aspects/color/' + l + '.png" style="width:40px; height:40px; display:block; margin:0 auto;"><span style="font-size:1.1rem; color:#bbb;">' + l + '</span></div>' +
					'<span style="font-size:2rem; color:#aaa;">+</span>' +
					'<div class="lexicon-goto" data-goto="' + combo[1] + '" data-tooltip="' + self.getTooltipText(combo[1]).replace(/"/g, '&quot;') + '" style="cursor:pointer; text-align:center; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"><img src="aspects/color/' + r + '.png" style="width:40px; height:40px; display:block; margin:0 auto;"><span style="font-size:1.1rem; color:#bbb;">' + r + '</span></div>' +
					'<span style="font-size:2rem; color:#aaa;">=</span>' +
					'<div class="lexicon-goto" data-goto="' + aspect + '" data-tooltip="' + self.getTooltipText(aspect).replace(/"/g, '&quot;') + '" style="cursor:pointer; text-align:center; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"><img src="aspects/color/' + tcId + '.png" style="width:40px; height:40px; display:block; margin:0 auto;"><span style="font-size:1.1rem; color:#4fc3f7;">' + tcId + '</span></div>' +
					'</div>';
			} else {
				recipeHtml = '<em style="color:#aaa; font-size:1.3rem;">Primal aspect</em>';
			}

			var derivsHtml = '';
			if (usedIn[aspect] && usedIn[aspect].length > 0) {
				derivsHtml = '<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:flex-start;">' + usedIn[aspect].map(function (d) {
					var dtcId = translate[d] || d;
					return '<div class="lexicon-goto" data-goto="' + d + '" data-tooltip="' + self.getTooltipText(d).replace(/"/g, '&quot;') + '" style="cursor:pointer; text-align:center; min-width:60px; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'"><img src="aspects/color/' + dtcId + '.png" style="width:36px; height:36px; display:block; margin:0 auto;"><span style="font-size:1.1rem; color:#bbb;">' + dtcId + '</span></div>';
				}).join('') + '</div>';
			} else {
				derivsHtml = '<em style="color:#aaa; font-size:1.2rem;">—</em>';
			}

			$('#lexicon-detail-content').html(
				'<div style="border-bottom:1px solid rgba(79,195,247,0.3); padding-bottom:12px; margin-bottom:12px;">' +
				'<h3 style="color:#4fc3f7; font-size:2rem; margin:0 0 4px;"><img src="aspects/color/' + tcId + '.png" style="width:40px; vertical-align:middle; margin-right:10px;"> ' + tcId + '</h3>' +
				'<p style="color:#888; margin:0; font-size:1.3rem;">(' + displayName + ')</p>' +
				'<span style="font-size:1.2rem; color:#aaa; padding:3px 10px; background:rgba(255,255,255,0.07); border-radius:20px; display:inline-block; margin-top:6px;">Tier T' + (self.getTier(aspect)) + '</span>' +
				'</div>' +
				'<div style="margin-bottom:18px;"><p style="color:#4fc3f7; font-size:1.4rem; font-weight:600; margin-bottom:10px;">Recipe</p>' + recipeHtml + '</div>' +
				'<div style="margin-bottom:18px;"><p style="color:#4fc3f7; font-size:1.4rem; font-weight:600; margin-bottom:10px;">Primals</p><div style="display:flex; flex-wrap:wrap; gap:4px;">' + primalsHtml + '</div></div>' +
				'<div><p style="color:#4fc3f7; font-size:1.4rem; font-weight:600; margin-bottom:10px;">Used in</p>' + derivsHtml + '</div>'
			);
			$('#lexicon-detail').slideDown(200);
		});

		$('#lexicon-detail-content').off('click', '.lexicon-goto').on('click', '.lexicon-goto', function () {
			var tgt = $(this).data('goto');
			if (tgt) {
				$('.lexicon-card[data-aspect="' + tgt + '"]').trigger('click');
			}
		});
	},

	calculateHungryNode: function () {
		var uiMap = { 'air': 'aer', 'earth': 'terra', 'fire': 'ignis', 'water': 'aqua', 'order': 'ordo', 'entropy': 'perditio' };
		var modVal = 1.0;
		var modName = $('#hungryNodeModifiers .active').data('mod');
		if (modName === 'bright') modVal = 1.2;
		else if (modName === 'pale') modVal = 0.8;
		else if (modName === 'fading') modVal = 0.5;

		var orbColors = {
			'air': '#ffff00', 'earth': '#00ff00', 'fire': '#ff4444',
			'water': '#0096ff', 'order': '#ffffff', 'entropy': '#888888'
		};

		var html = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin-top:10px;">';
		var hasAny = false;

		$.each(uiMap, function (internalName, tcName) {
			var raw = parseInt($('#hungry-' + tcName).val()) || 0;
			if (raw <= 0) return;
			hasAny = true;
			var cap = raw;
			var cv = Math.floor(Math.sqrt(cap * modVal));
			var color = orbColors[internalName];
			html += '<div style="background:rgba(0,0,0,0.4); border:1px solid ' + color + '40; border-radius:8px; padding:15px; text-align:center; width:120px;">' +
				'<img src="aspects/color/' + tcName + '.png" style="width:36px; height:36px;"><br>' +
				'<div style="font-size:2rem; font-weight:600; color:' + color + '; margin:8px 0;">' + cv + '</div>' +
				'<small style="color:#aaa;">CV/t</small><br>' +
				'<small style="color:#666;">' + raw + ' fed</small>' +
				'</div>';
		});
		html += '</div>';

		if (!hasAny) {
			$('#hungry-results').html('<p style="color:#f06292;">Please enter at least one amount > 0.</p>');
		} else {
			$('#hungry-results').html(html);
		}
	},

	init: function () {
		this.setVersions();
		this.whatchForViewChanges();

		try {
			var savedNode = localStorage.getItem('tc4_node_aspects');
			if (savedNode) this.nodeAspects = JSON.parse(savedNode);
			var savedMod = localStorage.getItem('tc4_node_modifier');
			if (savedMod) {
				this.nodeModifier = parseFloat(savedMod);
				this.c.$nodeModifiers.removeClass('active');
				if (this.nodeModifier === 1.2) this.c.$nodeModifiers.filter('[data-mod="bright"]').addClass('active');
				else if (this.nodeModifier === 0.8) this.c.$nodeModifiers.filter('[data-mod="pale"]').addClass('active');
				else if (this.nodeModifier === 0.5) this.c.$nodeModifiers.filter('[data-mod="fading"]').addClass('active');
				else this.c.$nodeModifiers.filter('[data-mod="normal"]').addClass('active');
			}
		} catch (e) { }

		this.resetAspects();
		this.loadStates();
		this.updateNodeUI();
	},

	saveStates: function () {
		var disabled = [];
		$('#avail .unavail').each(function () {
			disabled.push($(this).attr('id'));
		});
		var addons = {};
		$('.addon_toggle').each(function () {
			addons[$(this).attr('id')] = $(this).is(':checked');
		});
		try {
			localStorage.setItem('tc4_disabled_aspects', JSON.stringify(disabled));
			localStorage.setItem('tc4_addons_state', JSON.stringify(addons));
		} catch (e) { }
	},

	loadStates: function () {
		var self = this;
		try {
			var savedAddons = localStorage.getItem('tc4_addons_state');
			if (savedAddons) {
				var addons = JSON.parse(savedAddons);
				for (var id in addons) {
					$('#' + id + '.addon_toggle').attr('checked', addons[id]).trigger('change');
				}
			}

			var saved = localStorage.getItem('tc4_disabled_aspects');
			if (saved) {
				var disabled = JSON.parse(saved);
				$('#avail .aspect').each(function () {
					var id = $(this).attr('id');
					if (disabled.indexOf(id) !== -1) {
						self.disableAspect(this);
					} else {
						self.enableAspect(this);
					}
				});
			}
		} catch (e) { }
	}


}

tcresearch.init();

function aspectSort(a, b) {
	return (a == b) ? 0 : (translate[a] < translate[b]) ? -1 : 1;
}
function ddDataSort(a, b) {
	return (a.text == b.text) ? 0 : (translate[a] < translate[b]) ? -1 : 1;
}

function getWeight(aspect) {
	return $('#avail #' + aspect).hasClass('unavail') ? 100 : 1;
}

