# Todo

- [ ] Place timeout back

   ```
  // 5s has been seen to be too short; having too long delays certain faulty tests.
  jest.setTimeout(18000);
   ```
   
   See https://github.com/facebook/jest/issues/6216 . Preferably as a Jest setting. #help
   
   Maybe need to use `setupFilesAfterEnv` - was there before.
   
      
