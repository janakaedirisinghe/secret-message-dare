const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url');
const User = require('../model/user');
const Message = require('../model/message');
const handlebars = require('express-handlebars');
const cookie = require('cookie');
const fs = require('fs');

// express.use(express.static('public'));

const urlVariable = 'http://localhost:3000/user/message/';
// const urlVariable = 'https://quiz-prank.herokuapp.com/user/message/';

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

                res.setHeader('Set-Cookie', cookie.serialize('id', result._id), {
                    httpOnly: true,

                    expires: 60 * 60 * 24 * 7
            });
                // count
                fs.readFile("./api/routes/temp.txt", "utf-8", (err, data) => {
                    var count = Number(data)+1;

                    fs.writeFile("./api/routes/temp.txt", count, (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                    });


                });
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
   Message.find({ user: id})
       .exec()
       .then(result => {
           const array = {
               result : result,
               url: urlVariable + id
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

   User.findById(id)
       .exec()
       .then( result => {
           res.render("inputMessage",{data: result});
       })
       .catch();

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

router.get('/count', (req,res,next) => {

// file write
    // var data = "New File Contents";
    //


    // file read
    fs.readFile("./api/routes/temp.txt", "utf-8", (err, data) => {
        var count = Number(data);
        //
        // fs.writeFile("./api/routes/temp.txt", count, (err) => {
        //     if (err) console.log(err);
        //     console.log("Successfully Written to File.");
        // });

        res.json({
            count: count
        })

    });



});



module.exports = router;
