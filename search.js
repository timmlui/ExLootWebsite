var userid = null;
var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
userid = unescape(temp[1]);
if(userid == null || userid == 'undefined'){
      usrid = '';
    } else {
      usrid = "&userid=" + userid;
    }

const keywords = window.location.search.substr(1)
const keywords_clean = window.location.search.substr(1).replace('+', ' ')

loadResults();

function loadResults(){
  $.ajax({
      url: "/results",
      type: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        var searched_posts = response.posts;
        /*alert("LENGTH OF SEARCH RESULTS: " + searched_posts.length);*/
        if (searched_posts.length == 0){
          $('#search_results-list').append("<h4 class='no-results'>No results found</h4>");
        } else {
          showPosts(searched_posts);
        }
      }
    });
}

/*Search function*/
function search(keywords) {
  var searchURL = "/search/" + keywords;
  if(keywords != ''){ //if input for search wasn't empty
    $.ajax({
      url: searchURL,
      type: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        var searched_posts = response.posts;
        /*alert("LENGTH OF SEARCH RESULTS: " + searched_posts.length);*/
        if (searched_posts.length == 0){
          $('#search_results-list').append("<h4 class='no-results'>No results found</h4>");
        }
        showPosts(searched_posts);
      }
    });
  } else { //if input for search was empty
    $('#search_results-list').append("<h4 class='no-results'>No results found</h4>");
  }
};


$('#search').click(function () {
  loadSearch();
});

document.onkeydown=function(){
  if(window.event.keyCode=='13'){
    window.event.preventDefault();
    loadSearch();
  } 
}

function loadSearch(){
  search($("#keyword").val());
  /*alert("Keyword: " + $("#keyword").val());*/
  location.href = 'search.html?' + encodeURIComponent($("#keyword").val()).replace('%20', '+') + usrid;
}
/*--------------------------------Applying Filters -------------------------------*/

/*Change the pressed filter button to dark for indication*/
function filter(group, el) {
  /*alert("ITEMS ID: "+ itemsID);*/
  $(group).find('.ischecked').removeClass('ischecked');
  el.classList.add('ischecked');
}

/* Sort items by most viewed */
function sortByViews(){
  $(".list li").sort(function(a, b) {
    return parseInt($('.'+b.className).attr('name')) - parseInt($('.'+a.className).attr('name'));
  }).each(function() {
    var elem = $(this);
    elem.remove();
    $(elem).appendTo(".list");
  });
}

// /*  */
function filterResults(type){
  if(type != 'any'){
     $.ajax({
     url: "/filter?"+ type,
     type: "GET",
     success : function(response){
      showPosts(response.posts);
     }
    });
  } else {
    loadResults();
  }
}; 
// var location = ""; 
// var price = ""; 
// var time = "";
// var view = "";
// function filterResults(type){
//   if (type[0] == 'l'){
//     location=type + "&" ;
//   }
//     if (type[0] == 'p'){
//     price=type+ "&";
//   }
//     if (type[0] == 't'){
//     time=type + "&";
//   }
//     if (type[0] == 'v'){
//     view=type;
//   }

//   var str = location + price + time + view;
//   console.log(str);
//   if (str.slice(-1) == '&'){
//     str = str.subString(0,str.length()-1);
//   }
//   if(type != 'any'){
//      $.ajax({
//      url: "/filter?"+ str,
//      type: "GET",
//      success : function(response){
//       showPosts(response.posts);
//      }
//     });
//   } else {
//     loadResults();
//   }
// }; 



function showPosts(posts){
  $('#search_results-list').remove();
  $('#search_results').append("<ul class='list' id='search_results-list'></ul>");

  for (let i = 0; i < posts.length; i++){
    var location = posts[i].location;
    var capitalLocation = location.charAt(0).toUpperCase() + location.slice(1);
    var title = posts[i].title;
    var idName = title.replace(/\s+/g, '').toLowerCase();
    var usrid;
    /*alert("userid: " + userid)*/
    if(userid == null){
      usrid = '';
    } else {
      usrid = "&userid=" + userid;
    }

    var li = "<li class='"+ posts[i]._id + "' name='"+ posts[i].viewCounter +"' id='' title='"+posts[i].price+"'>"
    var link = "<a href='description.html?pid="+posts[i]._id+usrid+"' class='inner' id='"+ idName +"'>";
    var d1 = "<div class='li-img'><img src='"+ posts[i].imagePath + "' alt='Image Alt Text'/></div>";
    var d2 = "<div class='li-text'><h4 class='li-head'>" + title +"</h4>";
    var d3 = "<p class='li-date'>Posted: "+ posts[i].date +"</p>"
    var d4 = "<p class='li-rating' href='#seller'>posterID: "+ posts[i].posterID+"</p>"
    var d5 = "<p class='li-city' id='"+location+"'>City: "+ capitalLocation +"</p>";
    var d6 = "<p class='li-price'>Price: $"+ posts[i].price +".00</p>";
    var d7 = "<p class='li-summary'>"+ posts[i].description +"<br>Read More</p></div></a></li>";

    $('#search_results-list').append(li+link+d1+d2+d3+d4+d5+d6+d7);
  }
}

/* uncheck the rating or sort filter if either sort or rating are applied
   respectively */
function uncheck(group) {
  $(group).find('.ischecked').removeClass('ischecked');
  $(group).find('.any').addClass('ischecked');
}



  var userid = null;
  var has_user = false;
  if(location.search.substring() != ''){
    var parameters = location.search.substring(1);
    var temp = parameters.split("=");
    userid = unescape(temp[1]);
    }

$(document).ready(function(){

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

if(userid == null || userid == 'undefined'){
      usriid = '';
    } else {
      usriid = "?userid=" + userid;
    }

    function home(){
  var url = "homepage.html" + usriid;
     window.location.href = url;
 };




