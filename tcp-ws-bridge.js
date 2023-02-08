#!/usr/bin/env node
const net = require('net');
const WebSocketServer = require('ws');

var argv = require('optimist')
    .usage('Forward tcp connections to websocket')
    .demand('thost')
    .describe('thost', 'address tcp.')
    .demand('tport')
    .describe('tport', 'port tcp.')
    .demand('wport')
    .describe('wport', 'port websocket.')
    .argv;

const wss = new WebSocketServer.Server({ port: argv.wport })

function tcp2ws() {
    wss.on("connection", ws => {

        console.log("new client connected");



        var client = new net.Socket();

        client.connect(argv.tport, argv.thost, function () {

            console.log('Connected TCP');

        });



        client.on('data', function (data) {

            console.log('Received from TCP: ' + data);

            // sending message to client

            ws.send(data + "");

        });



        client.on('close', function () {

            console.log('TCP Connection closed');

        });



        // handling what to do when clients disconnects from server

        ws.on("close", () => {

            console.log("the client has connected");

            client.destroy(); // kill client after server's response

        });

        // handling client connection error

        ws.onerror = function () {

            console.log("Some Error occurred")

        }

    });

}


tcp2ws();