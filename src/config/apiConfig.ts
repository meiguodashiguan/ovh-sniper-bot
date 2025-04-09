
/**
 * OVH API凭据配置
 * 此文件用于存储与OVH API通信所需的配置信息
 */

export interface OVHCredentials {
  appKey: string;       // OVH应用密钥
  appSecret: string;    // OVH应用秘密
  consumerKey: string;  // OVH消费者密钥
  endpoint: string;     // OVH API端点(ovh-eu, ovh-us, ovh-ca)
}

// 默认配置（空值）
export const defaultCredentials: OVHCredentials = {
  appKey: '',
  appSecret: '',
  consumerKey: '',
  endpoint: 'ovh-eu'
};

/**
 * 建议用法：
 * 1. 从表单中获取用户提供的凭据
 * 2. 使用这些凭据调用API
 * 3. 出于安全考虑，不要在本地存储这些凭据
 */
