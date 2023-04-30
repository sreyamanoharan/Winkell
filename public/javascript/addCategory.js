function addCategoryVal() {
    var categoryName = document.submission.categoryName.value
    
    var description = document.submission.description.value

    let pass = document.getElementsByClassName("text-danger")
    const priceRegex = /^\d{0,8}(\.\d{1,4})?$/

    if (categoryName== "" && description == "") {
        let i = 0
        while (i < pass.length) {
            pass[i].innerHTML = "please fill the field"
            i++
        }
        
        return false
    }
    if (categoryName == "") {
        pass[0].innerHTML = "Product name is empty"
        return false
    }
    if (categoryName.length < 4) {
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