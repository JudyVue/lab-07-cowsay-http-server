'use strict';

//node modules

const http = require('http');
const url = require('url');
const queryString = require('querystring');

//npm modules
const cowsay = require('cowsay');

console.log(process.argv[0]);


//app modules
const parseBody = require('./lib/parse-body.js');

//module constants
const PORT = process.env.PORT || 3000;

//module logic
const server = http.createServer(function(req, res){

  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);

  if(req.method === 'GET' && req.url.pathname === '/'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('hello world\n');
    res.write(cowsay.think({text: 'moo'}));
    res.end();
    return;
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay'){
    if (!req.url.query.text){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
      res.end();
    }
    else{
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(cowsay.say(req.url.query));
      res.end();
    }
    return;
  }

  if (req.method === 'POST' && req.url.pathname === '/cowsay'){
    if(!req.body || !req.body.text){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
      res.end();
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    parseBody(req, function(err, body){
      if (err){
        console.log(err);
        return;
      }
      console.log(body);
      res.write(cowsay.say(body));
      res.end();
    });
    return;
  }

  res.statusCode = 404;
  res.write('too bad');
  res.end();
});

server.listen(PORT, function(){
  console.log('server up at port ', PORT);
});
