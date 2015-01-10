// Globals
var friends = {};

if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var room = 'lobby';
var message = {
  'username': getParameterByName('username'),
  'text': '',
  'roomname': room
};

// YOUR CODE HERE:

var refreshRoom = function() {

  $.ajax({
    // always use this url
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'GET',
    data: {
      order: "-createdAt",
      where: {
        roomname: room
      }
    },
    success: function (data) {
      console.log('chatterbox: Messages received');

      console.log(data);
      var messages = d3.select('#main').selectAll('.message').data(data.results.reverse()); //.text(function(d) { return d.text; });
      messages.select('.username').text(function(d) { return d.username; });
      messages.select('.messageText')
        .attr('style', function(d) { return !!friends[d.username] ? 'font-weight:bold' : 'font-weight:normal'; })
        .text(function(d) { return d.text; });

      var addedMessages = messages.enter().append('div').classed('message', true);

      var addedUserSpan = addedMessages.append('span');
      addedUserSpan.append('a').attr('href','#').classed('username', true).text(function(d) { return d.username;})
        .on('click', function() {
          friends[$(this).text()] = !friends[$(this).text()];
          refreshRoom();
          console.log($(this).text() + " " + friends[$(this).text()]);
        });

      addedMessages.append('span')
        .classed('messageText', true)
        .attr('style', function(d) { return !!friends[d.username] ? 'font-weight:bold' : 'font-weight:normal'; })
        .text(function(d) { return d.text;});
      messages.exit().remove();
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

$(document).ready(function() {
  $('#postMessage').submit(function() {

    message.text = $('#newMessage').val();

    $.ajax({
      // always use this url
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        refreshRoom();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

    return false;
  });

  $('#joinRoom').submit(function() {
    var newRoom =  $('#room').val();

    if(newRoom === '' ) {
      room = 'lobby';
    } else {
      room = newRoom;
    }
    message.roomname = room;

    refreshRoom();

    return false;
  });
});

refreshRoom();

setInterval(function() {
  refreshRoom();
}, 7000);




