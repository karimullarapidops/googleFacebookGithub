const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            // required: true,
            // unique: true,
            lowercase: true
        },
        password: {
            type: String
            // required: true
        } 
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    github: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }
});

userSchema.pre('save', async function(next) {
    try {
        if (this.method !== 'local') {
            next();
        }
        // Generate a salt
      const salt = await  bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.local.password, salt);
      // Re-assign hashed version original, plainn text password
      this.local.password = passwordHash;
      next();
    //   console.log('salt', salt);
    //   console.log('normal password', this.password);
    //   console.log('hashed password', passwordHash);
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        console.log("this.local.password", this.local.password);
        console.log("newPassword", newPassword);
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}


// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;