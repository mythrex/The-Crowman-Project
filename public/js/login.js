function makeAlert(type = 'primary',text,duration = 3000) {
  var alert = $(`<div class="alert alert-${type}" role="alert">
                        ${text}
                  </div>`);
  $('.container').prepend(alert);
  setTimeout(function () {
    alert.addClass('fade').remove();
    setTimeout(() => {
    	alert.remove();
    },200);
  },duration)
}

$(function() {
  let adminSubmit = $('#admin-submit');
  adminSubmit.click(function(event) {
  
  });

})
