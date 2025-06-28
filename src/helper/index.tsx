export const getNumberOfDaysLeft = (dateFuture: number) => {
    const now = Math.floor(Date.now() / 1000)
  const difference = (dateFuture - now)

  const timeLeft = convertDuration(difference)

  return timeLeft
}

const convertDuration = (seconds: number) => {
    const secondsInADay = 24 * 60 * 60;
    const secondsInAnHour = 60 * 60;
  
    const days = Math.floor(seconds / secondsInADay);
    const remainingSeconds = seconds % secondsInADay;
  
    const hours = Math.floor(remainingSeconds / secondsInAnHour);
    const remainingMinutes = Math.floor((remainingSeconds % secondsInAnHour) / 60);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      return 'Less than a minute';
    }
  };