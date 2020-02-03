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

// const urlVariable = 'http://localhost:3000/user/message/';
const urlVariable = 'https://quiz-prank.herokuapp.com/user/message/';

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
       .populate('user')
       .exec()
       .then(result => {
           var isEmpty;
           var messageCount = result.length;
           if (result.length ==  0){
               isEmpty = true;
           } else {
               isEmpty = false;
           }
           const array = {
               result : result,
               url: urlVariable + id,
               isEmpty: isEmpty,
               messageCount: messageCount
           };

            console.log(result);
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
    fs.readFile("./api/routes/temp.txt", "utf-8", (err, data) => {
         var count = Number(data);
         let userCount;
         let messageCount;

        Message.find()
            .exec()
            .then(result=> {

                messageCount = result.length;

                User.find()
                    .exec()
                    .then(
                        result => {
                            userCount = result.length;
                            res.json({
                                user_count: userCount,
                                message_count: messageCount
                            })
                        }
                    )


            })
            .catch();






    });


});
router.get('/logout', function(req, res){
    // const cookieTest = req.cookies;
    res.clearCookie("id");

    // console.log(req.headers.cookie.id);
    // for (var prop in cookie) {
    //     if (!cookie.hasOwnProperty(prop)) {
    //         continue;
    //     }
    //     res.cookie(prop, '', {expires: new Date(0)});
    // }
    // res.redirect('/');
});

router.get('/data', (req, res, next) => {
    User.aggregate([
        {
            $lookup: {
                from: 'messages',
                localField: '_id',
                foreignField: 'user',
                as: 'message'
            }
        },
        {
            $addFields: {
                message: "$message"
            }
        }
    ])
        .then(
                result => res.send(result)
        );
});



module.exports = router;
