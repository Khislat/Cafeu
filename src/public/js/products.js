console.log("Products frontend javascript file");

$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if(selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });

    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display", "none");
    });

    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(200);
        $("#process-btn").css("display", "flex");
    });

    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id,
        productStatus = $(`#${id}.new-product-status`).val();
        console.log("id:", id);
        console.log("productStatus:", productStatus);

        try {
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
            console.log("response:", response);
            const result = response.data;
            if(result.data) {
                console.log("Product updated!");
                $(".new-product-status").blur();
            }else alert ("Product update failed!");
        } catch (err) {
            console.log(err);
            alert("Product update failed!");
        }
    });

})

function validateForm() {
    const productName = $(".product-name").val(),
    productStatus = $(".product-status").val(),
    productPrice = $(".product-price").val(),
    productLeftCount = $(".product-left-count").val(),
    productCollection = $(".product-collection").val(),
    productDesc = $(".product-desc").val();
    
    if(
        productName === "" || 
        productPrice === "" || 
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === "" 
    ) {
        alert("Pleace insert all details!");
        return false;
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input")
    console.log("imgClassName:", imgClassName);

    const file = $(`.${imgClassName}`).get(0).files[0],
    fileType = file['type'],
    validImageType = ["image/jpg", "image/jpeg", "image/png"];
   

    if (!validImageType.includes(fileType)) {
        alert("Please insert only jpeg,jpg and png!");
    } else {
        if(file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
}