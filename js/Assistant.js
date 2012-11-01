var Assistant = new Class({
	setActive(name) {
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
	
	setErrors: function(name, msgArray) {
		// Find dt and el ...
		
		
		
		
		if((msgArray != null) && (msgArray.lngth > 0)) {
			dt.addClass('error');
			el.addClass('error');
		}
		else {
			dt.removeClass('error');
			el.removeClass('error');
		}
		
		
		// Find ul
		ul.getChildren().destroy().empty();
		msgArray.each(function(msg)) {
			ul.addopt(new Element('li', {text: msg})));
		});
	}
});