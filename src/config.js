export default {
    STRIPE_KEY: "pk_test_mDrOuTQM4I1PH0NOix0BDbya00KCSuyvvI",
    MAX_ATTACHMENT_SIZE: 5000000,
    
    s3: {
      REGION: "us-east-1",
      BUCKET: "squire-uploads"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://j9h8vp2pa0.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_8jPFYs9Av",
      APP_CLIENT_ID: "28280mevksju0eda02kmnsn64p",
      IDENTITY_POOL_ID: "us-east-1:687283dc-4fbc-4a34-8434-d4d96bd04a7e"
    }
  };