export const onRequestGet = async (context) => {
    // Get the city and timezone from Cloudflare's request data
    const { city, timezone } = context.request.cf;

    let timeDifference = null;
    let aheadOrBehind = '';
    let isSame = false;

    // Only calculate if a valid timezone is provided
    if (timezone) {
        try {
            const now = new Date();
            
            // Get the current hour in NYC (24-hour format)
            const nycHour = parseInt(new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: 'America/New_York'
            }).format(now));

            // Get the current hour in the visitor's timezone (24-hour format)
            const visitorHour = parseInt(new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: timezone
            }).format(now));

            let diff = visitorHour - nycHour;

            // Adjust for crossing midnight (e.g., California is -3 hours, not +21)
            if (diff > 12) diff -= 24;
            if (diff < -12) diff += 24;

            timeDifference = Math.abs(diff);
            
            if (diff > 0) {
                aheadOrBehind = 'ahead of';
            } else if (diff < 0) {
                aheadOrBehind = 'behind';
            } else {
                isSame = true; // The time difference is 0
            }

        } catch (e) {
            // If the timezone is invalid, we'll just skip the calculation
            console.error("Timezone calculation error:", e);
        }
    }

    // Prepare the data to send to the webpage
    const data = {
        city: city || null,
        timeDifference: timeDifference,
        aheadOrBehind: aheadOrBehind,
        isSame: isSame
    };

    // Return the data as a JSON response
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
};
