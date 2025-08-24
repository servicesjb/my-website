export const onRequestGet = async (context) => {
    const { city, timezone } = context.request.cf;

    let timeDifference = null;
    let aheadOrBehind = '';
    let isSame = false;
    let localTime = null; // Variable to hold the current time string

    if (timezone) {
        try {
            const now = new Date();
            const nycTimeZone = 'America/New_York';
            
            const nycHour = parseInt(new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: nycTimeZone
            }).format(now));

            const visitorHour = parseInt(new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: timezone
            }).format(now));

            let diff = visitorHour - nycHour;
            
            if (diff > 12) diff -= 24;
            if (diff < -12) diff += 24;

            timeDifference = Math.abs(diff);
            
            if (diff > 0) {
                aheadOrBehind = 'ahead of';
            } else if (diff < 0) {
                aheadOrBehind = 'behind';
            } else {
                isSame = true;
                // ** NEW ** If in the same timezone, format the current time
                const timeFormatter = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: nycTimeZone
                });
                localTime = timeFormatter.format(now);
            }
        } catch (e) {
            console.error("Timezone calculation error:", e);
        }
    }

    const data = {
        city: city || null,
        timeDifference: timeDifference,
        aheadOrBehind: aheadOrBehind,
        isSame: isSame,
        localTime: localTime // ** NEW ** Include the time in the data
    };

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
};
