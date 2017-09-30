function appendHistory(historyArr,tableBody) {
	tableBody.empty();
	for(historyObj of historyArr){
		let task = historyObj.task;
		tableBody.append(`
				<tr>
					<td class='text-${(task == 'add') ? 'success' : ((task == 'update') ? 'info' : 'danger')}'>${task}</td>
					<td>${historyObj.desc}</td>
					<td>${historyObj.type}</td>
					<td class="text-muted">${historyObj.updatedAt}</td>
				</tr>
			`);
	}
}

function showFullHistory() {
	let tableBody = $('#history-table-body');
	$.get('/admin/history', function(data) {
		appendHistory(data,tableBody);
	});
}



function filterHistory() {
	$('#filterHistory-btn').click(function(event) {
		let type = $("input[type='radio'][name='type']:checked").val();
		let task = $("input[type='radio'][name='task']:checked").val();
		let order = $("input[type='radio'][name='order']:checked").val();
		let orderType = $("input[type='radio'][name='order-type']:checked").val();
		let query = {};
		if(type && type != 'null') query.type = type;
		if(task && task != 'null') query.task = task;
		if(order) {
			query.order = [[order]];
			if(orderType == 'DESC') query.order[0].push('DESC');
		}
		$.get('/admin/history/', query, function(data) {
			appendHistory(data,$('#history-table-body'));
		});
	});
}

function refreshHistoryPage() {
	showFullHistory();
	filterHistory();
}

$(function () {
	refreshHistoryPage();
})