const deleteProduct = (btn) => {
  console.log('Clicked!',btn);
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    }
  }).then(response => {
    console.log('response',response);
    productElement.parentNode.removeChild(productElement);
  }).catch(err => {
    console.log('err',err);
  });

}