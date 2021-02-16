import { credentials } from "node-credentials";
import { google } from "googleapis";
import { GraphqlContext } from "../server/graphqlContext";
import { UserModel, IUserModel } from "../models/user";

const { client_id, client_secret, redirect_uris } = credentials[
    'google-calendar'
  ].web;
  const client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  export const calendarResolver = {
    Query: {
      calendarEvents: async (_, __, context: GraphqlContext) => {
        client.setCredentials({
          refresh_token: context.user.refreshToken,
        });
        context.checkUser();
        const calendar = google.calendar({ version: "v3", auth: client });
        const events = await calendar.events
          .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
          })
          .catch((_) => {
            throw new Error("Invalid Credentials");
          });
  
        return events.data.items.map((event) => {
          return {
            start: event.start,
            end: event.end,
          };
        });
      },
    },
}