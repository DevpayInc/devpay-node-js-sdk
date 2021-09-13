
const request = require('request-promise');
const utils = require('./utils');

class DevpayClient {

    constructor(config) {
        this.config = config;
    }

    confirmPayment(paymentDetails) {
        return this.paymentIntentToken(paymentDetails).then((token) => {
            return this.confirmPaymentIntent(token, paymentDetails)
        })
    }

    paymentIntentToken(paymentDetail) {

        // Card
        var card = paymentDetail.card
        var cardDetails = {
            "Number":card.cardNum,
            "ExpMonth":card.cardExpiryMonth,
            "ExpYear":card.cardExpiryYear,
            "Cvc":card.cvv
        }
        
        var chargeDetails = {}
        chargeDetails["amount"] = paymentDetail.amount
        chargeDetails["fee_amount"] = 0
        chargeDetails["description"] = paymentDetail.description
        chargeDetails["account_id"] = this.config.accountId
        chargeDetails["secreate_key"] = this.config.accessKey

        if (this.config.sandbox) {
            chargeDetails['environment'] = "sandbox"
        }

        var payload = {
            "CardDetails": cardDetails,
            "ChargeDetails": chargeDetails
        };

        var options = utils.paymentIntentTokenOptions(this.config);
        options.body = payload;

        if (this.config.debug) {
            console.log("Request -" + JSON.stringify(options));
        }
        var THIS = this;
        return request(options)
            .then(function (response) {
                if (THIS.config.debug) {
                    console.log("Response -" + JSON.stringify(response));
                }
                return JSON.parse(JSON.stringify(response))["token"];
            });
    }

    confirmPaymentIntent(token ,paymentDetail) {

        // Card
        var card = paymentDetail.card
        var cardDetails = {
            "Number":card.cardNum,
            "ExpMonth":card.cardExpiryMonth,
            "ExpYear":card.cardExpiryYear,
            "Cvc":card.cvv,
            "token":token            
        }
        
        var chargeDetails = {}
        chargeDetails["amount"] = paymentDetail.amount
        chargeDetails["fee_amount"] = 0
        chargeDetails["description"] = paymentDetail.description
        chargeDetails["account_id"] = this.config.accountId
        chargeDetails["secreate_key"] = this.config.accessKey

        if (this.config.sandbox) {
            chargeDetails['environment'] = "sandbox"
        }

        var payload = {
            "CardDetails": cardDetails,
            "ChargeDetails": chargeDetails
        };

        var options = utils.paymentIntentConfirmationOptions(this.config);
        options.body = payload;

        if (this.config.debug) {
            console.log("Request -" + JSON.stringify(options));
        }
        var THIS = this;
        return request(options)
            .then(function (response) {
                if (THIS.config.debug) {
                    console.log("Response -" + JSON.stringify(response));
                }
                return (JSON.parse(JSON.stringify(response))["status"] == 1);
            });
    }
}

module.exports = {
    DevpayClient: DevpayClient
};

