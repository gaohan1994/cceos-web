export type AppConfigType = {
  environment: 'development' | 'production'
};

const AppConfig: AppConfigType = {
  environment: 'development'
};

export async function WxJsSdkConfig () {
  // 
}

export { AppConfig };