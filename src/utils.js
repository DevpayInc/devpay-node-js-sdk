'use strict';

module.exports = {
    API_ENDPOINTS: {
        DEVPAY: 'https://api.devpay.io',
    },
    
    paymentIntentTokenOptions: function(){
        var uri = this.API_ENDPOINTS.DEVPAY;
        var options = {
            method: 'POST',
            uri: uri+'/v1/charge/create_Intend',
            headers:{"Content-Type":"application/json"},
            json: true
        };
        return options;
    },

    paymentIntentConfirmationOptions: function(){
        var uri = this.API_ENDPOINTS.DEVPAY;
        var options = {
            method: 'POST',
            uri: uri+'/v1/charge/confirm_charge',
            headers:{"Content-Type":"application/json"},
            json: true
        };
        return options;
    },
};