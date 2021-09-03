$(document).ready(function () {
  const cartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  if (cartData == null || cartData == undefined || cartData.length == 0) {
    $("#cartItems").html(
      "<h4 class='text-center'>No Items Present in Cart</h4>"
    );
    $("#totalPayableAmnt").text("0");
    $("#completePurchase").prop("disabled", true);
  } else {
    $("#completePurchase").prop("disabled", false);
    $("#cartItems").html("");
    var totalAmnt = [];
    for (var i = 0; i < cartData.length; i++) {
      totalAmnt.push(
        Number(cartData[i].prodPrice.substring(1)) *
          parseInt(cartData[i].prodQty)
      );

      var html = "<tr>";
      html += '<th scope="row">';
      html +=
        '<img src="' +
        cartData[i].prodImage +
        '" alt="" class="img-fluid z-depth-0" style="width:100px"/>';
      html += "</th>";
      html += "<td>";
      html += "<h6>";
      html += "<strong>" + cartData[i].prodName + "</strong>";
      html += "</h6>";
      html += "</td>";
      html += "<td>" + cartData[i].prodColor + "</td>";
      html += "<td>" + cartData[i].prodSize + "</td>";
      html += "<td class='prodPrice'>" + cartData[i].prodPrice + "</td>";
      html += "<td>";
      html += '<div class="def-number-input number-input safari_only">';
      html +=
        '<button onclick="decreaseQty(this)" class="minus" style="height:30px;"></button>';
      html +=
        '<input class="quantity" min="1" name="quantity" value="' +
        cartData[i].prodQty +
        '" type="number" disabled/>';
      html +=
        '<button onclick="increaseQty(this)" class="plus" style="height:30px;"></button>';
      html += "</div>";
      html += "</td>";
      html += '<td class="font-weight-bold">';
      html +=
        "<strong class='amount'>$" +
        Number(cartData[i].prodPrice.substring(1)) *
          parseInt(cartData[i].prodQty) +
        "</strong>";
      html += "</td>";
      html += "<td>";
      html +=
        '<button onclick="removeCartItem(this)" type="button" class="btn btn-sm btn-primary labattaBtn-outline" data-toggle="tooltip" data-placement="top" title="Remove item">';
      html += '<i class="far fa-trash-alt"></i>';
      html += "</button>";
      html += "</td>";
      html += "</tr>";
      $("#cartItems").append(html);
    }
    $("#totalPayableAmnt").text(totalAmnt.reduce((a, b) => a + b, 0));
  }
});
function decreaseQty(e) {
  var thisProdQty = $(e).parent().find("input").val();
  if (thisProdQty != 1) {
    thisProdQty = Number(thisProdQty) - 1;
  }
  $(e).parent().find("input").val(thisProdQty);
  var unitPrice = Number(
    $(e).parent().parent().parent().find(".prodPrice").text().substring(1)
  );
  var calculatedAmnt = unitPrice * thisProdQty;
  $(e)
    .parent()
    .parent()
    .parent()
    .find(".amount")
    .text("$" + calculatedAmnt);

  var updateIndex = $(e).parent().parent().parent().index();
  var cartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  cartData[updateIndex].prodQty = thisProdQty;
  localStorage.setItem("Labatt_Cart", JSON.stringify(cartData));

  const newCartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  var totalAmnt = [];
  for (var i = 0; i < newCartData.length; i++) {
    totalAmnt.push(
      Number(newCartData[i].prodPrice.substring(1)) *
        parseInt(newCartData[i].prodQty)
    );
  }
  $("#totalPayableAmnt").text(totalAmnt.reduce((a, b) => a + b, 0));
}
function increaseQty(e) {
  var thisProdQty = $(e).parent().find("input").val();
  if (thisProdQty != 0) {
    thisProdQty = Number(thisProdQty) + 1;
  }
  $(e).parent().find("input").val(thisProdQty);
  var unitPrice = Number(
    $(e).parent().parent().parent().find(".prodPrice").text().substring(1)
  );
  var calculatedAmnt = unitPrice * thisProdQty;
  $(e)
    .parent()
    .parent()
    .parent()
    .find(".amount")
    .text("$" + calculatedAmnt);

  var updateIndex = $(e).parent().parent().parent().index();
  var cartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  cartData[updateIndex].prodQty = thisProdQty;
  localStorage.setItem("Labatt_Cart", JSON.stringify(cartData));

  const newCartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  var totalAmnt = [];
  for (var i = 0; i < newCartData.length; i++) {
    totalAmnt.push(
      Number(newCartData[i].prodPrice.substring(1)) *
        parseInt(newCartData[i].prodQty)
    );
  }
  $("#totalPayableAmnt").text(totalAmnt.reduce((a, b) => a + b, 0));
}
function removeCartItem(e) {
  var newCartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  var updateIndex = $(e).parent().parent().index();
  newCartData.splice(updateIndex, 1);
  localStorage.setItem("Labatt_Cart", JSON.stringify(newCartData));
  var newCartData = JSON.parse(localStorage.getItem("Labatt_Cart"));
  var totalAmnt = [];
  for (var i = 0; i < newCartData.length; i++) {
    totalAmnt.push(
      Number(newCartData[i].prodPrice.substring(1)) *
        parseInt(newCartData[i].prodQty)
    );
  }
  $("#totalPayableAmnt").text(totalAmnt.reduce((a, b) => a + b, 0));
  $(e).parent().parent().remove();
  if (totalAmnt.reduce((a, b) => a + b, 0) == 0) {
    $("#cartItems").html(
      "<h4 class='text-cener'>No Items Present in Cart</h4>"
    );
    $("#completePurchase").prop("disabled", true);
  }
  $("#cartCount").text(JSON.parse(localStorage.getItem("Labatt_Cart")).length);
}
