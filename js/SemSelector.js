var SemSelector = new Class({
	initialize: function(inputEl, upEl, downEl) {
		this.inputEl = inputEl;
		this.upEl = upEl;
		this.downEl = downEl;
		
		this.D2 = 0;
		this.D4 = 1;
		this.DD = 2;
		
		this.inputEl.addEvent('blur', this.handleLostFocus.bind(this));
		this.inputEl.addEvent('keypress', this.handleKeyPressed.bind(this));
		
		this.upEl.addEvent('click', this.handleClickUp.bind(this));
		this.downEl.addEvent('click', this.handleClickDown.bind(this));
		
		this.update(new Semester());
		
		this.assistant = assis.add(this.inputEl, 'Bla');
	},
	
	extendYear: function(shortYear) {
		if(shortYear <= Semester.max % 100) {
			return 2000 + shortYear;
		}
		else {
			return 1900 + shortYear;
		}
	},
	
	getDigitType: function(s) {
		var n = Number.toInt(s);
		
		if(s.length == 2) {
			return this.D2;
		}
		else if(s.length == 4 && Semester.isInRange(n)) {
			return this.D4;
		}
		
		return this.DD;
	},
	
	readInput: function(fuzzing) {
		var text = this.inputEl.get('value').toUpperCase();
		var result = new Semester();
		
		// "WS <Number> [-|/|] <Number>"
		var m = text.match(/^\s*WS\s*(\d+)\s*(-|\/|)\s*(\d+)\s*$/);
		if(m) {
			var y1 = Number.toInt(m[1]);
			var y2 = Number.toInt(m[3]);
			
			var y1type = this.getDigitType(m[1]);
			var y2type = this.getDigitType(m[3]);
			
			if((y1type == this.D4 && y2type == this.D4) && (y1 + 1 == y2) ) {
				result.set(y1, true);
				return result;
			}
			else if((y1 + 1) % 100 == y2 % 100) {
				if((y1type == this.D4 && y2type == this.D2)) {
					result.set(y1, true);
					return result;
				}
				else if((y1type == this.D2 && y2type == this.D4)) {
					result.set(y2, true);
					return result;
				}
				else if((y1type == this.D2 && y2type == this.D2)) {
					result.set(this.extendYear(y1), true);
					return result;
				}
			}
		}
		
		// "SS <Number>"
		m = text.match(/^\s*SS\s*(\d+)\s*$/);
		if(m) {
			var y = Number.toInt(m[1]);
			var yDigitType = this.getDigitType(m[1]);
			
			if(yDigitType == this.D4) {
				result.set(y, false);
				return result;
			}
			else if(yDigitType == this.D2) {
				result.set(this.extendYear(y), false);
				return result;
			}
		}
		
		if(fuzzing) {
			return this.fuzz(1, 1)[0];
		}
		else {
			return null;
		}
	},
	
	isValid: function() {
		return this.readInput(false) != null;
	},
	
	fuzz: function(cnt, maxPlausibility) {
		var text = this.inputEl.get('value').toUpperCase();
		
		// ## Find the semester ################################################
		// The occurrences of the keywords "wi", "ws", "ss", "so"
		// "WS", "WiSe", "Winter Semester", 
		//  ^^    ^^      ^^  <-- only "ws" and "wi"
		// "SS", "SoSe", "Sommer Semester"
		//  ^^    ^^      ^^  <-- only "ss" and "so"
		var wsKeyPos = this.findKeywords(text, ['WS', 'WI']);
		var ssKeyPos = this.findKeywords(text, ['SS', 'SO']);
		
		
		// ## Find the year ####################################################
		var suggestions;
		
		if(wsKeyPos >= 0 && ssKeyPos < 0) {
			suggestions = this.fuzzYear(text, true, 1.0);
		}
		else if(wsKeyPos < 0 && ssKeyPos >= 0) {
			suggestions = this.fuzzYear(text, false, 1.0);
		}
		else if(wsKeyPos >= 0 && ssKeyPos >= 0) {
			if(wsKeyPos > ssKeyPos) {
				// SS was fund before WS and is hence more plausible
				suggestions =      this.fuzzYear(text, false, 1.0);
				suggestions.append(this.fuzzYear(text, true,  0.6));
			}
			else {
				// WS was fund before SS and is hence more plausible
				suggestions =      this.fuzzYear(text, true,  1.0);
				suggestions.append(this.fuzzYear(text, false, 0.6));
			}
		}
		else {
			return [new Semester()]; // Now
		}
		
		
		// ## Return the most plausible suggestions ############################
		// Order the suggestions by plausibility
		var ordered = suggestions.sortBy('plausibility');
		
		var result = [];
		var i = ordered.length - 1;
		var accPlausibility = 0;
		
		// Iterate until the maximum number of requested results have been found
		// or the results are enough plausible together.
		var minI = Number.max(ordered.length - cnt, 0);
		while(i >= minI && accPlausibility < maxPlausibility) {
			// Accumulate the plausibility
			accPlausibility += ordered[i].plausibility;
			
			// Fill the result
			result.include(ordered[i].sem);
			
			// Go to the next ordered suggestion
			i--;
		}
		
		return result;
	},
	
	fuzzYear: function(text, ws, fac) {
		var result = [];
		
		// Find each number sting in the text and iterate over them
		var numbers = text.match(/\d+/g);
		for(var i = numbers.length - 1; i >= 0; i--) {
			var year = Number.toInt(numbers[i]);
			var digitType = this.getDigitType(numbers[i]);
			
			if(numbers[i].length == 4 && Semester.isInRange(year)) {
				result.append(this.plausibility(year, ws, 1.0 * fac));
			}
			else if(numbers[i].length == 2) {
				year = this.extendYear(year);
				result.append(this.plausibility(year, ws, 0.9 * fac));
			}
			else if(Semester.isInRange(year)) {
				result.append(this.plausibility(year, ws, 0.9 * fac));
			}
			else if(year < 100) {
				year = this.extendYear(year);
				result.append(this.plausibility(year, ws, 0.7 * fac));
			}
		}
		
		return result;
	},
	
	plausibility: function(year, ws, fac) {
		var suggestion1 = new Object();
		
		suggestion1.sem = new Semester();
		suggestion1.sem.set(year, ws);
		
		// Calculate the delta to now.
		var d = Number.abs(Semester.nowYear - year);
		
		// The original formula is as folloing
		//                    1
		//      1  -  -----------------
		//             1 + (d/15)^(-2)
		// After 15 Years from now, the Propability is only 50% that the number
		// is the year of the test. Hence 15^2 is 255, the simplified formula
		// is as following.
		//          255
		//      -----------
		//       d^2 + 255
		// Extended with a factor for weighting the number representation in
		// the input text. The function is simply:
		suggestion1.plausibility = (255 * fac) / (d*d + 255);
		
		if(ws) {
			var suggestion2 = new Object();
			suggestion2.sem          = suggestion1.sem.clone().down().down();
			suggestion2.plausibility = suggestion1.plausibility;
			
			return [suggestion1, suggestion2];
		}
		else {
			return [suggestion1];
		}
	},
	
	findKeywords: function(s, keywords) {
		var lastPos = Number.POSITIVE_INFINITY;
		
		keywords.each(function(keyword) {
			var pos = s.indexOf(keyword);
			if(pos >= 0 && pos < lastPos) {
				lastPos = pos;
			}
		});
		
		if(lastPos != Number.POSITIVE_INFINITY) {
			return lastPos;
		}
		else {
			return -1;
		}
	},
	
	
	// ## Writing new values ###################################################
	update: function(semester) {
		this.inputEl.set('value', semester.toString());
	},
	
	move: function(direction) {
		// Set the text of the input box to a string created as followed
		// * Read the current value and try fuzzing if needed
		// * Move the result in the given direction (this ensures the value
		//   stays in range)
		this.update(this.readInput(true).move(direction));
	},
	
	up: function() {
		this.move(1);
	},
	
	down: function() {
		this.move(-1);
	},
	
	
	
	// ## Event handler ########################################################
	handleClickUp: function() {
		this.up();
	},
	
	handleClickDown: function() {
		this.down();
	},
	
	handleKeyPressed: function(event) {
		if(event.key == 'up') {
			this.up();
		}
		else if(event.key == 'down') {
			this.down();
		}
	},
	
	handleLostFocus: function() {
		if(this.isValid() == false) {
			var suggestions = this.fuzz(3, 1);
			var msg = "Ung&uuml;ltiges Semester Format, meintest du vieleicht"
			
			for(var i = suggestions.length - 1; i >= 0; i--) {
				msg += " <a href=\"javascript:$('" + this.inputEl.id + "').set('value', '" + suggestions[i].toString() + "'); void(0);\">" + suggestions[i].toString() + "</a>";
			}
			msg += ".";
			
			this.assistant.setErrors([msg]);
		}
		else {
			this.assistant.setErrors([]);
		}
	}
});


