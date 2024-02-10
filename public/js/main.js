document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("dropdownButton");
    const userDropdown = document.getElementById("userDropdown");

    if(dropdownButton == null) return;
    
    dropdownButton.addEventListener("click", function () {
        if (userDropdown.style.display === "none" || userDropdown.style.display === "") {
            userDropdown.style.display = "block";
        } else {
            userDropdown.style.display = "none";
        }
    });
});