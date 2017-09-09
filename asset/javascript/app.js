// FireBase Link =======================================================================================================
  // Initialize Firebase
  var config = { //This is the firebase park
    apiKey: "AIzaSyClgOv_9CtEMJzdPPwtXu_Cfw8ud-fYNQI",
    authDomain: "trainschedule-92b95.firebaseapp.com",
    databaseURL: "https://trainschedule-92b95.firebaseio.com",
    projectId: "trainschedule-92b95",
    storageBucket: "trainschedule-92b95.appspot.com",
    messagingSenderId: "538788932449"
};
firebase.initializeApp(config);// This part starts the firebase application
var database = firebase.database();// This part stores the information as a database
var trainsRef = firebase.database().ref().child('trains');// This part adds the information typed into the firebase database
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
        var trainName = lastTrain.trainName;
        var destination = lastTrain.destination;
        var trainTime = lastTrain.trainTime;
        var frequency = lastTrain.frequency;
        var trainSchedule = snapshot.val().trianSchedule;
    // storing the snapshot.val() in a variable for convenience
        var nextTrainTime = getNextTrainTime(trainTime, frequency);


        $('.table tbody').append(
            '<tr>' + 
                '<td>' + trainName + '</td>' +
                '<td>' + destination + '</td>' +
                '<td>' + trainTime + '</td>' +
                '<td>' + frequency + '</td>' + 
                '<td>' + nextTrainTime.format('HH:mm') + '</td>' +
                '<td>' + getNextArrival(nextTrainTime) + '</td>' +
            '</tr>'
        );

        // //Moment.js Variables ================================================================================================    
        function getNextTrainTime(trainTime, frequency) {
            var firstTimeConverted = moment(trainTime, "hh:mm");// First train time converted to miltary time
            var currentTime = moment();    // Current Time
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");//Difference between the times
            var tRemainder = diffTime % frequency;    // Time apart (remainder)
            var tMinutesTillTrain = frequency - tRemainder;     // Minute Until Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");    // Next Train
            return nextTrain;
        }
        
        function getNextArrival(nextArrival) {// This function finds the difference between the current time and the next arrival
            var currentTime = moment();// Current Time, as in now
            var diffTime = moment(nextArrival).diff(moment(), "minutes"); //Difference between the now time and the next arrival time
            return diffTime;// Returns the that difference
        }

    });


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