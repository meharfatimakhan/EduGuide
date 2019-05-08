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
				dataType: 'json'
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
	$('.dropdown-toggle').click(function () {
		dropDownFixPosition($('button'), $('.dropdown-menu'));
	});
	function dropDownFixPosition(button, dropdown) {
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
					$("#checking").show().html("This username is already taken! <br>");
				}
				else {
					$("#checking").show().html("<br> You can have this username!");
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
		{
			$.ajax({
				type: "GET",
				url: "/findBio",
				contentType: 'application/json;',
				dataType: 'json',
			}).done(function (result) {
				console.log(result[0].bio);
				$(".searchResultCont").show().html(result[0].bio);
			})

		}
	});

	$('#uniName').change(function () {
		var item = $('#uniName').val();
		console.log(item + "tellme")
		$.ajax({
			type: 'GET',
			data: { university: item },
			url: '/uniName/' + item + '/deptName',
			contentType: 'application/json;',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				$('#deptName').empty();
				$('deptName').append("<option disabled selected> Select Department..</option>");
				$.each(data, function (index, addressObj) {
					$('#deptName').append("<option value = '" + addressObj._id + "' > " + addressObj.departmentName + ". </option > ");
				});
			}
		});
	});

	$('#uniNamee').change(function () {
		var item = $('#uniNamee').val();
		console.log(item + "tellme")
		$.ajax({
			type: 'GET',
			data: { university: item },
			url: '/uniNamee/' + item + '/deptName',
			contentType: 'application/json;',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				$('#deptName').empty();
				$('deptName').append("<option disabled selected> Select Department..</option>");
				$.each(data, function (index, addressObj) {
					$('#deptName').append("<option value = '" + addressObj._id + "' > " + addressObj.departmentName + ". </option > ");
				});
			}
		});
	});

	$('#departName').change(function () {
		var item = $('#departName').val();
		console.log(item + "tellme")
		$.ajax({
			type: 'GET',
			data: { department: item },
			url: '/departName/' + item + '/courseName',
			contentType: 'application/json;',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				$('#courseName').empty();
				$('courseName').append("<option disabled selected> Select Course..</option>");
				$.each(data, function (index, addressObj) {
					$('#courseName').append("<option value = '" + addressObj._id + "' > " + addressObj.courseName + ". </option > ");
				});
			}
		});
	});

	$('#password, #confirmPassword').on('keyup', function () {
		if ($('#password').val() == $('#confirmPassword').val()) {
			$('#message').html('Matching').css('color', 'green');
		} else
			$('#message').html('Not Matching').css('color', 'red');
	});



	$("#frm").submit(function (event) {

		var valDDL = $("#uniName").val();
		if (valDDL == '0') {
			event.preventDefault();
			alert("Select a university and department!");
		}
	});

	$('#password, #re_password').on('keyup', function () {
		if ($('#password').val() == $('#re_password').val()) 
		{ $('#message').html('Passwords match!').css('color', 'green'); }
		else $('#message').html('Passwords dont match!').css('color', 'red');
	});
});

