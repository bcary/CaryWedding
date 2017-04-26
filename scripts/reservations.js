// firebase.auth().signOut().then(function() {
//   // Sign-out anonymous
// }).catch(function(error) {
//   // An error happened.
// });



function signIn(){
  firebase.auth().signInWithEmailAndPassword($('#username').val(), $('#password').val()).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    go();
  } else {
    // User is signed out.
  }
});

function go(){
    var ref = firebase.database().ref("reservations").orderByChild('submitted');
    var yesCount = 0;
    var noCount = 0;
    ref.once('value', function(snapshot){
        var reservationArray = [];
        snapshot.forEach(function(child){
            if(child){
                var foundReservation = JSON.parse(child.val());
                reservationArray.push(foundReservation);
            }
        });
        reservationArray.sort(function compare(a, b) {
            var adate = Date.parse(a.submitted);
            var bdate = Date.parse(b.submitted);
            return bdate - adate;
        });
        $.each(reservationArray, function(i, item){
            addReservation(item);
            yesCount = yesCount + item.guests.length;
        });
        $('#attendingcount').text('Yes Count: ' + yesCount.toString());
    }, function(error){
        console.error(error);
    });

    var regretsReference = firebase.database().ref("regrets")
    regretsReference.once('value', function(snapshot){
        snapshot.forEach(function(child){
            var foundRegret = JSON.parse(child.val());
            addRegret(foundRegret);
            noCount = noCount + 1;
        });
         $('#regretcount').text('No Count: ' + noCount.toString());
    }, function(error){
        console.error(error);
    });
}

function addReservation(reservation){
    if (reservation){
        $.each(reservation.guests, function(i, foundGuest){
            var newGuest = $('<tr>' +
                                '<td>' +
                                    '<h5 class="name" style="margin:10px;"></h5>' +
                                '</td>' +
                                '<td>' +
                                    '<h5 class="foodchoice"></h5>' +
                                '</td>' +
                                '<td>' +
                                    '<h5 class="time" style="margin:10px;"></h5>' +
                                '</td>');
            $(newGuest).find('.name').text(foundGuest.guestName);
            var date = new Date(reservation.submitted);

            $(newGuest).find('.time').text(date.toLocaleDateString());
            switch(foundGuest.guestFoodChoice) {
                case '1':
                     $(newGuest).find('.foodchoice').text('Chipotle Rubbed Pot Roast');
                     break;
                case '2':
                    $(newGuest).find('.foodchoice').text('Chicken Garlic Parmesean');
                    break;
                case '3':
                    $(newGuest).find('.foodchoice').text('Pasta Giardiniera (Vegetarian)');
                    break;
                default:
                    $(newGuest).find('.foodchoice').text('Didn\'t choose!!');
            }
            // $(newReservation).append(newGuest);
            $('#reservationsContainer').append(newGuest);
        });
        // var submittedHtml = $('<td>' +
        //                             '<h5 class="time" style="margin:10px;"></h5>' +
        //                     '</td');
        // $(submittedHtml).find('.time').text(reservation.submitted);
        // $('#reservationsContainer').append(submittedHtml);
    }
    
}

function addRegret(regret){
    var newRegret = $('<tr>' +
                        '<td><h4 class="name"></td>' +
                        '<td><p class="regretMessage"></p></td>' +
                    '</tr>');
    $(newRegret).find('.name').text(regret.name);
    $(newRegret).find('.regretMessage').text(regret.message);

    $('#regretsContainer').append(newRegret);
}
