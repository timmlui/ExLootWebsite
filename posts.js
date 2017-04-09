module.exports = function (app, mongo, autoIncrement, parsePost) {
  
//get all posts
app.get('/posts', function (req,res) {
 mongo.getDB().collection('stores').find().toArray(function (err,posts) {
  if(err){
   throw err;
  }
  res.json({posts:posts});
 });
});

  //Create post
  app.post('/post', function (req, res){

     // Validation
    if (!req.body.category || !req.body.price || !req.body.title || !req.body.description || !req.body.location || !req.body.date)
      return res.sendStatus(400);
   
      // Insert into database
      autoIncrement.getNextSequence(mongo.getDB(), 'posts', function (err, autoIndex) {
        mongo.getDB().collection('posts').insertOne({
          _id: autoIndex,
          category: req.body.category,
          price: req.body.price,
          title: req.body.title,
          description: req.body.description,
          location: req.body.location,
          imagePath: req.body.imagePath,
          date:req.body.date,
          posterID: req.body.posterID,
          buyerID:null,
          viewCounter: 0
        }, function(err, result) {
            res.json({
            postID: result.insertedId,
          });
        });
      });
  });

// Modify post
  app.put('/post/:pid', function (req, res) {
    // Validation
      if (!req.body.category && !req.body.price && !req.body.title && !req.body.description && !req.body.location && !req.body.date)
      return res.sendStatus(400);
  
  var id = parseInt(req.params.pid);
      if (!id){
        id = req.params.pid;
      }
    // Set update JSON
    var updateJSON = {};
    if (req.body.category)
      updateJSON.category = req.body.category;
    if (req.body.price)
      updateJSON.price = req.body.price;
    if (req.body.title)
      updateJSON.title = req.body.title;
    if (req.body.description)
      updateJSON.description = req.body.description;
    if (req.body.location)
      updateJSON.location = req.body.location;
     if (req.body.imagePath)
      updateJSON.imagePath = req.body.imagePath;
    mongo.getDB().collection('posts').updateOne({
      _id: id
    }, {
      $set: updateJSON
    }, function(err, result) {
      res.sendStatus(200);
    });
  });

// Delete post
  app.delete('/post/:pid', function (req, res, next) {
    var id = parseInt(req.params.pid);
      if (!id){
        id = req.params.pid;
      }
    // Delete post
    mongo.getDB().collection('posts').deleteOne({
      _id: id
    }, function(err, result) {
      res.sendStatus(200);
    });
  });

  // Get post
  app.get('/post/:pid', function (req, res, next) {
      var id = parseInt(req.params.pid);
      if (!id){
        id = req.params.pid;
      }
    mongo.getDB().collection('posts').find({
      _id : id
    }).toArray(function(err, docs) {
      if (docs.length == 0)
        return res.sendStatus(403);
      req.title = docs[0].title;
      req.date = docs[0].date;
      req.imagePath = docs[0].imagePath;
      req.price = docs[0].price;
      req.buyerID = docs[0].buyerID;
      req.posterID = docs[0].posterID;
      req.location = docs[0].location;
      req.category = docs[0].category;
      req.description = docs[0].description;

      // Increment viewcounter by 1
        mongo.getDB().collection('posts').updateOne({
          _id: parseInt(req.params.pid)
        }, {
          $inc: {viewCounter: 1}
        });

      next();
    });
  });
  
  app.get('/post/:pid', function (req, res) {
    var id = parseInt(req.params.pid);
      if (!id){
        id = req.params.pid;
      }
    mongo.getDB().collection('posts').find({
      _id: id
    }).toArray(function(err, docs) {
      res.json({
        postID: parseInt(req.params.pid),
        title: req.title,
        date: req.date,
        price: req.price,
        posterID: req.posterID,
        imagePath: req.imagePath,
        buyerID: req.buyerID,
        location: req.location,
        category: req.category,
        description: req.description
      });
    });
  });

// Popular (most viewed) posts
app.get('/top', function (req, res) {
  // mongo.getDB().collection('posts').find().sort({views:-1}).limit(5).toArray(function(err, docs) {
  mongo.getDB().collection('posts').find().sort({viewCounter:-1}).toArray(function(err, docs) {
    var posts = [];
    for (var i = 0; i < docs.length; i++) {
      posts.push(parsePost(docs[i]));
    }
    res.json({
      posts: posts
    });
  });
});

// Array intersect
var intersect = require('intersect');

// Search
app.get('/search/:keyword', function (req, res, next) {
  var keyword = req.params.keyword.replace('+', ' ');

  // Create index (see https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835)
  mongo.getDB().collection('posts').createIndex({'$**': 'text'}, null, function(err, indexName) {
    // Add to list of searches
    mongo.getDB().collection('searches').count({
      keyword: keyword
    }, function(err, count) {
      if (count > 0) {
        // Increment count
        mongo.getDB().collection('searches').updateOne({
          keyword: keyword
        }, {
          $inc: {count: 1}
        }, function(err, result) {
          next();
        });
      } else {
        // Insert count
        autoIncrement.getNextSequence(mongo.getDB(), 'searches', function (err, autoIndex) {
          mongo.getDB().collection('searches').insertOne({
            _id: autoIndex,
            keyword: keyword,
            count: 1
          }, function(err, result) {
            next();
          });
        });
      }
    });
  });
});

app.get('/search/:keyword', function (req, res) {
  var keyword = req.params.keyword.replace('+', ' ');
  // Perform search
  mongo.getDB().collection('posts').find(
    {$text: {$search: keyword}}, {score: {$meta: 'textScore'}}
    ).sort({score: {$meta: 'textScore'}}).toArray(function(err, posts) {

    storeResults(posts);

    res.json({
      posts: posts
    });
  });
});

// Store the posts from the search for sort and filter options
function storeResults(results){
  //Clearing the search results collection
  mongo.getDB().collection('results').drop();

  //Adding each searched post into the collection database
  for (var i = 0; i < results.length; i++) {
    mongo.getDB().collection('results').insertOne({
      _id: results[i]._id,
      category: results[i].category,
      price: results[i].price,
      title: results[i].title,
      description: results[i].description,
      location: results[i].location,
      date: results[i].date,
      posterID: results[i].posterID,
      buyerID: results[i].buyerID,
      viewCounter: results[i].viewCounter,
      imagePath: results[i].imagePath
    });
  };
};


//get all posts within a category
app.get('/category', function (req,res) {
 var query = {};
 (req.query.category == '' || req.query.category) ? (query.category = req.query.category) :"";
 mongo.getDB().collection('posts').find(query).sort({title: 1, _id: 1}).toArray(function (err,posts) {
  if(err){
   throw err;
  }
  storeResults(posts);
  res.json({posts:posts});
 });
});


//sort
app.get('/filter', function (req,res) {
 var query = {};
 var query2 = {};
 (req.query.price) ? (query.price = parseInt(req.query.price)) : 0;
 (req.query.time) ? (query._id = parseInt(req.query.time)) : 0;
 (req.query.view) ? (query.viewCounter = parseInt(req.query.view)) : 0;
 (req.query.location == '' || req.query.location) ? (query2.location = req.query.location) :"";

 mongo.getDB().collection('results').find(query2).sort(query).toArray(function (err,posts) {
  if(err){
   throw err;
  }
  res.json({posts:posts});
 });
});



app.get('/results', function (req, res) {
    mongo.getDB().collection('results').find().toArray(function(err, results) {
      res.json({
        posts: results
      });
    });
  });


}

