function getCountersHistory() {
	$.get('/admin/history',{type: 'counters'}, function(data) {
		let counterHistoryTable = $('#counterHistoryTable')
		counterHistoryTable.empty();
		for(index in data){
			counterHistoryTable.append(`
					<tr>
		              <th scope="row">${+index + 1}</th>
		              <td>${data[index].task}</td>
		              <td>${data[index].desc}</td>
		              <td>${data[index].createdAt}</td>
		            </tr>
				`);
		}
	});
}

//function to add a counter
function addCounter() {
	let name = $('#addCount-name').val();
	let desc = $('#addCount-desc').val();
	$.post('/admin/counters', {counterName: name,counterDescription: desc}, function(data, textStatus, xhr) {
		if(data.success){
			makeAlert('success','Successfully added a counter!');
		}
		resetForm('#addCount');
		refreshPage();
	});
}

//function to remove a counter
function removeCounter() {
	var id = $('#deleteCount-id').val();
	$.ajax({
		url: `/admin/counters/${id}`,
		type: 'delete',
		success: function (data) {
			if(data.success){
				makeAlert('success','Successfully deleted a counter!');
			}
			else{
				makeAlert('warning','No such Id was found!');
			}
			resetForm('#deleteCount');
			refreshPage();
		}
	});
	
}

//function to get counters along with their customers
function getCountersWithCustomers() {
	let counterCardContainer = $('#counters-card-container');
	counterCardContainer.empty();
	$.get('/admin/counters', function(counters) {
		for(counter of counters){
			let customerId = counter.customerId;
			if (customerId != null) {
				console.log(counter);
				let tempCounter = counter;
				$.get('/admin/customers',{id: customerId}, function(customer) {
					counterCardContainer.append(`
							<!--Card-->
						      <div class="col-12 col-sm-6">
						        <div class="card">
						          <div class="card-header card-inverse bg-app-color">
						            <small>COUNTER-ID: ${tempCounter.id} - ${tempCounter.counterName}</small>
						          </div>
						          <div class="card-body">
						            <div class="special-card">
						              <span class="special-card-icon fa fa-id-badge"></span>
						              <span class="special-card-text">${customer[0].id}</span> 
						            </div>
						            <div class="card-subtitle">
						              Name: ${customer[0].name}
						            </div>    
						          </div>
						          <div class="card-footer text-muted">
						            <small>Updated At - ${counter.updatedAt}</small>
						          </div>
						        </div>
						      </div>
						`);
				});
			}
			else{
				counterCardContainer.append(`
							<!--Card-->
						      <div class="col-12 col-sm-6">
						        <div class="card">
						          <div class="card-header card-inverse bg-app-color">
						            <small>COUNTER-ID: ${counter.id} - ${counter.counterName}</small>
						          </div>
						          <div class="card-body">
						            <div class="special-card">
						              <span class="special-card-icon fa fa-id-badge"></span>
						              <span class="special-card-text">:(</span> 
						            </div>
						            <div class="card-subtitle">
						              No any customer at this counter! :(
						            </div>    
						          </div>
						          <div class="card-footer text-muted">
						            <small>Updated At - ${counter.updatedAt}</small>
						          </div>
						        </div>
						      </div>
						`);
			}
		}
	});
}

function refreshPage(){
  getCountersWithCustomers();

  getCountersHistory();
}

$(function () {
  refreshPage();
  //add a counter
  $('#addCount-submit').click(addCounter);
  //remove a counter
  $('#deleteCount-submit').click(removeCounter);
})
