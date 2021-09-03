$(document).ready(function () {
  // Fetch products data
  fetch("https://bot-shirtly.github.io/Labatt/data/productData.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const productsData = data.Products;
      var url_string = window.location;
      var url = new URL(url_string);
      var selectedProduct = url.hash.split("?")[1].split("=")[1].trim();
      for (var i = 0; i < productsData.length; i++) {
        if (productsData[i].productLink === selectedProduct) {
          var prodImage = productsData[i].productImage;
          var prodName = productsData[i].productName;
          var prodPrice = productsData[i].productPrice;
          var prodDescription = productsData[i].productDescription;
          var prodDecorationArea = productsData[i].decorationArea;
          var prodArtPlacement = productsData[i].artPlacement;
          var prodFulfilmentTimes = productsData[i].fulfillmentTimes;
          var prodSizeChartLink = productsData[i].producSizeChart;
          if (prodSizeChartLink != "") {
            $("#prodSizeChart").css("display", "inline-block");
            $("#prodSizeChart").attr("href", prodSizeChartLink);
          }
          var prodSizes = productsData[i].productSize;
          var prodColors = productsData[i].productColor;

          $("#prodImage").attr("src", prodImage);
          $("#prodImage").attr("alt", prodName);
          $("#prodDecorationArea").text(prodDecorationArea);
          $("#prodArtPlacement").text(prodArtPlacement);
          $("#prodFulfillmentTimes").text(prodFulfilmentTimes);
          $("#prodName").text(prodName);
          $("#prodPrice").text("$" + prodPrice);
          $("#prodDescription").text(prodDescription);

          $("#prodColorList").html("");
          for (var j = 0; j < prodColors.length; j++) {
            var html = '<div class="col-md-4 col-12">';
            html += '<div class="form-group">';
            if (j == 0) {
              html +=
                '<input class="form-check-input" name="colorGroup" type="radio" id="radio' +
                prodColors[j].name +
                '" checked="checked"/>';
            } else {
              html +=
                '<input class="form-check-input" name="colorGroup" type="radio" id="radio' +
                prodColors[j].name +
                '"/>';
            }

            html +=
              '<label for="radio' +
              prodColors[j].name +
              '" class="form-check-label dark-grey-text">' +
              prodColors[j].name +
              "</label>";
            html += "</div>";
            html += "</div>";
            $("#prodColorList").append(html);
          }

          $("#prodSizeList").html("");
          for (var k = 0; k < prodSizes.length; k++) {
            var html = '<div class="col-md-4 col-12">';
            html += '<div class="form-group">';
            if (k == 0) {
              html +=
                '<input class="form-check-input" name="sizeGroup" type="radio" id="radio' +
                prodSizes[k] +
                '" checked="checked"/>';
            } else {
              html +=
                '<input class="form-check-input" name="sizeGroup" type="radio" id="radio' +
                prodSizes[k] +
                '"/>';
            }

            html +=
              '<label for="radio' +
              prodSizes[k] +
              '" class="form-check-label dark-grey-text">' +
              prodSizes[k] +
              "</label>";
            html += "</div>";
            html += "</div>";
            $("#prodSizeList").append(html);
          }
        }
      }
    });
});

function addToCart() {
  $(".toast").toast("show");
  var prodImage = $("#prodImage").attr("src");
  var prodName = $("#prodName").text();
  var prodPrice = $("#prodPrice").text();
  var prodQty = 1;
  $("#prodColorList .col-12").each(function () {
    if ($(this).find("input").prop("checked")) {
      prodColor = $(this).find("label").text();
    }
  });
  $("#prodSizeList .col-12").each(function () {
    if ($(this).find("input").prop("checked")) {
      prodSize = $(this).find("label").text();
    }
  });

  var itemsInCart = JSON.parse(localStorage.getItem("Labatt_Cart"));
  if (
    itemsInCart == null ||
    itemsInCart == undefined ||
    itemsInCart.length == 0
  ) {
    var cartData = [
      {
        prodImage,
        prodName,
        prodPrice,
        prodColor,
        prodSize,
        prodQty,
      },
    ];
    localStorage.setItem("Labatt_Cart", JSON.stringify(cartData));
    $("#cartCount").text(
      JSON.parse(localStorage.getItem("Labatt_Cart")).length
    );
  } else {
    var cartData = itemsInCart;
    cartData.push({
      prodImage,
      prodName,
      prodPrice,
      prodColor,
      prodSize,
      prodQty,
    });
    localStorage.setItem("Labatt_Cart", JSON.stringify(cartData));
    $("#cartCount").text(
      JSON.parse(localStorage.getItem("Labatt_Cart")).length
    );
  }
}
