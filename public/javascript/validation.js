function addProductVal() {
    var productName = document.submission.productName.value
    var category = document.submission.category.value
    // var subCategory = document.submission.subcategory.value
    var price = document.submission.price.value
    var stock = document.submission.stock.value
   
    var image = document.submission.image.value
    var description = document.submission.description.value

    let pass = document.getElementsByClassName("text-danger")
    const priceRegex = /^\d{0,8}(\.\d{1,4})?$/

    if (productName== "" &&  price == "" && stock == ""&& description == "" &&category== "") {
        let i = 0
        while (i < pass.length) {
            pass[i].innerHTML = "please fill the field"
            i++
        }
        
        return false
    }
    if (productName == "") {
        pass[0].innerHTML = "Product name is empty"
        return false
    }
    if (productName.length < 4) {
        pass[0].innerHTML = "Product name should contain 4 letters"
        return false
    }
    if (description == "") {
        pass[1].innerHTML = "Discription is required"
        return false
    }
    if (description.length > 500) {
        pass[1].innerHTML = "Exeeded limit"
        return false
    }

    
    if (price == "") {
        pass[2].innerHTML = "Add price of the product"
        return false
    }
    if (priceRegex.test(price) == false) {
        pass[2].innerHTML = "Enter correct price"
        return false
    }
    if (stock == "") {
        pass[3].innerHTML = "Stock is required"

        return false

    }
    if(stock<1){
        pass[3].innerHTML= "enter valid stock"
        return false
    }
    if (priceRegex.test(stock) == false) {
        pass[3].innerHTML = "Enter correct stock"
        return false
    }

    if (category == "") {
        pass[4].innerHTML = "Select one category"
        return false
    }
    
    return true
}
function clearform() {
    let pass = document.getElementsByClassName("text-danger")
    let i = 0
    while (i < pass.length) {
        pass[i].innerHTML = ""
        i++
    }
}











