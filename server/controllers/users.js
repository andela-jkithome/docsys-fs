(function() {
  'use strict';
  var User = require('../models/users'),
    Roles = require('../models/roles'),
    jwt = require('jsonwebtoken');
  module.exports = {
    login: function(req, res) {
      // Find the user
      User.findOne({
        username: req.body.username
      }).populate('role').exec(function(err, user) {

        if (err) throw err;

        // If user doesn't exist
        if (!user) {
          res.json({
            error: 'User not found.'
          });
        } else if (user) {
          var validPassword = user.comparePassword(req.body.password);

          // If the password is wrong.
          if (!validPassword) {
            res.json({
              error: 'Wrong password.'
            });
          } else {

            // If user is found and password is right
            // Create a token
            var data = {
              _id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
            var token = jwt.sign(data, req.app.get('superSecret'), {
              expiresIn: 3600 // expires in 24 hours
            });
            user.loggedIn = true;
            user.token = token;

            user.save(function(err) {
              if (err) {
                res.status(500).send(err);
              } else {
                // return the information including token as JSON
                res.json({
                  message: 'User successfully logged in.',
                  user: data,
                  token: token
                });
              }
            });
          }
        }
      });
    },

    all: function(req, res) {
      User.find({}, function(err, users) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(users);
          }
        })
      .populate('role')
        // Sort by latest created
      .sort({
        createdAt: -1
      });
    },

    create: function(req, res) {
      var user = new User();
      var saveUser = function() {
        // Fetch user details from REST request.
        user.username = req.body.username;
        user.name.first = req.body.firstname;
        user.name.last = req.body.lastname;
        user.email = req.body.email;
        // Hash the password usinh SHA1 algorithm
        user.password = req.body.password;
        user.save(function(err) {
          if (err) {
            if (err.code === 11000) {
              res.status(409).send(err);
            } else if (err.name === 'ValidationError') {
              res.status(400).send(err);
            } else {
              res.status(500).send(err);
            }
          } else {
            res.json({
              message: 'User created successfully.'
            });
          }
        });
      };
      // If no role is defined during user creation
      if (!req.body.role) {
        Roles.findOne({
          // Use default user
          title: Roles.schema.paths.title.default()
        }, function(err, role) {
          if (err) {
            res.status(500).send(err);
          } else {
            user.role = role._id;
            saveUser();
          }
        });
      } else {
        // If the user role is defined
        Roles.findOne({
          title: req.body.role
        }, function(err, role) {
          if (err) {
            res.status(500).send(err);
          } else {
            user.role = role._id;
            saveUser();
          }
        });
      }


    },

    find: function(req, res) {
      User.findById(req.params.id).populate('role').exec(function(err, user) {
        if (err) {
          res.json({
            error: 'Error fetching user.'
          });
        } else {
          var data = {
              _id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          res.json(data);
        }
      });
    },

    update: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else {
          if (req.body.username) {
            user.username = req.body.username;
          }
          if (req.body.firstname) {
            user.name.first = req.body.firstname;
          }
          if (req.body.lastname) {
            user.name.last = req.body.lastname;
          }
          if (req.body.email) {
            user.email = req.body.email;
          }
          if (req.body.password) {
            user.password = req.body.password;
          }
          user.save(function(err) {
            if (err) {
              if (err.code === 11000) {
                res.status(409).send(err);
              } else if (err.name === 'ValidationError') {
                res.status(400).send(err);
              } else {
                res.status(500).send(err);
              }
            } else {
              res.json({
                message: 'User updated succesfully.'
              });
            }
          });
        }
      });
    },

    deleteOne: function(req, res) {
      User.remove({
        _id: req.params.id
      }, function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({
            message: 'User deleted successfully.'
          });
        }
      });
    },

    logout: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.json({
            error: 'Error fetching user.'
          });
        } else {
          user.loggedIn = false;
          user.token = null;
          user.save(function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
              res.json({
                message: 'User logged out succesfully.'
              });
            }
          });
        }
      });
    },

    session: function(req, res) {
      User.findById(req.decoded._id, function(err,user) {
        if(err) {
          res.json({
            error: 'Error fetching user.'
          });
        } else {
          var token = req.body.token || req.query.token || req.headers['x-access-token'];
          if(user.token === token && user.loggedIn === true) {
            res.json({
              loggedIn: true
            });
          } else {
            res.json({
              loggedIn: false
            });
          }
        }
      });
    }
  };
})();
