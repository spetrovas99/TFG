import { UserModel, IUserModel } from '../models/user';
import * as jwt from 'jsonwebtoken';

export const JWT = {
  SECRET:
    process.env.JWT_SECRET ||
    '134A42C72D0382A29A2C6A1D58A8F0B45C1F29EC96AE047B13D628F7E497D68F',
  EXPIRES_IN: 60 * 60, //1h
};

class AuthorizationError extends Error {
  constructor(message = '') {
    super(`Incorrect Autentication ${message}`);
  }
}

export interface GraphqlContext {
  user: IUserModel;
  checkUser: () => boolean;
}

interface IJWTUserData {
  email: string;
}

function isUserData(x: any): x is IJWTUserData {
  return typeof x !== 'string';
}

export async function contextHandler({ request }) {
  const token = request.headers.authorization;
  let user = null;

  function checkUser(message = '') {
    if (!user) {
      throw new AuthorizationError(message);
    }
    return true;
  }

  const context = { checkUser };
  if (!token) return context;

  try {
    
    const userData = jwt.verify(token, JWT.SECRET);
    if (isUserData(userData)) {
      user = await UserModel.findOne({ email: userData.email });
      return { user, ...context };
    } else {
      return context;
    }
  } catch (err) {
    console.error(err);
    return context;
  }
}