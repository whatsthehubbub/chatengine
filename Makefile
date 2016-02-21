test: testapp testconv testconv2

testapp:
	jshint js/app.js

testconv:
	jshint js/conversation.js

testconv2:
	jshint js/conversation2.js

run:
	python -m SimpleHTTPServer