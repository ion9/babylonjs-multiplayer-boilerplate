# ccpwgl2 + Colyseus

This is a project setup to use ccpwgl2 with Colyseus 0.10.x.


## Tooling

- [Webpack 4.x](https://github.com/webpack/webpack)
- [TypeScript 3.x](https://github.com/Microsoft/TypeScript)
- [ccpwgl2](https://github.com/cppctamber/ccpwgl2)
- [Colyseus 0.10.x](https://github.com/colyseus/colyseus)
- [Node.js 8.x+](https://nodejs.org/)

**Requires [NodeJS v8.0.0+](https://nodejs.org/en/download/)**

## How to use

Check out this repository.

```
git clone https://github.com/ion9/babylonjs-multiplayer-boilerplate.git
```

Inside this repository, there's two separate applications. The client (babylonjs + colyseus client) and the server (nodejs + colyseus server).

### Client application

To be able to build the client application, you'll need to enter in the folder,
and install its dependencies first.

```
cd babylonjs-multiplayer-boilerplate/client
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn the `webpack-dev-server`, listening on [http://localhost:8080](http://localhost:8080).


### Server application

For the server, the steps are exactly the same. Install the dependencies:

```
cd babylonjs-multiplayer-boilerplate/server
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn a web socket server, listening on [ws://localhost:2657](ws://localhost:2657).

## Documentation

- [ccpwgl2](http://www.radicalcompliance.com/wp-content/uploads/2018/08/meme-documentation.jpg)
- [Colyseus documentation](https://docs.colyseus.io/)

## License

Apache License 2.0
