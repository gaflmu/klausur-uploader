var MyList = new Class({
	initialize: function(name) {
		this.name = name;
		
		this.lastValue = null;
		this.currentKey = null;
		
		this.collection = null;
		this.previous = null;
		this.next = null;
		
		this.focused = false;
		
		this.build($(name + '-container'));
		this.setOpen(false);
		this.update();
	},
	
	
	// ## List #################################################################
	setPrevious: function(previousList) {
		this.previous = previousList;
		return previousList;
	},
	
	getPrevious: function() {
		return this.previous;
	},
	
	hasPrevious: function() {
		return this.previous != null;
	},
	
	setNext: function(nextList) {
		this.next = nextList;
		return nextList;
	},
	
	getNext: function() {
		return this.next;
	},
	
	hasNext: function() {
		return this.next != null;
	},
	
	
	// ## Open/Close ###########################################################
	setOpen: function(open) {
		this.open = open;
		
		if(open) {
			this.container.removeClass('closed');
			this.container.addClass('open');
			this.elSelect.erase('readonly');
		}
		else {
			this.container.removeClass('open');
			this.container.addClass('closed');
			this.elSelect.set('readonly', 'readonly');
		}
	},
	
	setHeight: function(height) {
		this.elSelect.setStyle('height', height);
	},
	
	openNext: function() {
		if(this.hasNext()) {
			this.collection.open(this.next);
		}
	},
	
	
	// ## Data #################################################################
	dataProvider: function() {
		var query = new Object;
		
		for(var cur = this.getPrevious(); cur != null; cur = cur.getPrevious()) {
			if(cur.getCurrentKey() == null) {
				return null;
			}
			query[cur.name] = cur.getCurrentKey();
		}
		console.log(query);
		
		var jsonRequest = new Request.JSON({
			url: 'lister.php',
			method: 'post',
			onSuccess: function(list) {
				this.setData(list);
			}.bind(this)
		}).post(query);
		
		return [];
	},
	
	setData: function(data) {
		this.data = data;
		
		// Remove old list entries
		this.elSelect.getChildren().destroy().empty();
		this.currentKey = null;
		
		if(data != null) {
			// Add new list entries
			var foundOldValue = false;
			data.each(function(entrie) {
				// Create the <option> element
				var option = new Element('option', {
					'value': entrie.k,
					'text': entrie.v
				});
				
				
				option.addEvent('click', this.handleMouseClick.bind(this));
				
				// Append the <option> element to the <select> element
				this.elSelect.adopt(option);
				
				// Select an previously selected entrie
				if(entrie.v == this.lastValue) {
					foundOldValue = true;
					option.set('selected', 'selected');
				}
			}, this);
			
			// Previously selected element was not found:
			// Select the first one, if any
			if((foundOldValue == false) && (data.length > 0)) {
				this.elSelect.getChildren()[0].set('selected', 'selected');
			}
			
			// Set style: List can now get focus
			this.elSelect.erase('disabled');
		}
		else {
			// Set style: List can't even get focus
			this.elSelect.set('disabled', 'disabled');
			this.elSelection.set('text', '');
		}
	},
	
	hasData: function() {
		return this.data != null;
	},
	
	update: function() {
		this.setData(this.dataProvider());
		
		this.updateNext();
	},
	
	updateNext: function() {
		if(this.hasNext()) {
			this.getNext().update();
		}
	},
	
	getCurrentKey: function() {
		return this.currentKey;
	},
	
	
	// ## Events ###############################################################
	done: function(focusNext) {
		// Get the new value
		var newKey = this.elSelect.get('value');
		var newValue  = this.elSelect.getSelected().get('text');
		
		// Has the user selected something new
		if(newKey != this.key) {
			this.elSelection.set('text', newValue);
			this.lastValue = newKey;
			this.currentKey = newKey;
			this.updateNext();
		}
		
		// Focus next if needed (tab was not pressed)
		if(focusNext) {
			this.activateNext();
		}
	},
	
	// ## Focus ################################################################
	/* Huge workaround to destingluish between clicks on labels and actual
	 * clicks on the list
	 */
	hasFocus: function() {
		return this.focused;
	},
	
	handleGotFocus: function (a) {
		console.log(this.name + ": Got focus");
		
		this.focused = true;
		
		this.collection.open(this);
		this.assistant.activate();
	},
	
	handleLostFocus: function (a) {
		console.log(this.name + ": Lost focus");
		
		this.focused = false;
		
		this.assistant.deactivate();
	},
	
	handleMouseClick: function (a) {
		console.log(this.name + ": Mouse clicked");
		
		this.done(true);
	},
	
	handleKeyPressed: function(event) {
		console.log(this.name + ": Key pressed ("+event.key+" <"+event.code+">)");
		
		if(event.key == 'space') {
			this.done(true);
		}
		else if(event.key == 'tab') {
			this.done(false);
		}
	},
	
	handleSelectionClick: function() {
		this.elSelect.focus();
	},
	
	
	// ## Collection ###########################################################
	setCollection: function(collection) {
		this.collection = collection;
	},
	
	getCollection: function() {
		return this.collection;
	},
	
	
	// ## Build ################################################################
	build: function(container) {
		this.container = container;
		container.addClass('myList');
		
		this.elSelect = new Element('select', {
			'name'  : this.name,
			'id'    : this.name,
			'size'  : '10',
			'class' : 'deactivated'
		})
		.addEvent('keypress',  this.handleKeyPressed.bind(this))
		.addEvent('focus',     this.handleGotFocus.bind(this))
		.addEvent('blur',      this.handleLostFocus.bind(this));
		container.adopt(this.elSelect);
		
		this.elSelection = new Element('div', {
			'class' : 'selection',
			'for'   : this.name
		})
		.addEvent('click', this.handleSelectionClick.bind(this));
		container.adopt(this.elSelection);
		
		this.assistant = assis.add(this.elSelect, 'Bla');
	},
	
	
	// ## Trash? ###############################################################
	activate: function() {
		this.elSelect.focus();
	},
	
	deavtivate: function() {
	},
	
	clearNext: function() {
		if(this.hasNext()) {
			this.getNext().clear();
		}
	},
	
	activateNext: function() {
		if(this.hasNext()) {
			this.next.activate();
		}
	},
	
	clear: function() {
		// Clear my self
		
		// Clear next
		this.clearNext();
	}
});
