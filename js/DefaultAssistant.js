var DefaultAssistant = new Class({
	initialize: function(el) {
		this.el = el;
	},
	
	setActive: function(active) {
		if(active) {
			this.el.addClass('active');
		}
		else {
			this.el.removeClass('active');
		}
	},
});