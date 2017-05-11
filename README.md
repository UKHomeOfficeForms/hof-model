# hof-model
Simple model for interacting with http/rest apis.

## Data Storage

Models can be used as basic data storage with set/get and change events.

### Methods

#### `set`

Save a property to a model. Properties can be passed as a separate key/value arguments, or with multiple properties as an object.

```javascript
const model = new Model();
model.set('key', 'value');
model.set({
  firstname: 'John',
  lastname: 'Smith'
});
```

#### `get`

Retrieve a property from a model:

```javascript
const val = model.get('key');
// val = 'value'
```

#### `toJSON`

Returns a map of all properties on a model:

```javascript
const json = model.toJSON();
// json = { key: 'value' }
```

### Events

`change` is emitted when a property on a model changes

```javascript
const model = new Model();
model.on('change', (changedFields) => {
  // changedFields contains a map of the key/value pairs which have changed
  console.log(changedFields);
});
```

`change:<key>` is emitted when a particular property - with a key of `<key>` - on a model changes

```javascript
const model = new Model();
model.on('change:name', (newValue, oldValue) => {
  // handler is passed the new value and the old value as arguents
});
model.set('name', 'John Smith');
```

### Referenced Fields

A field can be set to a reference to another field by setting it a value of `$ref:<key>` where `<key>` is the field to be reference. The field will then behave exactly like a normal field except that its value will always appear as the value of the referenced field.

```javascript
const model = new Model();
model.set('home-address', '1 Main Street');
model.set('contact-address', '$ref:home-address');

model.get('contact-address'); // => '1 Main Street';
model.set('home-address', '2 Main Street');
model.get('contact-address'); // => '2 Main Street';

model.toJSON(); // => { home-address: '2 Main Street', 'contact-address': '2 Main Street' }
```

Change events will be fired on the referenced field if the underlying value changes.

```javascript
const model = new Model();
model.set('home-address', '1 Main Street');
model.set('contact-address', '$ref:home-address');
model.on('change:contact-address', (value, oldValue) => {
  // this is fired when home-address property changes
});

model.set('home-address', '2 Main Street');
```

A field can be unreferenced by setting its value to any other value.

```javascript
const model = new Model();
model.set('home-address', '1 Main Street');

// reference the field
model.set('contact-address', '$ref:home-address');

// unreference the field
model.set('contact-address', '1 Other Road');
```

## API Client

Normally this would be used as an abstract class and extended with your own implementation.

Implementations would normally define at least a `url` method to define the target of API calls.

There are three methods for API interaction corresponding to GET, POST, and DELETE http methods. These methods all return a Promise.

### Methods

#### `fetch`

```javascript
const model = new Model();
model.fetch().then(data => {
  console.log(data);
});
```

#### `save`

```javascript
const model = new Model();
model.set({
  property: 'properties are sent as JSON request body by default'
});
model.save().then(data => {
  console.log(data);
});
```

The method can also be overwritten by passing options

```javascript
const model = new Model();
model.set({
  property: 'this will be sent as a PUT request'
});
model.save({ method: 'PUT' }).then(data => {
  console.log(data);
});
```

#### `delete`

```javascript
const model = new Model();
model.delete().then(data => {
  console.log(data);
});
```

### Options

If no `url` method is defined then the model will use the options parameter and [Node's url.format method](https://nodejs.org/api/url.html#url_url_format_urlobj) to construct a URL.

```javascript
const model = new Model();

// make a GET request to http://example.com:3000/foo/bar
model.fetch({
  protocol: 'http',
  hostname: 'example.com',
  port: 3000,
  path: '/foo/bar'
}).then(data => {
  console.log(data);
});
```

### Events

API requests will emit events as part of their lifecycle.

`sync` is emitted when an API request is sent
```javascript
model.on('sync', function (settings) { });
```

`success` is emitted when an API request successfully completes
```javascript
model.on('success', function (data, settings, statusCode, responseTime) { });
```

`fail` is emitted when an API request fails
```javascript
model.on('fail', function (err, data, settings, statusCode, responseTime) { });
```
