/*jshint sub:true*/
/*jshint -W083 */
/*jshint shadow:true */
var DEBUG = false;

function renderStatement(statement) {
  $('#chat').append('<div class="row"><div class="small-10 medium-7 columns"><div class="call-bubble">' + statement + '</div></div></div>');
}

function showTyping() {
  $('#chat').append('<div class="row" id="typing"><div class="small-10 medium-7 columns"><div class="call-bubble"><img src="images/ellipsis.gif" width="24"></img></div></div></div>');
}

function hideTyping() {
  $('#typing').remove();
}

function scrollToBottom() {
  // Scroll to the bottom
  $('body').scrollTop(1E10);
}

function checkInput(option) {
  if ($('input[type=text]').val().length > 0) {
    showResponse(option);
  } else {
    alert("Vul alstjeblieft je naam in!");
  }

  return false;
}

function clearChat() {
  $('#chat').empty();
}

function clearFooter() {
  // Remove everything in the choices
  $('#choices').empty();
  // Remove an input if we already had one
  $('#input-container').empty();
}

function startConversation(scriptFile) {
  // Clear everything
  clearFooter();
  clearChat();

  $.getScript("js/" + scriptFile, function() {
    showStatement("1");
  })
  .fail(function( jqxhr, settings, exception ) {
    console.log("error");
  });
}

function showStatement(index) {
  var node = conversation[index];

  // If there is a side effect execute that within the context
  if ('sideeffect' in node && $.type(node['sideeffect'] === "function")) {
     node['sideeffect'](context);
  }

  // Wrap the statements in an array (if they're not already) for the general case
  var statements;
  if ($.type(node['statement']) === "array") {
    statements = node['statement'];
  } else if ($.type(node['statement']) === "string") {
    statements = [node['statement']];
  } else if ($.type(node['statement']) === "function") {
    statements = node['statement'](context);
  }

  async.eachSeries(statements, function(item, callback) {
    // We run this function over each statement

    showTyping();

    scrollToBottom();

    // Do some fiddly semi random delays based on the message length
    var delay = (item.length / 3) * 30 * (Math.floor(Math.random() * 5) + 1);

    if (DEBUG) { delay = 0; }

    setTimeout(function() {
      hideTyping();
      renderStatement(item);

      scrollToBottom();

      callback();
    }, delay);
  }, function (err) {
    // This is the final callback of the series

    if ('options' in node) {
      $('#input-row').hide();
      $('#choice-buttons').show();

      // Render the choices
      var options = node["options"];

      // If there are no options, then this is terminal
      // Otherwise render them
      if (options.length > 0) {
        for (var j = 0; j < options.length; j++) {
          var option = options[j];

          var li = $('<li/>');

          var extraClass;
          var clickFunction;
          if (option['consequence'] === null) {
            // The consequence being null means this is a branch we won't 
            // be exploring. As such the button is disabled and does nothing on click.
            clickFunction = null;
            extraClass = "disabled";
          } else {
            // This is the normal response button as we used to have it.
            clickFunction = function(option) {
              showResponse(option);
            }.bind(null, option);
            extraClass = "";
          }

          var button = $('<a/>', {
            text: option['choice'],
            "class": "button" + " " + extraClass,
            click: clickFunction
          }).appendTo(li);

          li.appendTo('#choices');
        }

        // Remove the previous button group number and add the new one
        $("#choices").removeClass("even-1 even-2 even-3 even-4 even-5 even-6 even-7 even-8");
        $("#choices").addClass("even-" + options.length);

        // Add the same even class to the chat-row
        $("#chat-row").removeClass("choices-1 choices-2 choices-3 choices-4 choices-5 choices-6 choices-7 choices-8");
        $("#chat-row").addClass("choices-" + options.length);
      }
    } else if ('input' in node) {
      $('#input-row').show();
      $('#choice-buttons').hide();

      var option = node['input'];

      // Render an input and a button
      var inputDiv = $('<div/>', {
        'class': 'medium-10 columns'
      });

      var form = $('<form/>', {
        submit: checkInput.bind(null, option)
      }).appendTo(inputDiv);

      var input = $('<input/>', {
        class: 'radius',
        type: 'text',
        placeholder: 'Bericht',
        name: option['name']
      }).appendTo(form);

      // Focus the input we just put into the DOM
      async.nextTick(function() {
        input.focus();
      });

      inputDiv.appendTo('#input-container');

      var buttonDiv = $('<div/>', {
        'class': 'medium-2 columns'
      });

      var button = $('<a/>', {
        text: "Verzenden",
        "class": "button postfix radius",
        click: checkInput.bind(null, option)
      }).appendTo(buttonDiv);

      buttonDiv.appendTo('#input-container');
    }

    scrollToBottom();
  });
}

function showResponse(option) {
  // If there was an input element, put that into the global context hard
  // This is dirty but this is a prototype.
  var feedback = "";

  if ('name' in option) {
    context[option['name']] = $('input[type=text]').val();

    feedback = context[option['name']];
  } else {
    feedback = option['choice'];
  }

  clearFooter();

  // Show what the user chose
  $("#chat").append('<div class="row clearfix"><div class="small-10 medium-7 columns right"><div class="response-bubble">' + feedback + '</div></div></div>');

  if ('consequence' in option) {
    showStatement(option['consequence']);
  } else {
    // If the option doesn't have a consequence tag, it is a dead end
    // This can be intentional
  }
}

// TODO this is global for now
var context = {};
