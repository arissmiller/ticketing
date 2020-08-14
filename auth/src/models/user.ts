import mongoose from 'mongoose';
import { Password } from '../services/password';

//interface for new users
interface userAttrs {
  email: string;
  password: string;
}

//describes user model
interface UserModel extends mongoose.Model<any> {
  build(attrs: userAttrs): UserDoc;
}

//describres properties of user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret.__id;
      delete ret.__id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
