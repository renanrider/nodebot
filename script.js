var  five    = require("johnny-five")
, speed  = 150
, motors
, ping
, led
, sensor
, board;
//,keypress = require("/opt/node_modules/keypress")
// Johnny-Five irá tentar localizar a porta onde o Arduino está
// mas também você pode especificar a porta, e também se estiver
// conectado via bluetooth vai funcionar, mas é opcional essas 
// configuracoes.

//Se estiver utilizando porta serial por exemplo modulo de bluetooth no Linux coloque o módulo para 
//funcionar como serial e especifique em port: "" a porta que ele está, e desmarque a linha comentada
board = new five.Board({
	port: "/dev/ttyACM0"
//port: "/dev/rfcomm0"

});
///inicia placa e seus componentes conectados,etc //////
board.on("ready", function () {
	console.log("Board ready");
//inicia os motores//
motors = {
        a: new five.Motor({pins: [11, 12], invertPWM: true}), //motor"a" é o da esquerda
        b: new five.Motor({pins: [10, 8], invertPWM: true})
    };
//inicia o sensor ultrasonico//
ping = new five.Ping({
	port: 7,
	freq: 500
});
//inicia o led//
led = new five.Led(13);  //intancia um novo objeto led
// inicia o sensor que captura valores analogicos
sensor = new five.Sensor({
	pin:"A0",
	freq: 500
});
//permite enviar comandos via terminal
this.repl.inject({
	motors: motors,
	led:led
});
console.log("Repl instance auto-initialized ready!!!");
console.log("Robo ok!");
});

/*===================================================================================
//server
*/
var   express = require('express')  
, app = require('express')()
, server = require('http').Server(app)
, io = require('socket.io')(server)
, port    = process.env.PORT || 3005;  

app.use(express.static(__dirname + '/public'));
server.listen(port);
console.log('Servidor escutando na porta: ' + port);

// on a socket connection
io.sockets.on('connection', function (socket) {
	socket.emit('port',{port: port});
    //Altera a velocidade dos motores
    socket.on('vel', function (data) {
    	console.log(data);
    	speed = data;
    	console.log("Velocidade:", speed);
    });
    // Liga a luz do pino 13
    socket.on('luz', function (data) {
    	console.log("luz");
    	control(data);
    });
    // Para o robo
    socket.on('stop', function (data) {
    	console.log("stop");
    	control(data);
    });
    //Move o robo para frente
    socket.on('forward', function (data) {
    	console.log("forward");
    	control(data);
    });
    //Move o robo para esquerda
    socket.on('left', function (data) {
    	console.log("left");
    	control(data);
    });
    //Move o robo para tras
    socket.on('back', function (data) {
    	console.log("back");
    	control(data);
    });
    //Move o robo para direira
    socket.on('right', function (data) {
    	console.log("right");
    	control(data);
    });
    //Faz o mouseup quando o botao do mouse e solto aciona esse evento
    //tirando a aceleracao dos motores
    socket.on('mouseup', function (data) {
    	console.log("mouseup", data);
    });
    // le os dados do sensor e envia para o browser
    sensor.on("data", function () {
    	socket.emit('sensor', {raw: this.raw});
    });
    //le os dados do sensor ultrasonico e envia para o browser
    ping.on("data", function () {
    	var data = {
    		raw: Math.round(this.cm)
    	};
    	socket.emit('ping', data);
    });
});
//essa funcao e responsavel por tomar a acao que o robo ira executar
function control(commands) {

	switch (commands) {

		case 0:
		led.toggle();
		break;

            case 1:  //Parar o robo
            motors.a.stop();
            motors.b.stop();
            break;

            case 2:  //Move o robo para frente
            motors.b.forward(speed);
            motors.a.forward(speed);
            break;

            case 3:  //Move o robo para esquerda
            motors.a.reverse(speed);
            motors.b.forward(speed);
            break;

            case 4:   //Move o robo para tras
            motors.a.reverse(speed);
            motors.b.reverse(speed);
            break;

            case 5:    //Move o robo para direira
            motors.b.reverse(speed);
            motors.a.forward(speed);
            break;

            case 6:    //Para o robo de acordo com o evento mouseup
            motors.a.stop();
            motors.b.stop();
            break;

            default:
            console.log("nenhum comando recebido");

        }
    }


