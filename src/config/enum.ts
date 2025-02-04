export enum PRIMARYIDTYPE {
  Citizenship = 1,
  Passport = 2,
  Driving_License = 3,
}
export enum STATUSTYPE {
  approved = 1,
  pending = 2,
  rejected = 3,
  completed = 4,
}

export enum AVAILABILITYFREQUENCY {
  Do_Not_Repeat = 1,
  Everyday = 2,
  Weekends = 3,
  Custom = 4,
}

export enum PAYMENTMODE {
  ESEWA = 1,
  KHALTI = 2,
  BANK = 3,
  PROMO = 4,
}

export enum ADMINAPPOINTMENT {
  Instant_call = 1,
  Appointment = 2,
  FollowUp = 3,
}

//Enum for call state
export enum CallState {
  INITIATE = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  COMPLETED = 4,
  MISSED = 5,
}

//Notification Type
export enum NotificationType {
  VIDEOCALL = 1,
  ADMIN = 2,
  GENERAL = 3,
}

export enum AmountType {
  PERCENTAGE = "1",
  AMOUNT = "2",
}
