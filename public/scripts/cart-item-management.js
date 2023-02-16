const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

const updateCartItem = async (event) => {
  event.preventDefault();

  const formElement = event.target;

  const productId = formElement.dataset.productid;
  const csrfToken = formElement.dataset.csrf;
  const quantity = formElement.firstElementChild.value;

  let response;
  try {
    
    response = await fetch('/cart/items', {
      method: "PATCH",
      body: JSON.stringify({
        productId,
        quantity,
        _csrf: csrfToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    formElement.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPrice = formElement.parentElement.querySelector('.cart-item-price');
    cartItemTotalPrice.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);

  }
  
  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);

  cartBadgeElements.forEach((el) => el.textContent = responseData.updatedCartData.newTotalQuantity);
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem)
}