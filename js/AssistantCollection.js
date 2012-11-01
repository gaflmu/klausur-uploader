var AssistantCollection = new Class({
	initialize: function(defaultEl) {
		this.defaultAssistant = new DefaultAssistant(defaultEl);
		this.active = this.defaultAssistant;
		this.active.setActive(true);
	},
	
	add: function(assisted, text) {
		return new Assistant(this, assisted, text);
	},
	
	requestActivation: function(assistant, force) {
		if(force == true || this.active == this.defaultAssistant) {
			if(assistant == null) {
				assistant = this.defaultAssistant;
			}
			
			if(this.active != assistant) {
				this.active.setActive(false);
				this.active = assistant;
				this.active.setActive(true);
			}
		}
	},
});