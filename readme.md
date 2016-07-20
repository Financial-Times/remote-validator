# Remote Validator
A module to validate the value of form fields against a remote service.

## Usage
Configure the element you wish to validate. The only required attribute is url, which is the url to send the data to.

The data will be sent via an HTTP GET request using XMLHttpRequest. The key for the data will be the element’s `name` attribute and the value will be the `value` of the element.

At the moment, the module only supports JSON responses. The module will inspect the `valid` property of the JSON response. If it doesn't match the value of the `valid-value` config option, the element’s custom validity will be set to the value of `message` config option.

The property of the JSON response can be changed using the `valid-key` config option.

### DOM API
First, configure the element you wish to validate using DOM attributes. The config options should be prefixed with `remote-validator-`, e.g.:

```
<input type="text" name="foo" remote-validator-url="http://somedomain.org/validate" remote-validator-valid-key="valid" remote-validator-valid-value="true" remote-validator-message="Foo is not valid">
```

Then initalise the validator by passing either the element or an ancestor element to the `RemoteValidator.init` method:

```
RemoteValidator.init(document.querySelector('[name="foo"]'));
```

### Javascript API
You can also create instances of the RemoteValidator manually by passing an element and config object to the constructor:

```
var myRemoteValidator = new RemoteValidator(document.querySelector('[name="foo"]'), {
	url: 'http://somedomain.org/validate',
	validKey: 'valid',
	validValue: 'true',
	message: 'Foo is not valid'
})
```

## Configuration options
Name|Description|Default value
----|-----------|-------------
url|The URL of the remote service to validate against. Required.|
valid-key|The name of the property in the response JSON to check|'valid'
valid-value|The value of `valid-key` that is considered valid|`true`
message|Value passed to the Element’s `setCustomValidity` method|'Remote validation error'
