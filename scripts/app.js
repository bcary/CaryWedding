$(document).ready(function(){
    $("#rsvpEmail").keyup(function(){
        if ($('#rsvpEmail').val()){
            $('#emailEnteredButton').prop('disabled', false);
        } else {
            $('#emailEnteredButton').prop('disabled', true);
            $('#addGuestButton').hide();
        }
    });
    $("#regretsLink").click(function(e) {e.preventDefault(); cantMakeIt(); return false; });
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
    $('#guestcontainer').empty();
    $('#regretsDiv').hide();
    $('#rsvpConfirmationMessage').hide();
    var ref = firebase.database().ref("reservations/" + getKeyFromInput($('#rsvpEmail').val().trim()));

    ref.once('value').then(function(snapshot) {
        if(snapshot.exists()){
            var foundReservation = JSON.parse(snapshot.val());
            if (foundReservation.guests.length > 0){
                $('#rsvpButton').html('Update RSVP');
                $.each(foundReservation.guests, function(i, foundGuest){
                    addGuest(foundGuest);
                });
            }
            $('#addGuestButton').show();
        } else {
            newReservation = true;
            $('#rsvpButton').html('RSVP');
            addGuest();
            $('#addGuestButton').show();
        }
    });
}

function addGuest(item) {
    if ($('.guest').length <= 8) {
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
                            '<div class="col-md-1">' +
                                '<i id="deleteguest" cursor: pointer;" title="Delete Guest" class="deleteguest fa fa-times fa-lg" aria-hidden="true"></i>' +
                            '</div>' +
                        '</div>');
        $('#guestcontainer').append(newGuest);

        if (item){
            $(newGuest).find('.name').val(item.guestName);
            $(newGuest).find('.foodchoice').val(item.guestFoodChoice);
        }

        if ($('.guest').length > 0) {
            $('#rsvpButton').show();
        }
        if ($('.guest').length >= 8) {
            $('#addGuestButton').hide();
        }

        $('.deleteguest').click(function() {
            $(this).parent().parent().remove();
            if ($('.guest').length === 0 && newReservation) {
                $('#rsvpButton').hide();
            } else {
                $('#rsvpButton').show();
            }
            if ($('.guest').length < 8) {
                $('#addGuestButton').show();
            }
            $(window).trigger('resize.px.parallax');
        });
        $(window).trigger('resize.px.parallax');
    }
}

function getKeyFromInput(userInput){
    return userInput.replace(/\./g, '').toLowerCase();;
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
    updates['/reservations/' + getKeyFromInput($('#rsvpEmail').val().trim())] = data;

    console.log('Reservation update: ' + data);

    firebase.database().ref().update(updates, function(error) {
        if(!error){
            newReservation = false;
            $('#guestcontainer').empty();
            $('#rsvpEmail').val('')
            $('#rsvpButton').hide();
            $('#addGuestButton').hide();
            $('#rsvpConfirmationMessage').show();
            $('#checkmark').show();
            $('#checkmark').fadeOut(2000);
            $(window).trigger('resize.px.parallax');
        }
    });
}

function cantMakeIt() {
    $('#regretsName').show();
    $('#regretsMessage').show();
    $('#regretsButton').show();
    $('#regretsHeader').show();
    $('#regretsLink').hide();
    $('#rsvpButton').hide();
    $('#rsvpEmail').hide();
    $('#emailEnteredButton').hide();
    $(window).trigger('resize.px.parallax');
}

function saveRegret() {
    
    var regret = {};
    regret.submitted = new Date().toUTCString();
    regret.name = $('#regretsName').val().trim();
    regret.message = $('#regretsMessage').val();

    var data = JSON.stringify(regret); 
    var updates = {};
    updates['/regrets/' + getKeyFromInput($('#regretsName').val().trim())] = data;

    console.log('Regrets update: ' + data);

    firebase.database().ref().update(updates, function(error) {
        if(!error){
            newReservation = false;
            $('#regretsName').hide();
            $('#regretsMessage').hide();
            $('#regretsButton').hide();
            $('#regretsLink').hide();
            $('#regretsHeader').hide();
            $('#regretsConfirmationMessage').show();
            $(window).trigger('resize.px.parallax');
        }
    });
    
}
