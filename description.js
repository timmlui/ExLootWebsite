var postid = null;
var userid = null;

$(document).ready(function(){

	if(location.search.substring(1).indexOf('&')> -1){
		console.log("true");
		var parameters = location.search.substring(1).split("&");
		var temp = parameters[0].split("=");
		var postid = unescape(temp[1]);
		temp = parameters[1].split("=");
		userid = unescape(temp[1]);
	}
	else{
		var parameters = location.search.substring(1);
		var temp = parameters.split("=");
		var postid = unescape(temp[1]);
	}
	// console.log("pos"+postid);

	$.ajax({
		url: '/post/'+postid,
		type: "GET",
		dataType: "text",
		success: function (response){
			var p = JSON.parse(response);
			document.getElementById("mySlides").src = p.imagePath;
			document.getElementById("show_title").innerHTML = p.title;
			document.getElementById("show_post_date").innerHTML = "Post Date: "+ p.date;
			document.getElementById("show_post_price").innerHTML = "Item Price:   " + p.price;
			document.getElementById("show_post_location").innerHTML = "Post Location:  "+p.location;
			document.getElementById("show_post_category").innerHTML = "Post Category:  "+p.category;
			document.getElementById("show_post_description").innerHTML = p.description;
			var posterid = p.posterID;
			var buyerid = p.buyerID;
			console.log("posterid:"+posterid);
			console.log("buyerid:"+buyerid);
			if(buyerid == null && userid!=null){
				console.log("here");
				$("#confirm").removeClass('hidden');
			}
			$.ajax({
				url :'/user/' + posterid,
				type: "GET",
				dataType:"text",
				success: function (response){
					var pp = JSON.parse(response);
					console.log("username:"+pp.username);
					document.getElementById("show_owner_name").innerHTML = pp.username;
					//document.getElementById("show_owner_email").innerHTML = "Seller Email Address: "+pp.email;
				},
				error:function (response){
					alert(response.status);
				}
			})
		},
		error: function(response){
			alert(response.status);
		}
	});

	$("#seller_info").click(function(){
		$.ajax({
			url: '/post/'+postid,
			type:"GET",
			dataType:"text",
			success: function (response){
				var p = JSON.parse(response);
				var posterid = p.posterID;
				if(posterid != userid){
					var url = "info.html?posterID="+posterid + "&userID="+userid;
				}
				else{
					var url = "info.html?posterID=" + posterid;
				}
				window.location.href = url;
			},
			error:function (response){
				alert(response.status);
			}
		});
	});

	$("#confirm_buy").click(function(){
		console.log("postid:"+postid);
		$.ajax({
			//url:'/description/'+ userid + "/"+postid,
			 url:'/description/'+ userid,
			type:"PUT",
			// dataType:"json",
			contentType:"application/json",
			data:JSON.stringify({
				"postID" : postid
			}),
			success: function(response){
				alert("Thank You For Your Purchase");
				$("#confirm").addClass('hidden');
			},
			error:function (response){
				console.log(response);
				alert("Can Not Place Purchase");
			}
		});
	});


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
function home(){
	  if(userid == null){
      usrid = '';
    } else {
      usrid = "?userid=" + userid;
    }
  var url = "homepage.html" + usrid;
     window.location.href = url;
 };