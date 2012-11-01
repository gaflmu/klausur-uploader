
var lists = new ListCollection(100);
lists.addLast(new MyList('subject'));
lists.addLast(new MyList('degree'));
lists.addLast(new MyList('lecture'));
lists.addLast(new MyList('type'));
lists.addLast(new MyList('subtype'));
lists.addLast(new MyList('prof'));

//lists.getNth(0).update();

var semSelector = new SemSelector($('year'), $('year-up'), $('year-down'));

var assi = new Assistant();
assi.setErrors($('foo'), ['foo', 'bar']);
