const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url');
const User = require('../model/user');
const Message = require('../model/message');
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
               }) + '/home/' + result._id ;
               res.redirect(urlMessage);

            }



       )
       .catch(err => {
          res.status(500).json({
             error:err
          })
       });
});

router.get('/home/:id',(req,res,next) => {

   const id = req.params.id;
   // User.findById(id)
   //     .exec()
   //     .then(
   //         result => {
   //
   //
   //         }
   //     )
   //     .catch(err=>{
   //        res.json({
   //           error:err
   //        })
   //     });

   Message.find({ user: id})
       .exec()
       .then(result => {
           const array = {
               result : result,
               // url: url.format({
               //       protocol: req.protocol,
               //       host: req.get('host'),
               //       pathname: req.originalUrl
               //   }),
               url: 'http://localhost:3000/user/message/'+ id+'' ,
           };
            // res.json(array);
           res.render("message", { data : array });
       })
       .catch(err=> {
          res.status(500).json({
              error:err
          })
       });

});

router.get('/message/:id', (req,res,next) => {
   const id = req.params.id;
   const array = {
     id:id
   };
   res.render("inputMessage",{data: array});
});

router.post('/message' , (req,res,next) => {
    const message = new Message({
       _id: new mongoose.Types.ObjectId(),
        user: req.body.id,
        message: req.body.message
   });

    message.save()
        .then(
           res.redirect('/')
        )
        .catch();

});



module.exports = router;
