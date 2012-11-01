var Assistant = new Class({
	setActive: function(name) {
		if(this.active != name) {
			// Hide old
			$(this.active).removeClass('active');
			
			// Show new
			if(name != null) {
				this.defaultMsg.addClass('active');
			}
			else {
				this.defaultMsg.addClass('active');
			}
			
			this.active = name;
		}
	},
	
	setErrors: function(el, msgArray) {
		var dd = el.getParent('dd');
		var dt = dd.getPrevious('dt');
		var ul = el.getChildren('ul')[0];
		
		
		// Paint everything error-red
		if((msgArray != null) && (msgArray.length > 0)) {
			dt.addClass('error');
			dd.addClass('error');
			el.addClass('error');
		}
		else {
			dt.removeClass('error');
			dd.removeClass('error');
			el.removeClass('error');
		}
		
		
		// Refill the error list
		ul.getChildren().destroy().empty();
		msgArray.each(function(msg) {
			ul.adopt(new Element('li', {text: msg}));
		});
	}
});