function initMap() {
    const div = document.getElementById('map');
    const option = {
        center: { lat: 31.963158, lng: 35.930359 },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP


    };

    map = new google.maps.Map(div, option);

    function createMarker(loc) {


        const marker = new google.maps.Marker({
            position: loc,
            map: map,
            // icon: ''
        });
    }

    var fromLocation = {
        lat: 31.963158,
        lng: 35.930359,
        value: false
    }
    document.getElementById('forms').addEventListener('submit', submitForm)
    //  current
    const currentLocation = document.getElementById('currentLocation');
    currentLocation.addEventListener('click', sendCurrentLocation);


    function sendCurrentLocation() {
        var success = (position) => {

            fromLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                value: true
            }
            console.log(fromLocation)
            createMarker(fromLocation)
        }

        const err = (error) => {
            console.log(error)
        }
        navigator.geolocation.watchPosition(success, err)
    }
    // end current

    function submitForm(event) {
        event.preventDefault()
        if (fromLocation.value == false) {
            fromLocation = {
                lat: parseInt(event.target.fromlat.value),
                lng: parseInt(event.target.fromlng.value)
            }
        }

        var toLocation = {
            lat: parseInt(event.target.tolat.value),
            lng: parseInt(event.target.tolng.value)
        }



        createMarker(fromLocation)
        createMarker(toLocation)

        let direction = $("#direction");
        direction.click(() => {
            drawRoute(fromLocation, toLocation);

        })
    }

    function drawRoute(start, end) {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        // Using Latitude and longitude
        var request = {
            origin: new google.maps.LatLng(start.lat, start.lng),
            destination: new google.maps.LatLng(end.lat, end.lng),
            optimizeWaypoints: true,
            avoidHighways: false,
            avoidTolls: false,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var leg = response.routes[0].legs[0];
                var polyline = route.overview_polyline;
                var distance = route.legs[0].distance.value;
                var duration = route.legs[0].duration.value;

                // console.log(route); // Complete route
                // console.log(distance); // Only distance 
                // console.log(duration); // Only duration
                console.log(leg); // Route options/list - So Important!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // console.log(polyline); // Polyline data

                const tripDetails = document.getElementById('tripDetails');
                const tripDistance = document.createElement('li');
                tripDistance.innerHTML = `the Distance is => ${leg.distance.text}`;
                tripDetails.appendChild(tripDistance);
                const tripDuration = document.createElement('li');
                tripDuration.innerHTML = `the time is => ${leg.duration.text}`;
                tripDetails.appendChild(tripDuration);
                const tripData = document.createElement('li');
                tripData.innerHTML = `this trip is start from ${leg.start_address} and end at ${leg.end_address}`
                tripDetails.appendChild(tripData);


            }
        });
    }

}
