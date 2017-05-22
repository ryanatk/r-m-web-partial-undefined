'use strict';

var defaults = require('lodash/defaults');
var toArray = require('lodash/toArray');
var isFunction = require('lodash/isFunction');

/**
 * Determines whether the element has a parent node with a specific ID.
 * @param  {HTMLElement} e - An HTML element
 * @param  {string} id - The id of the element
 * @return {Boolean} Whether the element has a parent with a specific ID
 */
function hasParent(e, id) {
	if (!e) return false;
	var el = e.target||e.srcElement||e||false;
	while (el && el.id != id) {
		el = el.parentNode||false;
	}
	return (el!==false);
}

/**
 * Returns the depth of the element "e" relative to element with an ID. Only
 * takes into consideration a className containing the waypoint.
 * @param  {HTMLElement} e - An HTML element
 * @param  {string} id - The id of the element
 * @param  {string} waypoint - CSS className
 * @param  {number} cnt - Counter used for the depth
 * @return {number} The depth belonging to the element
 */
function getLevelDepth(e, id, waypoint, cnt) {
	cnt = cnt || 0;
	if (e.id.indexOf(id) >= 0) return cnt;
	if (e.classList.contains(waypoint)) {
		++cnt;
	}
	return e.parentNode && getLevelDepth(e.parentNode, id, waypoint, cnt);
}

// returns the closest element to 'e' that has class "classname"
function closest(e, classname) {
	if (e.classList.contains(classname)) {
		return e;
	}
	return e.parentNode && closest(e.parentNode, classname);
}

module.exports = SiteMenu;

/**
 * Creates an instance of a SiteMenu.
 * @constructor
 * @param {HTMLElement} el - The element containing the menu
 * @param {HTMLElement} trigger - The element that opens the menu
 * @param {HTMLElement} wrapper The parent elemnt wrapping the menu
 * @param {Object} options - A slew of options
 * @param {string} [options.wrapperOpenClassName='fs-site-menu--pushed'] - The className applied to the menu
 * element when the menu has been opened
 * @param {string} [options.overlapContainerClassName='fs-site-menu__container--overlap'] - The className
 * applied to the menu element.
 * @param {string} [options.levelClassName='fs-site-menu__level'] - The className used to identify the levels.
 * @param {string} [options.overlayClassName='fs-site-menu__level--overlay'] - The className used to represent
 * what is behind the current level.
 * @param {string} [options.activeLevelClassName='fs-site-menu__level--active'] - The className applied to a
 * level when it is active or visible.
 * @param {string} [options.levelDataAttribute='level'] - The name of the data attribute with the level number
 */
function SiteMenu(el, trigger, wrapper, options) {
	this.el = el;
	this.trigger = trigger;
	this.wrapper = wrapper;
	this.options = defaults(options, SiteMenu.DEFAULTS);
	this.normalizeOptions();

	this.open = false;
	this.level = 0;
	this.levels = toArray(this.el.querySelectorAll('.' + this.options.levelClassName));
	this.menuItems = toArray(this.el.querySelectorAll('li'));
	this.activeMenu = null;

	this.eventtype = 'click';
	this.el.classList.add(this.options.overlapContainerClassName);
	this.markItemByLevel();
	this.bindEvents();
}

/**
 * Contains the defaults used onto the constructor.
 * @type {Object}
 */
SiteMenu.DEFAULTS = {
	menuSectionTemplate: require('../../../lib/templates/section-menu.html'),
	animationOffset: 300,
	wrapperOpenClassName: 'fs-site-menu--pushed',
	overlapContainerClassName: 'fs-site-menu__container--overlap',
	levelClassName: 'fs-site-menu__level',
	openClassName: 'fs-site-menu__level--open',
	overlayClassName: 'fs-site-menu__level--overlay',
	activeLevelClassName: 'fs-site-menu__level--active',
	levelDataAttribute: 'level',
	resetOffset: function() {
		return this.el.offsetWidth + 'px';
	}
};

/**
 * Opens the menu. When provided the subLevel, will open to that level.
 * @param  {HTMLElement} subLevel - The element containing the sub level
 */
SiteMenu.prototype.openMenu = function(subLevel) {
	// increment level depth
	++this.level;

	// move the main wrapper
	var translateVal = this.el.offsetWidth;

	this.setTransform('translate3d(' + translateVal + 'px,0,0)');

	if (subLevel) {
		// reset transform for sublevel
		this.setTransform('', subLevel);
		// need to reset the translate value for the level menus that have the same level depth and are not open
		this.levels.forEach(function(levelEl) {
			if (levelEl != subLevel && !levelEl.classList.contains(this.options.openClassName)) {
				this.setTransform('translate3d(' + this.options.animationOffset + ',0,0) translate3d(0,0,0)', levelEl);
			}
		}, this);
	}
	// add class mp-pushed to main wrapper if opening the first time
	if (this.level === 1) {
		this.wrapper.classList.add(this.options.wrapperOpenClassName);
		this.open = true;
	}

	if (this.activeMenu) {
		this.activeMenu.classList.remove(this.options.activeLevelClassName);
	}

	this.activeMenu = subLevel || this.levels[0];
	this.activeMenu.classList.add(this.options.openClassName);
	this.activeMenu.classList.add(this.options.activeLevelClassName);
};

