// To make API calls
var http = require("https");

var dotenv = require('dotenv');
dotenv.config();

var Particle = require('particle-api-js');
var particle = new Particle();
var token;

particle.login({username: process.env.SPARK_ID, password: process.env.SPARK_PASS}).then(
  function(data) {
    token = data.body.access_token;

    // Stuff that has to be called upon login
    // Making all lights on the photon glow here
    var fnPr = particle.callFunction({
      deviceId: process.env.DEVICE_ID,
      name: 'rainbow',
      argument: '5',
      auth: token
    });

    //Get button2 event for specific device
    particle.getEventStream({deviceId: process.env.DEVICE_ID, name: 'button2', auth: token }).then(function(stream) {
      stream.on('event', function(data) {
        console.log('Button2 pressed');

        // Make some light glow to indicate button press
        var fnPr1 = particle.callFunction({ deviceId: process.env.DEVICE_ID, name: 'ledOn', argument: '3,green', auth: token });

        // Just spits out response to API call onto console
        var httpCallback = function(response) {
          var str = '';

          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            console.log(str);
          });
        }

        fnPr1.then(
          function (data) {
            console.log('LedOn Function called succesfully:', data);


            // Call whatever endpoint you want here
            http.request("https://api.github.com/", httpCallback).end();

          }, function (err) {
            console.log('An error occurred:', err);
        });
      });
    });


    //Get button4 event for specific device
    particle.getEventStream({ deviceId: process.env.DEVICE_ID, name: 'button4', auth: token }).then(function(stream) {
      stream.on('event', function(data) {
        console.log('Button4 pressed');

        // Turn off all lights
        var fnPr1 = particle.callFunction({ deviceId: process.env.DEVICE_ID, name: 'allLedsOff', argument: '', auth: token });

        fnPr1.then(
          function (data) {
            console.log('allLedsOff Function called succesfully:', data);
          }, function (err) {
            console.log('An error occurred:', err);
          });
      });
    });
  },
  function (err) {
    console.log('Could not log in.', err);
  }
  );