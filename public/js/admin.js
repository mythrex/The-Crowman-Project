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
  $.post('/addCust', {name: name, phoneNo: phoneNo}, function(data, textStatus, xhr) {
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

  $.get('/searchCust', {id: id}, function(data, textStatus, xhr) {
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
    $.post('/updateCust', {id: id,name: name,mobileNo: phoneNo}, function(data, textStatus, xhr) {
      if(data.success){
        makeAlert('success','Successfully Updated the customer!');
        resetForm('#updateCust');
        disableForm('#updateCust');
      }
    });
  });

  $('#updateCust-cancel').click(function(event) {
    disableForm('#updateCust');
  });

  //for removing a customer
  $('#removeCust-remove').click(function(event) {
    let id = +$('#removeCust-id').val();
    $.post('/removeCust', {id: id}, function(data, textStatus, xhr) {
      if(data.success){
        makeAlert('danger','Successfully deleted customer!');
      }
    });
    resetForm('#removeCust');
  });
  $('#removeCust-cancel').click(function(event) {
    resetForm('#removeCust')
  });

  //for showing details
  // $('#findCustDetails-search').click(findCustomerDetails);
})
