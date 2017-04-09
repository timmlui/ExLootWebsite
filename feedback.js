
$(document).ready(function(){
	var parameters = location.search.substring(1).split("&");
	var temp = parameters[0].split("=");
	var postid = unescape(temp[1]);
	temp = parameters[1].split("=");
	var userid = unescape(temp[1]);

	if(userid){
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

	var posterID;
		$.ajax({
			url: '/post/' + postid,
			type:"GET",
			dataType: "text",
			success: function (response){
				console.log("res:"+response);
				var p = JSON.parse(response);
				document.getElementById("show_title").innerHTML = "Post Title: "+ p.title;
				posterID = p.posterID;
				document.getElementById("show_description").innerHTML = "Description: " + p.description
				document.getElementById("show_price").innerHTML = "Price: " + p.price.toString();
				document.getElementById("show_category").innerHTML = "Category: " + p.category;
				console.log("posterid1:"+ posterID);
				$.ajax({
					url: '/user/' + posterID,
					type:"GET",
					dataType:"text",
					success: function (response){
						console.log("res: "+response);
						var p = JSON.parse(response);
						document.getElementById("show_rating").innerHTML = "Poster Rating: " + p.rating;
					},
					error:function (response){
						alert(response.status);
					}
				});
				
			},
			error: function(response){
				alert(response.status);
			}
		});

	$("#submit_rating").click(function(){
		var rating = 1;
		var radios = document.getElementsByName("rating_p");
		for (var i = 0; i < radios.length; i++){
			console.log("haha"+radios[i].value);
			if(radios[i].checked){
				rating = radios[i].value;
				break;
			}
		}
		console.log("rating_button: "+rating);
		update_rating(rating);
		 var url = "history.html?userID="+userid;
		 window.location.href= url;
	});

	function update_rating(rate){
		$.ajax({
			url: '/post/' + postid,
			type:"GET", 
			dataType:"text",
			success: function(response){
				console.log(rate);
				var p = JSON.parse(response);
				posterID = p.posterID;
				console.log("sdfsdf"+rate);
				$.ajax({
					url: '/rating/' + postid,
					type:"PUT",
					dataType:"json",
					contentType: "application/json; charset=utf-8",
					data:JSON.stringify({
						"rating" : rate
					}),
				success: function (response){
					alert("done!");
				},
				error: function (response){
					alert("Thank you for your rating");
				}
				});	
			},
			error: function (response){
				alert(response.status);
			}
		});
	}

	  function home(){
  var url = "homepage.html?userID=" + userid;
     window.location.href = url;
 };


});