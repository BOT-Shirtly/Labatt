$(document).ready(function () {
  // Fetch products data
  fetch("../data/productData.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const productsData = data.Products;
      $("#productsList").html("");
      for (var i = 0; i < productsData.length; i++) {
        if (productsData[i].partner === "Labatt") {
          var html =
            '<div class="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch text-center" onclick="openProduct(\'' +
            productsData[i].productLink +
            "')\">";
          html += '<div class="card align-items-center z-depth-2">';
          html += '<div class="view overlay">';
          html +=
            '<img src="' +
            productsData[i].productImage +
            '" class="card-img-top" alt="" /></div>';
          html += '<div class="card-body text-center">';
          html += '<h5 class="mb-3">';
          html +=
            '<a href="" class="dark-grey-text">' + productsData[i].productName;
          html += "</h5>";
          html += '<h5 class="font-weight-bold blue-text mb-0">';
          html += "<strong>" + productsData[i].productPrice + "$</strong>";
          html += "</h5>";
          html += "</div>";
          html += "</div>";
          html += "</div>";
          $("#productsList").append(html);
        }
      }
    });

  //Set Banner Image
  var windowWidth = $(window).width();
  var bannerHeight = Number((37 * windowWidth) / 100);
  $(".bannerImage").css("height", bannerHeight);
  $(window).resize(function () {
    var windowWidth = $(window).width();
    var bannerHeight = Number((37 * windowWidth) / 100);
    $(".bannerImage").css("height", bannerHeight);
  });
});

function openProduct(product) {
  window.location.replace("/#/product-detail?product=" + product);
}
