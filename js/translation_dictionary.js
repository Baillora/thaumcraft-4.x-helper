var translate = {
	"air": "aer",
	"earth": "terra",
	"fire": "ignis",
	"water": "aqua",
	"order": "ordo",
	"entropy": "perditio",
	"void": "vacuos",
	"light": "lux",
	"energy": "potentia",
	"motion": "motus",
	"stone": "saxum",
	"life": "victus",
	"weather": "tempestas",
	"cold": "gelum",
	"crystal": "vitreus",
	"death": "mortuus",
	"flight": "volatus",
	"darkness": "tenebrae",
	"soul": "spiritus",
	"heal": "sano",
	"travel": "iter",
	"poison": "venenum",
	"eldritch": "alienis",
	"magic": "praecantatio",
	"aura": "auram",
	"taint": "vitium",
	"seed": "granum",
	"slime": "limus",
	"plant": "herba",
	"tree": "arbor",
	"beast": "bestia",
	"flesh": "corpus",
	"undead": "exanimis",
	"mind": "cognitio",
	"senses": "sensus",
	"man": "humanus",
	"crop": "messis",
	"harvest": "meto",
	"metal": "metallum",
	"mine": "perfodio",
	"tool": "instrumentum",
	"weapon": "telum",
	"armor": "tutamen",
	"hunger": "fames",
	"greed": "lucrum",
	"craft": "fabrico",
	"cloth": "pannus",
	"mechanism": "machina",
	"trap": "vinculum",
	"exchange": "permutatio",
	"wrath": "ira",
	"nether": "infernus",
	"gluttony": "gula",
	"envy": "invidia",
	"sloth": "desidia",
	"pride": "superbia",
	"lust": "luxuria",
	"time": "tempus",
	"electricity": "electrum",
	"magnetism": "magneto",
	"cheatiness": "nebrisum",
	"radioactivity": "radio",
	"stupidity": "stronito"
};

