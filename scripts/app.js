$(document).ready(function(){
    $("#rsvpEmail").keyup(function(){
        if ($('#rsvpEmail').val()){
            $('#emailEnteredButton').prop('disabled', false);
            $('#rsvpEmail').val($('#rsvpEmail').val().toLowerCase());
        } else {
            $('#emailEnteredButton').prop('disabled', true);
            $('#addGuestButton').hide();
        }
    });
});

var newReservation = false;

function initMap() {
    var wildernessRidge = {lat: 40.72201, lng: -96.6953297};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: wildernessRidge
    });
      
    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
        placeId: 'ChIJTTCFVE2UlocRnCk83E19jwE'
    }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '<br>' +
                '<a href="https://maps.google.com/maps?ll=40.721806,-96.694669&z=17&t=m&hl=en-US&gl=US&mapclient=apiv3&cid=112446289068435868" target="_blank">View in Google Maps</a></div>'
                );
                infowindow.open(map, this);
        });
    }
    });
}

function emailEntered(){
    $('#addGuestButton').show();

    var ref = firebase.database().ref("reservations/" + getKeyFromEmail($('#rsvpEmail').val()));

    ref.once('value').then(function(snapshot) {
        if(snapshot.exists()){
            var foundReservation = JSON.parse(snapshot.val());
            if (foundReservation.guests.length > 0){
                $.each(foundReservation.guests, function(i, foundGuest){
                    addGuest(foundGuest);
                });
            }
        } else {
            newReservation = true;
        }
    });
}

function addGuest(item) {
    var newGuest = $('<div class="guest form-inline" id="guest">' +
                        '<label class="sr-only" for="name">Guest Name</label>' +
                        '<input type="text" class="name form-control" style="margin:10px;" placeholder="Guest Full Name">' +
                        '<label class="sr-only" for="foodchoice">Menu Option</label>' +
                        '<select class="foodchoice form-control" style="margin:10px;">' +
                            '<option disabled selected value>Meal Choice</option>' +
                            '<option value="1">Chipotle Rubbed Pot Roast</option>' +
                            '<option value="2">Chicken Garlic Parmesean</option>' +
                            '<option value="3">Pasta Giardiniera (Vegetarian)</option>' +
                        '</select>' +
                        '<i id="deleteguest" style="margin:10px; cursor: pointer;" title="Delete Guest" class="deleteguest fa fa-times fa-lg" aria-hidden="true"></i>' +
                    '</div>');
    $('#guestcontainer').append(newGuest);

    if (item){
        $(newGuest).find('.name').val(item.guestName);
        $(newGuest).find('.foodchoice').val(item.guestFoodChoice);
        $('#rsvpButton').html('Update RSVP');
    }

    if ($('.guest').length > 0) {
        $('#rsvpButton').show();
    }

    $('.deleteguest').click(function() {
        $(this).parent().remove();
        if ($('.guest').length === 0 && newReservation) {
            $('#rsvpButton').hide();
        } else {
            $('#rsvpButton').show();
        }
        $(window).trigger('resize.px.parallax');
    });
    $(window).trigger('resize.px.parallax');
}

function getKeyFromEmail(userInput){
    return userInput.replace(/\./g, '');
}

function save() {
    var reservation = {};

    reservation.submitted = new Date().toUTCString();
    reservation.email = $('#rsvpEmail').val();
    reservation.guests = [];
    $('.guest').each(function(i, obj) {
        var newGuest = {};
        newGuest.guestName = $(obj).find('input.name').val();
        newGuest.guestFoodChoice = $(obj).find('select.foodchoice').val();
        reservation.guests.push(newGuest);
    });

    var data = JSON.stringify(reservation); 
    var updates = {};
    updates['/reservations/' + getKeyFromEmail($('#rsvpEmail').val())] = data;

    console.log('Reservation update: ' + data);

    firebase.database().ref().update(updates, function(error) {
        if(!error){
            newReservation = false;
            $('#guestcontainer').empty();
            $('#rsvpEmail').val('')
            $('#rsvpButton').hide();
            $('#addGuestButton').hide();
            $('#checkmark').show();
            $('#checkmark').fadeOut(2000);
            $(window).trigger('resize.px.parallax');
        }
    });
}
