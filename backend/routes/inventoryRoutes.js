const express = require("express");
const jwt = require("jsonwebtoken");
const secret = require("../configs").secret;
const inventoryRoutes = express.Router();
const User = require("../models/User");

inventoryRoutes.get("/:token", (req, res) => {
  const token = req.params.token;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.json({
        err,
      });
    } else {
      User.findById(decoded.user._id)
        .then((user) => {
          res.json({
            inventory: user.inventory,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            err,
          });
        });
    }
  });
});

inventoryRoutes.post("/add", (req, res) => {
  const { token, item } = req.body;
  console.log(token, item);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.json({
        err,
      });
    } else {
      User.findById(decoded.user._id)
        .then((user) => {
          console.log(user);
          user.inventory.push(item);
          user.save().then((usr) =>
            res.json({
              msg: "Successfully added new item!",
              usr,
            })
          );
        })
        .catch((err) => {
          console.log(err);
          res.json({
            err,
          });
        });
    }
  });
});

module.exports = inventoryRoutes;