var lang_dictionary = {
	"en": {
		"aer": "Air", "terra": "Earth", "ignis": "Fire", "aqua": "Water", "ordo": "Order", "perditio": "Entropy",
		"vacuos": "Void", "lux": "Light", "potentia": "Energy", "motus": "Motion", "saxum": "Stone", "victus": "Life",
		"tempestas": "Weather", "gelum": "Cold", "vitreus": "Crystal", "mortuus": "Death", "volatus": "Flight",
		"tenebrae": "Darkness", "spiritus": "Soul", "sano": "Heal", "iter": "Travel", "venenum": "Poison",
		"alienis": "Eldritch", "praecantatio": "Magic", "auram": "Aura", "vitium": "Taint", "granum": "Seed",
		"limus": "Slime", "herba": "Plant", "arbor": "Tree", "bestia": "Beast", "corpus": "Flesh", "exanimis": "Undead",
		"cognitio": "Mind", "sensus": "Senses", "humanus": "Man", "messis": "Crop", "meto": "Harvest", "metallum": "Metal",
		"perfodio": "Mine", "instrumentum": "Tool", "telum": "Weapon", "tutamen": "Armor", "fames": "Hunger",
		"lucrum": "Greed", "fabrico": "Craft", "pannus": "Cloth", "machina": "Mechanism", "vinculum": "Trap",
		"permutatio": "Exchange", "ira": "Wrath", "infernus": "Nether", "gula": "Gluttony", "invidia": "Envy",
		"desidia": "Sloth", "superbia": "Pride", "luxuria": "Lust", "tempus": "Time", "electrum": "Electricity",
		"magneto": "Magnetism", "nebrisum": "Cheatiness", "radio": "Radioactivity", "stronito": "Stupidity",
		"tab_research": "Research Helper", "tab_node": "Aura Node", "tab_reverse": "Target CV",
		"app_title": "Thaumcraft 4 Research Helper", "label_from": "From", "label_to": "To",
		"label_steps": "In, at least", "btn_go": "Go!", "node_title": "Aura Node Calculator",
		"node_desc": "Add aspects to the node to calculate Energized CV output",
		"label_select_aspect": "Select Aspect", "label_amount": "Amount", "btn_add_aspect": "Add Aspect",
		"mod_normal": "Normal", "mod_bright": "Bright (+20%)", "mod_pale": "Pale (-20%)", "mod_fading": "Fading (-50%)",
		"node_output": "Energized Output (CV/t)", "config_title": "Configuration", "btn_sel_all": "Select All",
		"btn_desel_all": "Deselect All", "avail_label": "Available Aspects", "help_title": "Help",
		"reverse_title": "Target CV Calculator", "reverse_desc": "Enter the desired Energized CV/t to find the most efficient compound aspects.",
		"btn_calc_reverse": "Calculate Optimal Aspects",
		"reverse_greedy": "Greedy Combo (Fewest Aspects)", "reverse_greedy_desc": "This combination contains all the primals you need. You can use these to feed a Hungry Node.",
		"reverse_single": "Best Single Aspect Solutions", "reverse_single_desc": "Each of these aspects contains all target primals in one node.",
		"reverse_none": "No single aspect can provide all target primals.", "reverse_error_zero": "Please enter at least one target CV > 0.",
		"tab_lexicon": "Aspect Lexicon", "lexicon_desc": "Click any aspect to see its recipe and uses.",
		"tab_hungry": "Hungry Node", "hungry_desc": "Simulate feeding raw essentia into a Hungry Node. Enter amounts per primal to see how much CV it gains.",
		"hungry_node_mod_label": "Node Modifier:", "btn_hungry_calc": "Simulate Feeding",
		"search_shortest": "Shortest Path", "search_cheapest": "Cheapest Path (Avoids High Tier)",
		"help_desc": "This script helps you with Thaumcraft 4.x research. If you have a research note with two aspects and you don't know how to connect them, this tool is for you.",
		"help_li_1": "Select the <strong>aspect from which</strong> you have to <strong>start</strong>.",
		"help_li_2": "Select the <strong>aspect</strong> you have <strong>to get to</strong>.",
		"help_li_3": "Additionally, you can <strong>specify the minimum number of steps</strong> needed, that is, the number of empty spaces between the two aspects in your research note.",
		"help_li_4": "<strong>Hit Go!</strong>",
		"help_desc2": "If you are unhappy with the path you got, because you do not have access to those aspects yet or they are quite rare, simply disable those aspects in the config section. Besides, clicking an aspect in a search result will rerun the search again, but with the aspect disabled (just momentarily).",
		"info_title_research": "How to use Research Helper",
		"info_body_research": "<p>This tab helps you connect two aspects in your Thaumonomicon research notes.</p><ul><li>Select the <strong>From</strong> aspect and the <strong>To</strong> aspect.</li><li>Set the minimum number of steps (empty hexes between them).</li><li>Choose your preferred search type (Shortest Path uses fewest steps, Cheapest Path avoids high-tier aspects like Humanus).</li><li>Click <strong>Go!</strong> to see the exact aspects to place in the hexes.</li></ul><p>If you don't have an aspect shown in the result, you can disable it in the Config section below.</p>",
		"info_title_node": "How to use Aura Node Calculator",
		"info_body_node": "<p>This tab calculates the total Energized CV output when you energize an aura node.</p><ul><li>Select an aspect from the dropdown and specify how many points it has.</li><li>Click <strong>Add Aspect</strong> to throw it into the simulated node.</li><li>Choose the Node Modifier (Bright, Pale, Fading) if the node has one.</li><li>The visualizer will show you the exact CV/t output of each primal aspect once energized.</li></ul>",
		"info_title_reverse": "How to use Target CV Calculator",
		"info_body_reverse": "<p>This tab helps you find which compound aspects to feed a hungry node or throw into an energized node to get a specific CV/t output.</p><ul><li>Enter the target CV amount for each of the 6 primal aspects.</li><li>Click <strong>Calculate</strong> to see the most efficient compound aspects that contain those primals.</li><li>Use the <strong>Greedy Combo</strong> if you want to feed multiple different aspects.</li><li>Use the <strong>Best Single Aspect</strong> if you want to find one super-aspect that contains everything you need.</li></ul>",
		"info_title_lexicon": "How to use Aspect Lexicon",
		"info_body_lexicon": "<p>The Lexicon is an interactive encyclopedia of all Thaumcraft 4 aspects.</p><ul><li>Use the search bar to instantly find any aspect by name or ID.</li><li>Click on any aspect icon to open its detail panel.</li><li>The detail panel shows you the exact <strong>Recipe</strong> (which two aspects combine to make it).</li><li>It also shows the <strong>Primals</strong> it decays into, and which higher-tier aspects it is <strong>Used In</strong>.</li></ul>",
		"info_title_hungry": "How to use Hungry Node Simulator",
		"info_body_hungry": "<p>This tab simulates the process of feeding a Hungry Node manually before energizing it.</p><ul><li>Enter the total amount of raw essentia or items you plan to feed the node for each primal category.</li><li>Select the Node Modifier (e.g., Bright adds +20%).</li><li>Click <strong>Simulate Feeding</strong> to instantly calculate the final Energized CV/t using the square root formula.</li></ul>"
	},
	"ru": {
		"aer": "Воздух", "terra": "Земля", "ignis": "Огонь", "aqua": "Вода", "ordo": "Порядок", "perditio": "Энтропия / Разрушение",
		"vacuos": "Пустота", "lux": "Свет", "potentia": "Энергия", "motus": "Движение", "saxum": "Камень", "victus": "Жизнь",
		"tempestas": "Погода", "gelum": "Холод", "vitreus": "Кристалл", "mortuus": "Смерть", "volatus": "Полет",
		"tenebrae": "Тьма", "spiritus": "Душа", "sano": "Исцеление", "iter": "Путешествие", "venenum": "Яд",
		"alienis": "Чуждое", "praecantatio": "Магия", "auram": "Аура", "vitium": "Заражение", "granum": "Семя",
		"limus": "Слизь", "herba": "Растение", "arbor": "Дерево", "bestia": "Зверь", "corpus": "Плоть", "exanimis": "Нежить",
		"cognitio": "Разум", "sensus": "Чувства", "humanus": "Человек", "messis": "Урожай", "meto": "Жатва", "metallum": "Металл",
		"perfodio": "Шахта / Добыча", "instrumentum": "Инструмент", "telum": "Оружие", "tutamen": "Броня / Защита", "fames": "Голод",
		"lucrum": "Жадность", "fabrico": "Ремесло", "pannus": "Ткань", "machina": "Механизм", "vinculum": "Ловушка / Оковы",
		"permutatio": "Обмен", "ira": "Гнев", "infernus": "Ад / Преисподняя", "gula": "Обжорство", "invidia": "Зависть",
		"desidia": "Лень", "superbia": "Гордыня", "luxuria": "Похоть", "tempus": "Время", "electrum": "Электричество",
		"magneto": "Магнетизм", "nebrisum": "Нечестность", "radio": "Радиация", "stronito": "Глупость",
		"tab_research": "Помощник исследований", "tab_node": "Узел ауры", "tab_reverse": "Target CV",
		"app_title": "Помощник исследований Thaumcraft 4", "label_from": "Откуда", "label_to": "Куда",
		"label_steps": "Как минимум через", "btn_go": "Искать!", "node_title": "Калькулятор узлов ауры",
		"node_desc": "Добавьте аспекты в узел для расчета выхода Energized CV",
		"label_select_aspect": "Выберите аспект", "label_amount": "Количество", "btn_add_aspect": "Добавить аспект",
		"mod_normal": "Обычный", "mod_bright": "Яркий (+20%)", "mod_pale": "Тусклый (-20%)", "mod_fading": "Увядающий (-50%)",
		"node_output": "Выход энергии (CV/t)", "config_title": "Конфигурация", "btn_sel_all": "Выбрать все",
		"btn_desel_all": "Убрать все", "avail_label": "Доступные аспекты", "help_title": "Помощь",
		"reverse_title": "Калькулятор Target CV", "reverse_desc": "Введите желаемое количество Energized CV/t для поиска самых эффективных составных аспектов.",
		"btn_calc_reverse": "Рассчитать",
		"reverse_greedy": "Жадная комбинация (наименьшее число аспектов)", "reverse_greedy_desc": "Эта комбинация содержит все нужные вам типы энергии. Вы можете использовать её для 'кормления' Голодного Узла Ауры.",
		"reverse_single": "Лучшие одиночные аспекты", "reverse_single_desc": "Каждый из этих аспектов поглощает в себе всё, что вам нужно.",
		"reverse_none": "Нет ни одного аспекта, который бы содержал всё сразу.", "reverse_error_zero": "Пожалуйста, введите хотя бы одно значение больше 0.",
		"tab_lexicon": "Энциклопедия Аспектов", "lexicon_desc": "Нажмите на любой аспект, чтобы увидеть его рецепт и применение.",
		"tab_hungry": "Голодный Узел", "hungry_desc": "Симулятор кормления Голодного Узла. Введите количество каждого типа эссенции, чтобы рассчитать прирост CV.",
		"hungry_node_mod_label": "Модификатор узла:", "btn_hungry_calc": "Симулировать кормление",
		"search_shortest": "Кратчайший путь", "search_cheapest": "Дешёвый путь (избегает высоких тиров)",
		"help_desc": "Этот скрипт поможет вам с изучением Thaumcraft 4.x. Если у вас есть записка с двумя аспектами, и вы не знаете как их соединить, этот инструмент для вас.",
		"help_li_1": "Выберите <strong>аспект, от которого</strong> вам нужно <strong>начать</strong>.",
		"help_li_2": "Выберите <strong>аспект</strong> <strong>к которому вы идете</strong>.",
		"help_li_3": "Кроме того, вы можете <strong>указать минимальное количество шагов</strong>, то есть количество пустых клеток между двумя аспектами в вашей заметке.",
		"help_li_4": "<strong>Нажмите Искать!</strong>",
		"help_desc2": "Если вам не нравится полученный путь из-за того, что у вас еще нет доступа к этим аспектам или они слишком редкие, просто отключите эти аспекты в разделе конфигурации. Нажатие на аспект в результатах поиска запустит поиск снова, но с временно отключенным аспектом.",
		"info_title_research": "Как использовать Помощник Исследований",
		"info_body_research": "<p>Эта вкладка помогает соединить два аспекта в записках исследований Таумономикона.</p><ul><li>Выберите начальный аспект (<strong>Откуда</strong>) и конечный (<strong>Куда</strong>).</li><li>Укажите минимальное количество шагов (пустых шестиугольников между ними).</li><li>Выберите тип поиска (Кратчайший использует меньше шагов, Дешёвый избегает сложных аспектов вроде Humanus).</li><li>Нажмите <strong>Искать!</strong> чтобы увидеть, какие аспекты нужно поставить.</li></ul><p>Если у вас нет какого-то аспекта из результата, вы можете отключить его в разделе Конфигурации ниже.</p>",
		"info_title_node": "Как использовать Калькулятор Узлов Ауры",
		"info_body_node": "<p>Эта вкладка рассчитывает итоговый выход энергии (CV/t) при возбуждении узла ауры.</p><ul><li>Выберите аспект из списка и укажите его количество в узле.</li><li>Нажмите <strong>Добавить аспект</strong>.</li><li>Выберите модификатор узла (Яркий, Тусклый, Увядающий), если он есть.</li><li>Визуализатор покажет точный выход CV/t для каждого из 6 первичных аспектов после возбуждения узла.</li></ul>",
		"info_title_reverse": "Как использовать Калькулятор Target CV",
		"info_body_reverse": "<p>Эта вкладка помогает найти идеальные составные аспекты, чтобы получить нужное количество энергии от возбуждённого узла.</p><ul><li>Введите желаемое количество CV для каждого из 6 первичных аспектов.</li><li>Нажмите <strong>Рассчитать</strong> чтобы увидеть самые эффективные составные аспекты, содержащие эти первоосновы.</li><li>Используйте <strong>Жадную комбинацию</strong> (Greedy Combo), если хотите скормить несколько разных аспектов.</li><li>Используйте <strong>Лучшие одиночные</strong> (Best Single), если ищете один супер-аспект, содержащий всё сразу.</li></ul>",
		"info_title_lexicon": "Как использовать Энциклопедию Аспектов",
		"info_body_lexicon": "<p>Энциклопедия — это интерактивный справочник по всем аспектам Thaumcraft 4.</p><ul><li>Используйте строку поиска, чтобы мгновенно найти любой аспект по имени.</li><li>Нажмите на иконку любого аспекта, чтобы открыть его детальную панель.</li><li>Детальная панель показывает точный <strong>Рецепт</strong> (какие два аспекта нужно смешать).</li><li>Она также показывает <strong>Первичные аспекты</strong> (из чего он состоит в базе) и в каких аспектах более высокого уровня он <strong>Используется</strong>.</li></ul>",
		"info_title_hungry": "Как использовать Симулятор Голодного Узла",
		"info_body_hungry": "<p>Эта вкладка симулирует процесс кормления Голодного Узла перед его возбуждением.</p><ul><li>Введите общее количество эссенции или предметов (в единицах базовых аспектов), которые вы планируете скормить узлу.</li><li>Здесь вводится ИМЕННО КОЛИЧЕСТВО СКОРМЛЕННЫХ АСПЕКТОВ, а не базовый размер узла.</li><li>Выберите Модификатор Узла (Яркий даёт +20%).</li><li>Нажмите <strong>Симулировать кормление</strong> чтобы мгновенно рассчитать итоговый выход Energized CV/t по формуле квадратного корня.</li></ul>"
	}
};

