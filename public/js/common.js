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

