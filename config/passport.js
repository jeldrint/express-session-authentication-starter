const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const { validPassword } = require('../lib/passwordUtils');
const User = connection.models.User;

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
}

const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            return done(null, false, {message: 'Incorrect username'})
        }

        const isValid = validPassword(password, user.hash, user.salt)

        if(isValid){
            return done(null,user)
        }else{
            return done(null,false)
        }
    }catch(err){
        return done(err)
    }
    
}

passport.use(new LocalStrategy(customFields, verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (userId, done) =>{
    try {
        const user = await User.findById(userId);
        done(null,user)
    }catch(err){
        done(err);
    }
})