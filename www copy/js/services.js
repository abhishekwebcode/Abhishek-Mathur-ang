app.service('WC', function(){
    return {
        WC: function(){
            var Woocommerce = new WoocommerceAPI({
                url: 'http://www.whomikart.com/',
                consumerKey: 'ck_680ac216aa11c8b526711eeff988e6a3ca2924ae',
                consumerSecret: 'cs_e49fc3de01a538794543d8fa0e50bfc390bf5c41',
		wpAPI: true, //or false if you want to use the legacy API v3
  		version: 'wc/v2' //or wc/v1
            })
            return Woocommerce;
        }
}});
