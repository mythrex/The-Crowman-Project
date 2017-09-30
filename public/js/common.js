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

//function to setMyModal
function showMyModal(title,body,btnPositive){
  let myModal = $('#myModal');
  $('#myModal-title').text(title);
  $('#myModal-body').empty().append(body);
  $('#myModal-footer').empty().append(btnPositive).append('<button type="button" class="btn btn-secondary" data-dismiss="modal" id="myModal-btn-negative">Cancel</button>');
  myModal.modal('show');
}
function makeBtnPositive(type='primary',text='done',cb){
  return $(`<button type="button" class="btn btn-${type}">${text}</button>`).click(cb);
}