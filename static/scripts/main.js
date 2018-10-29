var socket = io.connect('http://' + document.domain + ':' + location.port);
var player
socket.on('connect', function() {    
    var login = $('#join').on('submit', function(e) {
        e.preventDefault()
        let user_name = $('input.nickname').val()
        socket.emit('join', {
            user_name : user_name,
            money : 2000
        })
        player = {
            user_name : user_name,
            money : 2000
        }
        login.hide()
        $('#lobby').show()
    })
})

window.onbeforeunload = function() {
    console.log('qwfpst')
    socket.emit('leave', player)
};

$('#start').click(function() {
    socket.emit('start',player)
})

socket.on('showPlayers', function(player) {
    console.log(player)
    if(typeof player.user_name !== 'undefined') {        
        $('#players').append('<li><b style="color:#000">'+player.user_name+'</b> '+player.money+'</li>')
    }
})

socket.on('showTable', function(players){
    console.log(players)
    console.log(player)
    for(i = 0; i < players.length; i++){
        if (players[i].user_name === player.user_name){
            $('#lobby').hide()
            $('#table').show()
            for (i = 0; i < players.length; i++) {
                name = i % 2 == 0 ? '#left' : '#right'
                $(name).append('<div class="player-container"><p>'+players[i].user_name+'</p><p>Current money: '+players[i].money+'</p></div>')
            }
        }
    }
})

socket.on('clearList', function(){
    $('#players').empty()
})

socket.on('showStartButton', function(){
    $('#start').show()
})

socket.on('hideStartButton', function(){
    $('#start').hide()
})