var socket = io.connect('http://' + document.domain + ':' + location.port);
var player
socket.on('connect', function() {    
    var login = $('#join').on('submit', function(e) {
        e.preventDefault()
        let user_name = $('input.nickname').val()
        player = {
            user_name : user_name
        }
        socket.emit('join', player)
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
        $('#players').append('<li><b style="color:#000">'+player.user_name+'</b></li>')
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
                $(name).append('<div class="player-container">\
                                    <p>'+players[i].user_name+'</p>\
                                    <p>Current money: '+players[i].money+'</p>\
                                    <p> Current bet: '+ players[i].bet+'</p>\
                                </div>')
            }
        }
    }
})

socket.on('chooseDealer', function(currentPlayer){
    if (player.user_name == currentPlayer.user_name)
        $('#dealer').show()
     else
        $('#dealer').hide()
})

function takeDealer() {
    socket.emit('dealerChosen', player)
    $('#dealer').hide()
}

function passDealer() {
    socket.emit('nextPlayer')
    $('#dealer').hide()
}

socket.on('pressRoll', function(){
    $('#roll').show()
})

function roll() {
    $('#dice').show()
    $('#first').html(Math.floor((Math.random() * 6) + 1))
    $('#second').html(Math.floor((Math.random() * 6) + 1))
    $('#third').html(Math.floor((Math.random() * 6) + 1))
}

socket.on('clearList', function(){
    $('#players').empty()
})

socket.on('showStartButton', function(){
    $('#start').show()
})

socket.on('hideStartButton', function(){
    $('#start').hide()
})