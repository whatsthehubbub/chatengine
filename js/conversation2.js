var conversation = {
  "1": {
    "statement": function(context) {
      return ["Hi " + context.name];
    },
    "options": [{
      "choice": "Hi",
      "consequence": "2"
    }]
  }
};