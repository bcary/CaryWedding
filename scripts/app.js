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

function addGuest() {
    var newGuest = $('<div class="guest form-inline" id="guest">' +
                        '<label class="sr-only" for="name">Guest Name</label>' +
                        '<input type="text" class="name form-control" style="margin:10px;" placeholder="Guest Name">' +
                        '<label class="sr-only" for="foodchoice">Menu Option</label>' +
                        '<select class="foodchoice form-control">' +
                            '<option disabled selected value>Meal Choice</option>' +
                            '<option value="1">Chipotle Rubbed Pot Roast</option>' +
                            '<option value="2">Chicken Garlic Parmesean</option>' +
                            '<option value="3">Pasta Giardiniera (Vegetarian)</option>' +
                        '</select>' +
                        '<i id="deleteguest" style="margin:10px; cursor: pointer;" title="" class="deleteguest fa fa-minus-circle" aria-hidden="true"></i>' +
                    '</div>');
    $('#guestcontainer').append(newGuest);

    $('.deleteguest').click(function() {
        $(this).parent().remove();
    });
}

function save() {
    var reservation = {};
    //TODO see if cookie exists, and get reservation id 
    var keyFromCookie = '-KgqzAgZI4QGmm5SfBeN';
    reservation.submitted = new Date().toUTCString();
    reservation.guests = [];
    $('.guest').each(function(i, obj) {
        var newGuest = {};
        newGuest.guestName = $(obj).find('input.name').val();
        newGuest.guestFoodChoice = $(obj).find('select.foodchoice').val();
        reservation.guests.push(newGuest);
    });
    var reservationKey = keyFromCookie ? keyFromCookie : firebase.database().ref().child('reservations').push().key;
    var data = JSON.stringify(reservation); 

    var updates = {};
    updates['/reservations/' + reservationKey] = data;

    console.log('Reservation update: ' + data);

    return firebase.database().ref().update(updates);
}

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
