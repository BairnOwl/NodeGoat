var bcrypt = require("bcrypt-nodejs");

/* The UserDAO must be constructed with a connected database object */
function UserDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UserDAO)) {
        console.log("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO(db);
    }

    var usersCol = db.collection("users");

    this.addUser = function(userName, firstName, lastName, password, email, callback) {

        /*************** SECURITY ISSUE ****************
         ** Why shouldn't we store passwords in the   **
         ** database using plaintext?                 **
         ** Note: the bcrypt module helps fix this    **
         ***********************************************/

        // Create user document
        // var user = {
        //     userName: userName,
        //     firstName: firstName,
        //     lastName: lastName,
        //     benefitStartDate: this.getRandomFutureDate(),
        //     password: password //received from request param
        // };


        // What we did: use hashing for the password

        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var passwordHash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            password: passwordHash
        };

        if (bcrypt.compareSync(password, user.password)) {
            callback(null, user);
        } else {
            callback(invalidPasswordError, null);
        }

        // Add email if set
        if (email !== "") {
            user.email = email;
        }

        this.getNextSequence("userId", function(err, id) {
            if (err) {
                return callback(err, null);
            }
            console.log(typeof(id));

            user._id = id;

            usersCol.insert(user, function(err, result) {

                if (!err) {
                    return callback(null, result.ops[0]);
                }

                return callback(err, null);
            });
        });
    };

    this.getRandomFutureDate = function() {
        var today = new Date();
        var day = (Math.floor(Math.random() * 10) + today.getDay()) % 29;
        var month = (Math.floor(Math.random() * 10) + today.getMonth()) % 12;
        var year = Math.ceil(Math.random() * 30) + today.getFullYear();
        return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
    };

    this.validateLogin = function(userName, password, callback) {

        // Callback to pass to MongoDB that validates a user document
        function validateUserDoc(err, user) {

            if (err) return callback(err, null);

            if (user) {
                if (comparePassword(password, user.password)) {
                    callback(null, user);
                } else {
                    var invalidPasswordError = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalidPasswordError.invalidPassword = true;
                    callback(invalidPasswordError, null);
                }
            } else {
                var noSuchUserError = new Error("User: " + user + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                noSuchUserError.noSuchUser = true;
                callback(noSuchUserError, null);
            }
        }

        // Helper function to compare passwords
        function comparePassword(fromDB, fromUser) {
            return fromDB === fromUser;
            //if you encrypt your password, you have to decrypt here
            //better to use the bcrypt.compareSync function
        }

        usersCol.findOne({
            userName: userName
        }, validateUserDoc);
    };

    this.getUserById = function(userId, callback) {
        usersCol.findOne({
            _id: parseInt(userId)
        }, callback);
    };

    this.getUserByUserName = function(userName, callback) {
        usersCol.findOne({
            userName: userName
        }, callback);
    };

    this.getNextSequence = function(name, callback) {
        db.collection("counters").findAndModify({
                _id: name
            }, [], {
                $inc: {
                    seq: 1
                }
            }, {
                new: true
            },
            function(err, data) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, data.value.seq);
            }
        );
    };
}

module.exports.UserDAO = UserDAO;
