export function isTimeInRange(
  start: string,
  end: string,
  target: string
): boolean {
  const startTime = getTimeInMinutes(start);
  const endTime = getTimeInMinutes(end);
  const targetTime = getTimeInMinutes(target);

  // if (startTime <= targetTime && targetTime < endTime) {
  //   console.log(true);
  // } else console.log(false);
  return startTime <= targetTime && targetTime < endTime;
}

export function getTimeInMinutes(time: string): number {
  const [hours, minutes] = time ? time.split(":").map(Number) : [0, 0];

  return hours * 60 + minutes;
}

export function getMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  console.log(hours);
  return minutes;
}

export function getMinutesDifference(
  startTime: string,
  endTime: string
): number {
  const start = new Date();
  const end = new Date();

  const [startHour, startMinute] = startTime.split(":");
  const [endHour, endMinute] = endTime.split(":");

  start.setHours(Number(startHour), Number(startMinute), 0);
  end.setHours(Number(endHour), Number(endMinute), 0);

  const differenceInMilliseconds = end.getTime() - start.getTime();
  const minutesDifference = Math.floor(differenceInMilliseconds / (1000 * 60));

  return minutesDifference;
}

export function addOneHour(timeString: string): string {
  const [hours, minutes] = timeString.split(":");

  // Create a new Date object with the input time
  const time = new Date();
  time.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  // Add one hour to the time
  time.setHours(time.getHours() + 1);

  // Get the updated hours and minutes
  const updatedHours = time.getHours();
  const updatedMinutes = time.getMinutes();

  return `${updatedHours}:${updatedMinutes.toString().padStart(2, "0")}:00`;
}
