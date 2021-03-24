import ENV from 'frontend-gelinkt-notuleren/config/environment';
export function initialize(/* application */) {
  if (ENV.APP.analytics.appDomain !== "{{ANALYTICS_APP_DOMAIN}}" &&
      ENV.APP.analytics.plausibleScript !== "{{ANALYTICS_PLAUSIBLE_SCRIPT}}"
     )
  {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute("src", ENV.APP.analytics.plausibleScript);
    script.setAttribute("data-domain", ENV.APP.analytics.appDomain);
    script.setAttribute("async", "async");
    script.setAttribute("defer", "defer");
    head.appendChild(script);
  }
}

export default {
  initialize
};
