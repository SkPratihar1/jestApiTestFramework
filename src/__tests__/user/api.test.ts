
import { apiClient, login } from '../../lib/apiClient';
import dotenv from 'dotenv';

dotenv.config();



describe("Login Tests", () => {
 //debugger
    ["USER", "ADMIN"].forEach((userType) => {
      test(`Should login successfully with valid ${userType} credentials`, async () => {
        let email, password, headers;
  
       
        if (userType === "ADMIN") {
          email = process.env.ADMIN_EMAIL as string; 
          password = process.env.ADMIN_PASSWORD as string; 
          
          headers = {
            app: "ADMIN",
          };
        } else {
          email = process.env.USER_EMAIL as string; 
          password =  process.env.USER_PASSWORD as string; 
          
          headers = {
            app: "APP",
          };
        }
  
        // Call the login function and expect the response
        const loginResponse = await login(email, password, headers.app); 
        console.log(`${userType} login `,loginResponse)
        expect(loginResponse).toBeDefined(); // Expect the response to be defined
        expect(loginResponse.accessToken).toBeDefined(); // Check that the token is present
      });
    });
  });