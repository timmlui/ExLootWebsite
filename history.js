$(document).ready(function(){

	var userid = null;
	var parameters = location.search.substring(1);
	console.log(parameters);
	var temp = parameters.split("=");
	userid = unescape(temp[1]);
	console.log(userid);

	if(!(parameters == '')){
		console.log("??");
		$("#but_edit_profie").removeClass('hidden');
		$("#but_user_history").removeClass('hidden');
		$("#but_user_info").removeClass('hidden');
		$("#but_log_out").removeClass('hidden');
		$("#new_post").removeClass('hidden');
	}
	else{
		$("#but_log_in").removeClass('hidden');
	}

	$("#but_log_in").click(function(){
		var url = "login.html";
		window.location.href = url;
	});


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

	$("#show_results").click(function(){
		if($("#all_histories").length){
			$("#all_histories").remove();
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
		console.log("sortword:"+ sortword);
		postHistory(userid,sortword);
	});

	// $("#gohome").click(function(){
	// 	url = "homepage.html?userid=";
	// 	window.location.href = url;
	// })



	function postHistory(userid, sortword){

		$.ajax({
			url: "/users/" + userid+"/private/" + sortword,
			type : "GET",
			dataType:"text",
			//dataType:"json",
			contentType:"application/json; charset=utf-8",
			success: function(response){
				console.log("response:"+ response);
				result = JSON.parse(response);
				var user_id = result.userid;
				console.log("userid:"+ user_id);
				var all_histories = result.history;
				//console.log("posterID:" + all_histories[0].posterID);
				$("#display_history").append('<div id="display_history-1"></div>');
				$("#display_history-1").append('<table id="all_histories"></table>');
				$("#all_histories").append('<tr><th>PosterID</th><th>Description</th><th>PostDate</th><th>Price</th><th>Rating</th></tr>');
				var tr;
				for(let i =0; i < all_histories.length; i++){
					console.log("shshsddsjsdf:"+all_histories[i].postID);
					var tr = "<tr>";
					var td1 = "<td>" + all_histories[i].posterID + "</td>";
					var td3 = "<td>" + all_histories[i].descriptions + "</td>";
					var td4 = "<td>" + all_histories[i].post_date + "</td>";
					var td5 = "<td>" + all_histories[i].price + "</td>";
					var td6 = "<td>" + "<input type='button' id='"+all_histories[i].postID+"' class='rate' value='Rate this Purchase'/>" + "</td>";
					$("#all_histories").append(tr+td1+td3+td4+td5+ td6);
					//console.log("here:"+"<input type='button' id='"+all_histories[i].posterID+"' class = 'rate' value='Rate this Purchase'/>" + "</td>");

				}
					$(".rate").click(function(){
					console.log("haha");
					var iid = (this).id;
					console.log(userid);
					console.log(iid);
					//$(this).addClass('hidden');
					var url = "feedback.html?postID=" + iid + "&userID=" + userid;
					window.location.href = url;
					});
			} 
		});
	}

});

