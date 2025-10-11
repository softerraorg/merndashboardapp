let userForm = document.querySelector("[type=app-form]");

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    let formData = new FormData(userForm);
    let data = [...formData.entries()];
    
    try {
        const response = await fetch(`/apps/proxy/userinfo?shop=${Shopify.shop}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(result);
        alert(result.message);
        userForm.reset(); // Clear the form on success
        
    } catch(error) {
        console.error("Error:", error);
        alert("Failed to submit form. Please try again.");
    }
});