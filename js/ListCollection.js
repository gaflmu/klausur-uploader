var ListCollection = new Class({
	initialize: function(maxHeight) {
		this.maxHeight = maxHeight;
		this.heightDelta = 0;
		this.openList = null;
		this.first = null;
		this.last = null;
	},
	
	// ## List #################################################################
	addLast: function(list) {
		var firstEntrie = (this.last == null);
		
		if(firstEntrie == false) {
			this.last.setNext(list);
		}
		
		list.setPrevious(this.last);
		list.setNext(null);
		list.setCollection(this);
		
		this.last = list;
		if(firstEntrie == true) {
			this.first = list;
			this.open(list);
		}
		
		return list;
	},
	
	addFirst: function(list) {
		var firstEntrie = (this.last == null);
		
		if(firstEntrie == false) {
			this.first.setPrevious(list);
		}
		
		list.setPrevious(null);
		list.setNext(this.first);
		list.setCollection(this);
		
		this.first = list;
		if(firstEntrie == true) {
			this.last = list;
			this.open(list);
		}
		
		return list;
	},
	
	getNth: function(i) {
		var cur = null;
		
		// Find the nth list from the first one (i >= 0)
		if(i >= 0)
			for(cur = this.first; i > 0 && cur != null; i--)
				cur = cur.getNext();
		
		// Find the nth list from the last one (i < 0)
		else
			for(cur = this.last; i < 0 && cur != null; i++)
				cur = cur.getPrevious();
		
		return cur;
	},
	
	getFirst: function() {
		return this.first;
	},
	
	getLast: function() {
		return this.last;
	},
	
	size: function() {
		var i = 0;
		
		for(var cur = this.first; cur != null; cur = cur.getNext())
			i++;
		
		return i;
	},
	
	// ## Height ###############################################################
	setMaxHeight: function(maxHeight) {
		this.maxHeight = maxHeight;
		this.updateHeight();
	},
	
	getMaxHeight: function() {
		return this.maxHeight;
	},
	
	reserveHeight: function(delta) {
		this.heightDelta += delta;
		this.updateHeight();
	},
	
	freeHeight: function(delta) {
		this.heightDelta -= delta;
		this.updateHeight();
	},
	
	getHeightDelta: function() {
		return this.heightDelta;
	},
	
	getListHeight: function() {
		return this.maxHeight - this.heightDelta;
	},
	
	updateHeight: function() {
		if(this.openList != null) {
			this.openList.setHeight(this.getListHeight());
		}
	},
	
	// ## Open #################################################################
	open: function(list) {
		if((this.openList != list) && list.hasData()) {
			// Set the height of the new open list before it is shown
			list.setHeight(this.getListHeight());
			
			// Close the old open list, if any
			if(this.openList != null) {
				this.openList.setOpen(false);
			}
			
			// Open the new open list
			list.setOpen(true);
			
			// Save the new open list as the current open list
			this.openList = list;
		}
	}
});
