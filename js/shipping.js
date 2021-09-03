$(document).ready(function () {
  const cartData = JSON.parse(localStorage.getItem("Labatt_Cart"));

  if (cartData == null || cartData == undefined || cartData.length == 0) {
    $("#summaryItems").html("<h4 class='text-center'>No Items </h4>");
    $("#finalAmntPayable").text("0");
    $("#paymentBtn").prop("disabled", true);
  } else {
    $("#paymentBtn").prop("disabled", false);
    $("#summaryItems").html("");
    var totalAmnt = [];
    for (var i = 0; i < cartData.length; i++) {
      totalAmnt.push(
        Number(cartData[i].prodPrice.substring(1)) *
          parseInt(cartData[i].prodQty)
      );
      var html = '<dl class="row">';
      html += '<dd class="col-sm-8">' + cartData[i].prodName;
      html += "</dd>";
      html +=
        '<dd class="col-sm-4" style="text-align: right">$ ' +
        Number(cartData[i].prodPrice.substring(1)) *
          parseInt(cartData[i].prodQty) +
        "</dd>";
      html += "</dl>";
      html += "<hr />";
      $("#summaryItems").append(html);
    }
    $("#finalAmntPayable").text(totalAmnt.reduce((a, b) => a + b, 0));
  }
});
function paymentModal(visibility) {
  $("#payment-modal").modal(visibility);
  $("#finalAmountPayable").val($("#finalAmntPayable").text());
}
