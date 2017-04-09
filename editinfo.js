$(document).ready(function(){
	var parameters = location.search.substring(1).split("&");
	var temp = parameters[0].split("=");
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

	 function home(){
  var url = "homepage.html?userID=" + userid;
     window.location.href = url;
 };

	$.ajax({
		url: '/user/' + userid,
		type:"GET",
		dataType:"text",
		success: function(response){
			var p = JSON.parse(response);
			var email = p.email;
			document.getElementById("show_email").innerHTML = email;
		},
		error: function (response){
			alert(response.status);
		}
	});

	$("#submit_info").click(function(){
		update();
	})

	function update(){
		var new_username = null;
		var new_pw = null;
		var confirm_pw = null;
		var new_tel = null;
		new_username = $("#ud_username").val();
		new_pw = $("#ud_pw").val();
		confirm_pw = $("#ud_confirm_pw").val();
		new_tel = $("#ud_new_phone").val();
		if(new_pw && !confirm_pw){
			alert("Please Confirm Your password");
			return ;
		}
		if(new_pw != confirm_pw){
			alert("The password Do Not Match");
			return ;
		}
		$.ajax({
			url:"/users/" + userid+ "/editinfo",
			type:"PUT",
			dataType:"text",
			contentType:"application/json;charset=utf-8",
			data:JSON.stringify({
				"username": new_username,
				"phoneNumber": new_tel,
				"newpassword": new_pw
			}),
			success:function (response){
				alert("Done!");
				$("#ud_username").val("");
				$("#ud_pw").val("");
				$("#ud_confirm_pw").val("");
				$("#ud_new_phone").val("");
			},
			error: function(response){
				alert("User Not Found" + response.status);
			}
		});
	}
});