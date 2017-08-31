// FireBase Link =======================================================================================================
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyClgOv_9CtEMJzdPPwtXu_Cfw8ud-fYNQI",
    authDomain: "trainschedule-92b95.firebaseapp.com",
    databaseURL: "https://trainschedule-92b95.firebaseio.com",
    projectId: "trainschedule-92b95",
    storageBucket: "trainschedule-92b95.appspot.com",
    messagingSenderId: "538788932449"
  };
  firebase.initializeApp(config);
var database = firebase.database();
var trainsRef = firebase.database().ref().child('trains');
// Global Variables ====================================================================================================

var trainName;
var destination;
// var nextTrain;
var firebase;
var trainSchedule;      

// Functions and Processes ===========================================================================================================
$(document).ready(function() {
    trainsRef.on("child_added", function(snapshot) {
        var lastTrain = snapshot.val();
        var trainTime = lastTrain.trainTime;
        var frequency = lastTrain.frequency;
        var trainSchedule = snapshot.val().trianSchedule;

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // //Moment.js Variables ================================================================================================    
    function getNextTrainTime(trainTime, frequency) {
        var firstTimeConverted = moment(trainTime, "hh:mm");    // First train time converted to miltary time
        var currentTime = moment();    // Current Time
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");    // Difference between the times
        var tRemainder = diffTime % frequency;    // Time apart (remainder)
        var tMinutesTillTrain = frequency - tRemainder;     // Minute Until Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");    // Next Train
        console.log("First Time: " + firstTimeConverted);
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        console.log("DIFFERENCE IN TIME: " + diffTime);
        console.log("REMAINDER: " + tRemainder);
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        return nextTrain;
    };

    $(document).on("click", "#searchBtn", function(event) {
        event.preventDefault();
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var trainTime = $("#trainTime").val();
        var frequency = $("#frequency").val();

        writeUserData(trainName, destination, trainTime, frequency);

        function writeUserData(trainName, destination, trainTime, frequency) {
            trainsRef.push({
                trainName: trainName,
                destination: destination,
                trainTime: trainTime,
                frequency: frequency,
            });
        }
    });
});

