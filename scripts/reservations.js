function go(){
    var ref = firebase.database().ref("reservations").orderByChild("submitted");

    ref.once('value', function(snapshot){
        snapshot.forEach(function(child){
            var foundReservation = JSON.parse(child.val());
            addReservation(foundReservation);
        });
    }, function(error){
        console.error(error);
    });
}


function addReservation(reservation){
    var newReservation = $('<div id="reservationBucket" class="reservation">' +
                                '<h5 class="reservationemail"></h5>' +
                                '<h5 class="reservationtime"></h5>' +
                            '</div>');
    $(newReservation).find('.reservationemail').text(reservation.email);
    $(newReservation).find('.reservationtime').text(reservation.submitted);

    if (reservation){
        $.each(reservation.guests, function(i, foundGuest){
            var newGuest = $('<div class="guest row" id="guest">' +
                    '<div class="col-md-offset-2 col-md-4">' +
                        '<label class="sr-only" for="name">Guest Name</label>' +
                        '<input type="text" class="name form-control" placeholder="Full Name">' +
                    '</div>' +
                    '<div class="col-md-4">' +
                        '<label class="sr-only" for="foodchoice">Menu Option</label>' +
                        '<select class="foodchoice form-control">' +
                            '<option disabled selected value>Meal Choice</option>' +
                            '<option value="1">Chipotle Rubbed Pot Roast</option>' +
                            '<option value="2">Chicken Garlic Parmesean</option>' +
                            '<option value="3">Pasta Giardiniera (Vegetarian)</option>' +
                        '</select>' +
                    '</div>' +
                '</div>');
            $(newGuest).find('.name').val(foundGuest.guestName);
            $(newGuest).find('.foodchoice').val(foundGuest.guestFoodChoice);

            $(newReservation).append(newGuest);
        });
    }
    $('#reservationsContainer').append(newReservation);
}
