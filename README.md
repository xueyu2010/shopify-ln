## what is this?
This is a customized script that embeds in your Shopify store so that you can receive Bitcoin Lighting Payment.

## Want to use it in your shopify?
### Step1 - Set up your backend
Prerequisite:
- set up your LN node ( recommend LND )
- create following two API to generate lightning voice and checking order orderStatus

`${domain}/commerce/order/?key=${token}&order=${p}&coin=BTC`
`${domain}/commerce/create_order/`;


## Step 2 - Config your Shopify
1. Setting -> checkout  -> additional scripts

![Settings](/images/1.jpg)
![Additioanl Scripts Page](/images/2.jpg)



``` js
<script type="text/javascript" src=${STATIC_PATH_OF_SHOPIFYPAY.JS_FILE}></script>
<script type="text/javascript">
new CoboShopify({
  token: ${TOKEN}, domain:${YOUR_HOST_DOMAIN}
});
</script>
```
## Step 3
Config shopify payment. In settings -> payment provide -> Manual payments
Config custom payment.
Note the enter Bitcoin keywords in the customize payment name

![Payment Provide](/images/3.jpg)
![Manual Paymetns](/images/4.jpg)
