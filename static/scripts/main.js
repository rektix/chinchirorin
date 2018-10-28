var socket = io.connect('http://' + document.domain + ':' + location.port);
var player
socket.on('connect', function() {
    socket.emit('join', {
        data: 'User Connected'
    })
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
        $('#table').show()
    })
})

window.onbeforeunload = function() {
    console.log('qwfpst')
    socket.emit('leave', player)
};
socket.on('show players', function(msg) {
    console.log(msg)
    if(typeof msg.user_name !== 'undefined') {        
        $('ul#players').append('<li><b style="color:#000">'+msg.user_name+'</b> '+msg.money+'</li>')
    }
})

socket.on('clear list', function(){
    $('ul#players').empty()
})