var AssistantCollection = new Class({
	initialize: function(defaultEl) {
		this.defaultAssistant = new DefaultAssistant(defaultEl);
		this.active = this.defaultAssistant;
		this.active.setActive(true);
		this.assistants = [];
	},
	
	add: function(assisted, text) {
		var assistant = new Assistant(this, assisted, text);
		this.assistants.push(assistant);
		return assistant;
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
	
	isValid: function() {
		var valid = true;
		
		this.assistants.each(function(assistant) {
			valid &= assistant.isValid();
		}).bind(this);
		
		return valid;
	}
});