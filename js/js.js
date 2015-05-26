var assis = new AssistantCollection($('defaultassistant'));

var lists = new ListCollection(100);
lists.addLast(new MyList('subject'));
lists.addLast(new MyList('degree'));
lists.addLast(new MyList('lecture'));
lists.addLast(new MyList('type'));
lists.addLast(new MyList('subtype'));
lists.addLast(new MyList('prof'));

//lists.getNth(0).update();

var semSelector = new SemSelector($('year'), $('year-up'), $('year-down'));

var assi = assis.add($('year'), '<p>Das Semester aus dem die Dokumente Stammen.</p><p>Die Angabe des Wintersemesters von 2010 auf 2011 erfolgt zum Beispiel als <code>WS 2010/11</code> und für das Sommer Semster 2012 als <code>SS 2012</code>. Du kannst aber auch die Pfeilkn&ouml;pfe oder die Pfeiltasten Verwenden um in das n&auml;chste bzw. vorherige Semester zu gehen.</p>');
var assi = assis.add($('comment'), '<p>Solltest du weitere Anmelkungen zu den Dokumenten haben oder die obrigen Angaben nicht genau zutreffen, so kannst du uns dies in einem Kommentar hinterlassen.</p>');
var assi = assis.add($('mail'), '<p>Deine E-Mail Addresse kannst du angeben, damit wir dich bei r&uuml;ckfragen erreichen k&ouml;nnen. Deine E-Mail Addresse wird <em>nicht ver&ouml;ffentlicht</em>.</p>');
//assi.setErrors(['foo', 'bar']);

function doSend() {
	if(assis.isValid() == false) {
		alert("Es gibt noch fehler");
	}
}