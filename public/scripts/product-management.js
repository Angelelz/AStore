const deleteProductButtonElements = document.querySelectorAll('.product-item button');

const deleteProduct = async (event) => {
  event.preventDefault()
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  console.log(productId, csrfToken)

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: "delete"
  });

  if (!response.ok) {
    alert('Something went wrong');
    return
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();

}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct)
}