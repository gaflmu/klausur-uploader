var Assistant = new Class({
	initialize: function(collection, assisted, text) {
		this.collection = collection;
		this.assisted = assisted;
		this.dd = this.assisted.getParent('dd');
		this.dt = this.dd.getPrevious('dt');
		this.ul = new Element('ul', {class: 'errors'});
		this.el = new Element('div', {class: 'assistant'})
		.set('html', text);
		
		this.ul.inject(this.el, 'top');
		this.el.inject(assisted, 'after');
	},
	
	setActive: function(active) {
		if(active) {
			this.el.addClass('active');
		}
		else {
			this.el.removeClass('active');
		}
	},
	
	activate: function(force) {
		if(force === undefined || force) {
			var force = true;
		}
		
		this.collection.requestActivation(this, force);
	},
	
	deactivate: function() {
		this.collection.requestActivation(null, true);
	},
	
	setErrors: function(msgArray) {
		// Paint everything error-red
		if((msgArray != null) && (msgArray.length > 0)) {
			this.dt.addClass('error');
			this.dd.addClass('error');
			this.el.addClass('error');
		}
		else {
			this.dt.removeClass('error');
			this.dd.removeClass('error');
			this.el.removeClass('error');
		}
		
		
		// Refill the error list
		this.ul.getChildren().destroy().empty();
		msgArray.each(function(msg) {
			this.ul.adopt(new Element('li', {html: msg}));
		}, this);
		
		// Be an attention whore
		this.activate(false);
	}
});