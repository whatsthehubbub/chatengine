var conversation = {
  "1": {
    "statement": ["Hi!", "I'm Carl. 😊 What's your name?"],
    "input": {"name": "name", "consequence": "2"},
  },
  "2": {
    "statement": function(context) {
      return ["Hi " + context.name  + "!"];
    },
    "options": [{
      "choice": "Hey",
      "consequence": "4"
    }]
  },
  "4": {
    "statement": ["Nice to meet you.", "How are you doing?"],
    "options": [{
      "choice": "Fine",
      "consequence": "5.1"
    },{
      "choice": "So so",
      "consequence": "5.2"
    }]
  },
  "5.1": {
    "statement": ["That's great.", "Enjoy yourself. 👍"],
    "options": [{
      "choice": "Thanks",
      "consequence": null
    }],
    sideeffect: function(context) {
      context.feeling = "FINE";
    }
  },
  "5.2": {
    "statement": "Sorry to hear that.",
    "options": [{
      "choice": "Yeah.",
      "consequence": "6"
    }],
    sideeffect: function(context) {
      context.feeling = "SOSO";
    }
  },
  "6": {
    "statement": ["Can I do something to cheer you up?", "Sing a song, maybe?"],
    "options": [{
      "choice": "Please.",
      "consequency": "7"
    }]
  },
};