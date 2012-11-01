var Semester = new Class({
	initialize: function() {
		this.now();
	},
	
	set: function(year, ws) {
		this.year = year;
		this.ws = ws;
		return this;
	},
	
	setYear: function(year) {
		this.year = year;
		return this;
	},
	
	getYear: function() {
		return this.year;
	},
	
	setWs: function(ws) {
		this.ws = ws;
		return this;
	},
	
	getWs: function() {
		return this.ws;
	},
	
	clone: function() {
		var clone = new Semester();
		clone.set(this.year, this.ws);
		
		return clone;
	},
	
	up: function() {
		return this.move(Semester.UP);
	},
	
	down: function() {
		return this.move(Semester.DOWN);
	},
	
	move: function(direction) {
		if(this.ws == (direction == Semester.UP)) {
			this.year += direction;
		}
		
		this.fitRange();
		
		this.ws = !this.ws;
		return this;
	},
	
	twoDigits: function(n) {
		return ('0' + (n % 100)).slice (-2);
	},
	
	toString: function() {
		var text = '';
		
		if(this.ws) {
			text += 'WS ';
			text += this.year; // This is longer but clearer!
			//text += this.twoDigits(this.year);
			text += '/';
			text += this.twoDigits(this.year + 1);
		}
		else {
			text += 'SS ';
			text += this.year;
		}
		
		return text;
	},
	
	fitRange: function() {
		if(this.year < Semester.min) {
			this.year = Semester.min;
		}
		else if(this.year > Semester.max) {
			this.year = Semester.max;
		}
		
		return this;
	},
	
	
	isValid: function() {
		return Semester.isInRange(this.year);
	},
	
	now: function() {
		if(Semester.nowDOY < 10) {
			this.ws = true;
			this.year = Semester.nowYear - 1;
		}
		else if(Semester.nowDOY < 30*6) {
			this.ws = false;
			this.year = Semester.nowYear;
		}
		else {
			this.ws = true;
			this.year = Semester.nowYear;
		}
		
		return this;
	},
});

var now = new Date();
Semester.nowDOY  = now.get('dayofyear');
Semester.nowYear = now.get('year');

Semester.max = Semester.nowYear;
Semester.min = Semester.nowYear - 100;

Semester.UP = 1;
Semester.DOWN = -1;

Semester.isInRange = function(year) {
	return year >= Semester.min && year <= Semester.max;
};


