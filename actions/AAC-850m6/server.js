async function(properties, context) {
    //Stripe only accepts inline urlencoded API calls, documentation here: https://stripe.com/docs/api/checkout/sessions/object 

    const {
        token,
        currency,
        product_name,
        quantity,
        payment_method,
        unity_amount,
        mode
    } = properties;

    if (!token) {
        throw new Error("'Token' field is empty!");
    }
    if (!properties.success_url) {
        throw new Error("'Success URL' field is empty!");
    }
    if (!currency) {
        throw new Error("'Currency' field is empty!");
    }
    if (!product_name) {
        throw new Error("'Product name' field is empty!");
    }
    if (!quantity) {
        throw new Error("'Quantity' field is empty!");
    }
    if (!payment_method) {
        throw new Error("'Payment method' field is empty!");
    }
    if (!unity_amount) {
        throw new Error("'Unity price amount' field is empty!");
    }
    if (!mode) {
        throw new Error("'Mode' field is empty!");
    }

    //fool proof https on input box
    if (properties.cancel_url) {
        if (properties.cancel_url.indexOf('http://') == -1 && properties.cancel_url.indexOf('https://') == -1) {
            properties.cancel_url = 'http://' + properties.cancel_url;
        }
    }

    if (properties.success_url.indexOf('http://') == -1 && properties.success_url.indexOf('https://') == -1) {
        properties.success_url = 'http://' + properties.success_url;
    }

    const bodyData = {
        success_url: properties.success_url,
        'line_items[0][price_data][currency]': currency,
        'line_items[0][price_data][product_data][name]': product_name,
        'line_items[0][quantity]': quantity,
        mode: mode,
        'payment_method_types[0]': payment_method,
        'line_items[0][price_data][unit_amount]': unity_amount
    };

    if (properties.cancel_url) {
        bodyData.cancel_url = properties.cancel_url;
    }

    const requestUrl = 'https://api.stripe.com/v1/checkout/sessions';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(bodyData),
    }

    try {
        const request = await fetch(requestUrl, requestOptions);

        if (!request.ok) throw new Error("Request failed!");

        const response = await request.json();

        return {
            payment_url: response.url,
            expires_at: response.expires_at.toString(),
            payment_intent: response.payment_intent,
            payment_status: response.payment_status
        }
    } catch (error) {
        throw new Error(error.message);
    }
}