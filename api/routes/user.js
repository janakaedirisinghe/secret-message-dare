const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url');
const User = require('../model/user');
const handlebars = require('express-handlebars');

router.post('/', (req,res,next) => {
   const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name
   });

   user.save()
       .then(
            result => {
               const urlMessage =  url.format({
                  protocol: req.protocol,
                  host: req.get('host'),
                  pathname: req.originalUrl
               }) + '/' + result._id ;
               res.redirect(urlMessage);

            }



       )
       .catch(err => {
          res.status(500).json({
             error:err
          })
       });
});

router.get('/:id',(req,res,next) => {

   const id = req.params.id;
   User.findById(id)
       .exec()
       .then(
           result => {
               const array = {
                 result : result,
                 url: url.format({
                       protocol: req.protocol,
                       host: req.get('host'),
                       pathname: req.originalUrl
                   }),
               };

              res.render("message", { data : array });

           }
       )
       .catch(err=>{
          res.json({
             error:err
          })
       });
   //
});



module.exports = router;
