function(properties, context) {
    
    const asyncFunction = async () => {
    let response = await fetch("https:www.goe.com");
    console.log(`second message, now inside async code, the variable is ${response.status} (first workflow action)`);
	}


    const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

    const session = stripe.checkout.sessions.create({
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      line_items: [
        {price: 'price_H5ggYwtDq4fbrJ', quantity: 2},
      ],
      mode: 'payment',
    });


}