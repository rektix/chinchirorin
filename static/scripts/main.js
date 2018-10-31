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
                $(name).append('<div class="player-container" id="player'+i+'">\
                                    <p>'+players[i].user_name+'</p>\
                                    <p>Current money: '+players[i].money+'</p>\
                                    <p>Current bet: '+ players[i].bet+'</p>\
                                </div>')
            }
        }
    }
})

socket.on('updateTable', function(data){
    updatedPlayer = data[0]
    index = data[1]
    $('#player'+index+' > p:nth-child(2)').html('Current money: ' + updatedPlayer.money)
    $('#player'+index+' > p:nth-child(3)').html('Current bet: ' + updatedPlayer.bet)
})

socket.on('showBet', function(data){
    players = data[0]
    dealer = data[1]
    console.log(player,players,dealer)
    for (i = 0; i < players.length; i++){
        if (player.user_name == players[i].user_name && players[i].bet == 0 && player.user_name != dealer.user_name){
            console.log('i can bet')
            $('#bet').show()
            break
        } else {
            $('#bet').hide()
        }
    }
})

$('#bet').on('submit', function(e){
    e.preventDefault()
    $('#bet').hide()
    let bet = $('input.bet').val()
    player.bet = bet
    for (i = 0; i < players.length; i++){
        if (player.user_name == players[i].user_name){
            socket.emit('updateBet', player.bet, i)
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