
//toda vez que mudar a porta no script.js tem
// que mudar aqui tambem
var socket = io.connect('http://localhost:3003');

socket.on('port', function (data) {
    console.log(data.port);
});

//recebe os dados recebidos pela porta analogica A0 para o browser exibir em um <textarea>
socket.on('sensor', function (data) {
    console.log("Entrada de dados do sensor:", data.raw);
    $("#inData").append(data.raw + "\r");
    $("#inData").animate({scrollTop: $("#inData")[0].scrollHeight - $("#inData").height()}, 200);
    updateLdr(data.raw);
});

//recebe os dados recebidos pela sensor ultrasonico e envia para o browser exibir em um <textarea>
socket.on('ping', function (data) {
    console.log("Entrada de dados do ping:", data.raw);
    $("#inData2").append(data.raw + "\r");
    $("#inData2").animate({scrollTop: $("#inData2")[0].scrollHeight - $("#inData2").height()}, 200);
    updatePing(data.raw);
});

//reset nos valores, para evitar lentidão no elemento
setInterval(function() {
   $("#inData").empty(); 
   $("#inData2").empty(); 
   window.console.log("Reset");
}, 20000);  

//recebe os dados enviados pelo <button> do browser e envia para o script.js que esta rodando no  node.js
$('#vel').change(function () {
    var valor = $('#vel').val();
    console.log("Alterando a velocidade dos motores:", valor);
    var a = document.getElementById("exibe");
    a.innerHTML = $('#vel').val();
    socket.emit('vel', valor);
});

$('#luz').on('click', function () {
    console.log("Ligando luz:", 0);
    socket.emit('luz', 0);
});

$('#stop').on('click', function () {
    console.log("Parando robo:", 1);
    socket.emit('stop', 1);
});

$('#forward').on('mousedown', function () {
    console.log("Indo frente:", 2);
    socket.emit('forward', 2);
});

$('#left').on('mousedown', function () {
    console.log("virando direita:", 3);
    socket.emit('left', 3);
});

$('#back').on('mousedown', function () {
    console.log("Indo tras:", 4);
    socket.emit('back', 4);
});

$('#right').on('mousedown', function () {
    console.log("virando esquerda:", 5);
    socket.emit('right', 5);
});

$('.mouseup').mouseup(function () {
    console.log("mouseup:", 6);
    socket.emit('mouseup', 6);
});


var canvas = document.getElementById('chart'),
ctx = canvas.getContext('2d');
initData = {
  datasets: [
  {
      label: "Sensor Luminosidade",
      backgroundColor: "yellow",
      borderColor: 2,
      borderWidth: 1,
      data: [0, 10],      
  },
  {
      label: "Sensor Distância",
      backgroundColor: "blue",
      borderColor: 2,
      borderWidth: 1,
      data: [0, 10]
  }
  ],

};

// Reduce the animation steps for demo clarity.
var chart = new Chart(ctx, {
    type: "bar",
    data: initData,
    numSteps: 10
});

var updateLdr = function(value) {
    // Update one of the points in the second dataset
    chart.data.datasets[0].data[0] = value;
}

var updatePing = function(value) {
    // Update one of the points in the first dataset
    chart.data.datasets[1].data[0] = value;

}

setInterval(function(){
    chart.update();
}, 1000);



