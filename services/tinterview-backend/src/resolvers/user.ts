import { UserModel, IUserModel } from "../models/user";
import { credentials } from "node-credentials";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { google } from "googleapis";
import { GraphqlContext } from "../server/graphqlContext";
// import { JWT } from '../../constants';
export const JWT = {
  SECRET:
    process.env.JWT_SECRET ||
    "134A42C72D0382A29A2C6A1D58A8F0B45C1F29EC96AE047B13D628F7E497D68F",
  EXPIRES_IN: 60 * 60, //1h
};
dotenv.config();

const { client_id, client_secret, redirect_uris } = credentials[
  'google-calendar'
].web;
const client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

export const userResolver = {
  Query: {
    users: async () => {
      return await UserModel.find({});
    },
    currentUser: async (_, __, context: GraphqlContext) => {
      context.checkUser();
      return UserModel.findOne({ email: context.user.email });
    },
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
  Mutation: {
    signUp: async (
      _,
      args: {
        name: string;
        lastname: string;
        pwd: string;
        email: string;
        type: string;
      }
    ) => {
      const userFound = await UserModel.findOne({ email: args.email });
      if (userFound) {
        throw new Error("This user already exists.");
      }
      const saltRounds = 10;
      const hash = await bcrypt.hash(args.pwd, saltRounds);
      const userNew = new UserModel({
        email: args.email,
        lastname: args.lastname,
        name: args.name,
        type: args.type,
        pwd: hash,
      });
      const newUser = await UserModel.create(userNew);
      return newUser;
    },
    signIn: async (_, args: { email: string }) => {
      const user = await UserModel.findOne({ email: args.email });
      // const hash = await bcrypt.compare(args.pwd, user.pwd);
      //if (!hash) {
      // throw new Error('Incorrect email or password.');
      // }
      const token = jwt.sign({ email: user.email }, JWT.SECRET, {
        expiresIn: JWT.EXPIRES_IN,
      });
      return { token };
    },
    signOut: async (_, args: { token: string; email: string }) => {
      const user = await UserModel.findOneAndUpdate(
        { email: args.email, token: args.token },
        { $set: { token: null } },
        { new: true }
      );
      return user;
    },
    googleSignIn: async (_, args: { tokenId: string }) => {
      const ticket = await client.verifyIdToken({
        idToken: args.tokenId,
        audience: client._clientId,
      });
      const payload = ticket.getPayload();
      return payload.sub;
    },

    sendEmailPwd: async (_, args: { email: string }) => {
      const userFound = await UserModel.findOne({ email: args.email });
      if (userFound) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL,
          to: args.email,
          subject: "Reset password instructions for your Tinternet account",
          text:
            "Hi " +
            args.email +
            ", \n" +
            "There was a request to change your password! \n" +
            " If you did not make this request then please ignore this email. \n" +
            "Otherwise, please click this link to change your password: " +
            "http://localhost:3000/new_password?id=" +
            userFound.id +
            "\n" +
            "Thanks, \n" +
            "Tinterview Team.",
        };
        transporter.sendMail(mailOptions, (err: string) => {
          if (err) {
            throw new Error("email error" + err);
          }
        });
      }
      return userFound.email;
    },
    resetPwd: async (_, args: { pwd: string; url: string }) => {
      const url = args.url.split("id=");
      const id = url[1];
      const saltRounds = 10;
      const hash = await bcrypt.hash(args.pwd, saltRounds);

      const user = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { pwd: hash } }
      );
      return user.email;
    },
  },
};
