const addToCartButtonElement = document.querySelector('#product-info button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

const addToCart = async (event) => {
  event.preventDefault();
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;

  try {
    response = await fetch('/cart/items', {
      method: 'PUT',
      body: JSON.stringify({
        productId,
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

  const newTotalItems = responseData.newTotalItems;

  cartBadgeElements.forEach((el) => el.textContent = newTotalItems);
}

addToCartButtonElement.addEventListener('click', addToCart);