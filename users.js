module.exports = function (app, mongo, autoIncrement, sha1, generateToken) {
  
  app.post('/users', function (req, res) {
    // Validation
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.phoneNumber) 
      return res.sendStatus(400);
    // Query database: first, check if email or username already exists
    mongo.getDB().collection('users').count({
      $or: [{email: req.body.email}, {username: req.body.username}]
    }, function(err, count) {
      if (count > 0) 
        // Email or username already exists
        return res.sendStatus(403);
      // Insert into database
      autoIncrement.getNextSequence(mongo.getDB(), 'users', function (err, autoIndex) {
        mongo.getDB().collection('users').insertOne({
          _id: autoIndex,
          email: req.body.email,
          username: req.body.username,
          password: sha1(req.body.email + req.body.password),
          phoneNumber: req.body.phoneNumber,
          admin:req.body.admin,
          rating:0,
          ratingCount:0
          // admin: false
        }, function(err, result) {
          var token = generateToken(result.insertedId);
          res.json({
            userid: result.insertedId,
            token: token
          });
        });
      });
    });
  });

    // Log in
  app.post('/login', function (req, res) {
    // Validation
    if (!req.body.email || !req.body.password)
      return res.sendStatus(400);
    // Query database
    mongo.getDB().collection('users').find({
      email: req.body.email,
      password: sha1(req.body.email + req.body.password)
    }).toArray(function(err, docs) {
      if (docs.length == 0) {
        return res.sendStatus(403);
      }
      var token = generateToken(docs[0]._id);
      res.json({
        userID: docs[0]._id,
        token: token
      });
    });
  });
  
  //update user info
  app.put('/users/:uid/editinfo',function (req,res,next){
    mongo.getDB().collection('users').find({
      _id : parseInt(req.params.uid)
    }).toArray(function (err, docs){
      if(docs.length == 0){
        return res.sendStatus(403);
      } else{
        next();
      }
    });
  });

  app.put('/users/:uid/editinfo',function (req,res,next){
    if(req.body.username){
      mongo.getDB().collection('users').updateOne({
        _id: parseInt(req.params.uid)
      },{
        $set:{username: req.body.username}
      },function(err,result) {
        next();
      });
    }
    else{
      next();
    }
  });

  app.put('/users/:uid/editinfo',function (req,res,next){
    if(req.body.phoneNumber){
      mongo.getDB().collection('users').updateOne({
        _id: parseInt(req.params.uid)
      },{
        $set:{phoneNumber: req.body.phoneNumber}
      },function (err,result){
        next();
      });
    }
    else{
      next();
    }
  });

  app.put('/users/:uid/editinfo',function (req,res,next){
    if(req.body.newpassword){
      mongo.getDB().collection('users').updateOne({
        _id: parseInt(req.params.uid)
    },{
      $set:{password: sha1(req.body.email+req.body.newpassword)}
    },function (err,result){
      res.sendStatus(200);
    });
    }else{
      res.sendStatus(200);
    }
  });


  // get user's purchase history.
  app.get('/users/:uid/private/pricelh',function (req,res){
    mongo.getDB().collection('posts').find({
      buyerID : parseInt(req.params.uid)
    }).sort({price:+1}).toArray(function(err,docs){
      var purchses = [];
      for (var i = 0; i < docs.length; i++){
        purchses.push({postID:docs[i]._id,
          descriptions:docs[i].description, price:docs[i].price, 
          posterID:docs[i].posterID,post_date:docs[i].date});
      }
            console.log("here?");
      res.json({
        userid:parseInt(req.params.uid),
        history: purchses
      });
    });
  });

    app.get('/users/:uid/private/pricehl',function (req,res){
    mongo.getDB().collection('posts').find({
      buyerID : parseInt(req.params.uid)
    }).sort({price:-1}).toArray(function(err,docs){
      var purchses = [];
      for (var i = 0; i < docs.length; i++){
        purchses.push({postID:docs[i]._id,
          descriptions:docs[i].description, price:docs[i].price,
        posterID:docs[i].posterID,post_date:docs[i].date});
      }

      res.json({
        userid:parseInt(req.params.uid),
        history: purchses
      });
    });
  });


  app.get('/users/:uid/private/datahl',function (req,res){
    mongo.getDB().collection('posts').find({
      buyerID : parseInt(req.params.uid)
    }).sort({date:-1}).toArray(function(err,docs){
      var purchses = [];
      for( var i = 0; i < docs.length; i++){
        purchses.push({postID:docs[i]._id,
          descriptions:docs[i].description, price:docs[i].price,
        posterID:docs[i].posterID,post_date:docs[i].date});
      }
      res.json({
        userid:parseInt(req.params.uid),
        history:purchses
      });
    });
  });

    app.get('/users/:uid/private/datalh',function (req,res){
    mongo.getDB().collection('posts').find({
      buyerID : parseInt(req.params.uid)
    }).sort({date:+1}).toArray(function(err,docs){
      var purchses = [];
      for( var i = 0; i < docs.length; i++){
        purchses.push({postID:docs[i]._id,
          descriptions:docs[i].description, price:docs[i].price,
        posterID:docs[i].posterID,post_date:docs[i].date});
      }
      res.json({
        userid:parseInt(req.params.uid),
        history:purchses
      });
    });
  });


  //get user's posts
  app.get('/users/:uid/info/pricehl',function (req, res){
    mongo.getDB().collection('posts').find({
      posterID: parseInt(req.params.uid)
    }).sort({price:-1}).toArray(function(err,docs){
      var list_posts = [];
      for (var i = 0; i< docs.length; i++) {
        list_posts.push({postID:docs[i]._id, postDate:docs[i].date,
          description:docs[i].description, price:docs[i].price});
      }
      res.json({
        userid:parseInt(req.params.uid),
        //info: info,
        list_posts: list_posts
      });
    });
  });

    app.get('/users/:uid/info/pricelh',function (req, res){
    mongo.getDB().collection('posts').find({
      posterID: parseInt(req.params.uid)
    }).sort({price:+1}).toArray(function(err,docs){
      var list_posts = [];
      for (var i = 0; i< docs.length; i++) {
        list_posts.push({postID:docs[i]._id, postDate:docs[i].date,
          description:docs[i].description, price:docs[i].price});
      }
      res.json({
        userid:parseInt(req.params.uid),
        list_posts: list_posts
      });
    });
  });

    app.get('/users/:uid/info/datehl',function (req, res){
    mongo.getDB().collection('posts').find({
      posterID: parseInt(req.params.uid)
    }).sort({date:-1}).toArray(function(err,docs){
      var list_posts = [];
      for (var i = 0; i< docs.length; i++) {
        list_posts.push({postID:docs[i]._id, postDate:docs[i].date,
          description:docs[i].description, price:docs[i].price});
      }
      res.json({
        userid:parseInt(req.params.uid),
        list_posts: list_posts
      });
    });
  });

    app.get('/users/:uid/info/datelh',function (req, res){
    mongo.getDB().collection('posts').find({
      posterID: parseInt(req.params.uid)
    }).sort({date:+1}).toArray(function(err,docs){
      var list_posts = [];
      for (var i = 0; i< docs.length; i++) {
        list_posts.push({postID:docs[i]._id, postDate:docs[i].date,
          description:docs[i].description, price:docs[i].price});
      }
      res.json({
        userid:parseInt(req.params.uid),
        list_posts: list_posts
      });
    });
  });


  //delete users
  app.delete('/users/:uid',function (req, res) {

    mongo.getDB().collection('users').count({
      _id:parseInt(req.params.uid)
    },function (err, count){
      if(count == 0){
        return res.sendStatus(404);
      }
      mongo.getDB().collection('users').deleteOne({
        _id:parseInt(req.params.uid)
      },function (err,result){
        mongo.getDB().collection('posts').remove({
          posterID:parseInt(req.params.uid)
        },function (err,result){
        });
        res.sendStatus(200);
      });
    });
  });


    // get one specific post for rating.
    app.get('/posts/:pid',function (req, res){
        var id = parseInt(req.params.pid);
      if(!id){
        id=req.params.pid;
      }
      mongo.getDB().collection('posts').find({
        _id :id
      }).toArray(function (err,docs){
        if (docs.length == 0)
          return res.sendStatus(403);
        var price = docs[0].price;
        var title = docs[0].title;
        var description = docs[0].description;
        res.json({
        postid: id,
        price: price,
        title: title,
        description: description
      });
    });
  });

    // update the personal rating.
  //   app.put('/rating/:pid',function (req, res){
  //     mongo.getDB().collection('posts').find({
  //       _id : parseInt(req.params.pid)
  //     }).toArray(function (err, docs){
  //       var rate_obj = docs[0].posterID;
  //       // console.log(rate_obj);
  //        mongo.getDB().collection('users').find({
  //           _id : rate_obj
  //          }).toArray(function (err, docs){
  //           var ratingCount = docs[0].ratingCount;
  //           var rating = docs[0].rating;
  //           var new_rating = (parseInt(rating*ratingCount) + parseInt(req.body.rating))/(parseInt(ratingCount)+1);
  //           new_rating= new_rating.toFixed(2);
  //           mongo.getDB().collection('users').updateOne({
  //             _id : rate_obj},
  //          {
  //           $set:{ratingCount: (ratingCount+1), rating: new_rating}
  //          },
  //          function(err,result){
  //           res.sendStatus(200);
  //          });
  //       });
  //     });
  // });

    app.put('/rating/:pid',function (req, res){
      var id = parseInt(req.params.pid);
      if(!id){
        id=req.params.pid;
      }
      mongo.getDB().collection('posts').find({
        _id :id
      }).toArray(function (err, docs){
        var rate_obj = docs[0].posterID;
        // console.log(rate_obj);
         mongo.getDB().collection('users').find({
            _id : rate_obj
           }).toArray(function (err, docs){
            var ratingCount = docs[0].ratingCount;
            var rating = docs[0].rating;
            var new_rating = (parseInt(rating*ratingCount) + parseInt(req.body.rating))/(parseInt(ratingCount)+1);
            new_rating= new_rating.toFixed(2);
            // console.log(ratingCount);
            // console.log(rating);
            // console.log(new_rating);
            // console.log(req.body.rating);
            mongo.getDB().collection('users').updateOne({
              _id : rate_obj},
           {
            $set:{ratingCount: (ratingCount+1), rating: new_rating}
           },
           function(err,result){
            res.sendStatus(200);
           });
        });
           mongo.getDB().collection('posts').removeOne({
            _id: id
           },function(err,result){
           });
      });
  });

     // purchase button. add buyer
   app.put('/description/:uid',function (req,res){
    // //var buyer = parseInt(req.params.uid);
    // console.log(req.body);
    // console.log("uid:"+parseInt(req.params.uid));
    // console.log(req.body.postID);
    mongo.getDB().collection('posts').updateOne({
      // _id : parseInt(req.params.pid)
      _id : req.body.postID
    } ,{
      $set:{buyerID: parseInt(req.params.uid)}
    },function (err, result){
      // mongo.getDB().collection('posts').findOne({
      //   _id : parseInt(req.body.postID)
      // }, function(err,ress){
      //   console.log(ress);
      // });
      if (result.matchedCount == 0)
        console.log("what?");
      if(err){
        console.log(err);
        // throw(err);
      }
      res.send({cool:""});
    });
   });



    //get all users
    app.get('/admin',function (req,res){
      mongo.getDB().collection('users').find().toArray(function (err,docs){
        var all_users = [];
      for (var i = 0; i < docs.length; i++){
        all_users.push({username:docs[i].username,
          email:docs[i].email, rating:docs[i].rating, phoneNumber:
          docs[i].phoneNumber});
      }
      res.json({
        all_users : all_users
      });
    });
   });

   //promote a user to admin
   app.put('/users/:uid/admin',function (req,res,next){
    mongo.getDB().collection('users').find({
      _id: parseInt(req.params.uid)
   }).toArray(function (err,docs){
      if(!docs[0].admin){
        return res.sendStatus(401);
      }else{
        next();
      }
   });
  });

   app.put('/users/:uid/admin',function (req,res){
    mongo.getDB().collection('users').updateOne({
      _id: req.body.userID
   },{
    $set:{admin:true}
   }, function (err,result){
    res.sendStatus(200);
   });
  });

   //get user info by id
   app.get('/user/:uid',function (req,res,next){
    mongo.getDB().collection('users').find({
      _id: parseInt(req.params.uid)
    }).toArray(function (err,docs){
      if(docs.length == 0)
        return res.sendStatus(404);
      res.json({
        _id: docs[0]._id,
        email:docs[0].email,
        username: docs[0].username,
        phoneNumber: docs[0].phoneNumber,
        rating:docs[0].rating,
      });
    });
   });

}
