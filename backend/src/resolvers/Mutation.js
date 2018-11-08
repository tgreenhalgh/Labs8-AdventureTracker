const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  // async createTrip(parent, args, ctx, info) {
  //   // TODO: Check if they are logged in

  //   const trip = await ctx.db.mutation.createTrip(
  //     {
  //       data: {
  //         // Below is the same as manually adding in each field
  //         ...args
  //       }
  //     },
  //     info
  //   );
  //   return trip;
  // },
  // updateTrip(parent, args, ctx, info) {
  //   // first take a copy of the updates
  //   const updates = { ...args };
  //   // remove the ID from the updates
  //   delete updates.id;
  //   // run the update method
  //   return ctx.db.mutation.updateTrip(
  //     {
  //       data: updates,
  //       where: {
  //         id: args.id
  //       }
  //     },
  //     info
  //   );
  // },
  // async deleteTrip(parent, args, ctx, info) {
  //   const where = { id: args.id };
  //   // find the item
  //   const item = await ctx.db.query.item({ where }, `{ id title}`);
  //   // check if they own that item, or have the permissions
  //   // TODO
  //   // Delete it
  //   return ctx.db.mutation.deleteItem({ where }, info);
  // },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      },
      info
    });
    // create the JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // Return the user to the browser
    return user;
  },
  async signin(parent, { name, password }, ctx, info) {
    // check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for username ${name}`);
    }
    // check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password');
    }
    // generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // return the user
    return user;
  },
  
  async deleteUser(parent, { id }, ctx, info) {
    const deletedUser = await ctx.db.mutation.deleteUser({
      where: {
        id
      }
    });

    return deletedUser;
  }
  // signout(parent, args, ctx, info) {
  //   ctx.response.clearCookie('token');
  //   return { message: 'Goodbye' };
  // }
};

module.exports = Mutations;
