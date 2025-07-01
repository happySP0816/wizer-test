import React, { useState, useEffect, useMemo } from 'react';

export const useExpirationInfo = (durationInSeconds: number): string | null => {
    const [expirationInfo, setExpirationInfo] = useState<string | null>(null);

    const formattedExpiration = useMemo(() => {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + durationInSeconds * 1000);

        // Format the expiration info
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][expirationDate.getDay()];
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][expirationDate.getMonth()];

        // Get AM or PM
        const amOrPm = expirationDate.getHours() >= 12 ? 'PM' : 'AM';

        // Get hours in 12-hour format
        const hours = expirationDate.getHours() % 12 || 12;

        return `Expires ${dayOfWeek} ${expirationDate.getDate()} ${month} at ${hours}:${String(expirationDate.getMinutes()).padStart(2, '0')} ${amOrPm}`;
    }, [durationInSeconds]);

    useEffect(() => {
        setExpirationInfo(formattedExpiration);
    }, [formattedExpiration]);

    return expirationInfo;
};

