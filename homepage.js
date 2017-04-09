  var userid = null;
  var has_user = false;
  if(location.search.substring() != ''){
    var parameters = location.search.substring(1);
    var temp = parameters.split("=");
    userid = unescape(temp[1]);
    }

$(document).ready(function(){
  var has_user = false;

  console.log("userid"+userid);
  if(userid){
    has_user = true;
  }
  console.log("sdd:"+has_user);
  if(!has_user){
    $("#but_log_in").removeClass('hidden');
    $("#but_sign_up").removeClass('hidden');
  }

  $("#but_log_in").click(function(){
    var url = "login.html";
    window.location.href = url;
  });


  $("#but_sign_up").click(function(){
    var url = "register.html";
    window.location.href = url;
  });

  if(has_user){
    $("#but_edit_profie").removeClass('hidden');
    $("#but_user_history").removeClass('hidden');
    $("#but_user_info").removeClass('hidden');
    $("#but_log_out").removeClass('hidden');
    $("#new_post").removeClass('hidden');
  }

  $("#but_edit_profie").click(function(){
    var url = "editinfo.html?userID="+userid;
    window.location.href = url;
  });

  $("#but_user_info").click(function(){
    var url = "info.html?userID=" + userid;
    window.location.href = url;
  });

  $("#but_user_history").click(function(){
    var url = "history.html?userID=" + userid;
    window.location.href = url;
  });

  $("#but_log_out").click(function(){
    var url = "homepage.html";
    window.location.href = url;
  });

  $("#new_post").click(function(){
    var url = "newpost.html?userid=" +userid;
    window.location.href = url;
  });
});

    if(userid == null){
      usrid = '';
    } else {
      usrid = "&userid=" + userid;
    }


function getMostViewed(){
  $.ajax({
   url: "/top",
   type: "GET",
   success : function(response){
    $("#photobanner").remove();
    var all_posts = response.posts;
    $('#container').append('<div id="photobanner" class="photobanner"></div>');
     $('#photobanner').append('<a href="description.html?postid='+all_posts[0].postID+usrid+'"><img class="first" src="'+all_posts[0].imagePath+'" alt="" /></a>');

    for (let i = 1; (i < all_posts.length && i < 15);i++){
     console.log(all_posts[i].imagePath);
     $('#photobanner').append('<a href="description.html?postid='+all_posts[i].postID+usrid+'"><img src="'+all_posts[i].imagePath+'" alt="" /></a>');
    }
   }
  });
 };

 function newPost(){
  var url = "newpost.html?userID=" + userid;
     window.location.href = url;
 };

 function filterCategory(category){
  if(userid == null){
      usrid = '';
    } else {
      usrid = "?userid=" + userid;
    }
    console.log(category);
   $.ajax({
   url: "/category?category="+ category,
   type: "GET",
   success : function(response){
    var url = "search.html"+usrid;
     window.location.href = url;
   }
  });
 }; 

  function home(){
      if(userid == null){
      usrid = '';
    } else {
      usrid = "?userid=" + userid;
    }
  var url = "homepage.html" + usrid;
     window.location.href = url;
 };






