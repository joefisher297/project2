document.addEventListener('DOMContentLoaded', () => {

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  let username;
  // check for username
  if (!localStorage.getItem('username')) {
    // create and save
    username = prompt("Please enter your username", "Username...");
    localStorage.setItem('username', username);
  } else {
    // access username in local storage
    username = localStorage.getItem('username');
  };
  // update html
  document.querySelector('#username').innerHTML = username;

  // creating a new channel
  socket.on('connect', () => {
    document.querySelector('#nameForm').onsubmit = () => {
      let name = document.querySelector('#newChannelName').value;
      //console.log(name)
      document.querySelector('#newChannelName').value = '';
      socket.emit('create channel', name);
      return false;
    };

    // Sending a new message, if that's possible
    if (document.querySelector('#messageForm')) {
      document.querySelector('#messageForm').onsubmit = () => {
        let content = document.querySelector('#composer').value;
        document.querySelector('#composer').value = '';
        channelID = document.getElementById('channelID').innerHTML;
        console.log(channelID);
        socket.emit('new message', content, channelID);
        return false;
      };
    };
  });

  // success
  socket.on('channel created', (name, id) => {
    //console.log('block reached, name is '+name+'and id is '+id);
    //console.log(name);
    const channel = document.createElement('a');
    channel.className = 'list-group-item list-group-item-action channel';
    channel.href = '/chat/'+id;
    channel.innerHTML = name;
    //channel.innerHTML = '<a href={{ url_for("chat", channelID = channel.id) }} class="list-group-item list-group-item-action channel">' + name + '</a>';
    document.querySelector('#channels').appendChild(channel);
    //return false;
  });

  // channel name already in use
  socket.on('channel exists', (name, id) => {
    alert('Channel "'+name+'" already exists');
  });

  // Message successfully sent


  // After clicking "New Channel" button
  // document.querySelector('#addChannelButton').onclick = () => {
  //   alert('success!')
  // };


});
