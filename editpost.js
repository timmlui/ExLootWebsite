var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var iid = unescape(temp[1]);
var temp = parameters[1].split("=");
var userid = unescape(temp[1]);
var imagePath = null;
var d = new Date();
var date = d.getDate().toString()+"/"+d.getMonth().toString()+"/"+d.getFullYear();

function fillPostInfo(){
$.ajax({
   url: "/user/"+userid,
   type: "GET",
   success : function(response){
        document.getElementById("phone").innerHTML = response.phoneNumber;
        document.getElementById("email").innerHTML = response.email;
    },
    error : function(response){
      alert(response.status + " Not Found");
    }
  });

$.ajax({
   url: "/post/"+iid,
   type: "GET",
   success : function(response){
        document.getElementById("category").value = response.category;
        document.getElementById("price").value = response.price;
        document.getElementById("title").value = response.title;
        document.getElementById("description").value = response.description;
        document.getElementById("location").value = response.location;
    },
    error : function(response){
      alert(response.status + " Not Found");
    }
  });

};

function editPost(){
var yourSelect = document.getElementById("category");
var category =  yourSelect.options[yourSelect.selectedIndex].value;
  $.ajax({
   url: "/post/"+iid,
   type: "PUT",
   dataType:"json",
   contentType: "application/json; charset=utf-8",
   data:JSON.stringify({
      "category": category,
      "price":  parseInt($("#price").val()),
      "title": $("#title").val(),
      "description" : $("#description").val(),
      "location": $("#location").val(),
      "posterID": userid,
      "imagePath" : imagePath,
      "date" : date
   }),
   error: function(response){
         if(response.status == 200){
      alert("Post Edited! " + response.status);
    }else{
      alert("Not OK! " + response.status);
    }
    }
  });
 };


  function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
           imagePath = (document.getElementById("fileToUpload").value).replace('C:\\fakepath\\','pics/');
         }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
  }


   function home(){
  var url = "homepage.html?userID=" + userid;
     window.location.href = url;
 };


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