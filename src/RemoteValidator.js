(function(root) {
    function triggerInvalidEvent(el) {
        var evt = new Event('invalid', {
            bubbles: false,
            cancelable: true
        });

        el.dispatchEvent(evt);
    }

    function triggerValidEvent(el) {
        var evt = new Event('valid', {
            bubbles: false,
            cancelable: true
        });

        el.dispatchEvent(evt);
    }

    function handleResponse(xhr) {
        var data;

        this.el.removeAttribute('aria-busy');

        if (xhr.status >= 500 || xhr.status === 429) { //too many requests
            // server error, do nothing
            return;
        }

        if (xhr.status >= 400) {
            this.el.setCustomValidity(this.message);
            return triggerInvalidEvent(this.el);
        }

        try {
            data = JSON.parse(xhr.responseText);
        } catch (e) {
            this.el.setCustomValidity(this.message);
            return triggerInvalidEvent(this.el);
        }

        if (this.validKey && data[this.validKey].toString() !== this.validValue.toString()) {
            this.el.setCustomValidity(this.message);
            return triggerInvalidEvent(this.el);
        }

        this.el.setCustomValidity('');
        triggerValidEvent(this.el);
    }

    function validate() {
        if (!this.el.value) {
            return;
        }

        this.el.setAttribute('aria-busy', 'true');

        if (this.xhr !== undefined) {
            this.xhr.abort();
        }

        this.xhr = new XMLHttpRequest();
        var data = encodeURIComponent(this.el.name) + '=' + encodeURIComponent(this.el.value);
        var url = this.url + '?' + data;

        this.xhr.addEventListener('load', handleResponse.bind(this, this.xhr));
        this.xhr.open('GET', url);
        this.xhr.send();
    }

    function compile(el) {
        var attrs = el.attributes;
        var prefix = 'remote-validator-';
        var i = attrs.length;
        var name;
        var config = {};

        while (i--) {
            name = attrs[i].name;

            if (name.indexOf(prefix) === 0) {
                name = name.replace(prefix, '');
                config[name] = attrs[i].value;
            }
        }

        return new RemoteValidator(el, config);
    }

    function RemoteValidator(el, config) {
        if (!(this instanceof RemoteValidator)) {
            return new RemoteValidator(el, config);
        }

        this.el = el;

        config = config || {};
        this.url = config.url;
        this.validKey = config['valid-key'] || 'valid';
        this.validValue = config['valid-value'] || 'true';
        this.message = config.message || 'Remote validation error';

        this.abort = function() {
            if (this.xhr !== undefined) {
                this.el.removeAttribute('aria-busy');
                this.xhr.abort();
            }
        }

        this.el.addEventListener('change', validate.bind(this));
    }

    RemoteValidator.init = function(rootEl) {
        var selector = '[remote-validator-url]';

        if (rootEl.matches(selector)) {
            return compile(rootEl);
        }

        var nodes = rootEl.querySelectorAll(selector);
        var validators = [];
        var i = nodes.length;

        while (i--) {
            validators.push(compile(nodes[i]));
        }

        return validators;
    };

    if (typeof exports === 'object') {
        module.exports = RemoteValidator;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return RemoteValidator;
        });
    } else {
        root.RemoteValidator = RemoteValidator;
    }
})(this);
