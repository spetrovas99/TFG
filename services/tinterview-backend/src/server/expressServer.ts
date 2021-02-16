import { GraphQLServer } from 'graphql-yoga';
import { google } from 'googleapis';
const { credentials } = require('node-credentials');
import * as jwt from 'jsonwebtoken';
const passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user';


export const JWT = {
  SECRET:
    process.env.JWT_SECRET ||
    '134A42C72D0382A29A2C6A1D58A8F0B45C1F29EC96AE047B13D628F7E497D68F',
  EXPIRES_IN: 60 * 60, //1h
};

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar.readonly',
];

const { client_id, client_secret, redirect_uris } = credentials[
  'google-calendar'
].web;

const client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findOne({ googleId: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      scope: SCOPES,
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: redirect_uris[0],
    },
    function(accessToken, refreshToken, profile, done) {
      
      UserModel['findOneOrCreate'](
        {
          googleId: profile.id,
        },
        {
          googleId: profile.id,
          name: profile.displayName,
          email: profile._json.email,
          accessToken,
          refreshToken,
        },
      )
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    },
  ),
);

const googleAuthenticateOptions = {
  accessType: 'offline',
  approvalPrompt: 'force',
  failureRedirect: '/login',
};

export async function expressServer(server: GraphQLServer) {
  const app = server.express;

  app.get('/api/v1/health', (req, res) => {
    res.json({ success: true });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    '/api/auth',
    passport.authenticate('google', googleAuthenticateOptions),
    (req, res) => {
      res.json({
        success: true,
        error: false,
      });
    },
  );

  app.get(
    '/api/auth/token',
    passport.authenticate('google', googleAuthenticateOptions),
    function(req: any, res) {
      // Successful authentication, redirect home.
      // res.redirect('/api/profile');
      const jwTtoken = jwt.sign({ email: req.user }, JWT.SECRET, {
        expiresIn: JWT.EXPIRES_IN,
      });

      res.json({
        user: req.user,
        jwTtoken: jwTtoken,
      });
    },
  );

  // function getOAuth2Client() {
  //   const { client_secret, client_id, redirect_uris } = credentials[
  //     'google-calendar'
  //   ].web;

  //   const oAuth2Client = new google.auth.OAuth2(
  //     client_id,
  //     client_secret,
  //     redirect_uris[0],
  //   );
  //   return oAuth2Client;
  // }

  // app.get('/api/auth', (req, res) => {
  //   const authUrl = getOAuth2Client().generateAuthUrl({
  //     access_type: 'offline',
  //     scope: SCOPES,
  //   });

  //   res.json({ authUrl });
  // });

  // app.get('/api/auth/token', async (req, res) => {
  //   const code: any = req.query.code;
  //   const auth = getOAuth2Client();
  //   const { tokens } = await auth.getToken(code);
  //   auth.setCredentials(tokens);
  //   google.options({ auth });
  //   const userInfo = await google.people('v1').people.get({
  //     resourceName: 'people/me',
  //     personFields: 'emailAddresses,names,photos,id',
  //   });

  //   res.json({ tokens, userInfo });
  // });
}
