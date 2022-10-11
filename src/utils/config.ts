export const config = {
    port: process.env.PORT!,
    isProduction: process.env.NODE_ENV! === 'production',
    clientUrl: process.env.CLIENT_URL!,
    baseDomain: process.env.BASE_DOMAIN!,

    activationTokenSecret: process.env.ACTIVATION_TOKEN_SECRET!,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,

    mongoPath: process.env.MONGODB_PATH!,
    mongoUser: process.env.MONGODB_USER!,
    mongoPassword: process.env.MONGODB_PASSWORD!,

    mailingServiceClientId: process.env.MAILING_SERVICE_CLIENT_ID!,
    mailingServiceClientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET!,
    mailingServiceRefreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN!,
    senderEmailAddress: process.env.SENDER_EMAIL_ADDRESS!,

    cloudName: process.env.CLOUD_NAME!,
    cloudApiKey: process.env.CLOUD_API_KEY!,
    cloudApiSecret: process.env.CLOUD_API_SECRET!,
};
