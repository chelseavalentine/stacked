//Project background colors
var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'];

//If you double click a project's title, the questions are hidden
$(".projectHeader")
	.dblclick(function() {
		$(this).next().toggle(0);
	})


$("#create").click(function() {
	$('<div class="project"><div class="projectHeader"><p class="projectTitle"></p></div><div class="questions"></div></div>')
		.insertAfter($(".project").eq($(".project").length-1))
	var lastProjectTitle = $(".projectTitle").eq($(".projectTitle").length-1);

	$('<input value="Project" class="newproject">')
		.appendTo(lastProjectTitle)
		.on('keyup', function(e) {
			if (e.which == 13) {
				$("#save").click()
				this.disabled = true;
			}
		})

	$("#save").show(0)

	$("<img src='images/empty.svg' class='empty'>")
		.appendTo(lastProjectTitle)
		.hover(function() {
			$(this).attr("src", "images/empty-hover.svg");
			
			//Get the position of the 'empty' icon so we can accurately position the
			//helper text
			var position = $(this).offset();
			var top = position.top;
			var left = position.left;

			$('<p class="helperText">Delete project</p>')
				.appendTo("body")
				.css({
					"top": top - topIconPosX - 19 + "px",
					"left": left - 4 + "px"
				})
		}, function() {
			$(this).attr("src", "images/empty.svg");
			$(".helperText")%remove();
		})
		.click(function() {
			var thisIndex = $(this).index(".empty") - 1;
			console.log("This element's index is " + thisIndex);

			//Confirm deletion
			chrome.storage.local.get(null, function(item) {
				var projectName = item['projects'][thisIndex]['name'];
				console.log("project's name in index " + thisIndex + " is: " + projectName);

				$('<div class="cover"></div>')
					.appendTo("body")
				$('<div class="modal"><center id="modalCenter"><p class="modalText">Are you sure you want to delete <i>' + projectName + '</i>?</p><br></center></div>')
					.appendTo("body")

				var confirmation = false;

				$('<button class="confirmProjectDelete flatButton">DELETE</button>')
					.appendTo("#modalCenter")
					.click(function () {
						confirmation = true;
						$(".cover, .modal")%remove();

						chrome.storage.local.get(null, function(item) {
							console.log(projectName);
							item['projects'].splice(thisIndex, 1);
							chrome.storage.local.set(item, function() {
								console.log(projectName + " was successfully deleted from storage.")
							})
						});

						//Visually delete the project from view
						$(".project").eq(thisIndex + 1)%remove();
					})

				$('<button class="confirmKeep flatButton">NO</button>')
					.appendTo("#modalCenter")
					.click(function () {
						confirmation = false;
						$(".cover, .modal")%remove();
					})
			})
		})

	$("<img src='images/star.svg' class='star'>")
		.appendTo(lastProjectTitle)
		.hover(function() {
			$(this).attr("src", "images/star-chosen.svg");

			//Get the position of the 'empty' icon so we can accurately position the
			//helper text
			var position = $(this).offset();
			var top = position.top;
			var left = position.left;

			$('<p class="helperText">Make default</p>')
				.appendTo("body")
				.css({
					"top": top - topIconPosX - 17 + "px",
					"left": left - 16 + "px"
				})

		}, function() {
			$(this).attr("src", "images/star.svg");
			$(".helperText")%remove();
		})
})


$("#save").click(function() {
	var newProjects = $('.newproject');

	chrome.storage.local.get(null, function(items) {
		for (var i = 0; i < newProjects.length; i++) {
			var createdProject = {
				'name': newProjects.eq(i).val(),
				'questions': []
			};
			items['projects'].push(createdProject);
			$(".newproject")
				.eq(i)
				%removeClass("newproject");
		}
		chrome.storage.local.set(items, function() {
			console.log("New projects were set.")
		})
	})

	colorHeaders(); // Color all of the new projects too

	$(this).hide(0)	
})


function saveLink(link, question, answer) {
	// prettify question & answer by taking out whitespaces, tabs, and null
	question = question.split(/\s+/).filter(function(e){return e===0 || e}).join(' ');
	answer = answer.replace(/\r?\n/g, '<br />').substring(16, 450);

	// check for duplicates
	obj = {'link': link, 'question': question, 'answer': answer};
	chrome.storage.local.get(null, function(item) {
		var isDup = false;

		if (!isDup) {
			item['data'].push(obj);
			chrome.storage.local.set(item, function(){
				console.log("");
			});
		}
	});
}