/**
 * Resets or wipes out an existance of the menu.
 */
SiteMenu.prototype.resetMenu = function() {
	this.setTransform('translate3d(0,0,0)');
	this.level = 0;
	this.wrapper.classList.remove(this.options.wrapperOpenClassName);
	this.toggleLevels();
	this.open = false;
};

/**
 * Closes the current menu.
 */
SiteMenu.prototype.closeMenu = function() {
	var translateVal = this.el.offsetWidth;
	this.setTransform('translate3d(' + translateVal + 'px,0,0)');
	this.toggleLevels();
};

/**
 * Applies a css transform.
 * @param  {string} val - Contains the value of the transform
 * @param  {HTMLELement} el - The element getting the transform
 */
SiteMenu.prototype.setTransform = function(val, el) {
	el = el || this.wrapper;
	el.style.WebkitTransform = val;
	el.style.MozTransform = val;
	el.style.transform = val;
};

SiteMenu.prototype.toggleLevels = function() {
	setTimeout(function() {
		this.levels.forEach(function(levelEl) {
			var level = this.getLevel(levelEl);

			if (level >= this.level + 1) {
				levelEl.classList.remove(this.options.openClassName);
				levelEl.classList.remove(this.options.overlayClassName);
			} else if (Number(level) == this.level) {
				levelEl.classList.remove(this.options.overlayClassName);
				this.applyActiveMenu(levelEl);
			}
		}, this);
	}.bind(this), this.options.animationOffset);
};

/**
 * Binds all events.
 */
SiteMenu.prototype.bindEvents = function() {
	this.trigger.addEventListener(this.eventtype, this.toggleMenuFromTrigger.bind(this));

	document.body.addEventListener(this.eventtype, this.closeMenuFromOutside.bind(this));

	this.menuItems.forEach(function(el) {
		var subLevel = el.querySelector('.' + this.options.levelClassName);
		if (subLevel) {
			el.querySelector('a').addEventListener(this.eventtype, this.navigateMenuTransition.bind(this, el, subLevel));
		}
	}, this);

	this.el.addEventListener(this.eventtype, this.navigateSectionItem.bind(this));
};

/**
 * Toggles the menu based on the state of the menu.
 * @param  {Event} evt - An event object
 */
SiteMenu.prototype.toggleMenuFromTrigger = function(evt) {
	evt.preventDefault();

	if (this.open) {
		this.resetMenu();
	} else {
		this.openMenu();
	}
};

/**
 * Closes the menu when any of the necessary conditions have been met. For example, when traversing of the DOM,
 * no ID containing the menu is found or if the trigger element is not found.
 * @param  {Event} evt - An event object
 */
SiteMenu.prototype.closeMenuFromOutside = function(evt) {
	var target = evt.target;

	if(this.open && !hasParent(target, this.el.id) && !hasParent(target, this.trigger.id)) {
		this.outsideEventHandler(document);
	}
};

/**
 * Simple proxy function that wipes out the menu and remoes the outside event handler.
 * @param  {HTMLELement} el - The element getting the event listener removed.
 */
SiteMenu.prototype.outsideEventHandler = function(el) {
	this.resetMenu();
	el.removeEventListener(this.eventtype, this.outsideEventHandler);
};

/**
 * Event handler used to see if a section menu has been interacted with. If so,
 * it'll handle such things as a valid level selected, demarking the new active
 * menu, and reseting any levels.
 * @param  {Event} evt - An event object
 */
SiteMenu.prototype.navigateSectionItem = function(evt) {
	var target = evt.target;
	var levelEl;
	var level;
	var selectedMenuEl;

	if (target.classList.contains('menu-section__item')) {
		evt.preventDefault();
		levelEl = closest(target, this.options.levelClassName);
		level = this.getLevel(levelEl);

		if (this.level <= level) {
			this.level = target.getAttribute('data-menu-level');
			selectedMenuEl = this.getElFromLevel(levelEl.parentNode);
			this.applyActiveMenu(selectedMenuEl);
			this.resetActiveByEl(selectedMenuEl);
		}
	}
};

/**
 * Determines the section level based on the item selected and if the necessary
 * attributes are present. If they are present, then the section level is
 * returned.
 * @param  {HTMLElement} el - The element that has been selected
 * @return {HTMLElement} The element containing the section level
 */
