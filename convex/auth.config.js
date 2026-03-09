export default {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN || "https://clerk.wandermate.app",
      applicationID: "convex",
    },
  ],
};
