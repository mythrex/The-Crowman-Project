function addMessage() {
	$('#addMessage-btn').click(function(event) {
		let message = $('#addMessage-text').val();
		let type = $("input[type='radio'][name='addMessage-type']:checked").val();
		$.post('/admin/messages', {message: message,type: type}, function(data, textStatus, xhr) {
			if(data.success){
				makeAlert('success','Done! Added a message');
				resetForm('#addMessage');
				refreshMessagesPage();
			}
		});
	});

}

function editMessage(){
	$('.message-edit').click(function(event) {
		let id = +$(event.target).parent().parent().attr('data-id');

		$.get('/admin/messages', {id: id},function(data) {
			console.log(data);
			let body = `<div class="container">
			<form id="updateMessage">
						<div class="form-group row">
							<label class="col-sm-5 col-md-4 col-form-label" for="updateMessage-text">Message</label>
							<input class="col-sm-7 col-md-8 form-control" name="updateMessage-text" id="updateMessage-text" type="text" placeholder="Type your message" value='${data[0].message}'>
						</div>
						<div class="form-group row">
							<label class="col-sm-3 col-md-2 col-form-label">Type</label>
							<div class="col-sm-9 col-md-10">
								<div class="form-check col-sm-12">
									<label class="form-check-label">
										<input class="form-check-input" type="radio" name="updateMessage-type" id="addMessage-type-normal" value="normal"${(data[0].type == 'normal') ? 'checked' : ''}>
										<span class="label-text text-info"><span class="fa fa-info-circle"></span> Normal</span>
									</label>
								</div>
								<div class="form-check col-sm-12">
									<label class="form-check-label">
										<input class="form-check-input" type="radio" name="updateMessage-type" id="addMessage-type-important" value="important" ${(data[0].type == 'important') ? 'checked' : ''}>
										<span class="label-text text-primary"><span class="fa fa-envelope"></span> Important</span>
									</label>
								</div>
								<div class="form-check col-sm-12">
									<label class="form-check-label">
										<input class="form-check-input" type="radio" name="updateMessage-type" id="addMessage-type-warning" value="warning" ${(data[0].type == 'warning') ? 'checked' : ''}>
										<span class="label-text text-warning"><span class="fa fa-exclamation-circle"></span> Warning</span>
									</label>
								</div>
							</div>
						</div>
					</form>
		</div>`;
		let doneBtn = makeBtnPositive('primary','Done',function (event) {
			let message = $('#updateMessage-text').val();
			let type = $("input[type='radio'][name='updateMessage-type']:checked").val();
			console.log(type);
			$.ajax({
				url: '/admin/messages',
				type: 'put',
				data: {id: id,message: message,type: type},
				success: function (data) {
					if(data.success){
						makeAlert('success','Successfully Updated a message!');
					}
					refreshMessagesPage();
				}
			});
			$('#myModal').modal('hide');
		});
		showMyModal('Update a Message',body,doneBtn);	
		});
	});
}

function deleteMessage(){
	$('.message-delete').click(function(event) {
		let id = +$(event.target).parent().parent().attr('data-id');
		let doneBtn = makeBtnPositive('danger','Delete',function (event) {
			$.ajax({
				url: `/admin/messages/${id}`,
				type: 'delete',
				success: function (data) {
					if(data.success){
						makeAlert('danger','Successfully Deleted a message!');
					}
					refreshMessagesPage();
				}
			});
			$('#myModal').modal('hide');
		});
		showMyModal('Delete','<span class="text-danger">Are you sure? You want to delete this message</span>',doneBtn);
	});
}


function appendMessages(messageArr,messageContainer) {
	messageContainer.empty();
	let tr;
	let td;
	if(messageArr){
		for(message of messageArr){
		console.log(message.id);
		
		if(message.type == 'normal'){
			td = $('<td><span class="fa fa-info-circle text-info"></span></td>');
		}else if(message.type == 'important'){
			td = $('<td><span class="fa fa-envelope text-primary"></span></td>');
		}else if(message.type == 'warning'){
			td = $('<td><span class="fa fa-exclamation-circle text-warning"></span></td>');
		}
		tr = $('<tr>').attr('data-id',message.id).append(td).append(`
				<td>${message.message}</td>
				<td class="text-muted">${message.updatedAt}</td>
				<td><button type="button" class="btn btn-neutral message-edit"><span class="fa fa-pencil"></span></button></td>
				<td><button type="button" class="btn btn-danger message-delete"><span class="fa fa-trash"></span></button></td>
			`);
		messageContainer.append(tr);
	}
	}
}

//append Normal Message count
function appendMessageCount(messageCount,count) {
	messageCount.text(count);
}


//get messages
function getMessages() {
	$.get('/admin/messages', function(data) {
		var container = $('#messages-table-body');
		appendMessages(data,container);
		//edit Message function
		editMessage();
		//delete message
		deleteMessage();
	});
}

//getNormal Messages Count
function getNormalMessagesCount(){
	$.get('/admin/messages/count',{type: 'normal'},function(data) {
		var container = $('#normal-message-count');
		appendMessageCount(container,data.count);
	});
}

//get Important Messages Count
function getImportantMessagesCount(){
	$.get('/admin/messages/count',{type: 'important'},function(data) {
		var container = $('#important-message-count');
		appendMessageCount(container,data.count);
	});
}

//getWarning Messages Count
function getWarningMessagesCount(){
	$.get('/admin/messages/count',{type: 'warning'},function(data) {
		var container = $('#warning-message-count');
		appendMessageCount(container,data.count);
	});
}

//refresh page
function refreshMessagesPage(){
	getMessages();
	getNormalMessagesCount();
	getImportantMessagesCount();
	getWarningMessagesCount();
}


//ready function
$(function () {
	
	//get the messages
	refreshMessagesPage();
	addMessage();
});