SiteMenu.prototype.getElFromLevel = function(el) {
	if (el) {
		el = closest(el, this.options.levelClassName)
		while (el) {
			if (el.getAttribute('data-level') === this.level) {
				return el;
			}

			el = closest(el.parentNode, this.options.levelClassName)
		}
	}
};

/**
 * Determines which menus that need reseting and performs reset. A few things to
 * note, it will initially reset the active classes one below the active to give
 * the illusion that is what is closing the menu. A timeout is set afterwards to
 * close the rest. Since the element sit in the DOM by hierarchy, the deferred
 * reseting will not be visible by the user.
 * @param  {HTMLElement} el - The menu which is to be active
 */
SiteMenu.prototype.resetActiveByEl = function(el) {
    var els = toArray(el.querySelectorAll('.' + this.options.openClassName));
    var firstChildEl = els[0];

    firstChildEl.classList.remove(this.options.openClassName);
    firstChildEl.classList.remove(this.options.overlayClassName);

		setTimeout(function() {
			els.forEach(function(levelEl) {
				levelEl.classList.remove(this.options.openClassName);
				levelEl.classList.remove(this.options.overlayClassName);
			}, this);
		}.bind(this), this.options.animationOffset);
};

/**
 * Obtains the data used for populating the sub menu.
 * @param  {HTMLElement} el - The element traversed up to find data
 * @return {array} The data containing the sub menu
 */
SiteMenu.prototype.getSectionMenuData = function(el) {
	var data = [];

	while (el.id !== this.el.id) {
		if (el.classList.contains(this.options.levelClassName)) {
			data.unshift({
				level: this.getLevel(el),
				name: el.querySelector('h2').textContent
			})
		}

		el = el.parentNode;
	}

	return data;
};

/**
 * Responsible for rendering of the dynamic sub menu.
 * @param  {HTMLElement} el - The element selected
 * @param  {HTMLElement} subLevel - The section where the sub menu will be
 * injected
 * @param  {Event} evt - An event tobject
 */
SiteMenu.prototype.navigateMenuTransition = function(el, subLevel, evt) {
	evt.preventDefault();

	var target = evt.target;
	var parentEl = closest(el, this.options.levelClassName);
	var level = this.getLevel(parentEl);
	var sectionMenuDataAttr = 'data-has-section-menu';

	if (this.level <= level) {
		var sectionMenuData = this.getSectionMenuData(target);
		var hasSectionMenu = subLevel.getAttribute(sectionMenuDataAttr);

		if (sectionMenuData && !hasSectionMenu) {
			var output = this.options.menuSectionTemplate({
				items: sectionMenuData
			});

			subLevel.insertAdjacentHTML('afterbegin', output);
			subLevel.setAttribute(sectionMenuDataAttr, true);
		}

		closest(el, this.options.levelClassName).classList.add(this.options.overlayClassName);
		this.openMenu(subLevel);
	}
};

/**
 * Marks an element based on the level it belongs to.
 */
SiteMenu.prototype.markItemByLevel = function() {
	this.levels.forEach(function(el) {
		var anchor;
		var span;

		el.setAttribute('data-' + this.options.levelDataAttribute, getLevelDepth(el, this.el.id, this.options.levelClassName));

		if (el.previousSibling.nodeName === 'A') {
			anchor = el.previousSibling;
		} else if (el.previousSibling.previousSibling && el.previousSibling.previousSibling.nodeName === 'A') {
			anchor = el.previousSibling.previousSibling;
		}

		if (anchor) {
			span = document.createElement('span');
			span.className = 'icon-arrow';
			anchor.appendChild(span);
		}
	}, this);
};

/**
 * Determines what level an element belongs to.
 * @param  {HTMLElement} el - The element in question
 * @return {string} The depth of the level
 */
SiteMenu.prototype.getLevel = function(el) {
	return el.getAttribute('data-' + this.options.levelDataAttribute);
};

/**
 * Denotes the element as being active.
 * @param  {HTMLElement} el - An HTML being examined
 */
SiteMenu.prototype.applyActiveMenu = function(el) {
	if (this.activeMenu) {
		this.activeMenu.classList.remove(this.options.activeLevelClassName);
	}

	this.activeMenu = el;
	setTimeout(function() {
		this.activeMenu.classList.add(this.options.activeLevelClassName);
	}.bind(this), this.options.animationOffset);
};

/**
 * Normalizes any options that need special treatment.
 */
SiteMenu.prototype.normalizeOptions = function() {
	var resetOffset = this.options.resetOffset;
	if (isFunction(resetOffset)) {
		this.options.resetOffset = resetOffset.call(this);
	}
};
