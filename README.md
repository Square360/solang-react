# Solang React 


Solang React library provides functionality to create applications using solr. It is still in active development and 
breaking refactors are likely at this stage. It uses:
* Typescript
* [Redux](https://redux.js.org/) specifically [Redux Toolkit](https://redux-toolkit.js.org/)
* [RxJS](https://rxjs.dev/) specifically [Redux Observable](https://redux-observable.js.org/)

Iinstructions & examples for importing into your own project will follow, but you might consider starting by bootstrapping with 
[Create React App](https://github.com/facebook/create-react-app), using the # Redux + TypeScript template and modifying.
To match the patterns used in this app. 

```shell
npx create-react-app my-app --template redux-typescript 
```

## Compiling this library
Compile this library with tsc before pushing a new release. Rollup configuration incomplete.  
```shell
yarn tsc
```


## Installing local test data

Install & configure solr & populate with test data. 

```shell
# Create solr container
docker run --name solang -d -p 8983:8983 -t solr:8.11.3
# Create solr core
docker exec -it --user=solr solang bin/solr create_core -c solang

# Import test data
curl 'http://localhost:8983/solr/solang/update?commit=true' --data-binary @assets/test-data.json -H 'Content-type:application/json'

# Optional: update config to allow cross-origin
docker cp assets/solr/web.xml solang:/opt/solr-8.11.3/server/solr-webapp/webapp/WEB-INF/web.xml && docker restart solang

```

## Original Bootstrap instructions

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
