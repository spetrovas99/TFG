import { Document, Model, model, Schema } from "mongoose";
import { ObjectID } from "bson";
import timestamps from "mongoose-timestamp";

export interface IUserModel extends Document {
    _id: ObjectID;
    email: string;
    lastname: string;
    name: string;
    googleId: string;
    accessToken: string;
    refreshToken: string;
    pwd: string;
    token: string;
    type: string;
    departament: string;
    position: string;
    seniority: string;
    
}

const UserSchema: Schema = new Schema({
    email: { type: String, unique: true },
    lastname: { type: String },
    name: { type: String },
    pwd: { type: String },
    googleId: { type: String },
    accessToken: { type:String },
    refreshToken: { type: String },
    token: { type: String },
    type: { type: String, enum: ["Recruiter", "Interviewer", "Candidate"] },
    departament: { type: String, enum: ["Development", "QA", "SRE", "Salesforce", "Data"] },
    position: { type: String, enum: ["Frontend", "Backend", "Fullstack", "VP", "Tech Director", "CTO", "Teach Lead - Backend", "Teach Lead - Frontend", "Tech Director", "Engineer Manager", "QA Engineer", "Senior SRE", "Lead SRE", "Tech Lead", "Salesforce developer", "Data Scientist", "Data Engineer"] },
    seniority: { type: String, enum: ["Junior", "Senior", "Mid", "Tech Director", "VP", "Teach Lead", "Lead", "CTO", "EM"] },
});

UserSchema.static('findOneOrCreate', async function findOneOrCreate(
    condition,
    doc,
  ) {
    const one = await this.findOne(condition);
  
    if (one) {
      await one.update(doc);
      return one;
    }
    return this.create(doc);
  });
  
  UserSchema.plugin(timestamps);
  export const UserModel: Model<IUserModel> = model<IUserModel>(
    'UserModel',
    UserSchema,
  );
