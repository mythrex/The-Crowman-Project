function makeAlert(type = 'primary',text,duration = 3000) {
  var alert = $(`<div class="alert alert-${type}" role="alert">
  ${text}
  </div>`);
  $('.content').prepend(alert);
  setTimeout(function () {
    alert.addClass('fade').remove();
    setTimeout(() => {
      alert.remove();
    },200);
  },duration)
}

function resetForm(formId) {
  $(':input',formId)
 .not(':button, :submit, :reset, :hidden')
 .val('')
 .removeAttr('checked')
 .removeAttr('selected');
}

function disableForm(formId) {
  $(':input',formId)
  .not(':hidden')
  .attr('disabled','true')
  .removeAttr('checked')
  .removeAttr('selected');
}

//adding a customer
function addCust() {
  let name = $('#addCust-name').val();
  let phoneNo = $('#addCust-phone-no').val();
  $.post('/admin/customer', {name: name, phoneNo: phoneNo}, function(data, textStatus, xhr) {
    if(data.success)
      makeAlert('success',`Added ${name} to Database`);
    else
      makeAlert('danger','Oops, There is an error');

    resetForm('#addCust')
  });

}
//updating a customer
function searchCust() {
  let id = +$('#searchCust-id').val();

  $.get('/admin/customer', {id: id}, function(data, textStatus, xhr) {
    console.log(data);
    if(data.success){
      $('#updateCust-id').text(id);
      $('#updateCust-name').removeAttr('disabled');
      $('#updateCust-phone-no').removeAttr('disabled');
      $('#updateCust-update').removeAttr('disabled');
      $('#updateCust-cancel').removeAttr('disabled');
      $('#updateCust-name').val(data.name);
      $('#updateCust-phone-no').val(data.phoneNo);
    }else {
      makeAlert('danger',`ID: ${id} is not available in DB`);
    }
  });

  resetForm('#searchCust');
}


$(function () {
  disableForm('#updateCust');

  //for addCust
  $('#addCust-submit').click(addCust);
  $('#addCust-reset').click(() => {
  	resetForm('#addCust');
  });

  //for search Cust
  $('#searchCust-search').click(searchCust);

  //for updating customer
  $('#updateCust-update').click(function(event) {
    let id = +$('#updateCust-id').text();
    let name = $('#updateCust-name').val();
    let phoneNo = $('#updateCust-phone-no').val();
    console.log(id,name,phoneNo);
    $.ajax({
       url: '/admin/customer',
       type: 'PUT',
       data: {id: id,name: name,mobileNo: phoneNo},
       success: function(data) {
         if(data.success){
           console.log(data);
           makeAlert('success','Successfully Updated the customer!');
           resetForm('#updateCust');
           disableForm('#updateCust');
         }
       }
    });
    // $.post('/updateCust', {id: id,name: name,mobileNo: phoneNo}, function(data, textStatus, xhr) {
    // });
  });

  $('#updateCust-cancel').click(function(event) {
    disableForm('#updateCust');
  });

  //for removing a customer
  $('#removeCust-remove').click(function(event) {
    let id = +$('#removeCust-id').val();
    $.post('/removeCust', {id: id}, function(data, textStatus, xhr) {
      console.log(data.success);
      if(data.success){
        makeAlert('danger','Successfully deleted customer!');
      }else {
        makeAlert('primary','Id specified is not found!');
      }
    });
    resetForm('#removeCust');
  });
  $('#removeCust-cancel').click(function(event) {
    resetForm('#removeCust')
  });

  $('#findCustDetails-search').click(function(event) {
    let id = $('#findCustDetails-id').val();
    console.log(id);
    $.get('/admin/customer', {id: id}, function(data, textStatus, xhr) {
      console.log(data);
      if(data.success){
        $('#findCustDetails-result').empty().append(`
          <div class="col-12 col-sm-6">
            <p>Customer Details</p>
            <ul>
              <li>Customer Id: ${data.id}</li>
              <li>Customer Name: ${data.name}</li>
              <li>Customer Phone No.: ${data.phoneNo}</li>
            </ul>
          </div>

          <div class="col-12 col-sm-6">
            <p>Customer Bank Details</p>
            <ul>
              <li>Bank Name: ${data.bank}</li>
              <li>Bank Branch: ${data.branch}</li>
              <li>Bank Opening Time: ${data.openTime}</li>
              <li>Bank Lunch Time: ${data.lunchTime}</li>
              <li>Bank Closeing Time: ${data.closeTime}</li>
            </ul>
          </div>
          `);
      }else {
        $('#findCustDetails-result').empty().append('<small>noDetails found fot his Id</small>');
      }
    });
  });
})
