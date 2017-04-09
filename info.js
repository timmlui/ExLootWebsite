$(document).ready(function(){
	var userid = null;
	var userid2 = null;
	if(location.search.substring(1).indexOf('&')> -1){
		var parameters = location.search.substring(1).split("&");
		var temp = parameters[0].split("=");
		 userid = unescape(temp[1]);
		var temp2 = parameters[1].split("=");
		 userid2 = unescape(temp2[1]);
	}
	else{
		var parameters = location.search.substring(1);
		var temp = parameters.split("=");
		userid = unescape(temp[1]);
	}
	
	console.log("userid: "+ userid);
	console.log("userid2: "+ userid2);

	if(userid){
		$("#but_edit_profie").removeClass('hidden');
		$("#but_user_history").removeClass('hidden');
		$("#but_user_info").removeClass('hidden');
		$("#but_log_out").removeClass('hidden');
		$("#new_post").removeClass('hidden');
	}

	$("#but_edit_profie").click(function(){
		if(userid2){
			var url = "editinfo.html?userID="+userid2;
			window.location.href = url;
		}else{
			var url = "editinfo.html?userID="+userid;
			window.location.href = url;
		}
	});

	$("#but_user_info").click(function(){
		if(userid2){
			var url = "info.html?userID="+userid2;
			window.location.href = url;
		}else{
			var url = "info.html?userID="+userid;
			window.location.href = url;
		}
	});

	$("#but_user_history").click(function(){
		if(userid2){
			var url = "history.html?userID="+userid2;
			window.location.href = url;
		}else{
			var url = "history.html?userID="+userid;
			window.location.href = url;
		}
	});

	$("#but_log_out").click(function(){
		var url = "homepage.html?userID="+userid;
		window.location.href = url;
	});

	$("#new_post").click(function(){
		if(userid2){
			var url = "newpost.html?userID="+userid2;
			window.location.href = url;
		}else{
			var url = "newpost.html?userID="+userid;
			window.location.href = url;
		}
	});

	  function home(){
  var url = "homepage.html?userID=" + userid;
     window.location.href = url;
 };



	$.ajax({
		url: '/user/'+userid,
		type: "GET",
		dataType:"text",
		success: function(response){
			var p = JSON.parse(response);
			document.getElementById("show_username").innerHTML ="User Name:    " + p.username;
			document.getElementById("show_email").innerHTML ="Email Address:    " + p.email;
			document.getElementById("show_telephone").innerHTML ="Telephone:    " + p.phoneNumber;
			document.getElementById("show_rating").innerHTML = "User Rating:    "+ p.rating;
		},
		error: function(response){
			alert(response.status);
		}
	});

	$("#show_posts").click(function(){
		if($('#all_posts').length){
			$("#all_posts").remove();
		}
		var sortword = "pricehl";
		var e = document.getElementById("SortFiled");
		var sortword = e.options[e.selectedIndex].value;
		if(sortword == "1"){
			sortword = "datehl";
		}
		if(sortword == "2"){
			sortword = "datelh";
		}
		if(sortword == "3"){
			sortword = "pricelh";
		}
		else{
			sortword = "pricehl";
		}
		console.log("sdf"+sortword);
		postPosts(userid,sortword);

	})

	function postPosts(userid,sortword){
		$.ajax({
			url:"/users/" + userid + "/info/" + sortword,
			type: "GET",
			dataType:"text",
			contentType:"application/json; charset=utf-8",
			success: function (response){
				result = JSON.parse(response);
				var user_id = result.userid;
				console.log("SDFsdfs:"+user_id);
				var all_posts = result.list_posts;
				$("#display_posts").append('<div id="display_posts-1"></div>');
				$("#display_posts-1").append('<table id="all_posts"></table>');
				$("#all_posts").append('<tr><th>PostID</th><th>Description</th><th>PostDate</th><th>Price</th></tr>');
				var tr;
				//console.log("shshsddsjsdf:"+all_posts);
				for(let i =0; i < all_posts.length; i++){
					var tr = "<tr>";
					var td1 = "<td>" + all_posts[i].postID + "</td>";
					var td3 = "<td>" + all_posts[i].description + "</td>";
					var td4 = "<td>" + all_posts[i].postDate + "</td>";
					var td5 = "<td>" + all_posts[i].price + "</td>";
					var td6 = "<td>" + "<input type='button' id='"+all_posts[i].postID+"' class='popo' value='GO TO THE POST'/>" + "</td>";
					var td7 = "<td>" + "<input type='button' id='"+all_posts[i].postID+"' class='edit hidden' value='Edit This Post'/>" + "</td>";
					$("#all_posts").append(tr+td1+td3+td4+td5+td6+td7);
					//console.log("here:"+"<input type='button' id='"+all_histories[i].posterID+"' class = 'rate' value='Rate this Purchase'/>" + "</td>");
				}
				if(userid2 == null){
					$(".edit").removeClass('hidden');
				}
				$(".popo").click(function(){
					var iid= (this).id;
					var url = "description.html?posotID=" + iid + "&userID=" + userid2;
					window.location.href = url;
				});
				$(".edit").click(function(){
					var iid=(this).id;
					var url = "editpost.html?posterid="+iid+"&userid="+userid;
					window.location.href = url;
				});
			},
			error : function (response){
				alert(response.status);
			}
		});
	}
	

});