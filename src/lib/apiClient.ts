
// import axios, { AxiosInstance } from 'axios';


// const apiClient: AxiosInstance = axios.create({
//   baseURL: 'https://evc.laravel-studio.io',
//   timeout: 20000,
//   headers: {
//     'Content-Type': 'application/json',
//     'app':'APP'
//   },
// });

// const apiAdmin: AxiosInstance = axios.create({
//     baseURL: 'https://evc.laravel-studio.io',
//     timeout: 20000,
//     headers: {
//       'Content-Type': 'application/json',
//       'app':'ADMIN'
//     },
//   });
// async function login(username: string, password: string): Promise<string | null> {
//     const loginPayload = {
//         email: username,
//         password: password
//     };
   
//         const response = await apiClient.post('/api/login', loginPayload);
//         console.log(response.data.data)
//         const data = response.data;
//         const token=data.token
        
        
//         if (data && data.token) {
//             apiClient.defaults.headers.common['Authorization'] = `jwt ${data.token}`;
//             console.log('token',token)
//             return token;
//         } else {
//             throw new Error('Token not found in the response');
            
//         }
        

    
// }

// export { apiClient, login ,apiAdmin};


import axios, { AxiosInstance } from 'axios';

// Define Axios instances for user and admin
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://evc.laravel-studio.io',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'app': 'APP',
  },
});

const apiAdmin: AxiosInstance = axios.create({
  baseURL: 'https://evc.laravel-studio.io',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'app': 'ADMIN',
  },
});

// Define the login function
async function login(username: string, password: string, app: string): Promise<{ accessToken: string }> {
  const loginPayload = {
    email: username,
    password: password,
  };

  
  const apiInstance = app === "ADMIN" ? apiAdmin : apiClient;

  try {
   
    const response = await apiInstance.post('/api/login', loginPayload);
    //console.log(response)
    const { data, message, success } = response.data;

    // Check if the login was successful
    if (!success) {
      throw new Error(`Login failed: ${message}`);
    }
    
    const accessToken = data?.accessToken;
    if (accessToken) {
      // Set the Authorization header for subsequent requests
      apiInstance.defaults.headers.common['Authorization'] = `jwt ${accessToken}`;
      return { accessToken }; // Return an object containing the token
    } else {
      throw new Error('Token not found in the response');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Rethrow for handling in tests
  }
}

export { apiClient, login ,apiAdmin};