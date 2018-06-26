// Database call
var config = {
    apiKey: "AIzaSyCrVSMFqBIkvzon9FyeKzyMDEUWGZD5Z94",
    authDomain: "train-scheduler-1b268.firebaseapp.com",
    databaseURL: "https://train-scheduler-1b268.firebaseio.com",
    projectId: "train-scheduler-1b268",
    storageBucket: "",
    messagingSenderId: "309546875306"
};

firebase.initializeApp(config);
 
 
var database = firebase.database();

$("#add-train").on("click", function (event) {
    
    event.preventDefault();

    // Display the info to the HTML
    trainName = $("#name-input").val();
    destination = $("#destination-input").val();
    trainTime =  moment($("#traintime-input").val(), "hh:mm A" ).format("X");
    frequency = $("#frequency-input").val();
    
    console.log("Add Train:" + trainTime)

    database.ref().push({
        trainName : trainName,
        destination : destination,
        trainTime : trainTime,
        frequency : frequency,
        dataAdded : firebase.database.ServerValue.TIMESTAMP
    });

    // Clear the input values
    $(".form-control").val("");
});


database.ref().on("child_added", function (snapshot) {

    var tfrequency = parseInt(snapshot.val().frequency)
    
    console.log("TEST1:" + moment(parseInt(snapshot.val().trainTime)));
    
    // using .unix solved the time issue instead of using parsInt!!
    var tRemainder = moment().diff(moment.unix(snapshot.val().trainTime), "minutes") % tfrequency;
	var tMinutes = (tfrequency - tRemainder);

    // To calculate the arrival time, add the tMinutes to the currrent time
    var m = moment();
    var tArrival = m.add(tMinutes, "m").format("hh:mm A"); 
    

    // Displaying the train info
    $("#trainName").append("<p>" + snapshot.val().trainName + "</p>");
    $("#destination").append("<p>" + snapshot.val().destination + "</p>");
    $("#frequency").append("<p>" + snapshot.val().frequency + "</p>");
    $("#nextArrival").append("<p>" + tArrival  + "</p>");
    $("#minutesAway").append("<p>" + tMinutes + "</p>");
      
});