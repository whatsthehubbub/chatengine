Run with the command: ``make run`` and go to http://localhost:8000/ for a sample conversation.

Built with [Zurb Foundation](http://foundation.zurb.com).

For local development we recommend using [CodeKit](http://incident57.com/codekit/).

# Documentation

We use a fake JSON file as our conversation. You can find and edit this file in: js/conversation.js

The file contains a conversation object with nodes indexed by a string (in our case numbers). A node can contain a bunch of stuff:

* "statement" (required) what our bot says. This can be a string, a array of strings or a function (with context) that returns an array of strings.
* "options" an array of things you can do. Each option contains a choice that the user can select (and then also say) and a consequence that is the next node we move to.
* "input" replaces options and gives the user an input field. What the user types is stored in the context under name and we move then to consequence.
* "sideeffect" a function that is executed at the start of the node. Mostly used to set stuff in the context to refer back to later.