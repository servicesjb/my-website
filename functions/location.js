// This is a Cloudflare Function. It runs on the server before the page is sent to the user.
// Its job is to get the visitor's location and calculate the distance to NYC.

// Haversine formula to calculate distance between two lat/lon points in miles
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// This is the main function that runs when your page is requested
export const onRequestGet = async (context) => {
  // Coordinates for New York City
  const nycLat = 40.7128;
  const nycLon = -74.0060;

  // Get the visitor's location data from Cloudflare's request object
  const visitorLat = context.request.cf.latitude;
  const visitorLon = context.request.cf.longitude;

  // If we have the visitor's location, calculate the distance
  let distance = null;
  if (visitorLat && visitorLon) {
    distance = getDistance(
        parseFloat(visitorLat), 
        parseFloat(visitorLon), 
        nycLat, 
        nycLon
    );
  }

  // Prepare the data to be sent back to the browser
  const data = {
    // Round the distance to a whole number
    distance: distance ? Math.round(distance) : null 
  };
  
  // Return the data as a JSON response
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
