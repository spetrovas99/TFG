import { userResolver } from "./user";
import { calendarResolver } from "./calendar"

export const allResolvers = [
    userResolver,
    calendarResolver,
];