var savedLang = null;
try { savedLang = localStorage.getItem('tc4_lang'); } catch (e) { }
var currentLang = savedLang || ((navigator.language || navigator.userLanguage).startsWith('ru') ? 'ru' : 'en');

function getAspectName(aspectId) {
	var tcId = translate[aspectId];
	if (!tcId) tcId = aspectId;
	var name = lang_dictionary[currentLang][tcId];
	return name ? name : tcId;
}

function setLanguage(lang) {
	currentLang = lang;
	try { localStorage.setItem('tc4_lang', lang); } catch (e) { }
	$('[data-translate]').each(function () {
		var key = $(this).data('translate');
		if (lang_dictionary[currentLang] && lang_dictionary[currentLang][key]) {
			$(this).html(lang_dictionary[currentLang][key]);
		}
	});
	$('.lang-btn').removeClass('active');
	$('.lang-btn[data-lang="' + lang + '"]').addClass('active');
	if (typeof tcresearch !== 'undefined' && tcresearch.refreshDropdowns) {
		tcresearch.refreshDropdowns();
	}
}

$(document).ready(function () {
	$('[data-translate]').each(function () {
		var key = $(this).data('translate');
		if (lang_dictionary[currentLang] && lang_dictionary[currentLang][key]) {
			$(this).html(lang_dictionary[currentLang][key]);
		}
	});
	$('.lang-btn[data-lang="' + currentLang + '"]').addClass('active');
	$(document).on('click', '.lang-btn', function () {
		setLanguage($(this).data('lang'));
	});
});
