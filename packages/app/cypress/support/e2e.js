/*
* Browser-side support for tests
*/
import './auth.js'

/*
* If you wish to use partial object matching ('containSubset') within your application tests,
*   - add "chai-subset" to your package.json devDependencies
*   - enable the following block
*
* References:
*   -  -> https://stackoverflow.com/a/57710080/14455
*   - npm: https://www.npmjs.com/package/chai-subset
*   -  -> https://stackoverflow.com/questions/73825526/how-to-install-chai-plugin-to-be-used-by-cypress
*
// Enables 'should.containSubset' for the tests
//
import chaiSubset from 'chai-subset'
chai.use(chaiSubset);
***/
