$(document).ready(function () {
	$('div[id="#search"]').on('click', function (event) {
		$('#search').addClass('open');
		$('#search > form > input[type="search"]').focus();
	});
	$('#search, #search button.close').on('click keyup', function (event) {
		if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
			$(this).removeClass('open');
		}
	});

	$("#uploadMyFile1").on('click', function (e) {
		e.preventDefault();
		$("#upload:hidden").trigger('click');
	});
	$("#uploadMyFile2").on('click', function (e) {
		e.preventDefault();
		$("#uploadStory:hidden").trigger('click');
	});
	$("#searchField").keyup(function (e) {
		var term = $(this).val();
		let param = {
			"val": term
		}
		if (term.length > 1) {
			$.ajax({
				type: "GET",
				url: "/searchMembers",
				data: param,
				contentType: 'application/json;',
				dataType: 'json',

				//error: function (xhr, textStatus, errorThrown) {
				//toastr.error(errorThrown);

				//}
			}).done(function (result) {

				var list = "";
				$.each(result, function (i) {
					list += "<li>" + result[i].username + "</li>";
				});
				$(".searchResultCont").show().find("ul").html(list);
			})

		} else {
			$(".searchResultCont").hide();
		}
	});
	$('.dropdown-toggle').click(function (){
		dropDownFixPosition($('button'),$('.dropdown-menu'));
	});
	function dropDownFixPosition(button,dropdown){
	   var dropDownTop = button.offset().top + button.outerHeight();
	   dropdown.css('top', dropDownTop + "px");
	   dropdown.css('left', button.offset().left + "px");
	 }
	$("#username").keyup(function (e) {
		var term = $(this).val();
		let param = {
			"val": term
		}
		if (term.length > 3) {
			$.ajax({
				type: "GET",
				url: "/checkUser",
				data: param,
				contentType: 'application/json;',
				dataType: 'json',

			}).done(function (result) {

				if (result != null) {
					$("#checking").show().html("This username is already taken");
				}
				else {
					$("#checking").show().html("<br> You can have this username");
					$("#sub").removeAttr('disabled');

				}

			})
		}
		else {
			$('#checking').hide();
		}


	})

	$("#work").click(function (e) {

		var term = "abc";
		//if (term.length > 1) {2
		{
			$.ajax({
				type: "GET",
				url: "/findBio",
				contentType: 'application/json;',
				dataType: 'json',

				//error: function (xhr, textStatus, errorThrown) {
				//toastr.error(errorThrown);

				//}
			}).done(function (result) {
				console.log(result[0].bio);
				$(".searchResultCont").show().html(result[0].bio);
			})

		}
	});

});

