describe('RemoteValidator', function() {
    before(function() {
        fixture.setBase('test/fixtures');
    });

    beforeEach(function() {
        fixture.load('fixture.html');
        window.RemoteValidator.init(fixture.el);
        this.server = sinon.fakeServer.create();
        this.server.respondImmediately = true;
    });

    afterEach(function() {
        fixture.cleanup();
        this.server.restore();
    });

    it('should invalidate the element if the remote request returns a 400 response', function(done) {
        var input = document.getElementById('test-input');

        this.server.respondWith(new RegExp(input.getAttribute('remote-validator-url')), [ 400, {}, '' ]);

        input.addEventListener('invalid', function() {
            expect(input.validity.valid).to.equal(false);
            done();
        });

        input.value = 'bar';
        input.dispatchEvent(new Event('change'));
    });

    it('should set the element\'s validation message if the element is invalid', function(done) {
        var input = document.getElementById('test-input');

        this.server.respondWith(new RegExp(input.getAttribute('remote-validator-url')), [ 400, {}, '' ]);

        input.addEventListener('invalid', function() {
            expect(input.validationMessage).to.equal(input.getAttribute('remote-validator-message'));
            done();
        });

        input.value = 'bar';
        input.dispatchEvent(new Event('change'));
    });

    it('should invalidate the element if the remote request returns invalid JSON', function(done) {
        var input = document.getElementById('test-input');

        this.server.respondWith(new RegExp(input.getAttribute('remote-validator-url')), [
            200,
            { 'Content-Type': 'application/json' },
            'Invalid JSON'
        ]);

        input.addEventListener('invalid', function() {
            expect(input.validity.valid).to.equal(false);
            done();
        });

        input.value = 'bar';
        input.dispatchEvent(new Event('change'));
    });

    it('should invalidate the element if the remote request returns a value that does not equal the valid-value attribute', function(done) {
        var input = document.getElementById('test-input');

        this.server.respondWith(new RegExp(input.getAttribute('remote-validator-url')), [
            200,
            { 'Content-Type': 'application/json' },
            '{ "valid": false }'
        ]);

        input.addEventListener('invalid', function() {
            expect(input.validity.valid).to.equal(false);
            done();
        });

        input.value = 'bar';
        input.dispatchEvent(new Event('change'));
    });

    it('should clear the custom validation message if the remote request returns a value that equals that valid-value attribute', function(done) {
        var input = document.getElementById('test-input');

        this.server.respondWith(new RegExp(input.getAttribute('remote-validator-url')), [
            200,
            { 'Content-Type': 'application/json' },
            '{ "valid": true }'
        ]);

        input.setCustomValidity('error');
        input.value = 'bar';
        input.dispatchEvent(new Event('change'));
        // the Sinon server will respond synchronously
        expect(input.validationMessage).to.equal('');
        done();
    });
});
