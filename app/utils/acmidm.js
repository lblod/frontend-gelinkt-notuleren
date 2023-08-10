export function buildLoginUrl({ apiKey, baseUrl, scope, redirectUrl }) {
  return (
    `${baseUrl}?response_type=code&` +
    `client_id=${apiKey}&` +
    `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
    `scope=${scope}`
  );
}

export function buildLogoutUrl({ logoutUrl }) {
  return logoutUrl;
}

export function buildSwitchUrl({ apiKey, logoutUrl, switchRedirectUrl }) {
  return `${logoutUrl}?switch=true&client_id=${apiKey}&post_logout_redirect_uri=${encodeURIComponent(
    switchRedirectUrl,
  )}`;
}

export function isValidAcmidmConfig(acmidmConfig) {
  return Object.values(acmidmConfig).every(
    (value) =>
      typeof value === 'string' &&
      value.trim() !== '' &&
      !value.startsWith('{{'),
  );
}
